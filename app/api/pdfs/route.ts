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
  try {
    const body: RegisterJobBatchFileRequest = await req.json();

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
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const fullPath = resolvePublicPdfPath(body.file_path);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        {
          error: `File not found at path: ${fullPath}, please check if this file exists on this path`,
        },
        { status: 404 }
      );
    }

    const requestData: RegisterJobBatchFileRequest = {
      ...body,
      file_path: fullPath,
    };

    const filePath = requestData.file_path;

    await registerAndUploadFile(requestData, filePath);

    return NextResponse.json(requestData, { status: 200 });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve PDF documents' },
      { status: 500 }
    );
  }
};
export { GET, POST };
