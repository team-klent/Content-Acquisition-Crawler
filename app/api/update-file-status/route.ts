import { updateFileStatus } from '@/lib/intelligent-automation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'project_code', 
      'task_uid', 
      'file_id',
      'previous_file_status',
      'file_status'
    ];
    
    const missingFields = requiredFields.filter(
      field => !payload[field] || (typeof payload[field] === 'string' && payload[field].trim() === '')
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Call the updateFileStatus function
    const response = await updateFileStatus(payload);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in update-file-status API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
