'use client';

import { CustomTable } from '@/components/shared/custom-table';
import { useState } from 'react';
import contentAcquisitionColumns from './columns';
import { TableSelection } from './table-selection';
import { CrawlerSource } from './utils';

export default function ContentAcquisitionTable({
  data,
}: {
  data: CrawlerSource[];
}) {
  const [selection, setSelection] = useState<CrawlerSource | null>(null);
  console.log(selection);

  const handleSelectButtonClick = () => {
    if (selection) {
      const scraper = data.find((s) => s.id === selection.id);
      alert(`Selected scraper: ${scraper?.script || 'None'}`);
    } else {
      alert('No scraper selected');
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <div className='bg-white border rounded-md shadow-sm'>
        <TableSelection
          handleSelectButtonClick={handleSelectButtonClick}
          selectedScraper={selection}
        />

        <CustomTable
          data={data}
          columns={contentAcquisitionColumns}
          setSelection={setSelection}
        />

        <div className='p-2 border-t bg-gray-50 text-xs text-muted-foreground'>
          {data.length} Total Length
        </div>
      </div>
    </div>
  );
}
