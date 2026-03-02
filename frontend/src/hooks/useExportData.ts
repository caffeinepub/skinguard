import { useState } from 'react';
import { useGetUserProfileIntro } from './useQueries';
import { useGetSkinTypeDetectionResults } from './useQueries';
import { useGetFavorites } from './useQueries';
import { useGetRoutines } from './useQueries';
import { useGetProductNotes } from './useQueries';
import { useGetProductRecommendations } from './useQueries';
import { useGetLatestSkinType } from './useQueries';
import { toast } from 'sonner';

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: userProfile } = useGetUserProfileIntro();
  const { data: analysisHistory } = useGetSkinTypeDetectionResults();
  const { data: favorites } = useGetFavorites();
  const { data: routines } = useGetRoutines();
  const { data: productNotes } = useGetProductNotes();
  const { data: latestSkinType } = useGetLatestSkinType();

  const exportData = async () => {
    setIsExporting(true);
    
    try {
      // Aggregate all user data
      const exportObject = {
        exportDate: new Date().toISOString(),
        profile: userProfile ? {
          name: userProfile.name,
          age: Number(userProfile.age),
          email: userProfile.email || null,
        } : null,
        skinType: latestSkinType,
        analysisHistory: analysisHistory?.map(item => ({
          detectedSkinType: item.detectedSkinType,
          concerns: {
            acne: item.concerns.acne,
            pigmentation: item.concerns.pigmentation,
            aging: item.concerns.aging,
            dryness: item.concerns.dryness,
            concerns: item.concerns.concerns,
          },
          timestamp: Number(item.timestamp),
          answers: item.answers.map(a => Number(a)),
        })) || [],
        favorites: favorites || [],
        routines: routines?.map(routine => ({
          name: routine.name,
          steps: routine.steps.map(step => ({
            productName: step.productName,
            order: Number(step.order),
            frequency: Number(step.frequency),
          })),
        })) || [],
        productNotes: productNotes?.map(note => ({
          productName: note.productName,
          rating: Number(note.rating),
          notes: note.notes,
          experience: note.experience,
        })) || [],
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportObject, null, 2);
      
      // Create blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `skincare-data-export-${dateStr}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting,
  };
}
