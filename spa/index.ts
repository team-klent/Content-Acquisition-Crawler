/**
 * Barrel export for the Content Acquisition Crawler SPA client.
 *
 * Usage from the host registry:
 *   loadApp: () => import('https://cdn.example.com/content-acquisition/ca-entry.js')
 *   loadApp: () => import('https://cdn.example.com/content-acquisition/inventory-entry.js')
 */
export {
  dispatchTaskComplete,
  dispatchTaskError,
  dispatchTaskProgress,
} from './types';
export type { UWTaskAppProps } from './types';
