'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { ContentAcquisitionColumns } from './utils';

const columns: ColumnDef<ContentAcquisitionColumns>[] = [
  {
    id: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          #
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.id}</p>,
  },

  {
    accessorKey: 'source',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          source
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.source}</p>,
  },

  {
    accessorKey: 'script',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          script
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.script}</p>,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.status}</p>,
  },

  {
    accessorKey: 'interval',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          interval
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.interval}</p>,
  },

  {
    accessorKey: 'initial',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          initial
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => (
      <p>{cell.row.original.initial ?? <p className='text-red-600'>N/A</p>}</p>
    ),
  },

  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.type}</p>,
  },

  // {
  //   header: 'Actions',
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: (cell) => {
  //     return (
  //       <div className='flex flex-row gap-2'>
  //         <UpdateSkuForm id={cell.row.original._id} />
  //       </div>
  //     );
  //   },
  // },
];

export default columns;
