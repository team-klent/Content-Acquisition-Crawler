'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';

interface DirectPDFViewerProps {
  pdfUrl: string;
  filename: string;
}

export default function DirectPDFViewer({ pdfUrl, filename }: DirectPDFViewerProps) {
  const [iframeKey, setIframeKey] = useState(Math.random());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [attemptCount, setAttemptCount] = useState(0);
  const [pdfLoadSuccess, setPdfLoadSuccess] = useState(false);
  
 
  const getProxiedPdfUrl = (url: string) => {
    
   
    try {
      return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
    } catch (e) {
      console.error('Error encoding URL for proxy:', e);
      
      // Fallback method if encoding fails completely
      const base = `/api/pdf-proxy?url=`;
      return base + url.replace(/\s/g, '%20');
    }
  };
  
  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIframeKey(Math.random()); // Force iframe reload
    setAttemptCount(0); // Reset attempt counter
  }, [pdfUrl]);
  
  // Get the proxied URL
  const proxiedUrl = getProxiedPdfUrl(pdfUrl);
  console.log('DirectPDFViewer using URL:', proxiedUrl);

  // Create a fallback component that uses object tag instead of iframe
  // Add a ref for the object element
  const objectRef = useRef<HTMLObjectElement>(null);
  
  // Create effect to handle object load events
  useEffect(() => {
    const handleObjectLoad = () => {
      console.log('PDF object loaded');
      setTimeout(() => {
        setIsLoading(false);
        setPdfLoadSuccess(true);
      }, 0);
    };
    
    const handleObjectError = () => {
      console.error('PDF object load error');
    };
    
    const objectElement = objectRef.current;
    if (objectElement) {
      objectElement.addEventListener('load', handleObjectLoad);
      objectElement.addEventListener('error', handleObjectError);
      
      // Auto-hide loading after a timeout to ensure PDF has a chance to load
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      
      return () => {
        objectElement.removeEventListener('load', handleObjectLoad);
        objectElement.removeEventListener('error', handleObjectError);
        clearTimeout(timeoutId);
      };
    }
  }, [proxiedUrl]);

  const renderPdfWithObjectTag = () => {
    return (
      <object
        ref={objectRef}
        data={proxiedUrl}
        type="application/pdf"
        width="100%"
        height="600px"
        className="border-2 border-gray-200"
      >
        <p>Your browser does not support PDF embedding. <a href={proxiedUrl} target="_blank" rel="noreferrer">Click here to download the PDF</a></p>
      </object>
    );
  };

  return (
    <div className="h-full flex flex-col relative" style={{ minHeight: '600px' }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            <p className="mt-2">Loading PDF...</p>
          </div>
        </div>
      )}
      
      {/* Success indicator */}
      {pdfLoadSuccess && !isLoading && !error && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center z-10 shadow-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">PDF Loaded Successfully</span>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 p-5">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg">
            <div className="flex flex-col">
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load PDF</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <p className="text-sm text-gray-600 mb-4">You can try the following options:</p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    setError(null);
                    setIframeKey(Math.random()); // Force iframe reload
                  }}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(pdfUrl, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="pdf-container" style={{ height: 'calc(100% - 20px)', minHeight: '600px' }}>
        <div className="h-full">
          {renderPdfWithObjectTag()}
        </div>
       
        <iframe
          key={iframeKey}
          style={{ 
            height: '100%', 
            minHeight: '600px', 
            display: 'none',  
            backgroundColor: '#f0f0f0' 
          }}
          className="w-full border-2 border-gray-200"
          src={proxiedUrl}
          title={`PDF Viewer - ${filename}`}
          onLoad={(e) => {
            // Log successful iframe load for debugging
            console.log('PDF iframe loaded', { url: proxiedUrl });
            // Using setTimeout to avoid state updates during render
            setTimeout(() => {
              setIsLoading(false);
              setPdfLoadSuccess(true);
            }, 0);
          }}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onError={(e) => {
            console.error('PDF iframe load error:', e);
            // The object tag should still work even if the iframe fails
            // Using setTimeout to avoid state updates during render
            setTimeout(() => {
              setError('Failed to load the PDF. Using object tag as fallback.');
            }, 0);
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
