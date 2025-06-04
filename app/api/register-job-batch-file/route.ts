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
  try {
    const tempDir = path.join(os.tmpdir(), 'content-acquisition-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const contentType = request.headers.get('content-type') || '';
    let requestData: RegisterJobBatchFileRequest;
    let tempFilePath: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
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

    const response = await registerAndUploadFile(requestData, filePath);

    return NextResponse.json(response, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error registering job batch file:', error);
    // Log the full error details for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return NextResponse.json(
      { error: error.message || 'Failed to register job batch file' },
      { status: error.status || 500 }
    );
  }
}
