export interface RegisterJobBatchFileRequest {
  project_code: string;
  workflow_code: string;
  first_task_uid: string;
  file_unique_identifier?: string;
  file_name: string;
  file_path: string;
  project_id?: string;
  workflow_id?: string;
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
  console.log('[registerJobBatchFile] Starting registration...');
  console.log(
    '[registerJobBatchFile] Payload:',
    JSON.stringify(payload, null, 2)
  );

  const baseUrl = process.env.NEXT_PUBLIC_IA_API_URL;

  if (!baseUrl) {
    const error = 'NEXT_PUBLIC_IA_API_URL environment variable is not set';
    console.error('[registerJobBatchFile] ERROR:', error);
    throw new Error(error);
  }

  const url = `${baseUrl}/api/register-job-batch-file`;
  console.log('[registerJobBatchFile] API URL:', url);

  try {
    const requiredFields = [
      'project_code',
      'workflow_code',
      'first_task_uid',
      'file_name',
    ];

    if (!payload.file_path) {
      payload.file_path = '-';
    }

    if (!payload.file_unique_identifier) {
      payload.file_unique_identifier = `file-uid-${
        payload.file_name
      }-${Date.now()}`;
    }

    const enhancedPayload = {
      ...payload,
      project_id: payload.project_id || '',
      workflow_id: payload.workflow_id || '',
    };

    const apiToken = process.env.API_TOKEN;
    if (!apiToken) {
      const error = 'API_TOKEN environment variable is not set';
      console.error('[registerJobBatchFile] ERROR:', error);
      throw new Error(error);
    }

    console.log(
      '[registerJobBatchFile] Enhanced payload:',
      JSON.stringify(enhancedPayload, null, 2)
    );
    console.log('[registerJobBatchFile] Making API request...');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-token': apiToken,
      },
      body: JSON.stringify(enhancedPayload),
    });

    console.log('[registerJobBatchFile] Response status:', response.status);
    console.log(
      '[registerJobBatchFile] Response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorDetails = '';

      try {
        if (contentType && contentType.includes('application/json')) {
          const errorJson = await response.json();
          errorDetails = JSON.stringify(errorJson, null, 2);
        } else {
          errorDetails = await response.text();
        }
      } catch (e) {
        errorDetails = `Could not parse error response: ${e}`;
      }

      console.error('[registerJobBatchFile] API Error:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        errorDetails,
      });

      throw new Error(
        `Failed to register job batch file: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[registerJobBatchFile] Expected JSON but received:', text);
      throw new Error(
        `Expected JSON response but received: ${text.substring(0, 100)}...`
      );
    }

    const responseData = await response.json();
    console.log(
      '[registerJobBatchFile] Success! Response data:',
      JSON.stringify(responseData, null, 2)
    );

    // Check if the response has a nested 'data' object (common API pattern)
    if (responseData.data && typeof responseData.data === 'object') {
      console.log(
        '[registerJobBatchFile] Extracting data from nested response'
      );
      return responseData.data as RegisterJobBatchFileResponse;
    }

    // Otherwise return the response as-is
    return responseData as RegisterJobBatchFileResponse;
  } catch (error) {
    console.error('[registerJobBatchFile] FINAL ERROR:', error);
    if (error instanceof Error) {
      console.error('[registerJobBatchFile] Error message:', error.message);
      console.error('[registerJobBatchFile] Error stack:', error.stack);
    }
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
  console.log('[registerAndUploadFile] Starting...');
  console.log(
    '[registerAndUploadFile] Payload:',
    JSON.stringify(registrationPayload, null, 2)
  );
  console.log('[registerAndUploadFile] Local file path:', localFilePath);

  try {
    // Step 1: Register the job batch file
    console.log(
      '[registerAndUploadFile] Step 1: Calling registerJobBatchFile...'
    );
    const registrationResponse = await registerJobBatchFile(
      registrationPayload
    );

    console.log(
      '[registerAndUploadFile] Registration Response:',
      JSON.stringify(registrationResponse, null, 2)
    );

    // Check if file upload is required (some workflows may not need file upload)
    const uploadUrl = registrationResponse.file_output_upload_url;
    const outputPath = registrationResponse.file_output_path;

    console.log('[registerAndUploadFile] Upload URL:', uploadUrl);
    console.log('[registerAndUploadFile] Output Path:', outputPath);

    // If upload URL is null or empty, skip the upload step
    if (!uploadUrl || uploadUrl === null || uploadUrl === '') {
      console.log(
        '[registerAndUploadFile] No upload URL provided - skipping file upload step'
      );
      console.log(
        '[registerAndUploadFile] This workflow may not require file upload to S3'
      );

      const result = {
        registration: registrationResponse,
        upload: {
          success: true,
          message: 'File upload skipped - no upload URL provided by API',
        } as FileUploadResponse,
        statusUpdate: undefined,
      };

      console.log(
        '[registerAndUploadFile] Complete! Final result:',
        JSON.stringify(result, null, 2)
      );
      return result;
    }

    // If we reach here, upload URL is valid
    console.log('[registerAndUploadFile] Step 2: Uploading file...');
    console.log('[registerAndUploadFile] Local File Path:', localFilePath);
    console.log('[registerAndUploadFile] Upload URL:', uploadUrl);

    const uploadResponse = await uploadFileToS3(
      localFilePath,
      uploadUrl as string
    );

    console.log(
      '[registerAndUploadFile] Upload Response:',
      JSON.stringify(uploadResponse, null, 2)
    );

    // If upload was successful and update status options are provided, proceed to Step 3
    let statusUpdateResponse;
    if (uploadResponse.success && registrationResponse.file_id) {
      console.log('[registerAndUploadFile] Step 3: Updating file status...');
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
        console.log(
          '[registerAndUploadFile] Status update response:',
          JSON.stringify(statusUpdateResponse, null, 2)
        );
      } catch (updateError) {
        console.error(
          '[registerAndUploadFile] Error updating file status:',
          updateError
        );
      }
    } else {
      console.log(
        '[registerAndUploadFile] Skipping status update - upload success:',
        uploadResponse.success,
        'file_id:',
        registrationResponse.file_id
      );
    }

    const result = {
      registration: registrationResponse,
      upload: uploadResponse,
      statusUpdate: statusUpdateResponse,
    };
    console.log(
      '[registerAndUploadFile] Complete! Final result:',
      JSON.stringify(result, null, 2)
    );
    return result;
  } catch (error) {
    console.error('[registerAndUploadFile] FINAL ERROR:', error);
    if (error instanceof Error) {
      console.error('[registerAndUploadFile] Error message:', error.message);
      console.error('[registerAndUploadFile] Error stack:', error.stack);
    }
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
    console.log('File Path:', filePath);
    console.log('Upload URL:', uploadUrl);

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
  const baseUrl = process.env.NEXT_PUBLIC_IA_API_URL!;
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
        'api-token': `${process.env.API_TOKEN}`,
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
    return data;
  } catch (error) {
    console.error('Error in updateFileStatus:', error);
    throw error;
  }
}
