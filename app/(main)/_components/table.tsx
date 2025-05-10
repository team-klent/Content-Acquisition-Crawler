'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, FileText, ImageIcon, Package } from 'lucide-react';
import { useState } from 'react';
import { CrawlerSource } from './utils';

const scrapers: CrawlerSource[] = [
  {
    id: '1',
    source: 'https://example.com',
    script: 'ExampleScraper',
    status: 'active',
    interval: '1h',
    initial: '2023-05-01T08:00:00Z',
    type: 'blog',
    isActive: true,
    createdAt: '2023-04-20T08:00:00Z',
    updatedAt: '2023-05-01T08:00:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: '2',
    source: 'https://news.ycombinator.com',
    script: 'HackerNewsScraper',
    status: 'paused',
    interval: '30m',
    initial: '2023-04-15T12:30:00Z',
    type: 'news',
    isActive: false,
    createdAt: '2023-04-10T10:00:00Z',
    updatedAt: '2023-04-20T14:30:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: '3',
    source: 'https://reddit.com/r/programming',
    script: 'RedditScraper',
    status: 'error',
    interval: '2h',
    initial: '2023-05-10T10:00:00Z',
    type: 'forum',
    isActive: true,
    createdAt: '2023-05-01T15:00:00Z',
    updatedAt: '2023-05-10T11:20:00Z',
    updateBy: 'system',
    createdBy: 'admin',
  },
  {
    id: '4',
    source: 'https://dev.to',
    script: 'DevToScraper',
    status: 'active',
    interval: '4h',
    initial: '2023-05-05T09:15:00Z',
    type: 'blog',
    isActive: true,
    createdAt: '2023-04-25T16:30:00Z',
    updatedAt: '2023-05-05T09:15:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: '5',
    source: 'https://github.com/trending',
    script: 'GithubTrendingScraper',
    status: 'active',
    interval: '12h',
    initial: '2023-05-02T00:00:00Z',
    type: 'repository',
    isActive: true,
    createdAt: '2023-04-28T17:45:00Z',
    updatedAt: '2023-05-02T00:00:00Z',
    updateBy: 'admin',
    createdBy: 'admin',
  },
];

export default function ScraperList() {
  const [selectedScraper, setSelectedScraper] = useState<string | null>(null);

  const selectScraper = (scraperId: string) => {
    setSelectedScraper(selectedScraper === scraperId ? null : scraperId);
  };

  const handleSelectButtonClick = () => {
    if (selectedScraper) {
      const scraper = scrapers.find((s) => s.id === selectedScraper);
      alert(`Selected scraper: ${scraper?.source || 'None'}`);
    } else {
      alert('No scraper selected');
    }
  };

  const getIconForScraper = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className='h-4 w-4 text-blue-500' />;
      case 'news':
        return <FileText className='h-4 w-4 text-green-500' />;
      case 'forum':
        return <Package className='h-4 w-4 text-amber-500' />;
      case 'repository':
        return <ImageIcon className='h-4 w-4 text-purple-500' />;
      default:
        return <FileText className='h-4 w-4 text-gray-500' />;
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <div className='bg-white border rounded-md shadow-sm'>
        <div className='p-4 border-b flex items-center justify-between bg-gray-50'>
          <h1 className='text-lg font-medium'>Scrapers</h1>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {selectedScraper ? '1 scraper' : 'No scraper'} selected
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

        <div className='overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50 hover:bg-gray-50'>
                <TableHead className='w-[40px]'></TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Script</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scrapers.map((scraper) => (
                <TableRow
                  key={scraper.id}
                  className={`cursor-pointer ${
                    selectedScraper === scraper.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => selectScraper(scraper.id)}
                >
                  <TableCell className='w-[40px]'>
                    {selectedScraper === scraper.id ? (
                      <div className='flex h-4 w-4 items-center justify-center rounded-sm border border-blue-600 bg-blue-600 text-white'>
                        <Check className='h-3 w-3' />
                      </div>
                    ) : (
                      <div className='flex h-4 w-4 items-center justify-center rounded-sm border border-input'></div>
                    )}
                  </TableCell>
                  <TableCell className='font-medium flex items-center gap-2'>
                    {getIconForScraper(scraper.type)}
                    {scraper.source}
                  </TableCell>
                  <TableCell>{scraper.script}</TableCell>
                  <TableCell>{scraper.type}</TableCell>
                  <TableCell>
                    {new Date(scraper.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='p-2 border-t bg-gray-50 text-xs text-muted-foreground'>
          {scrapers.length} scrapers
        </div>
      </div>
    </div>
  );
}
