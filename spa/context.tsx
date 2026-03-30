import { createContext, useContext } from 'react';
import type { UWTaskAppProps } from './types';

/**
 * Context that provides the host's parcel props to all child components.
 * When running as a single-spa micro-frontend, this replaces Next.js router context.
 */
const SpaPropsContext = createContext<UWTaskAppProps | null>(null);

export const SpaPropsProvider = SpaPropsContext.Provider;

export function useSpaProps(): UWTaskAppProps | null {
  return useContext(SpaPropsContext);
}
