/**
 * Utility functions to handle API URL generation
 */

/**
 * Generate an API URL
 * @param path - The API path (should start with /api)
 * @returns The complete API URL
 */
export function getApiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath;
}
