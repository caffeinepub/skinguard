import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useGetCallerUserProfile, useGetSkinTypeDetectionResults, useGetRoutines, useGetFavorites, useGetProductNotes, useGetProductRecommendations, useGetLatestSkinType } from '../hooks/useQueries';
import { generateExportHTML } from '../utils/exportFormatter';

interface ExportButtonProps {
  type: 'results' | 'dashboard';
}

export default function ExportButton({ type }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: analysisHistory } = useGetSkinTypeDetectionResults();
  const { data: routines } = useGetRoutines();
  const { data: favorites } = useGetFavorites();
  const { data: notes } = useGetProductNotes();
  const { data: latestSkinType } = useGetLatestSkinType();
  
  const latestResult = analysisHistory && analysisHistory.length > 0 ? analysisHistory[0] : null;
  const { data: products } = useGetProductRecommendations(
    latestSkinType || null,
    latestResult?.concerns || null
  );

  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const html = generateExportHTML({
        userProfile: userProfile || { name: 'User', age: BigInt(0), email: undefined },
        analysisHistory: analysisHistory || [],
        products: products || [],
        routines: routines || [],
        favorites: favorites || [],
        notes: notes || [],
        type,
      });

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to generate export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Export
        </>
      )}
    </Button>
  );
}
