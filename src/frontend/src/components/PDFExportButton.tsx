import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface PDFExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
}

// Type declaration for html2pdf.js
declare global {
  interface Window {
    html2pdf: any;
  }
}

export default function PDFExportButton({ contentRef }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!contentRef.current) {
      toast.error('Content not found. Please try again.');
      return;
    }

    // Check if html2pdf is loaded
    if (typeof window.html2pdf === 'undefined') {
      toast.error('PDF library not loaded. Please refresh the page and try again.');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate timestamp for filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `SkinCare-Analyzer-DBMS-Documentation-${timestamp}.pdf`;

      // Configure html2pdf options
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { 
          type: 'jpeg', 
          quality: 0.85 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break',
          avoid: '.print-avoid-break'
        }
      };

      // Generate PDF
      await window.html2pdf()
        .set(options)
        .from(contentRef.current)
        .save();

      toast.success('PDF generated successfully!', {
        description: `Downloaded as ${filename}`
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', {
        description: 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all duration-200 no-print"
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-5 h-5 mr-2" />
          Export as PDF
        </>
      )}
    </Button>
  );
}
