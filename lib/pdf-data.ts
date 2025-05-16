import { Metadata } from './types';

export interface PdfDocument extends Metadata {
  id: string;
  title: string;
  filename: string;
  path: string;
  size?: string;
  type: string;
}

// This simulates a database by providing PDF data from the public folder
export const pdfDocuments: PdfDocument[] = [
  {
    id: '1',
    title: 'API Documentation Guide',
    filename: 'Get_Started_With_Smallpdf-output.pdf',
    path: '/pdfs/Get_Started_With_Smallpdf-output.pdf',
    size: '1.2 MB',
    type: 'pdf',
    createdAt: new Date('2025-01-15'),
    isActive: true,
    createdBy: 'admin@example.com',
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    title: 'Product Requirements Document',
    filename: 'sample.pdf',
    path: '/pdfs/sample.pdf',
    size: '3.5 MB',
    type: 'pdf',
    createdAt: new Date('2025-02-20'),
    isActive: true,
    createdBy: 'product@example.com',
    updatedAt: new Date('2025-04-10'),
  },
  {
    id: '3',
    title: 'Technical Specifications',
    filename: 'sample3.pdf',
    path: '/pdfs/sample3.pdf',
    size: '2.8 MB',
    type: 'pdf',
    createdAt: new Date('2025-03-10'),
    isActive: true,
    createdBy: 'engineer@example.com',
    updatedAt: new Date('2025-03-15'),
  },
];

// Helper function to get a PDF document by ID
export function getPdfById(id: string): PdfDocument | undefined {
  return pdfDocuments.find((pdf) => pdf.id === id);
}

// Helper function to get all PDF documents
export function getAllPdfs(): PdfDocument[] {
  return pdfDocuments;
}