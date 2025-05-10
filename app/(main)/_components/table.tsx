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
        {/* <div className='overflow-auto'>
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
              {data.map((scraper) => (
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
        </div> */}

        <div className='p-2 border-t bg-gray-50 text-xs text-muted-foreground'>
          {data.length}
        </div>
      </div>
    </div>
  );
}
