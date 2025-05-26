import ContentAcqusitionPDFViewer from '@/components/organisms/components/pdf-view';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filePath = params.file_path as string;
  if (!filePath) {
    return <div className='p-6'>No PDF file specified.</div>;
  }

  const pdf = {
    file_name: params.file_name as string,
    file_path: filePath,
    created_at: params.created_at as string,
    updated_at: params.updated_at as string,
    current_file_status: params.current_file_status as string,
  };

  return (
    <main className='p-6'>
      <ContentAcqusitionPDFViewer pdf={pdf} />
    </main>
  );
}
