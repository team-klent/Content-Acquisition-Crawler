import { getApiUrl } from './api-helpers';


const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36',
];

export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}


export function getWafBypassHeaders(variation = 0): Record<string, string> {
 
  const baseHeaders: Record<string, string> = {
    'Cache-Control': 'no-cache, no-store',
    'Pragma': 'no-cache',
  };
  
  baseHeaders['User-Agent'] = getRandomUserAgent();
  
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
  
  baseHeaders[`X-Request-${Date.now() % 1000}`] = Math.random().toString(36).substring(2, 10);
  
  return baseHeaders;
}

export function getProxiedPdfUrl(originalUrl: string, attempt = 0): string {
  try {
  
    const apiProxyPath = getApiUrl('/api/pdf-proxy');
    
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000000);
    
    const params = new URLSearchParams();
    
    params.append('url', originalUrl);
    
    if (attempt % 2 === 0) {
      params.append('_cb', `${timestamp}_${randomId}`);
    } else {
      params.append('_t', timestamp.toString());
      params.append('_r', randomId.toString(36));
    }
    
    const requestModes = ['standard', 'web', 'cors', 'stream', 'xhr', 'direct'];
    const requestMode = requestModes[attempt % requestModes.length];
    params.append('_mode', requestMode);
    

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
    
    // return the URL
    const queryString = paramPairs.map(([key, value]) => 
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    ).join('&');
    
    return `${apiProxyPath}?${queryString}`;
  } catch (_e) {
    // Fallback to simple encoding if anything fails
    const base = getApiUrl('/api/pdf-proxy');
    return `${base}?url=${encodeURIComponent(originalUrl)}&_cb=${Date.now()}`;
  }
}

/**
 * Apply fetch for bypassing WAF restrictions
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