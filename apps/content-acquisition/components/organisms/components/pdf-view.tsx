'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { TABLE_CELL_CLASSES } from '@/lib/constants';
import { useSearchParams } from 'next/navigation';
import PDFObject from 'pdfobject';
import { useEffect, useRef } from 'react';

export default function PdfView() {
  const containerRef = useRef(null);
  const searchParams = useSearchParams();

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
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            ID
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT_NO_BREAK}>
                            {id}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Title
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {title}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            File Name
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {fileName}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Path
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {path}
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-b'>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Size
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {size}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Type
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
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
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Author
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
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
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Upload Date
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
                            {createdAt}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={TABLE_CELL_CLASSES.HEADER}>
                            Last Modified
                          </TableCell>
                          <TableCell className={TABLE_CELL_CLASSES.CONTENT}>
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
