'use client';

import { Button } from '@/components/ui/button';
import { CrawlerSource } from './utils';

export function TableSelection({
  selectedScraper,
  handleSelectButtonClick,
}: {
  selectedScraper: CrawlerSource | null;
  handleSelectButtonClick: () => void;
}) {
  return (
    <div className='p-4 border-b flex items-center justify-between bg-gray-50'>
      <h1 className='text-lg font-medium'>Content Acquisition</h1>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>
          {selectedScraper?.script} selected
        </span>
        <Button
          onClick={handleSelectButtonClick}
          disabled={!selectedScraper}
          className='bg-blue-600 text-white hover:bg-blue-700'
        >
          Select
        </Button>
      </div>
    </div>
  );
}
