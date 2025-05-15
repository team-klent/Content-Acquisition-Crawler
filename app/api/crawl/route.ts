import { CrawlerSource } from '@/app/(main)/inventory/_components/utils';
import { NextResponse } from 'next/server';
const data: CrawlerSource[] = [
  {
    id: 1,
    source:
      'https://poyyyyehvvngoqpw.public.blob.vercel-storage.com/content-acquisition-crawler/WebSample.pdf',
    name: 'WebSample',
    type: 'application/pdf',
    isActive: true,
    createdAt: new Date('2023-04-20T08:00:00Z'),
    updatedAt: new Date('2023-05-01T08:00:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 2,
    source:
      'https://poyyyyehvvngoqpw.public.blob.vercel-storage.com/content-acquisition-crawler/invoicesample.pdf',
    name: 'invoicesample',
    type: 'application/pdf',
    isActive: false,
    createdAt: new Date('2023-04-10T10:00:00Z'),
    updatedAt: new Date('2023-04-20T14:30:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 3,
    source:
      'https://poyyyyehvvngoqpw.public.blob.vercel-storage.com/content-acquisition-crawler/somatosensory.pdf',
    name: 'somatosensory',
    type: 'application/pdf',
    isActive: true,
    createdAt: new Date('2023-05-01T15:00:00Z'),
    updatedAt: new Date('2023-05-10T11:20:00Z'),
    updateBy: 'system',
    createdBy: 'admin',
  },
  {
    id: 4,
    source:
      'https://poyyyyehvvngoqpw.public.blob.vercel-storage.com/content-acquisition-crawler/receipt.pdf',
    name: 'receipt',
    type: 'application/pdf',
    isActive: true,
    createdAt: new Date('2023-04-25T16:30:00Z'),
    updatedAt: new Date('2023-05-05T09:15:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 5,
    source:
      'https://poyyyyehvvngoqpw.public.blob.vercel-storage.com/content-acquisition-crawler/soma.pdf',
    name: 'soma',
    type: 'application/pdf',
    isActive: true,
    createdAt: new Date('2023-04-28T17:45:00Z'),
    updatedAt: new Date('2023-05-02T00:00:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
  {
    id: 6,
    source:
      'https://poyyyyehvvngoqpw.public.blob.vercel-storage.com/content-acquisition-crawler/browser.pdf',
    name: 'browser',
    type: 'application/pdf',
    isActive: true,
    createdAt: new Date('2023-04-28T17:45:00Z'),
    updatedAt: new Date('2023-05-02T00:00:00Z'),
    updateBy: 'admin',
    createdBy: 'admin',
  },
];

const GET = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250)); // Simulate a delay
  return NextResponse.json(data);
};

export { GET };
