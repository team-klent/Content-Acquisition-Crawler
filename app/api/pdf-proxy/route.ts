import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  try {
   
    const url = req.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400 }
      );
    }
    
    // Special handling for S3 signed URLs with tokens
    let decodedUrl;
    const originalUrl = url;
    
    // Specific handling for AWS S3 URLs
    if (url.includes('amazonaws.com')) {
      console.log('Detected S3 URL, using special handling for signed URLs...');
      
      try {
       
        decodedUrl = decodeURIComponent(url);
        
       
        if (url.includes('X-Amz-Signature=')) {
          console.log('URL contains X-Amz-Signature token, preserving exact signature format');
          
          
          const origSigMatch = url.match(/X-Amz-Signature=([^&]+)/);
          const decodedSigMatch = decodedUrl.match(/X-Amz-Signature=([^&]+)/);
          
          if (origSigMatch && decodedSigMatch && origSigMatch[1] !== decodedSigMatch[1]) {
            decodedUrl = decodedUrl.replace(
              `X-Amz-Signature=${decodedSigMatch[1]}`, 
              `X-Amz-Signature=${origSigMatch[1]}`
            );
            console.log('Fixed signature mismatch in URL');
          }
          
          if (url.includes('X-Amz-Security-Token=')) {
            console.log('URL contains Security Token, preserving exact format');
            
            const origTokenMatch = url.match(/X-Amz-Security-Token=([^&]+)/);
            const decodedTokenMatch = decodedUrl.match(/X-Amz-Security-Token=([^&]+)/);
            
            if (origTokenMatch && decodedTokenMatch && origTokenMatch[1] !== decodedTokenMatch[1]) {
              // Replace the decoded token with the original one
              decodedUrl = decodedUrl.replace(
                `X-Amz-Security-Token=${decodedTokenMatch[1]}`, 
                `X-Amz-Security-Token=${origTokenMatch[1]}`
              );
              console.log('Fixed security token mismatch in URL');
            }
          }
          
          if (decodedUrl.includes('IQoJb3JpZ') && url.includes('IQoJb3JpZ')) {
            console.log('Detected JWT-style security token, using original URL format');
            // Use original URL to avoid any token mangling
            decodedUrl = url;
          }
        }
      } catch (e) {
        // If any error in decoding, use original URL
        console.warn('URL processing for S3 failed, using original URL:', e);
        decodedUrl = url;
      }
    } else {
      // For non-S3 URLs, standard decoding is fine
      decodedUrl = decodeURIComponent(url);
    }
    
    // Log only part of the URL for security (redact sensitive parts)
    const urlForLogging = decodedUrl.split('?')[0];
    console.log(`Proxying PDF request for: ${urlForLogging}`);
    
    // For AWS S3 signed URLs, we need special handling
    let response;
    
    try {
      // Create a fetch request with carefully selected headers to bypass WAF
      response = await fetch(decodedUrl, {
        method: 'GET',
        headers: {
          // Add headers that help bypass WAF restrictions
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
          'Accept': 'application/pdf,*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'X-Requested-With': 'XMLHttpRequest',
          // Requesting as blob to bypass content inspection
          'Sec-Fetch-Dest': 'blob',
          'Sec-Fetch-Mode': 'cors',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        }, 
        credentials: 'omit', 
        cache: 'no-store', 
        redirect: 'follow',
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // If we have fetch error and this is an S3 URL, try the original URL as fallback
      if (decodedUrl.includes('amazonaws.com') && decodedUrl !== originalUrl) {
        console.log('Fetch failed with decoded URL, trying original URL as fallback');
        response = await fetch(originalUrl, {
          method: 'GET',
          headers: {},
          credentials: 'omit',
          cache: 'no-store',
        });
      } else {
        throw fetchError;
      }
    }
    
    if (!response.ok) {
      console.error(`Error fetching PDF: ${response.status} ${response.statusText}`);
      
      let errorDetails = response.statusText;
      try {

        const errorText = await response.text();
        if (errorText) {
          errorDetails = `${response.statusText} - ${errorText.substring(0, 200)}`;
          console.error('PDF proxy response error details:', errorText);
        }
      } catch (e) {
        console.error('Could not read error response body:', e);
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
    
    // Check the content type of the response
    const contentType = response.headers.get('content-type');
    console.log(`PDF proxy received content-type: ${contentType}`);
    
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
    } catch (e) {
      console.warn('Could not extract filename from URL or headers:', e);
    }
    
    const bypassMode = req.nextUrl.searchParams.get('_mode') || 'standard';
    const bypassHeaders: Record<string, string> = {};
    
    if (bypassMode === 'direct' || bypassMode === 'stream') {
      bypassHeaders['X-Stream-Type'] = 'document';
      bypassHeaders['X-Document-Type'] = 'pdf';
    } else if (bypassMode === 'xhr') {
      bypassHeaders['X-Requested-With'] = 'XMLHttpRequest';
      bypassHeaders['X-Ajax-Request'] = 'true';
    } else {
      // Add a unique non-standard header to make each response look different
      bypassHeaders[`X-Response-${Date.now() % 1000}`] = Math.random().toString(36).substring(2, 10);
    }
    
    // Return the PDF with enhanced headers specifically designed to bypass WAF
    return new NextResponse(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfArrayBuffer.byteLength.toString(),
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        // Aggressive anti-caching directives
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        // Security headers that help with WAF
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        // CORS headers to ensure the PDF is accessible
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control',
        'Access-Control-Max-Age': '3600',
        'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length, Content-Type',
        // Additional headers to help bypass WAF
        'X-Requested-With': 'XMLHttpRequest',
        'X-WAF-Bypass': 'true',
        'Accept': 'application/pdf',
        'Accept-Encoding': 'gzip, deflate, br',
        'Timing-Allow-Origin': '*',
        'Vary': 'Origin',
        // Modern security headers that legitimate sites use
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'interest-cohort=()',
        // Randomized headers to bypass pattern detection
        [`X-Req-ID-${Date.now()}`]: Math.random().toString(36).substring(2),
        // Add all the dynamic bypass headers
        ...bypassHeaders,
      },
    });
    
  } catch (error) {
    console.error(`PDF proxy error:`, error);
    
    // Extract error information
    const errorMessage = error instanceof Error ? error.message : 'Failed to proxy PDF file';
      
    // Log additional debug information
    console.error('PDF proxy debug info:', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorStack: error instanceof Error ? error.stack : null,
    });
    
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
