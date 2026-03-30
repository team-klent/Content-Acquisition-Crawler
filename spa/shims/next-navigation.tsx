/**
 * Shim for `next/navigation` used during the single-spa MFE build.
 *
 * In the host environment there is no Next.js router.
 * This module reads values from the SpaPropsContext instead,
 * so existing components that call useSearchParams() / useRouter()
 * continue to work without modification.
 */
import { useSpaProps } from '../context';

// Keys that are single-spa internals — never expose as "search params"
const INTERNAL_KEYS = new Set([
  'domElement',
  'name',
  'singleSpa',
  'mountParcel',
  'onTaskComplete',
  'onTaskProgress',
]);

/**
 * Drop-in replacement for Next.js useSearchParams().
 * Returns a ReadonlyURLSearchParams built from the host-provided parcel props.
 */
export function useSearchParams(): URLSearchParams {
  const props = useSpaProps();
  const params = new URLSearchParams();

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (
        !INTERNAL_KEYS.has(key) &&
        value !== undefined &&
        value !== null &&
        typeof value !== 'function' &&
        typeof value !== 'object'
      ) {
        params.set(key, String(value));
      }
    }
  }

  return params;
}

/**
 * Drop-in replacement for Next.js useRouter().
 * Provides basic navigation via the browser History API.
 */
export function useRouter() {
  return {
    push: (url: string) => {
      window.history.pushState(null, '', url);
    },
    replace: (url: string) => {
      window.history.replaceState(null, '', url);
    },
    back: () => {
      window.history.back();
    },
    forward: () => {
      window.history.forward();
    },
    refresh: () => {
      window.location.reload();
    },
    prefetch: () => {
      /* no-op in MFE context */
    },
  };
}

/**
 * Drop-in replacement for Next.js usePathname().
 */
export function usePathname(): string {
  return window.location.pathname;
}

/**
 * Drop-in replacement for Next.js redirect().
 */
export function redirect(url: string): never {
  window.location.href = url;
  // Next.js redirect throws — mimic that so callers don't continue execution
  throw new Error(`REDIRECT: ${url}`);
}

/**
 * Drop-in replacement for Next.js notFound().
 */
export function notFound(): never {
  throw new Error('NOT_FOUND');
}
