import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const project_id = searchParams.get('project_id');
    const job_id = searchParams.get('job_id');
    const file_id = searchParams.get('file_id');
    const task_id = searchParams.get('task_id');
    
   
    if (!project_id || !job_id || !file_id || !task_id) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters. Required: project_id, job_id, file_id, task_id'
        }, 
        { status: 400 }
      );
    }
    
   
    // Hardcoded API configuration for debugging
    const baseApiUrl = 'https://unifiedworkflow.innodata.com';
    const apiToken = '1|X5QySPSNPZMpsiZ05zB0qiMDJo1I0Fnb2KbXEzVCaaa38279';
    const url = `${baseApiUrl}/api/get-task-ongoing-file`;
    

    const queryParams = new URLSearchParams({
      project_id: project_id,
      task_id: task_id,
      job_id: job_id,
      file_id: file_id
    });

    const fullUrl = `${url}?${queryParams.toString()}`;
    
    console.log('Making API call to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error response:', errorText);
      return NextResponse.json(
        { 
          status: false, 
          error: `External API error: ${response.status}. ${errorText}` 
        }, 
        { status: response.status }
      );
    }
     const data = await response.json();
     
    console.log('API Response data:', JSON.stringify(data, null, 2));

    if (!data) {
      return NextResponse.json({ 
        status: false, 
        error: "Empty response from workflow API." 
      }, { status: 500 });
    }
    
    if (data.status === false) {
      return NextResponse.json({ 
        status: false, 
        error: data.error || "Unknown error from workflow API" 
      }, { status: 500 });
    }
    
    if (!data.file) {
      return NextResponse.json({ 
        status: false, 
        error: "Invalid response from workflow API. File data not found." 
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}