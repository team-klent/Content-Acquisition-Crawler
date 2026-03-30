/**
 * Inventory — Root wrapper for single-spa MFE.
 *
 * Receives UWTaskAppProps from the host and provides them
 * via SpaPropsContext so that existing components can read
 * workflow params through the useSearchParams shim.
 */
import { Toaster } from 'sonner';
import ClientDataFetcher from '../app/(main)/inventory/_components/client-data-fetcher';
import { SpaPropsProvider } from './context';
import './styles.css';
import type { UWTaskAppProps } from './types';

export default function InventoryApp(props: UWTaskAppProps) {
  return (
    <SpaPropsProvider value={props}>
      <div className='uw-mfe-inventory-root'>
        <div className='p-6'>
          <ClientDataFetcher />
        </div>
        <Toaster />
      </div>
    </SpaPropsProvider>
  );
}
