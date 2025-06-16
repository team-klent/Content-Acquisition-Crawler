import Header from '@/components/shared/header';
import { type Metadata } from 'next';
import { Toaster } from 'sonner';
import { leagueSpartan } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Acquisition ',
  description:
    'Tool for registering and processing files with Intelligent Automation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${leagueSpartan.className}  antialiased `}>
        <Header />

        {children}
        <Toaster />
      </body>
    </html>
  );
}
