'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { getProxiedPdfUrl } from '@/lib/waf-bypass';
import { UI_CONSTANTS, ERROR_UI_CLASSES } from '@/lib/constants';

interface DirectPDFViewerProps {
  pdfUrl: string;
  filename: string;
}

export default function DirectPDFViewer({ pdfUrl, filename }: DirectPDFViewerProps) {
  const [iframeKey, setIframeKey] = useState(Math.random());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoadSuccess, setPdfLoadSuccess] = useState(false);
  
  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIframeKey(Math.random()); // Force iframe reload
  }, [pdfUrl]);
  
  // Get the proxied URL
  const proxiedUrl = getProxiedPdfUrl(pdfUrl);

  // Create a fallback component that uses object tag instead of iframe
  // Add a ref for the object element
  const objectRef = useRef<HTMLObjectElement>(null);
  
  // Create effect to handle object load events
  useEffect(() => {
    const handleObjectLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setPdfLoadSuccess(true);
      }, 0);
    };
    
    const handleObjectError = () => {
      // Handle object error silently
    };
    
    const objectElement = objectRef.current;
    if (objectElement) {
      objectElement.addEventListener('load', handleObjectLoad);
      objectElement.addEventListener('error', handleObjectError);
      
      // Auto-hide loading after a timeout to ensure PDF has a chance to load
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, UI_CONSTANTS.LOADING_TIMEOUT);
      
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
        height={UI_CONSTANTS.PDF_VIEWER_MIN_HEIGHT}
        className="border-2 border-gray-200"
      >
        <p>Your browser does not support PDF embedding. <a href={proxiedUrl} target="_blank" rel="noreferrer">Click here to download the PDF</a></p>
      </object>
    );
  };

  return (
    <div className="h-full flex flex-col relative" style={{ minHeight: UI_CONSTANTS.PDF_VIEWER_MIN_HEIGHT }}>
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
        <div className={ERROR_UI_CLASSES.SUCCESS_INDICATOR}>
          <CheckCircle className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">PDF Loaded Successfully</span>
        </div>
      )}
      
      {error && (
        <div className={ERROR_UI_CLASSES.OVERLAY}>
          <div className={ERROR_UI_CLASSES.CONTAINER.replace('mb-4', 'max-w-lg')}>
            <div className="flex flex-col">
              <h3 className={ERROR_UI_CLASSES.TITLE}>Failed to load PDF</h3>
              <p className={ERROR_UI_CLASSES.MESSAGE.replace('mb-2', 'mb-4')}>{error}</p>
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
      
      <div className="pdf-container" style={{ height: 'calc(100% - 20px)', minHeight: UI_CONSTANTS.PDF_VIEWER_MIN_HEIGHT }}>
        <div className="h-full">
          {renderPdfWithObjectTag()}
        </div>
       
        <iframe
          key={iframeKey}
          style={{ 
            height: '100%', 
            minHeight: UI_CONSTANTS.PDF_VIEWER_MIN_HEIGHT, 
            display: 'none',  
            backgroundColor: '#f0f0f0' 
          }}
          className="w-full border-2 border-gray-200"
          src={proxiedUrl}
          title={`PDF Viewer - ${filename}`}
          onLoad={(_e) => {
            // Using setTimeout to avoid state updates during render
            setTimeout(() => {
              setIsLoading(false);
              setPdfLoadSuccess(true);
            }, 0);
          }}
          onError={(_e) => {
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
