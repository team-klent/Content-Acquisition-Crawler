import fs from 'fs';
import path from 'path';
import { PdfDocument } from './pdf-data';

/**
 * This is a server-side utility function to scan the PDF directory
 * and generate metadata for each PDF file found.
 * 
 * In a real application, you would use this during build time or
 * via a server endpoint to dynamically update the PDF document list.
 */
export async function scanPdfDirectory(
  directoryPath: string = path.join(process.cwd(), 'public', 'pdfs')
): Promise<PdfDocument[]> {
  try {
    // Check if directory exists
    if (!fs.existsSync(directoryPath)) {
      return [];
    }
    
    // Read directory contents
    const files = fs.readdirSync(directoryPath);
    
    // Filter for PDF files only
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    
    // Generate metadata for each file
    const pdfDocuments: PdfDocument[] = pdfFiles.map((filename, index) => {
      const filePath = path.join(directoryPath, filename);
      const stats = fs.statSync(filePath);
      
      // Format file size
      const fileSizeInBytes = stats.size;
      let fileSize: string;
      if (fileSizeInBytes < 1024) {
        fileSize = fileSizeInBytes + ' bytes';
      } else if (fileSizeInBytes < 1024 * 1024) {
        fileSize = Math.round(fileSizeInBytes / 1024) + ' KB';
      } else {
        fileSize = (fileSizeInBytes / (1024 * 1024)).toFixed(1) + ' MB';
      }
      
      // Generate a title from filename (remove extension and convert to title case)
      const title = filename
        .replace('.pdf', '')
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        id: (index + 1).toString(),
        title,
        filename,
        path: `/pdfs/${filename}`,
        size: fileSize,
        type: 'pdf',
        createdAt: new Date(stats.birthtime),
        updatedAt: new Date(stats.mtime),
        isActive: true,
      };
    });
    
    return pdfDocuments;
  } catch {
    return [];
  }
}


