'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
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

  const editedPath = `/apps${path}`;

  useEffect(() => {
    if (containerRef.current && path) {
      PDFObject.embed(editedPath, containerRef.current, {
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
        <h2 className='ml-4 text-2xl font-medium font-league'>{title}</h2>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        <div ref={containerRef} id='pdf-container' className='col-span-3 ' />
        <div className='col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 font-medium '>
                Metadata
              </CardTitle>
              <CardDescription>Details about this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div>
                  <h3 className='font-medium mb-3'>Basic Information</h3>
                  <div className='border rounded-md overflow-hidden'>
                    <Table className='w-full overflow-hidden'>
                      <TableBody>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            ID
                          </TableCell>
                          <TableCell className='px-4  py-2 text-sm '>
                            {id}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Title
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {title}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            File Name
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {fileName}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Path
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-9 '>
                            {path}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Size
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {size}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Type
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {type}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className='font-medium mb-3'>Authorship</h3>
                  <div className='border rounded-md overflow-hidden'>
                    <Table className='w-full'>
                      <TableBody>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Author
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {createdBy}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className='font-medium mb-3'>Dates</h3>
                  <div className='border rounded-md overflow-hidden'>
                    <Table className='w-full'>
                      <TableBody>
                        <TableRow className='border-b'>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Upload Date
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {createdAt}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='px-4 py-2 bg-gray-100 font-medium text-sm'>
                            Last Modified
                          </TableCell>
                          <TableCell className='px-4 py-2 text-sm break-all pr-2 '>
                            {updatedAt}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
