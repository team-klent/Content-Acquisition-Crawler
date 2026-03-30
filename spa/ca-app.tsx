/**
 * Content Acquisition — Root wrapper for single-spa MFE.
 *
 * Receives UWTaskAppProps from the host and provides them
 * via SpaPropsContext so that existing components can read
 * workflow params through the useSearchParams shim.
 */
import { Toaster } from 'sonner';
import ContentAquisitionPage from '../components/organisms/ContentAquisition';
import { SpaPropsProvider } from './context';
import './styles.css';
import type { UWTaskAppProps } from './types';

export default function CaApp(props: UWTaskAppProps) {
  return (
    <SpaPropsProvider value={props}>
      <div className='uw-mfe-ca-root'>
        <div className='container mx-auto pt-5 xl:min-w-[95%]'>
          <ContentAquisitionPage />
        </div>
        <Toaster />
      </div>
    </SpaPropsProvider>
  );
}
