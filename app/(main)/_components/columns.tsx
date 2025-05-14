'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, FileText, Folder } from 'lucide-react';
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
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          Name{' '}
          {column.getIsSorted() === 'asc'
            ? '↑'
            : column.getIsSorted() === 'desc'
            ? '↓'
            : ''}
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => (
      <div className='flex flex-row items-center gap-2'>
        {cell.row.original.type.includes('pdf') ? (
          <FileText className='h-4 w-4 my-auto' />
        ) : (
          <Folder className='h-4 w-4 my-auto' />
        )}
        <p>{cell.row.original.name}</p>
      </div>
    ),
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
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          Date Created
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => {
      if (!cell?.row?.original?.createdAt) return <p>Not Available</p>;
      const date = new Date(cell?.row?.original?.createdAt);
      return <p>{date.toLocaleDateString()}</p>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='uppercase'
        >
          Date Modified
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => {
      if (!cell?.row?.original?.updatedAt) return <p>Not Available</p>;
      const date = new Date(cell.row.original.updatedAt);
      return <p>{date.toLocaleDateString()}</p>;
    },
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
