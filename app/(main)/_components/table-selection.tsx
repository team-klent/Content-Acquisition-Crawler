'use client';

import { useCrawlerStateContext } from '@/app/context/CrawlerStateContext';
import { Button } from '@/components/ui/button';
import { CrawlerSource } from './utils';

export function TableSelection({ data }: { data?: CrawlerSource[] }) {
  const { selection } = useCrawlerStateContext();

  const handleSelectButtonClick = () => {
    if (!data) return;
    if (selection) {
      const scraper = data.find((s) => s.id === selection.id);
      alert(`Selected scraper: ${scraper?.name || 'None'}`);
    } else {
      alert('No scraper selected');
    }
  };

  return (
    <div className='p-4 border-b flex items-center justify-between bg-gray-50'>
      <h1 className='text-lg font-medium'>Content Acquisition</h1>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>
          {selection ? `${selection?.name} selected` : ''}
        </span>
        <Button
          onClick={handleSelectButtonClick}
          disabled={!selection}
          className='bg-blue-600 text-white hover:bg-blue-700'
        >
          Select
        </Button>
      </div>
    </div>
  );
}
