'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PDFObject from 'pdfobject';
import { useEffect, useRef } from 'react';

export default function PdfView() {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id');
  const title = searchParams.get('title');
  const fileName = searchParams.get('fileName');
  const path = searchParams.get('path');
  const size = searchParams.get('size');
  const type = searchParams.get('type');
  const createdAt = searchParams.get('createdAt');
  const createdBy = searchParams.get('createdBy');
  const updatedAt = searchParams.get('updatedAt');

  useEffect(() => {
    if (containerRef.current && path) {
      PDFObject.embed(path, containerRef.current, {
        height: '800px',
        pdfOpenParams: {
          view: 'FitV',
          pagemode: 'none',
        },
      });
    }
  }, [path]);

  return (
    <div>
      <div className='flex items-center mb-4'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.back()}
          className='cursor-pointer'
        >
          <ChevronLeft />
        </Button>
        <h2 className='ml-4 text-xl font-semibold'>{title}</h2>
      </div>
      <div className='w-full'>
        <div ref={containerRef} id='pdf-container' />
      </div>
    </div>
  );
}
