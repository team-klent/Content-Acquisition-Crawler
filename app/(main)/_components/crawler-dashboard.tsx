'use client';

import { AddSourceDialog } from '@/app/(main)/_components/addForm';
import { CrawlerTable } from '@/app/(main)/_components/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Plus, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import type { CrawlerSource } from './utils';

interface ContentAcquisitionDashboardProps {
  sourcesData: CrawlerSource[];
}

export function CrawlerDashboard({
  sourcesData,
}: ContentAcquisitionDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [sources, setSources] = useState<CrawlerSource[]>(sourcesData);

  const addSource = (source: CrawlerSource) => {
    setSources([
      ...sources,
      { ...source, id: (sources.length + 1).toString() },
    ]);
    setIsAddDialogOpen(false);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Content Acquisition Dashboard</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Add Source
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
            <Input
              type='search'
              placeholder='Search sources...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant='outline' className='sm:w-auto w-full'>
            <Filter className='mr-2 h-4 w-4' />
            Filters
          </Button>
          <Button variant='outline' className='sm:w-auto w-full'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
          <CrawlerTable sources={sources} />
        </div>
      </div>

      <AddSourceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addSource}
      />
    </div>
  );
}
