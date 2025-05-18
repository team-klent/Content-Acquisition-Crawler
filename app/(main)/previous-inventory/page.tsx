import CustomPagination from '@/components/shared/custom-pagination';
import ContentAcquisitionTable from './_components/table';
import { TableSelection } from './_components/table-selection';
import { getAllCrawlerData } from './_services/api';

interface IProps {
  searchParams: Promise<{ page: string }>;
}

const MainPage = async ({ searchParams }: IProps) => {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 8;

  const data = await getAllCrawlerData();

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
      <CustomPagination
        totalLength={data.length}
        currentPage={currentPage}
        pageSize={pageSize}
      />
    </div>
  );
};

export default MainPage;
