"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import UploadBox from "@/components/UploadBox";
import DataTable from "@/components/DataTable/DataTable";
import ReviewPanel from "@/components/ReviewPanel";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  return (
    <div className="msme__outer-wrapper">
      <Header />
      <main className="msme__main">
        <div className="msme__main-title-wrapper">
          <h1>Invoice Verification</h1>
          <p>Precision processing for secure financial operations.</p>
        </div>
        <UploadBox />
        <DataTable
          setIsDrawerOpen={setIsDrawerOpen}
          setSelectedInvoice={setSelectedInvoice}
        />
        <ReviewPanel
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          selectedInvoice={selectedInvoice}
        />
      </main>
    </div>
  );
}
