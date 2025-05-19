/**
 * Utility functions to handle API URL generation with proper basePath handling
 */

/**
 * Get the base path prefix for URLs based on environment
 * @returns The base path prefix to use
 */
export function getBasePath(): string {
  // Check for client-side and server-side environment variables
  if (typeof window !== 'undefined') {
    // Client-side
    return window.location.pathname.startsWith('/app1') ? '/app1' : '';
  } else {
    // Server-side
    return process.env.USE_BASE_PATH === 'true' ? (process.env.BASE_PATH || '/app1') : '';
  }
}

/**
 * Generate an API URL with the correct base path
 * @param path - The API path (should start with /api)
 * @returns The complete API URL with correct base path
 */
export function getApiUrl(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
