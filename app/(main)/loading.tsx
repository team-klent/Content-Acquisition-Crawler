import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Loader = async () => {
  return (
    <div className='container mx-auto py-4'>
      <div className='container mx-auto bg-white border rounded-md'>
        <div className='bg-white border rounded-md '>
          <div className='p-4 border-b flex items-center justify-between bg-gray-50'>
            <h1 className='text-lg font-medium'>Content Acquisition</h1>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>...</span>
              <Button
                className='bg-blue-600 text-white hover:bg-blue-700'
                disabled
              >
                Loading...
              </Button>
            </div>
          </div>

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
    </div>
  );
};

export default Loader;
