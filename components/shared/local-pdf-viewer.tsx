'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LocalPDFViewerProps {
  pdfUrl: string;
  filename: string;
}

export default function LocalPDFViewer({
  pdfUrl,
  filename,
}: LocalPDFViewerProps) {
  const [iframeKey, setIframeKey] = useState(Math.random());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoadSuccess, setPdfLoadSuccess] = useState(false);

  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIframeKey(Math.random()); // force reload
  }, [pdfUrl]);

  useEffect(() => {
    const handleObjectLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setPdfLoadSuccess(true);
      }, 0);
    };

    const handleObjectError = () => {
      setTimeout(() => {
        setIsLoading(false);
        setError('Failed to load the PDF file.');
      }, 0);
    };

    const objectElement = objectRef.current;
    if (objectElement) {
      objectElement.addEventListener('load', handleObjectLoad);
      objectElement.addEventListener('error', handleObjectError);

      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2500);

      return () => {
        objectElement.removeEventListener('load', handleObjectLoad);
        objectElement.removeEventListener('error', handleObjectError);
        clearTimeout(timeoutId);
      };
    }
  }, [pdfUrl]);

  const renderPdfWithObjectTag = () => (
    <object
      ref={objectRef}
      data={pdfUrl}
      type='application/pdf'
      width='100%'
      height='600px'
      className='border-2 border-gray-200'
    >
      <p>
        Your browser does not support PDF embedding.{' '}
        <a href={pdfUrl} target='_blank' rel='noreferrer'>
          Click here to download the PDF
        </a>
      </p>
    </object>
  );

  return (
    <div
      className='h-full flex flex-col relative'
      style={{ minHeight: '600px' }}
    >
      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10'>
          <div className='flex flex-col items-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700'></div>
            <p className='mt-2'>Loading PDF...</p>
          </div>
        </div>
      )}

      {pdfLoadSuccess && !isLoading && !error && (
        <div className='absolute top-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center z-10 shadow-sm'>
          <CheckCircle className='w-4 h-4 mr-1' />
          <span className='text-xs font-medium'>PDF Loaded Successfully</span>
        </div>
      )}

      {error && (
        <div className='absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 p-5'>
          <div className='bg-red-50 border-l-4 border-red-500 p-4 max-w-lg'>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium text-red-800 mb-2'>
                Failed to load PDF
              </h3>
              <p className='text-sm text-red-700 mb-4'>{error}</p>
              <p className='text-sm text-gray-600 mb-4'>
                You can try the following options:
              </p>
              <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsLoading(true);
                    setError(null);
                    setIframeKey(Math.random());
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant='outline'
                  onClick={() => window.open(pdfUrl, '_blank')}
                >
                  <Download className='mr-2 h-4 w-4' /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className='pdf-container'
        style={{ height: 'calc(100% - 20px)', minHeight: '600px' }}
      >
        <div className='h-full'>{renderPdfWithObjectTag()}</div>

        <iframe
          key={iframeKey}
          src={pdfUrl}
          title={`PDF Viewer - ${filename}`}
          style={{
            display: 'none', // Hide iframe (object tag is primary)
          }}
          onLoad={() => {
            setTimeout(() => {
              setIsLoading(false);
              setPdfLoadSuccess(true);
            }, 0);
          }}
          onError={(e) => {
            console.error('PDF iframe load error:', e);
            setTimeout(() => {
              setError('Failed to load the PDF via iframe.');
            }, 0);
          }}
          sandbox='allow-scripts allow-same-origin allow-forms'
        />
      </div>
    </div>
  );
}
