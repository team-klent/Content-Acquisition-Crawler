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
    id: '4',
    title: 'ACT Accelerator Strategic Plan & Budget',
    filename: 'ACT_accelerator_Strategic_Plan_&_Budget.pdf',
    path: '/pdfs/ACT_accelerator_Strategic_Plan_&_Budget.pdf',
    size: '4.2 MB',
    type: 'pdf',
    createdAt: new Date('2025-04-01'),
    isActive: true,
    createdBy: 'health@example.com',
    updatedAt: new Date('2025-04-05'),
  },
  {
    id: '5',
    title: 'Better Cardiac Care Aboriginal Torres Strait Islander 2021',
    filename: 'Better_Cardiac_Care_Aboriginal_Torres_Strait_Islander_2021.pdf',
    path: '/pdfs/Better_Cardiac_Care_Aboriginal_Torres_Strait_Islander_2021.pdf',
    size: '3.7 MB',
    type: 'pdf',
    createdAt: new Date('2025-02-15'),
    isActive: true,
    createdBy: 'research@example.com',
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '6',
    title: 'Child Protection Australia 2021-22',
    filename: 'Child_Protection_Australia_2021_22.pdf',
    path: '/pdfs/Child_Protection_Australia_2021_22.pdf',
    size: '2.9 MB',
    type: 'pdf',
    createdAt: new Date('2025-01-28'),
    isActive: true,
    createdBy: 'welfare@example.com',
    updatedAt: new Date('2025-02-10'),
  },
  {
    id: '7',
    title: 'OECD Health Care Quality and Outcomes Indicators',
    filename: 'OECD_health_care_quality_and_outcomes_indicators.pdf',
    path: '/pdfs/OECD_health_care_quality_and_outcomes_indicators.pdf',
    size: '5.1 MB',
    type: 'pdf',
    createdAt: new Date('2025-03-25'),
    isActive: true,
    createdBy: 'policy@example.com',
    updatedAt: new Date('2025-04-12'),
  },
  {
    id: '8',
    title: 'Oxygen Therapy Equipment Cleaning Guidelines',
    filename: 'Oxygen_Therapy_Equipment_Cleaning_Guidelines.pdf',
    path: '/pdfs/Oxygen_Therapy_Equipment_Cleaning_Guidelines.pdf',
    size: '1.8 MB',
    type: 'pdf',
    createdAt: new Date('2025-02-05'),
    isActive: true,
    createdBy: 'medical@example.com',
    updatedAt: new Date('2025-03-01'),
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
