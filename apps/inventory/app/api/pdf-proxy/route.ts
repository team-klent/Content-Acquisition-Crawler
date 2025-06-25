import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  try {
    // Add safeguards against potential infinite loops
    const startTime = Date.now();
    const MAX_PROCESSING_TIME = 30000; // 30 seconds max
   
    const url = req.nextUrl.searchParams.get('url');
    const attempt = req.nextUrl.searchParams.get('_attempt') || '0';
    const attemptNum = parseInt(attempt, 10);
    
    // Prevent excessive retry attempts
    if (attemptNum > 10) {
      return NextResponse.json(
        { error: 'Too many retry attempts', attempt: attemptNum },
        { status: 400 }
      );
    }
    
    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400 }
      );
    }
    // Special handling for S3 signed URLs with tokens
    let decodedUrl;
    const originalUrl = url;
    
    if (url.includes('amazonaws.com')) {
      try {
       
        decodedUrl = decodeURIComponent(url);
        
        if (url.includes('X-Amz-Signature=')) {
          
          const origSigMatch = url.match(/X-Amz-Signature=([^&]+)/);
          const decodedSigMatch = decodedUrl.match(/X-Amz-Signature=([^&]+)/);
          
          if (origSigMatch && decodedSigMatch && origSigMatch[1] !== decodedSigMatch[1]) {

            decodedUrl = decodedUrl.replace(
              `X-Amz-Signature=${decodedSigMatch[1]}`, 
              `X-Amz-Signature=${origSigMatch[1]}`
            );
          }
          
          if (url.includes('X-Amz-Security-Token=')) {
            
            // Use the original token from the URL rather than the decoded one
            const origTokenMatch = url.match(/X-Amz-Security-Token=([^&]+)/);
            const decodedTokenMatch = decodedUrl.match(/X-Amz-Security-Token=([^&]+)/);
            
            if (origTokenMatch && decodedTokenMatch && origTokenMatch[1] !== decodedTokenMatch[1]) {
              // Replace the decoded token with the original one
              decodedUrl = decodedUrl.replace(
                `X-Amz-Security-Token=${decodedTokenMatch[1]}`, 
                `X-Amz-Security-Token=${origTokenMatch[1]}`
              );
            }
          }
          
          // If the code is invalid, lets try to use the original URK
          if (decodedUrl.includes('IQoJb3JpZ') && url.includes('IQoJb3JpZ')) {
            decodedUrl = url;
          }
        }
      } catch {
        // If any error in decoding, use original URL
        decodedUrl = url;
      }
    } else {
      // Just a fall back incase the URL is not an S3
      decodedUrl = decodeURIComponent(url);
    }
    
    const urlForLogging = decodedUrl.split('?')[0];
    
    let response;

    try {
      // Check processing time to prevent hanging
      if (Date.now() - startTime > MAX_PROCESSING_TIME) {
        throw new Error('Request processing timeout');
      }
      
      // Create a fetch request with minimal options to avoid signature issues
      response = await fetch(decodedUrl, {
        method: 'GET',
        headers: {}, // No additional headers to avoid signature issues
        credentials: 'omit', // Don't send cookies or credentials
        cache: 'no-store', // Don't cache signed URLs
        signal: AbortSignal.timeout(15000), // 15 seconds timeout for the initial request
      });

    } catch (fetchError) {
      // Check processing time before retry
      if (Date.now() - startTime > MAX_PROCESSING_TIME) {
        throw new Error('Request processing timeout during retry');
      }
      
      // If we have fetch error and this is an S3 URL, try the original URL as fallback
      if (decodedUrl.includes('amazonaws.com') && decodedUrl !== originalUrl) {
        response = await fetch(originalUrl, {
          method: 'GET',
          headers: {},
          credentials: 'omit',
          cache: 'no-store',
          signal: AbortSignal.timeout(15000), // Shorter timeout for fallback
        });
      } else {
        throw fetchError;
      }
    }
    
    if (!response.ok) {
      let errorDetails = response.statusText;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorDetails = `${response.statusText} - ${errorText.substring(0, 200)}`;
        }
      } catch {
        // Could not read error response body
      }
      
      let message = 'Unable to retrieve the PDF file';
      
      if (response.status === 403) {
        message = 'Access denied - the S3 signed URL may have expired';
      } else if (response.status === 400) {
        message = 'The S3 signed URL may be expired or malformed';
        
        if (errorDetails.includes('InvalidToken')) {
          message = 'Invalid security token in the S3 URL - the token may be malformed or expired';
        } else if (errorDetails.includes('UNSIGNED-PAYLOAD')) {
          message = 'S3 signature validation failed - unsigned payload issue';
        } else if (errorDetails.includes('SignatureDoesNotMatch')) {
          message = 'S3 signature does not match - the URL may be corrupted or expired';
        }
      }
      

      return NextResponse.json({ 
          error: `Failed to fetch PDF: ${response.status}`,
          details: errorDetails,
          url: urlForLogging,
          message: message
        },
        { status: response.status }
      );
    }
    
    // Get the PDF data
    const pdfArrayBuffer = await response.arrayBuffer();
    
    // Extract filename for content disposition header
    let filename = 'document.pdf';
    try {
      // First try to get filename from content disposition header
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // If not found in headers, try to extract from the URL path
      if (filename === 'document.pdf') {
        const urlObj = new URL(decodedUrl);
        const pathParts = urlObj.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.toLowerCase().includes('.pdf')) {
          filename = lastPart;
        }
      }
    } catch {
      // Could not extract filename from URL or headers
    }
    
    // Return the PDF with appropriate headers
    return new NextResponse(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfArrayBuffer.byteLength.toString(),
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-cache, no-store', // Don't cache signed URLs
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    
    // Extract error information
    const errorMessage = error instanceof Error ? error.message : 'Failed to proxy PDF file';
      
    // Log additional debug information
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy PDF file', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
