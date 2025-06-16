// Shared constants across the application
export const DEFAULT_METADATA = {
  M1: 'V1',
  M2: 'V2',
} as const;

// CSS class constants for table cells to avoid duplication
export const TABLE_CELL_CLASSES = {
  HEADER: 'px-4 py-2 bg-gray-100 font-medium text-sm',
  CONTENT: 'px-4 py-2 text-sm break-all pr-2',
  CONTENT_NO_BREAK: 'px-4 py-2 text-sm',
} as const;

// UI Constants for consistent sizing
export const UI_CONSTANTS = {
  PDF_VIEWER_MIN_HEIGHT: '600px',
  LOADING_TIMEOUT: 2500,
} as const;

// File handling constants
export const FILE_CONSTANTS = {
  UNIQUE_ID_PREFIX: 'file-uid-',
  DEFAULT_FILE_PATH: '-',
} as const;

// Error UI styling constants  
export const ERROR_UI_CLASSES = {
  CONTAINER: 'bg-red-50 border-l-4 border-red-500 p-4 mb-4',
  TITLE: 'text-lg font-medium text-red-800 mb-2',
  MESSAGE: 'text-sm text-red-700 mb-2',
  SUCCESS_INDICATOR: 'absolute top-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center z-10 shadow-sm',
  OVERLAY: 'absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 p-5'
} as const;
