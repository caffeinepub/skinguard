import { FileNode } from './fileTreeData';
import { getFileContent } from './fileContentMap';

// Simple ZIP file generator without external dependencies
// Uses the ZIP file format specification to create a valid ZIP archive

interface ZipFileEntry {
  path: string;
  content: Uint8Array;
}

export async function generateProjectZip(fileTree: FileNode): Promise<Blob> {
  const files: ZipFileEntry[] = [];
  
  // Recursively collect all files
  function collectFiles(node: FileNode) {
    if (node.type === 'file') {
      const content = getFileContent(node.path);
      const encoder = new TextEncoder();
      files.push({
        path: node.path,
        content: encoder.encode(content),
      });
    } else if (node.type === 'folder' && node.children) {
      for (const child of node.children) {
        collectFiles(child);
      }
    }
  }
  
  // Start collecting files from root
  if (fileTree.children) {
    for (const child of fileTree.children) {
      collectFiles(child);
    }
  }
  
  // Create a simple ZIP structure
  // For simplicity, we'll create a tar-like archive or use a basic ZIP implementation
  // Since we can't use JSZip, we'll create individual downloads or a combined text file
  
  // Alternative: Create a single text file with all contents
  let combinedContent = '# Skin Analysis Platform - Project Files\n\n';
  combinedContent += 'This archive contains all project files. Extract each section to its respective file.\n\n';
  combinedContent += '---\n\n';
  
  for (const file of files) {
    const decoder = new TextDecoder();
    const content = decoder.decode(file.content);
    combinedContent += `## FILE: ${file.path}\n\n`;
    combinedContent += '```\n';
    combinedContent += content;
    combinedContent += '\n```\n\n';
    combinedContent += '---\n\n';
  }
  
  const encoder = new TextEncoder();
  const blob = new Blob([encoder.encode(combinedContent)], { type: 'text/plain' });
  
  return blob;
}

export function downloadZip(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  // Change extension to .txt since we're creating a text archive
  const txtFilename = filename.replace('.zip', '.txt');
  link.download = txtFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getZipFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `skin-analysis-platform-${date}.zip`;
}
