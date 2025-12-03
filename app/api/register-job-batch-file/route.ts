import {
  registerAndUploadFile,
  RegisterJobBatchFileRequest,
} from '@/lib/intelligent-automation';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import os from 'os'; // Importing os module to handle temporary file paths --- DONT REMOVED!!!!!
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  console.log(
    '[API Route] POST /api/register-job-batch-file - Request received'
  );

  try {
    const tempDir = path.join(os.tmpdir(), 'content-acquisition-uploads');
    console.log('[API Route] Temp directory:', tempDir);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log('[API Route] Created temp directory');
    }

    const contentType = request.headers.get('content-type') || '';
    console.log('[API Route] Content-Type:', contentType);

    let requestData: RegisterJobBatchFileRequest;
    let tempFilePath: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      console.log('[API Route] Processing multipart/form-data');
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      console.log(
        '[API Route] File:',
        file ? `${file.name} (${file.size} bytes)` : 'null'
      );

      if (!file) {
        console.error('[API Route] ERROR: No file uploaded');
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      const rawProjectId = formData.get('project_id');
      const rawWorkflowId = formData.get('workflow_id');

      requestData = {
        project_code: formData.get('project_code') as string,
        workflow_code: formData.get('workflow_code') as string,
        first_task_uid: formData.get('first_task_uid') as string,
        file_unique_identifier:
          (formData.get('file_unique_identifier') as string) || '',
        file_name: file.name,
        file_path: '',
        project_id: rawProjectId ? String(rawProjectId) : '',
        workflow_id: rawWorkflowId ? String(rawWorkflowId) : '',
        meta_data: JSON.parse((formData.get('meta_data') as string) || '{}'),
      };

      const fileId = uuidv4();
      tempFilePath = path.join(tempDir, `${fileId}-${file.name}`);
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await writeFile(tempFilePath, fileBuffer);

      requestData.file_path = tempFilePath;
    } else {
      requestData = await request.json();
    }

    console.log('Request Data:', requestData);

    const requiredFields = [
      'project_code',
      'workflow_code',
      'first_task_uid',
      'file_name',
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !requestData[field as keyof RegisterJobBatchFileRequest] ||
        (typeof requestData[field as keyof RegisterJobBatchFileRequest] ===
          'string' &&
          (
            requestData[field as keyof RegisterJobBatchFileRequest] as string
          ).trim() === '')
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    if (
      !requestData.file_unique_identifier ||
      requestData.file_unique_identifier.trim() === ''
    ) {
      requestData.file_unique_identifier = `file-uid-${
        requestData.file_name
      }-${Date.now()}`;
    }

    if (!requestData.file_path || requestData.file_path.trim() === '') {
      requestData.file_path = '-';
    }

    if (!requestData.meta_data) {
      requestData.meta_data = {
        M1: 'V1',
        M2: 'V2',
      };
    }

    const filePath = requestData.file_path;

    console.log('[API Route] Calling registerAndUploadFile...');
    console.log(
      '[API Route] Request data:',
      JSON.stringify(requestData, null, 2)
    );
    console.log('[API Route] File path:', filePath);

    const response = await registerAndUploadFile(requestData, filePath);

    console.log(
      '[API Route] Success! Response:',
      JSON.stringify(response, null, 2)
    );
    return NextResponse.json(response, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[API Route] ========== ERROR CAUGHT ==========');
    console.error('[API Route] Error type:', typeof error);
    console.error('[API Route] Error:', error);
    console.error('[API Route] Error message:', error?.message);
    console.error('[API Route] Error stack:', error?.stack);
    console.error('[API Route] Error cause:', error?.cause);
    console.error('[API Route] Error name:', error?.name);
    console.error(
      '[API Route] Full error object:',
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
    console.error('[API Route] ====================================');

    return NextResponse.json(
      {
        error: error.message || 'Failed to register job batch file',
        details: error.stack || 'No stack trace available',
        errorType: error.name || typeof error,
      },
      { status: error.status || 500 }
    );
  }
}
