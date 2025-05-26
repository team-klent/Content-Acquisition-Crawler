import UWLogo from '@/public/logo-unified-workflow.jpg';
import Image from 'next/image';

export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className='bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700'>
        <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
          <div className='flex shrink-0 items-center p-[10px] py-[2px]'>
            <Image
              className='h-[40px] w-auto'
              src={UWLogo}
              alt='Innodata'
              width={160}
              height={40}
              priority
            />
          </div>
        </div>
      </nav>
      <main className='h-dvh w-full'>{children} </main>
    </>
  );
}
