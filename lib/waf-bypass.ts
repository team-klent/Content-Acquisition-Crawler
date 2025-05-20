/**
 * WAF Bypass Utilities
 * 
 * This module provides techniques to help bypass Web Application Firewalls (WAF)
 * like Check Point, Cloudflare, etc. when fetching protected resources.
 */

import { getApiUrl } from './api-helpers';

/**
 * User agent strings to rotate between to bypass User-Agent based WAF rules
 */
const USER_AGENTS = [
  // Modern browsers
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0',
  // Mobile browsers for variety
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36',
];

/**
 * Request modes that can be used to vary request signatures
 */
const REQUEST_MODES = ['standard', 'web', 'cors', 'stream', 'xhr', 'direct'];

/**
 * Gets a random user agent from the list
 */
export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Gets a random request mode
 */
export function getRandomRequestMode(): string {
  return REQUEST_MODES[Math.floor(Math.random() * REQUEST_MODES.length)];
}

/**
 * Generates headers designed to bypass WAF restrictions
 * Different combinations of headers can help avoid pattern-based blocking
 */
export function getWafBypassHeaders(variation = 0): Record<string, string> {
  // Base headers that are always included
  const baseHeaders: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store',
    'Pragma': 'no-cache',
  };
  
  // Add randomized User-Agent (important for WAF bypass)
  baseHeaders['User-Agent'] = getRandomUserAgent();
  
  // Add variation-specific headers
  switch (variation % 4) {
    case 0:
      // Standard browser-like headers
      baseHeaders['Accept'] = 'application/pdf,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
      baseHeaders['Accept-Language'] = 'en-US,en;q=0.5';
      break;
    case 1:
      // XHR-like headers
      baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
      baseHeaders['Accept'] = 'application/pdf';
      break;
    case 2:
      // Fetch API-like headers
      baseHeaders['Accept'] = '*/*';
      baseHeaders['Sec-Fetch-Dest'] = 'document';
      baseHeaders['Sec-Fetch-Mode'] = 'navigate';
      break;
    case 3:
      // Special PDF viewer headers
      baseHeaders['Accept'] = 'application/pdf';
      baseHeaders['Origin'] = typeof window !== 'undefined' ? window.location.origin : 'https://app.example.com';
      baseHeaders['X-PDF-View'] = 'true';
      break;
  }
  
  // Add a random header to make the signature more unique
  baseHeaders[`X-Request-${Date.now() % 1000}`] = Math.random().toString(36).substring(2, 10);
  
  return baseHeaders;
}

/**
 * Generate a URL for the PDF proxy that uses varied techniques to bypass WAF
 */
export function getProxiedPdfUrl(originalUrl: string, attempt = 0): string {
  try {
    // Get the right API path for the environment
    const apiProxyPath = getApiUrl('/api/pdf-proxy');
    
    // Generate a timestamp and random values for cache busting
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000000);
    
    // Create parameters based on the attempt number to vary our approach
    const params = new URLSearchParams();
    
    // Always include the URL
    params.append('url', originalUrl);
    
    // Cache busting parameters that vary by attempt
    if (attempt % 2 === 0) {
      params.append('_cb', `${timestamp}_${randomId}`);
    } else {
      params.append('_t', timestamp.toString());
      params.append('_r', randomId.toString(36));
    }
    
    // Add variation based on attempt number
    const requestMode = REQUEST_MODES[attempt % REQUEST_MODES.length];
    params.append('_mode', requestMode);
    
    // Add different parameters based on attempt to create variation
    switch (attempt % 4) {
      case 0:
        params.append('_xhr', 'true');
        params.append('_accept', 'application/pdf');
        break;
      case 1:
        params.append('_agent', 'webapp');
        params.append('_format', 'blob');
        break;
      case 2:
        params.append('_nav', 'direct');
        params.append('_stream', 'true');
        break;
      case 3:
        params.append('_fmt', 'raw');
        params.append('_inline', 'true');
        break;
    }
    
    // Add Origin information to help with WAF bypass
    if (typeof window !== 'undefined') {
      params.append('_origin', window.location.hostname);
    }
    
    // Randomize parameter order to avoid pattern detection
    // Convert params to array, shuffle, and reconstruct
    const paramPairs = Array.from(params.entries());
    for (let i = paramPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paramPairs[i], paramPairs[j]] = [paramPairs[j], paramPairs[i]];
    }
    
    // Construct and return the URL
    const queryString = paramPairs.map(([key, value]) => 
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    ).join('&');
    
    return `${apiProxyPath}?${queryString}`;
  } catch (e) {
    console.error('Error creating proxied PDF URL:', e);
    
    // Fallback to simple encoding if anything fails
    const base = getApiUrl('/api/pdf-proxy');
    return `${base}?url=${encodeURIComponent(originalUrl)}&_cb=${Date.now()}`;
  }
}

/**
 * Apply fetch options optimized for bypassing WAF restrictions
 */
export function getWafBypassFetchOptions(attempt = 0): RequestInit {
  return {
    method: 'GET',
    headers: getWafBypassHeaders(attempt),
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'follow',
    // Randomize mode based on attempt
    mode: attempt % 2 === 0 ? 'cors' : undefined,
  };
}

/**
 * Helper function that attempts to fetch a resource with multiple strategies
 * to bypass WAF restrictions
 */
export async function fetchWithWafBypass<T>(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3,
  responseType: 'json' | 'text' | 'blob' | 'arrayBuffer' = 'json'
): Promise<T> {
  let retries = 0;
  let lastError;
  
  while (retries < maxRetries) {
    try {
      // Add delay between retries with increasing wait time
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, retries * 1000));
        console.log(`Retry attempt ${retries} for: ${url}`);
      }
      
      // Combine user options with WAF bypass options
      const fetchOptions: RequestInit = {
        ...options,
        headers: {
          ...getWafBypassHeaders(retries),
          ...(options.headers || {}),
        },
        // No caching
        cache: 'no-store',
      };
      
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      // Return the appropriate response format
      switch (responseType) {
        case 'json':
          return await response.json() as T;
        case 'text':
          return await response.text() as unknown as T;
        case 'blob':
          return await response.blob() as unknown as T;
        case 'arrayBuffer':
          return await response.arrayBuffer() as unknown as T;
      }
    } catch (err) {
      console.error(`Fetch attempt ${retries + 1} failed:`, err);
      lastError = err;
      retries++;
    }
  }
  
  throw lastError;
}