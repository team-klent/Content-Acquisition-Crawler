'use client';

import { CustomTable } from '@/components/shared/custom-table';
import { PdfDocument } from '@/lib/pdf-data';
import { columns } from './columns';

interface PdfTableProps {
  documents: PdfDocument[];
}

export function PdfTable({ documents }: PdfTableProps) {
  return (
    <div>
      <CustomTable
        data={documents}
        columns={columns}
        // setSelection={() => {
        //   // Selection handling can be implemented here when needed
        // }}
      />
    </div>
  );
}
