/**
 * Utility functions to handle API URL generation with proper basePath handling
 */

/**
 * Get the base path prefix for URLs based on environment
 * @returns The base path prefix to use
 */
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/inventory') ? '/inventory' : '';
  } else {
    // Server-side
    return process.env.USE_BASE_PATH === 'true' ? (process.env.BASE_PATH || '/inventory') : '';
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
