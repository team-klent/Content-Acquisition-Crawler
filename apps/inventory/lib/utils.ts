import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FILE_CONSTANTS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique file identifier with consistent format
 */
export function generateFileUniqueId(fileName: string): string {
  return `${FILE_CONSTANTS.UNIQUE_ID_PREFIX}${fileName}-${Date.now()}`;
}
