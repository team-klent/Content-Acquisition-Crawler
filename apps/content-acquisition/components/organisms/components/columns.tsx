'use client';

import { Button } from '@/components/ui/button';
import { PdfDocument } from '@/lib/pdf-data';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, FileText } from 'lucide-react';
import PdfConfirmationButton from './pdf-confirmation-button';

export const columns: ColumnDef<PdfDocument>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='  text-black font-league font-[400] text-sm tracking-wide cursor-pointer'
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='flex flex-row items-center gap-2'>
        <FileText className='h-4 w-4 my-auto' />
        <div className='font-medium'>{row.getValue('title')}</div>
      </div>
    ),
  },
  {
    accessorKey: 'filename',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='  text-black font-league font-[400] text-sm tracking-wide cursor-pointer'
        >
          Filename
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.getValue('filename')}</span>,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='  text-black font-league font-[400] text-sm tracking-wide cursor-pointer'
        >
          Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span>{(row.getValue('type') as string).toUpperCase()}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='  text-black font-league font-[400] text-sm tracking-wide cursor-pointer'
        >
          Date Added
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date ? (
        <span>{date.toLocaleDateString()}</span>
      ) : (
        <span>Not Available</span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const pdf = row.original;

      return (
        <div className='flex space-x-2'>
          <PdfConfirmationButton pdf={pdf} />
        </div>
      );
    },
  },
];
