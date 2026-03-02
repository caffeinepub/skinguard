import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Download, FileText, Folder, Loader2, Package } from 'lucide-react';
import { projectFileTree, FileNode } from '../utils/fileTreeData';
import { getFileContent, downloadFile } from '../utils/fileContentMap';
import { generateProjectZip, downloadZip, getZipFilename } from '../utils/zipGenerator';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';

interface FileDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FileDownloadModal({ open, onOpenChange }: FileDownloadModalProps) {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [generatingZip, setGeneratingZip] = useState(false);

  const handleDownloadFile = (filePath: string) => {
    setDownloadingFile(filePath);
    try {
      const content = getFileContent(filePath);
      downloadFile(filePath, content);
      toast.success(`Downloaded ${filePath.split('/').pop()}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleDownloadAll = async () => {
    setGeneratingZip(true);
    try {
      toast.info('Generating ZIP file... This may take a moment.');
      const blob = await generateProjectZip(projectFileTree);
      const filename = getZipFilename();
      downloadZip(blob, filename);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('ZIP generation error:', error);
      toast.error('Failed to generate ZIP file');
    } finally {
      setGeneratingZip(false);
    }
  };

  const renderFileNode = (node: FileNode, level: number = 0): React.ReactElement => {
    if (node.type === 'file') {
      return (
        <div
          key={node.path}
          className="flex items-center justify-between py-2 px-3 hover:bg-accent/50 rounded-md transition-colors group"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate" title={node.name}>
              {node.name}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDownloadFile(node.path)}
            disabled={downloadingFile === node.path}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {downloadingFile === node.path ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
          </Button>
        </div>
      );
    }

    if (node.type === 'folder' && node.children) {
      return (
        <AccordionItem key={node.path} value={node.path} className="border-none">
          <AccordionTrigger className="py-2 px-3 hover:bg-accent/30 rounded-md hover:no-underline">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{node.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-4 pb-0">
            {node.children.map((child) => renderFileNode(child, level + 1))}
          </AccordionContent>
        </AccordionItem>
      );
    }

    return <></>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Download Project Files</DialogTitle>
          <DialogDescription>
            Download individual files or the entire project as a ZIP archive for GitHub upload.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 py-4 border-y border-border">
          <Button
            onClick={handleDownloadAll}
            disabled={generatingZip}
            className="bg-primary hover:bg-primary/90"
          >
            {generatingZip ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating ZIP...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Download All as ZIP
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Recommended for GitHub upload
          </p>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-1">
            <Accordion type="multiple" className="w-full">
              {projectFileTree.children?.map((node) => renderFileNode(node))}
            </Accordion>
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> The README.md file includes comprehensive documentation about your
            database architecture and DBMS implementation. Other files show the project structure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
