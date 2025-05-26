'use client';

import LocalPDFViewer from '@/components/shared/local-pdf-viewer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { ChevronLeft, Download, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FileData {
  id: number | string;
  file_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  current_file_status?: string;

  // Optional fields for the metadata table
  project_code?: string;
  project_name?: string;
  job_name?: string;
  batch_name?: string;
  task_name?: string;
  download_url?: string;
}

export default function ContentAcquisitionPDFViewer({
  pdf,
}: {
  pdf: FileData;
}) {
  const searchParams = useSearchParams();
  const [fileData] = useState<FileData | null>(pdf);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfViewerFailed, setPdfViewerFailed] = useState(false);
  const [useDirectViewer, setUseDirectViewer] = useState(false);
  const router = useRouter();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching file data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  console.log('Search Params:', searchParams.toString());
  console.log('File Data:', fileData);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-4'>
        <div className='flex flex-col'>
          <h3 className='text-lg font-medium text-red-800 mb-2'>
            Error Loading File
          </h3>
          <p className='text-sm text-red-700 mb-2'>{error}</p>
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
      <div className='grid grid-cols-4 gap-4'>
        {/* PDF Viewer */}
        <div
          className='col-span-3 h-[80vh] relative'
          style={{ minHeight: '600px' }}
        >
          {useDirectViewer ? (
            // Use the direct iframe viewer as a fallback
            <LocalPDFViewer
              pdfUrl={fileData.file_path}
              filename={fileData.file_name}
            />
          ) : (
            // Use the React PDF viewer as primary option
            <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
              <Viewer
                fileUrl={fileData.file_path}
                defaultScale={SpecialZoomLevel.PageFit}
                withCredentials={false}
                plugins={[defaultLayoutPluginInstance]}
                renderError={(error) => {
                  // Mark the viewer as failed so we can show the toggle button
                  setPdfViewerFailed(true);
                  return (
                    <div className='p-5 text-center break-words whitespace-normal'>
                      <p className='text-red-500 font-semibold mb-2'>
                        Failed to load the PDF document
                      </p>
                      <p className='text-sm text-gray-600'>
                        {error.message || 'Unknown PDF loading error'}
                      </p>
                      <div className='flex justify-center gap-3 mt-6'>
                        <Button
                          variant='outline'
                          onClick={() => setUseDirectViewer(true)}
                        >
                          <RefreshCw className='mr-2 h-4 w-4' /> Try Direct
                          Viewer
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() =>
                            window.open(fileData.download_url, '_blank')
                          }
                        >
                          <Download className='mr-2 h-4 w-4' /> Download PDF
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
              <CardTitle className='flex items-center gap-2'>
                Basic Information
              </CardTitle>
              <CardDescription>Details about this document</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4 flex flex-col justify-between'>
              <div className='border rounded-md overflow-hidden'>
                <table className='table-fixed w-full'>
                  <tbody>
                    <tr className='border-b w-full'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm w-1/4'>
                        File Name:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word wrap-break-word w-3/4'>
                        {fileData.file_name}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        Project:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {fileData.project_code}{' '}
                        {fileData.project_name && `(${fileData.project_name})`}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        Job:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {fileData.job_name}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        Batch:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {fileData.batch_name}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        Task:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {fileData.task_name}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        Created:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {new Date(fileData.created_at).toLocaleString()}
                      </td>
                    </tr>
                    <tr className='border-b'>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        Updated:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {new Date(fileData.updated_at).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                        File Status:
                      </td>
                      <td className='px-4 py-2 text-sm wrap-break-word'>
                        {fileData.current_file_status || 'Unknown'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
