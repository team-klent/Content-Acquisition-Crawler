'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CustomTableSkeleton({
  length = 8,
  columns = 4,
}: {
  length: number;
  columns: number;
}) {
  return (
    <div className='w-full'>
      <div className='border rounded-md bg-white'>
        {/* Table structure */}
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(columns)].map((_, index) => (
                <TableHead key={index} className='px-3 py-2'>
                  <Skeleton className='h-4 w-full' />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(columns)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(length)].map((_, cellIndex) => (
                  <TableCell key={cellIndex} className='px-3 py-2'>
                    <Skeleton className='h-4 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
