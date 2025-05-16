'use client';

import { useEffect, useRef } from 'react';
import PDFObject from 'pdfobject';
import { useSearchParams,useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { ChevronLeft } from "lucide-react"


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
    if (containerRef.current) {
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
      <div className="flex items-center mb-4">
      <Button variant="outline" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
      <h2 className="ml-4 text-xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div ref={containerRef} id="pdf-container" className="col-span-3" />
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Metadata
              </CardTitle>
              <CardDescription>Details about this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Basic Information</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">ID</td>
                          <td className="px-4 py-2 text-sm">{id}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Title</td>
                          <td className="px-4 py-2 text-sm">{title}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">File Name</td>
                          <td className="px-4 py-2 text-sm">{fileName}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Path</td>
                          <td className="px-4 py-2 text-sm">{path}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Size</td>
                          <td className="px-4 py-2 text-sm">{size}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Type</td>
                          <td className="px-4 py-2 text-sm">{type}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Authorship</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Author</td>
                          <td className="px-4 py-2 text-sm">{createdBy}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Dates</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Upload Date</td>
                          <td className="px-4 py-2 text-sm">{createdAt}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 bg-gray-100 font-medium text-sm">Last Modified</td>
                          <td className="px-4 py-2 text-sm">{updatedAt}</td>
                        </tr>
                      </tbody>
                    </table>
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