"use client";

import { useState } from "react";
import { CustomTable } from "@/components/shared/custom-table";
import { PdfDocument } from "@/lib/pdf-data";
import { columns } from "./columns";

interface PdfTableProps {
  documents: PdfDocument[];
}

export function PdfTable({ documents }: PdfTableProps) {
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);

  return (
    <div className="space-y-4">
      <CustomTable
        data={documents}
        columns={columns}
        setSelection={(selection) => setSelectedPdf(selection as PdfDocument | null)}
      />
    </div>
  );
}
