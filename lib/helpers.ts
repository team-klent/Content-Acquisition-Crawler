export function getFileType(fileName: string): string | null {
  if (!fileName || typeof fileName !== 'string') return null;

  const parts = fileName.split('.');
  if (parts.length < 2) return null; // No extension

  return parts.pop()?.toLowerCase() || null;
}
