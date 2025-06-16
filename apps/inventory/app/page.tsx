import { Suspense } from 'react';
import ClientDataFetcher from './_components/client-data-fetcher';

function InventoryPageContent() {
  return (
    <div className="p-6">
      <ClientDataFetcher />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <InventoryPageContent />
    </Suspense>
  );
}