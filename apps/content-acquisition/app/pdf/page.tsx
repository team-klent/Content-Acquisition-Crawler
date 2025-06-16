import PdfView from '@/components/organisms/components/pdf-view';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="p-6">
      <Suspense fallback={<p>Loading PDF viewer...</p>}>
        <PdfView />
      </Suspense>
    </main>
  );
}