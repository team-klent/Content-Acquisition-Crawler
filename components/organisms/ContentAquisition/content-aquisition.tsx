'use client';

import TableCard from '@/components/shared/table-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pdfDocuments } from '@/lib/pdf-data';
import { PdfTable } from '../components/pdf-table';
import PdfRegisterButton from './file-registration-upload';
import { version } from '../../../package.json';
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
        {version && <p className='text-xs'>Version: {version}</p>}
      </TableCard>
    </>
  );
}
