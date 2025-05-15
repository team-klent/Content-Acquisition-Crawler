
/**
 * Interface for job batch file registration request
 */
export interface RegisterJobBatchFileRequest {
  project_code: string;
  workflow_code: string;
  first_task_uid: string;
  file_unique_identifier: string;
  file_name: string;
  file_path: string;
  meta_data: Record<string, string>;
}


export interface RegisterJobBatchFileResponse {
  file_id: string;
  file_output_upload_url: string;
  [key: string]: any;
}

/**
 * Register a job batch file with the Intelligent Automation API
 * 
 * @param payload - The registration payload
 * @param apiToken - The API token for authentication
 * @returns The API response including file_id and file_output_upload_url
 */
export async function registerJobBatchFile(
  payload: RegisterJobBatchFileRequest,
  apiToken: string
): Promise<RegisterJobBatchFileResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_IA_API_URL || "https://test-intelligentautomation.innodata.com";
  const url = `${baseUrl}/api/register-job-batch-file`;
  
  
  try {
   
    const requiredFields = ['project_code', 'workflow_code', 'first_task_uid', 'file_name'];
    const missingFields = requiredFields.filter(field => 
      !payload[field as keyof RegisterJobBatchFileRequest] || 
      (typeof payload[field as keyof RegisterJobBatchFileRequest] === 'string' && 
       (payload[field as keyof RegisterJobBatchFileRequest] as string).trim() === '')
    );
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    

    if (!payload.file_path) {
      payload.file_path = '-';
    }
    
    
    if (!payload.file_unique_identifier) {
      payload.file_unique_identifier = `file-uid-${payload.file_name}-${Date.now()}`;
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify(payload)
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
        errorDetails = 'Could not parse error response';
      }
      
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorDetails}`);
      
      throw new Error(`Failed to register job batch file: ${response.status} ${response.statusText} - ${errorDetails}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but received:', text);
      throw new Error(`Expected JSON response but received: ${text.substring(0, 100)}...`);
    }
    
    const data = await response.json();
    console.log("API response received:", data);
    return data;
  } catch (error) {
    console.error("Error in registerJobBatchFile:", error);
    throw error;
  }
}
