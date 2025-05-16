export interface RegisterJobBatchFileRequest {
  project_code: string;
  workflow_code: string;
  first_task_uid: string;
  file_unique_identifier?: string;
  file_name: string;
  file_path: string;
  meta_data: Record<string, string>;
}

export interface UpdateFileStatusRequest {
  project_code: string;
  task_uid: string;
  file_id: string;
  previous_file_status: string;
  file_status: string;
}

export interface UpdateFileStatusResponse {
  success: boolean;
  message: string;
  [key: string]: string | number | boolean | object | null;
}

export interface RegisterJobBatchFileResponse {
  file_id: string;
  file_output_upload_url: string;
  file_output_path: string;
  [key: string]: string | number | boolean | object | null;
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
}

/**
 * Register a job batch file with the Intelligent Automation API
 *
 * @param payload - The registration payload
 * @param apiToken - The API token for authentication
 * @returns The API response including file_id and file_output_upload_url
 */
export async function registerJobBatchFile(
  payload: RegisterJobBatchFileRequest
): Promise<RegisterJobBatchFileResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_IA_API_URL ||
    'https://test-intelligentautomation.innodata.com';
  const url = `${baseUrl}/api/register-job-batch-file`;

  try {
    const requiredFields = [
      'project_code',
      'workflow_code',
      'first_task_uid',
      'file_name',
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !payload[field as keyof RegisterJobBatchFileRequest] ||
        (typeof payload[field as keyof RegisterJobBatchFileRequest] ===
          'string' &&
          (
            payload[field as keyof RegisterJobBatchFileRequest] as string
          ).trim() === '')
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    if (!payload.file_path) {
      payload.file_path = '-';
    }

    if (!payload.file_unique_identifier) {
      payload.file_unique_identifier = `file-uid-${
        payload.file_name
      }-${Date.now()}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN!}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorDetails = '';

      try {
        if (contentType && contentType.includes('application/json')) {
          const errorJson = await response.json();
          errorDetails = JSON.stringify(errorJson);
        } else {
          errorDetails = await response.text();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        errorDetails = 'Could not parse error response';
      }

      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorDetails}`);

      throw new Error(
        `Failed to register job batch file: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but received:', text);
      throw new Error(
        `Expected JSON response but received: ${text.substring(0, 100)}...`
      );
    }

    const data = await response.json();
    console.log('API response received:', data);
    return data;
  } catch (error) {
    console.error('Error in registerJobBatchFile:', error);
    throw error;
  }
}

////DONOT REMOVED ANY JSDOC

/**
 * Complete workflow to register a job batch file, upload it to S3, and update its status
 *
 * @param registrationPayload - The registration payload
 * @param localFilePath - The local path to the file to upload
 * @param updateStatusOptions - Options for updating the file status after upload
 * @returns The combined result of registration, upload, and status update
 */
export async function registerAndUploadFile(
  registrationPayload: RegisterJobBatchFileRequest,
  localFilePath: string,
  updateStatusOptions?: {
    previousFileStatus?: string;
    fileStatus?: string;
  }
): Promise<{
  registration: RegisterJobBatchFileResponse;
  upload: FileUploadResponse;
  statusUpdate?: UpdateFileStatusResponse;
}> {
  try {
    // Step 1: Register the job batch file
    const registrationResponse = await registerJobBatchFile(
      registrationPayload
    );

    // Validate the response before stepping to the next stage
    if (typeof registrationResponse.file_output_path !== 'string') {
      throw new Error('file_output_path is not a valid string');
    }
    //step 2: Upload the file to S3
    const uploadResponse = await uploadFileToS3(
      localFilePath,
      registrationResponse.file_output_upload_url as string
    );

    // If upload was successful and update status options are provided, proceed to Step 3
    let statusUpdateResponse;
    if (uploadResponse.success && registrationResponse.file_id) {
      // Step 3: Update file status
      const previousFileStatus = updateStatusOptions?.previousFileStatus || 'I';
      const fileStatus = updateStatusOptions?.fileStatus || 'C';

      try {
        statusUpdateResponse = await updateFileStatus({
          project_code: registrationPayload.project_code,
          task_uid: registrationPayload.first_task_uid,
          file_id: registrationResponse.file_id,
          previous_file_status: previousFileStatus,
          file_status: fileStatus,
        });

        console.log('File status update successful:', statusUpdateResponse);
      } catch (updateError) {
        console.error('Error updating file status:', updateError);
      }
    }

    return {
      registration: registrationResponse,
      upload: uploadResponse,
      statusUpdate: statusUpdateResponse,
    };
  } catch (error) {
    console.error('Error in registerAndUploadFile:', error);
    throw error;
  }
}
/**
 * Upload a file to S3 using the provided upload URL
 *
 * @param filePath - The local path to the file to upload
 * @param uploadUrl - The S3 URL to upload the file to
 * @returns A response object indicating success or failure
 */
export async function uploadFileToS3(
  filePath: string,
  uploadUrl: string
): Promise<FileUploadResponse> {
  try {
    // Import fs module for file operations
    const fs = await import('fs');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Read the file as a buffer
    const fileContent = fs.readFileSync(filePath);

    // Upload the file to S3
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: fileContent,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload file: ${response.status} ${response.statusText}`
      );
    }

    return {
      success: true,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    console.error('Error in uploadFileToS3:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during file upload',
    };
  }
}

/**
 * Update the status of a file after it has been uploaded
 *
 * @param payload - The file status update request
 * @returns The API response
 */
export async function updateFileStatus(
  payload: UpdateFileStatusRequest
): Promise<UpdateFileStatusResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_IA_API_URL ||
    'https://test-intelligentautomation.innodata.com';
  const url = `${baseUrl}/api/update-file-status`;

  try {
    const requiredFields = [
      'project_code',
      'task_uid',
      'file_id',
      'previous_file_status',
      'file_status',
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !payload[field as keyof UpdateFileStatusRequest] ||
        (typeof payload[field as keyof UpdateFileStatusRequest] === 'string' &&
          (payload[field as keyof UpdateFileStatusRequest] as string).trim() ===
            '')
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorDetails = '';

      try {
        if (contentType && contentType.includes('application/json')) {
          const errorJson = await response.json();
          errorDetails = JSON.stringify(errorJson);
        } else {
          errorDetails = await response.text();
        }
      } catch (e) {
        errorDetails = `${e} Could not parse error response`;
      }

      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorDetails}`);

      throw new Error(
        `Failed to update file status: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();
    console.log('File status update response:', data);
    return data;
  } catch (error) {
    console.error('Error in updateFileStatus:', error);
    throw error;
  }
}
