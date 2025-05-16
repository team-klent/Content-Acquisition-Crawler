"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { pdfDocuments, PdfDocument } from "@/lib/pdf-data";
import { PlusIcon, RefreshCw } from "lucide-react";
import { PdfTable } from "../components/pdf-table";

export default function ContentAquisitionPage() {
  const [documents, setDocuments] = useState<PdfDocument[]>(pdfDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/pdfs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF documents');
      }
      
      const data = await response.json();
      
      // Convert string dates back to Date objects
      const pdfDocs = data.pdfs.map((pdf: any) => ({
        ...pdf,
        createdAt: pdf.createdAt ? new Date(pdf.createdAt) : undefined,
        updatedAt: pdf.updatedAt ? new Date(pdf.updatedAt) : undefined,
      }));
      
      setDocuments(pdfDocs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Acquisition</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            disabled={loading}
            onClick={fetchPdfs}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <PdfTable documents={documents} />
        )}
      </div>
      
     
    </div>
  );
}
