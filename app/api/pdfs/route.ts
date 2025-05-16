import { NextResponse } from 'next/server';
import { scanPdfDirectory } from '@/lib/pdf-scanner';

export async function GET() {
  try {
    const pdfDocuments = await scanPdfDirectory();
    return NextResponse.json({ pdfs: pdfDocuments });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve PDF documents' },
      { status: 500 }
    );
  }
}
