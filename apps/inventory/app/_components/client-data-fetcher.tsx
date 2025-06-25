'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getApiUrl } from '@/lib/api-helpers';
import { TABLE_CELL_CLASSES, UI_CONSTANTS, ERROR_UI_CLASSES } from '@/lib/constants';
import { getProxiedPdfUrl } from '@/lib/waf-bypass';
import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Download, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DirectPDFViewer from './direct-pdf-viewer';

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
  project_name?: string;
  current_file_status?: string;
  [key: string]: any;
}

export default function ClientDataFetcher() {
  const searchParams = useSearchParams();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfViewerFailed, setPdfViewerFailed] = useState(false);
  const [useDirectViewer, setUseDirectViewer] = useState(false);
  const [pdfRetryAttempt, setPdfRetryAttempt] = useState(0);
  const maxPdfRetries = 3;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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

        // Get the base path and ensure it's correct for the environment

        const baseApiPath = getApiUrl('/api/inventory');
        const apiUrl = `${baseApiPath}?project_id=${project_id}&job_id=${job_id}&file_id=${file_id}&task_id=${task_id}`;

  

        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text().catch(() => '');

          if (response.status === 404) {
            throw new Error(
              `Resource not found (404). The API endpoint or requested file might not exist. Check the URL parameters and API route.`
            );
          } else if (response.status === 405) {
            throw new Error(
              `Method Not Allowed (405). The API doesn't support the request method being used. ${errorText}`
            );
          } else if (response.status === 401) {
            throw new Error(
              `Authentication Error (401). API token is missing or invalid. Please check your API_TOKEN environment variable. ${errorText}`
            );
          } else {
            throw new Error(`API Error: ${response.status}. ${errorText}`);
          }
        }

        const data = await response.json();
        
        // Check for API-level errors
        if (!data.status || data.error) {
          throw new Error(data.error || 'Unknown API error');
        }

        const file = data.file;
        setFileData(file);

        // We'll use the proxy API endpoint instead of direct S3 URL
        // This helps bypass S3 authentication issues
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={ERROR_UI_CLASSES.CONTAINER}>
        <div className='flex flex-col'>
          <h3 className={ERROR_UI_CLASSES.TITLE}>
            Error Loading File
          </h3>
          <p className={ERROR_UI_CLASSES.MESSAGE}>{error}</p>
        </div>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500'>No file data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-center mb-4'>
        <h2 className='ml-4 text-2xl font-medium'>{fileData.file_name}</h2>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {/* PDF Viewer */}
        <div
          className='col-span-3 h-[80vh] relative '
          style={{ minHeight: UI_CONSTANTS.PDF_VIEWER_MIN_HEIGHT }}
        >
          {useDirectViewer ? (
            // Use the direct iframe viewer as a fallback
            <DirectPDFViewer
              pdfUrl={fileData.download_url}
              filename={fileData.file_name}
            />
          ) : (
            // Use the React PDF viewer as primary option
            <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
              <Viewer
                key={pdfRetryAttempt}
                fileUrl={getProxiedPdfUrl(fileData.download_url)}
                defaultScale={SpecialZoomLevel.PageFit}
                withCredentials={false}
                plugins={[defaultLayoutPluginInstance]}
                renderError={(error) => {
                  // Mark the viewer as failed so we can show the toggle button
                  if (!pdfViewerFailed) setPdfViewerFailed(true);
                  return (
                    <div className='p-5 text-center'>
                      <p className='text-red-500 font-semibold mb-2'>
                        Failed to load the PDF document
                      </p>
                      <p className='text-sm text-gray-600'>
                        {error.message || 'Unknown PDF loading error'}
                      </p>
                      <div className='flex justify-center gap-3 mt-6'>
                        <Button
                          variant='outline'
                          onClick={() => {
                            if (pdfRetryAttempt < maxPdfRetries) {
                              setPdfRetryAttempt((prev) => prev + 1);
                              setPdfViewerFailed(false);
                            } else {
                              setUseDirectViewer(true);
                            }
                          }}
                          disabled={pdfRetryAttempt >= maxPdfRetries}
                        >
                          <RefreshCw className='mr-2 h-4 w-4' />
                          {pdfRetryAttempt >= maxPdfRetries
                            ? 'Max Retries'
                            : `Retry (${pdfRetryAttempt + 1}/${maxPdfRetries})`}
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => setUseDirectViewer(true)}
                        >
                          Switch to Fallback Viewer
                        </Button>
                      </div>
                    </div>
                  );
                }}
              />
            </Worker>
          )}

          {/* Toggle button to switch between viewers */}
          {pdfViewerFailed && !useDirectViewer && (
            <div className='absolute bottom-4 right-4'>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => setUseDirectViewer(true)}
              >
                <RefreshCw className='mr-2 h-4 w-4' /> Try Direct Viewer
              </Button>
            </div>
          )}

          {useDirectViewer && (
            <div className='absolute bottom-4 right-4'>
              <Button
                variant='secondary'
                size='sm'
                onClick={() => setUseDirectViewer(false)}
              >
                <RefreshCw className='mr-2 h-4 w-4' /> Try PDF.js Viewer
              </Button>
            </div>
          )}
        </div>

        {/* For Metadata Panel  */}
        <div className='col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2  font-medium'>
                Basic Information
              </CardTitle>
              <CardDescription>Details about this document</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 flex flex-col justify-between'>
              <div className='space-y-6'>
                <div>
                  <div className='border rounded-md overflow-hidden'>
                    <table className='w-full overflow-hidden'>
                      <TableBody>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            File Name:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileData.file_name}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Project:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileData.project_code}{' '}
                            {fileData.project_name &&
                              `(${fileData.project_name})`}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Job:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileData.job_name}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Batch:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileData.batch_name}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Task:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileData.task_name}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Created:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {new Date(fileData.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Updated:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {new Date(fileData.updated_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            File Status:
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileData.current_file_status || 'Unknown'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </table>
                  </div>
                </div>
              </div>

              <div className='mt-4'>
                <Button
                  variant='ghost'
                  className='relative cursor-pointer shadow-md ring-1 ring-gray-200 hover:bg-gray-100 w-full'
                  onClick={() => window.open(fileData.download_url, '_blank')}
                >
                  <Download className='mr-2' /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
