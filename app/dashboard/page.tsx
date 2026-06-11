"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import UploadBox from "@/components/UploadBox";
import DataTable from "@/components/DataTable/DataTable";
import ReviewPanel from "@/components/ReviewPanel";
import { useLoginStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const logout = useLoginStore((state) => state.logout);

  return (
    <div
      className={`msme__outer-wrapper ${
        isLeaving ? "msme__dashboard-leaving" : "msme__dashboard-enter"
      }`}
      onAnimationEnd={() => {
        if (isLeaving) {
          logout();
          router.replace("/");
        }
      }}
    >
      <Header setIsLeaving={setIsLeaving} />
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
};

export default Dashboard;
