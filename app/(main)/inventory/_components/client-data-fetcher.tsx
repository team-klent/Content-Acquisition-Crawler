'use client';

import { ChevronLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';


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
  const router = useRouter();
  
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
    <div>
      <div className='flex items-center mb-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.back()}
          className='cursor-pointer'
        >
          <ChevronLeft />
        </Button>
        <h2 className='ml-4 text-xl font-semibold'>{fileData.file_name}</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {/* PDF Viewer */}
        <div className='col-span-3 h-[80vh]'>
          {/* Temporary PDF Viewer Component */}
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl="/pdfs/Get_Started_With_Smallpdf-output.pdf" />;
          </Worker>
        </div>
        {/* For Metadata Panel  */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Basic Information</CardTitle>
              <CardDescription>Details about this document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col justify-between">
              <div className='space-y-6'>
                <div>
                  <div className='border rounded-md overflow-hidden'>
                    <table className='w-full'>
                      <tbody>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            File Name:
                          </td>
                          <td className='px-4 py-2 text-sm'>{fileData.file_name}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Project:
                          </td>
                          <td className='px-4 py-2 text-sm'>{fileData.project_code} ({fileData.project_name})</td>
                        </tr>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Job:
                          </td>
                          <td className='px-4 py-2 text-sm'>{fileData.job_name}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Batch:
                          </td>
                          <td className='px-4 py-2 text-sm'>{fileData.batch_name}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Task:
                          </td>
                          <td className='px-4 py-2 text-sm'>{fileData.task_name}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Created:
                          </td>
                          <td className='px-4 py-2 text-sm'>{new Date(fileData.created_at).toLocaleString()}</td>
                        </tr>
                        <tr className='border-b'>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Updated:
                          </td>
                          <td className='px-4 py-2 text-sm'>{new Date(fileData.updated_at).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            File Status:
                          </td>
                          <td className='px-4 py-2 text-sm'>{fileData.current_file_status}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  variant='ghost'
                className='relative cursor-pointer shadow-md ring-1  ring-gray-200 hover:bg-gray-100 w-full'
                  onClick={() => window.open(fileData.download_url, '_blank')}
                >
                  <Download /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}