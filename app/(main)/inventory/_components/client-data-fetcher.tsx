'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FileData {
  id: number;
  file_name: string;
  download_url: string;
  project_code: string;
  job_name: string;
  batch_name: string;
  task_code: string;
  task_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export default function ClientDataFetcher() {
  const searchParams = useSearchParams();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const project_id = searchParams.get('project_id');
        const job_id = searchParams.get('job_id');
        const file_id = searchParams.get('file_id');
        const task_id = searchParams.get('task_id');
        
  
        if (!project_id || !job_id || !file_id || !task_id) {
          setError('Missing required URL parameters');
          setLoading(false);
          return;
        }
        
        const apiUrl = `/api/inventory?project_id=${project_id}&job_id=${job_id}&file_id=${file_id}&task_id=${task_id}`;
        
       //Debugging: Log the API request details
        console.log('API Request Info:', {
          url: apiUrl,
          params: { project_id, job_id, file_id, task_id },
          currentURL: window.location.href
        });
        
        // Check ENV's
        console.log("Environment:", {
          NEXT_PUBLIC_IA_API_URL: process.env.NEXT_PUBLIC_IA_API_URL || 'not set',
          NODE_ENV: process.env.NODE_ENV
        });
        
        console.log("Fetching from API:", apiUrl);
        const response = await fetch(apiUrl);
        

        //Don't Removed please, for Debugging
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          console.error(`API Error ${response.status}:`, errorText);
          
          if (response.status === 404) {
            throw new Error(`Resource not found (404). The API endpoint or requested file might not exist. Check the URL parameters and API route.`);
          } else if (response.status === 405) {
            throw new Error(`Method Not Allowed (405). The API doesn't support the request method being used. ${errorText}`);
          } else if (response.status === 401) {
            throw new Error(`Authentication Error (401). API token is missing or invalid. Please check your API_TOKEN environment variable. ${errorText}`);
          } else {
            throw new Error(`API Error: ${response.status}. ${errorText}`);
          }
        }
        
        const data = await response.json();
        
        // Check for API-level errors
        if (!data.status || data.error) {
          throw new Error(data.error || 'Unknown API error');
        }
        
        setFileData(data.file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching file data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading File</h3>
          <p className="text-sm text-red-700 mb-2">
            {error}
          </p>
     
        </div>
      </div>
    );
  }
  
  if (!fileData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No file data available</p>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">{fileData.file_name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF Viewer */}
        <div className="lg:col-span-2">
            <h1>Dispaly PDF here</h1>
        </div>
        
        {/* For Metadata Panel  */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>File Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">File Name:</span>
                  <span>{fileData.file_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Project:</span>
                  <span>{fileData.project_code} ({fileData.project_name})</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Job:</span>
                  <span>{fileData.job_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Batch:</span>
                  <span>{fileData.batch_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Task:</span>
                  <span>{fileData.task_code} ({fileData.task_name})</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Created:</span>
                  <span>{new Date(fileData.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Updated:</span>
                  <span>{new Date(fileData.updated_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">File Status:</span>
                  <span>{fileData.current_file_status}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => window.open(fileData.download_url, '_blank')}
                >
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}