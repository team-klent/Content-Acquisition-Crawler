import {
  registerAndUploadFile,
  RegisterJobBatchFileRequest,
} from '@/lib/intelligent-automation';
import { scanPdfDirectory } from '@/lib/pdf-scanner';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';

function resolvePublicPdfPath(relativePath: string) {
  const normalized = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath;

  return path.join(process.cwd(), 'public', normalized);
}

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
  console.log('[API /api/pdfs POST] Request received');

  try {
    const body: RegisterJobBatchFileRequest = await req.json();

    console.log(
      '[API /api/pdfs POST] Request Body:',
      JSON.stringify(body, null, 2)
    );

    const requiredFields = [
      'project_code',
      'workflow_code',
      'first_task_uid',
      'file_name',
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !body[field as keyof RegisterJobBatchFileRequest] ||
        (typeof body[field as keyof RegisterJobBatchFileRequest] === 'string' &&
          (
            body[field as keyof RegisterJobBatchFileRequest] as string
          ).trim() === '')
    );

    if (missingFields.length > 0) {
      console.error(
        '[API /api/pdfs POST] ERROR: Missing required fields:',
        missingFields
      );
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('[API /api/pdfs POST] All required fields present');

    if (
      !body.file_unique_identifier ||
      body.file_unique_identifier.trim() === ''
    ) {
      body.file_unique_identifier = `file-uid-${body.file_name}-${Date.now()}`;
    }

    if (!body.file_path || body.file_path.trim() === '') {
      body.file_path = '-';
    }

    if (!body.meta_data) {
      body.meta_data = {
        M1: 'V1',
        M2: 'V2',
      };
    }

    if (!body.file_path || body.file_path.trim() === '') {
      console.error('[API /api/pdfs POST] ERROR: File path is required');
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    console.log('[API /api/pdfs POST] Resolving file path:', body.file_path);
    const fullPath = resolvePublicPdfPath(body.file_path);
    console.log('[API /api/pdfs POST] Full resolved path:', fullPath);

    if (!fs.existsSync(fullPath)) {
      console.error(
        '[API /api/pdfs POST] ERROR: File not found at path:',
        fullPath
      );
      return NextResponse.json(
        {
          error: `File not found at path: ${fullPath}, please check if this file exists on this path`,
        },
        { status: 404 }
      );
    }

    console.log(
      '[API /api/pdfs POST] File exists, proceeding with registration'
    );

    const requestData: RegisterJobBatchFileRequest = {
      ...body,
      file_path: fullPath,
    };

    const filePath = requestData.file_path;

    console.log(
      '[API /api/pdfs POST] Final request data:',
      JSON.stringify(requestData, null, 2)
    );
    console.log('[API /api/pdfs POST] File path to upload:', filePath);
    console.log('[API /api/pdfs POST] Calling registerAndUploadFile...');

    const result = await registerAndUploadFile(requestData, filePath);

    console.log(
      '[API /api/pdfs POST] Success! Result:',
      JSON.stringify(result, null, 2)
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/pdfs POST] ========== ERROR CAUGHT ==========');
    console.error('[API /api/pdfs POST] Error type:', typeof error);
    console.error('[API /api/pdfs POST] Error:', error);
    console.error('[API /api/pdfs POST] Error message:', error?.message);
    console.error('[API /api/pdfs POST] Error stack:', error?.stack);
    console.error('[API /api/pdfs POST] Error cause:', error?.cause);
    console.error(
      '[API /api/pdfs POST] Full error object:',
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
    console.error('[API /api/pdfs POST] ====================================');

    return NextResponse.json(
      {
        error: error.message || 'Failed to register and upload PDF',
        details: error.stack || 'No stack trace available',
        errorType: error.name || typeof error,
      },
      { status: 500 }
    );
  }
};
export { GET, POST };
