import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TableSelection } from './_components/table-selection';

const Loader = async () => {
  return (
    <div className='container mx-auto py-4'>
      <div className='container mx-auto bg-white border rounded-md'>
        <div className='bg-white border rounded-md '>
          <TableSelection />
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(3)].map((_, index) => (
                  <TableHead key={index + 1} className='py-2 px-3'>
                    <Skeleton className='h-4 w-full' />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index + 1}>
                  {[...Array(3)].map((_, index) => (
                    <TableCell key={index + 1} className='py-2 px-3'>
                      <Skeleton className='h-4 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
          <div className='p-2 border-t bg-gray-50 text-xs text-muted-foreground'>
            ...
          </div>
        </div>
      </div>
      <Pagination className='justify-end mt-3 pr-3'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              className={
                'hover:bg-transparent cursor-not-allowed text-gray-300 hover:text-gray-300'
              }
              aria-disabled={true}
              tabIndex={-1}
            >
              <ChevronLeft className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className='ring-1 ring-gray-200 rounded-md hover:bg-transparent cursor-not-allowed'
              href='#'
              aria-disabled={true}
              tabIndex={-1}
            >
              ...
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={
                'hover:bg-transparent cursor-not-allowed text-gray-300 hover:text-gray-300'
              }
              aria-disabled={true}
              tabIndex={-1}
            >
              <ChevronRight className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Loader;
