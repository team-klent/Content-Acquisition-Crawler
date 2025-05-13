import CustomPagination from '@/components/shared/custom-pagination';
import ContentAcquisitionTable from './_components/table';
import { TableSelection } from './_components/table-selection';

interface IProps {
  searchParams: Promise<{ page: string }>;
}

const MainPage = async ({ searchParams }: IProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 4;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/crawl`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  return (
    <div className='container mx-auto py-4'>
      <div className='container mx-auto bg-white border rounded-md'>
        <div className='bg-white border   '>
          <TableSelection data={data} />
        </div>
        <ContentAcquisitionTable data={data} />
        <div className='p-2 border-t bg-gray-50 text-xs text-muted-foreground'>
          {data.length} Total Length
        </div>
      </div>
      <p>
        {process.env.VERCEL_URL} {process.env.NEXT_PUBLIC_URL}
      </p>
      <CustomPagination
        totalLength={data.length}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
};

export default MainPage;
