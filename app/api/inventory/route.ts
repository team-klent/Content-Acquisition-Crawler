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
    
   
    const baseApiUrl = process.env.NEXT_PUBLIC_IA_API_URL;
    const url = `${baseApiUrl}/api/get-task-ongoing-file`;
    

    const queryParams = new URLSearchParams({
      project_id: project_id,
      task_id: task_id,
      job_id: job_id,
      file_id: file_id
    });

    const fullUrl = `${url}?${queryParams.toString()}`;
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          status: false, 
          error: `External API error: ${response.status}. ${errorText}` 
        }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();


    console.log("Data received from external API:", data);
    
    if (!data) {
      console.error('Empty response from external API');
      return NextResponse.json({ 
        status: false, 
        error: "Empty response from workflow API." 
      }, { status: 500 });
    }
    
    if (data.status === false) {
      console.error('API reported failure:', data.error);
      return NextResponse.json({ 
        status: false, 
        error: data.error || "Unknown error from workflow API" 
      }, { status: 500 });
    }
    
    if (!data.file) {
      console.error('File data missing from API response:', data);
      return NextResponse.json({ 
        status: false, 
        error: "Invalid response from workflow API. File data not found." 
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    
    console.error('Error in inventory API route:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}