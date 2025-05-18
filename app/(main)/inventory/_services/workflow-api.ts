
interface WorkflowUrlParams {
  project_id?: string;
  job_id?: string;
  batch_id?: string;
  file_id?: string;
  task_id?: string;
  user_id?: string;
}

interface WorkflowTaskResponse {
  status: boolean;
  error: string;
  file: {
    id: number;
    project_id: number;
    workflow_id: number;
    job_id: number;
    batch_id: number;
    file_name: string;
    file_path: string;
    created_at: string;
    updated_at: string;
    current_task: number;
    current_file_status: string;
    current_handled_by: number;
    unit: string;
    unit_count: string;
    meta_data: Record<string, any> | null;
    billable: number;
    due_date: string | null;
    qa_cluster_id: string | null;
    unique_identifier: string;
    is_batch_task_file: number;
    file_priority: number;
    sla_completed_at: string | null;
    archived: number;
    current_task_updated_at: string;
    file_task_id: number;
    user_task_started_at: string;
    task_id: number;
    file_id: number;
    input_source_user_task_id: number;
    file_status_started: string;
    user_id: number;
    ft_input_source_user_task_id: number;
    ft_input_source_user_task_id_initial: string | null;
    task_name: string;
    task_uid: string;
    task_code: string;
    project_name: string;
    project_code: string;
    job_name: string;
    batch_name: string;
    file_task_created: string;
    file_task_status: string;
    file_task_handled_by: number;
    file_task_assigned_to: string | null;
    file_task_assigned_to_team: string | null;
    unit_count_done: string;
    input_file_name: string | null;
    workflow_code: string;
    download_url: string;
    s3_file_path: string;
    previous_task_code: string;
    previous_task_output_path: string;
    previous_task_output_ext: string;
    previous_task_uid: string;
    file_content: string | null;
    url_to_open: string;
    supporting_files: Array<any>;
    job_supporting_files: Array<any>;
    batch_supporting_files: Array<any>;
  };
}


export const getTaskOngoingFile = async (params: WorkflowUrlParams): Promise<WorkflowTaskResponse> => {
  try {
    
    const baseApiUrl = typeof window !== 'undefined' 
      ? window.process?.env?.NEXT_PUBLIC_IA_API_URL
      : process.env.NEXT_PUBLIC_IA_API_URL;
    
    const apiUrl = `${baseApiUrl}/api/get-task-ongoing-file`;
    
    const queryParams = new URLSearchParams({
      project_id: params.project_id || '',
      task_id: params.task_id || '',
      job_id: params.job_id || '',
      file_id: params.file_id || ''
    });
    
   
    const response = await fetch(`${apiUrl}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching task file:', error);
    throw error;
  }
};


export const extractUrlParams = (url: string): WorkflowUrlParams => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    return {
      project_id: params.get('project_id') || undefined,
      job_id: params.get('job_id') || undefined,
      batch_id: params.get('batch_id') || undefined,
      file_id: params.get('file_id') || undefined,
      task_id: params.get('task_id') || undefined,
      user_id: params.get('user_id') || undefined,
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {};
  }
};
