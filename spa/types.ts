/**
 * Props passed from the UW Host to the micro-frontend via single-spa parcel props.
 * These match the host's UWTaskAppProps interface.
 */
export interface UWTaskAppProps {
  // DOM target (provided by single-spa)
  domElement: HTMLElement;

  // single-spa internals
  name: string;
  singleSpa: Record<string, unknown>;
  mountParcel: (...args: unknown[]) => unknown;

  // Task context (from host)
  project_id: string;
  project_code: string;
  workflow_id: string;
  workflow_code: string;
  task_id: string;
  task_uid: string;
  user_id: string;
  file_id?: string;
  file_task_id?: string;

  // Additional params the host may forward (e.g. inventory needs job_id)
  job_id?: string;
  batch_id?: string;

  // Legacy callbacks (prefer CustomEvents)
  onTaskComplete?: () => void;
  onTaskProgress?: (progress: number) => void;

  // Allow extra props
  [key: string]: unknown;
}

// ── Bundle metadata (injected at build time by Vite `define`) ──────────

declare const __MFE_VERSION__: string;
declare const __MFE_NAME__: string;
declare const __MFE_BUILD_TIME__: string;

export interface MfeBundleMetadata {
  name: string;
  version: string;
  buildTime: string;
}

/**
 * Bundle version / build info — readable by the host after import.
 *
 * Usage from the host:
 *   const mod = await import('.../ca-entry.js');
 *   console.log(mod.metadata); // { name, version, buildTime }
 */
export const metadata: MfeBundleMetadata = {
  name:
    typeof __MFE_NAME__ !== 'undefined'
      ? __MFE_NAME__
      : 'content-acquisition-crawler',
  version:
    typeof __MFE_VERSION__ !== 'undefined' ? __MFE_VERSION__ : '0.0.0-dev',
  buildTime:
    typeof __MFE_BUILD_TIME__ !== 'undefined' ? __MFE_BUILD_TIME__ : '',
};

/**
 * Dispatch uw:task-complete to signal the host that processing is done.
 */
export function dispatchTaskComplete(detail: {
  status: 'completed' | 'on-hold' | 'pending';
  file_id?: string;
  task_id?: string;
  message?: string;
  reason?: string;
}) {
  window.dispatchEvent(new CustomEvent('uw:task-complete', { detail }));
}

/**
 * Dispatch uw:task-progress to report progress to the host.
 */
export function dispatchTaskProgress(detail: {
  file_id?: string;
  progress: number;
}) {
  window.dispatchEvent(new CustomEvent('uw:task-progress', { detail }));
}

/**
 * Dispatch uw:task-error to report an error to the host.
 */
export function dispatchTaskError(detail: {
  file_id?: string;
  message: string;
}) {
  window.dispatchEvent(new CustomEvent('uw:task-error', { detail }));
}
