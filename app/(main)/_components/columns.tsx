'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { CrawlerSource } from './utils';

const columns: ColumnDef<CrawlerSource>[] = [
  {
    id: 'select',
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked: boolean) => {
          row.toggleSelected(checked);
          console.log(table.getIsSomeRowsSelected());
        }}
      />
    ),
  },

  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          #{' '}
          {column.getIsSorted() === 'asc'
            ? '↑'
            : column.getIsSorted() === 'desc'
            ? '↓'
            : ''}
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
          source{' '}
          {column.getIsSorted() === 'asc'
            ? '↑'
            : column.getIsSorted() === 'desc'
            ? '↓'
            : ''}
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
          script{' '}
          {column.getIsSorted() === 'asc'
            ? '↑'
            : column.getIsSorted() === 'desc'
            ? '↓'
            : ''}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.script}</p>,
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
