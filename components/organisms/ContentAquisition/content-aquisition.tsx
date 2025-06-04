'use client';

import { pdfDocuments } from '@/lib/pdf-data';
import { PdfTable } from '../components/pdf-table';
import PdfRegisterButton from './file-registration-upload';
import { version } from '../../../package.json';
export default function ContentAquisitionPage() {
  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Content Acquisition</h1>
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

      <div className='bg-white rounded-lg shadow p-4'>
        <PdfTable documents={pdfDocuments} />
        {version && <p className='text-xs'>Version: {version}</p>}
      </div>
    </div>
  );
}
