'use client';

import TableCard from '@/components/shared/table-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pdfDocuments } from '@/lib/pdf-data';
import { PdfTable } from '../components/pdf-table';
import PdfRegisterButton from './file-registration-upload';

export default function ContentAquisitionPage() {
  return (
    <>
      <TableCard>
        <div className='flex px-5 mb-5 justify-between items-center '>
          <h1 className='text-xl  font-normal font-league'>
            Content Acquisition
          </h1>
          <div className='flex gap-2'>
            <PdfRegisterButton />
          </div>
        </div>
        {/* 
      {error && (
        <div
          className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4'
          role='alert'
        >
          <p className='font-bold'>Error</p>
          <p>{error}</p>
        </div>
      )} */}

        <PdfTable documents={pdfDocuments} />
        <div className='flex px-5 pt-3 justify-between items-center '>
          <p className='text-normal font-light'>
            Showing {pdfDocuments.length} of {pdfDocuments.length} entries
          </p>
          <div className='flex items-center gap-1'>
            <Button variant='ghost' className='cursor-pointer' disabled>
              Previous
            </Button>
            <Button variant='ghost' className='cursor-pointer' disabled>
              Next
            </Button>
            <p className='pl-6  text-gray-500 text-sm'>Show:</p>
            <Input
              type='number'
              defaultValue={10}
              className='w-16'
              min={1}
              max={100}
              disabled
            />
          </div>
        </div>
      </TableCard>
    </>
  );
}
