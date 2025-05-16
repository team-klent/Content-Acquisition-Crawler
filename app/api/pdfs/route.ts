import { registerAndUploadFile } from '@/lib/intelligent-automation';
import { scanPdfDirectory } from '@/lib/pdf-scanner';
import { NextRequest, NextResponse } from 'next/server';

async function GET() {
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

const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const projectInformation = {
      project_code: 'TEST-UNIFIED-WF',
      workflow_code: 'UWF-1',
      first_task_uid: '1eb1599609b8474bbee630925b3603e0',
      file_name: body.filename,
      file_path: body.path,
      meta_data: {
        M1: 'V1',
        M2: 'V2',
      },
    };

    await registerAndUploadFile(projectInformation, body.path);

    return NextResponse.json(
      { message: 'PDF registered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve PDF documents' },
      { status: 500 }
    );
  }
};
export { GET, POST };
