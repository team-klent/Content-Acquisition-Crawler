import {
  registerJobBatchFile,
  RegisterJobBatchFileRequest,
} from '@/lib/intelligent-automation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle POST requests to register a job batch file
 *
 * Expected request body:
 * {
 *   "project_code": "string",
 *   "workflow_code": "string",
 *   "first_task_uid": "string",
 *   "file_unique_identifier": "string",
 *   "file_name": "string",
 *   "file_path": "string",
 *   "meta_data": {
 *     "key1": "value1",
 *     "key2": "value2"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const requestData: RegisterJobBatchFileRequest = await request.json();
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
      console.log(
        'Generated file_unique_identifier:',
        requestData.file_unique_identifier
      );
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

    const response = await registerJobBatchFile(requestData);

    return NextResponse.json(response);
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
