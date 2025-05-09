'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const TablePagination = ({
  currentPage,
  totalLength,
  pageSize,
}: {
  currentPage: number;
  totalLength: number;
  pageSize: number;
}) => {
  const pathname = usePathname();

  const disabledPrev = currentPage === 1;
  const disabledNext = currentPage * pageSize > totalLength;

  return (
    <TooltipProvider>
      <Pagination className='justify-end mt-3 pr-3'>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              href={disabledPrev ? '#' : `${pathname}?page=${currentPage - 1}`}
              className={cn(
                !disabledPrev && 'transition delay-50 hover:-translate-x-1.5',
                disabledPrev &&
                  'hover:bg-transparent cursor-not-allowed text-gray-300 hover:text-gray-300'
              )}
              aria-disabled={disabledPrev && true}
              tabIndex={disabledPrev ? -1 : undefined}
            >
              <ChevronLeft className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
          {pageSize * currentPage - pageSize * 5 > 0 && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger className='group transition delay-500 ease-in-out duration-300 flex flex-col '>
                <PaginationItem>
                  <PaginationLink href={`${pathname}?page=${currentPage - 5}`}>
                    <PaginationEllipsis className=' block transition delay-100 ease-in-out duration-100 group-hover:opacity-0  h-4 w-4 ' />
                    <ChevronsLeft className=' block  transition delay-100 ease-in-out duration-100 opacity-0 group-hover:opacity-100  -ml-4 h-4 w-4' />
                  </PaginationLink>
                </PaginationItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Jump Previous 5 Pages</p>
              </TooltipContent>
            </Tooltip>
          )}
          {pageSize * currentPage - pageSize * 2 > 0 && (
            <PaginationItem>
              <PaginationLink href={`${pathname}?page=${currentPage - 2}`}>
                {currentPage - 2}
              </PaginationLink>
            </PaginationItem>
          )}

          {pageSize * currentPage - pageSize > 0 && (
            <PaginationItem>
              <PaginationLink href={`${pathname}?page=${currentPage - 1}`}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              className='ring-1 ring-gray-200 rounded-md hover:bg-transparent '
              href='#'
            >
              {' '}
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          {pageSize * currentPage + pageSize < totalLength + pageSize && (
            <PaginationItem>
              <PaginationLink href={`${pathname}?page=${currentPage + 1}`}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {pageSize * currentPage + pageSize * 2 < totalLength && (
            <PaginationItem>
              <PaginationLink href={`${pathname}?page=${currentPage + 2}`}>
                {currentPage + 2}
              </PaginationLink>
            </PaginationItem>
          )}
          {pageSize * currentPage + pageSize * 5 < totalLength && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger className='group transition delay-500 ease-in-out duration-300 flex flex-col '>
                <PaginationItem>
                  <PaginationLink href={`${pathname}?page=${currentPage + 5}`}>
                    <PaginationEllipsis className=' block transition delay-100 ease-in-out duration-100 group-hover:opacity-0  h-4 w-4 ' />
                    <ChevronsRight className=' block  transition delay-100 ease-in-out duration-100 opacity-0 group-hover:opacity-100  -ml-4 h-4 w-4' />
                  </PaginationLink>
                </PaginationItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>Jump 5 Pages</p>
              </TooltipContent>
            </Tooltip>
          )}
          <PaginationItem>
            <PaginationLink
              href={disabledNext ? '#' : `${pathname}?page=${currentPage + 1}`}
              className={cn(
                !disabledNext && 'transition delay-50 hover:translate-x-1.5',
                disabledNext &&
                  'hover:bg-transparent cursor-not-allowed text-gray-300 hover:text-gray-300'
              )}
              aria-disabled={disabledNext && true}
              tabIndex={disabledNext ? -1 : undefined}
            >
              <ChevronRight className='h-4 w-4' />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </TooltipProvider>
  );
};

export default TablePagination;
