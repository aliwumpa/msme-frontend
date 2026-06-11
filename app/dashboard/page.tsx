"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import UploadBox from "@/components/UploadBox";
import DataTable from "@/components/DataTable/DataTable";
import ReviewPanel from "@/components/ReviewPanel";
import { useLoginStore, useMSMEStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { getSubmissionList } from "@/services/submissionList";

const Dashboard = () => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const logout = useLoginStore((state) => state.logout);

  const setIsTableLoading = useMSMEStore((state) => state.setIsTableLoading);

  const setInvoicesList = useMSMEStore((state) => state.setInvoicesList);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setIsTableLoading(true);

        const response = await getSubmissionList();

        const mappedInvoices = response.data.map((item: any) => ({
          id: item.id,
          invoiceNumber: item.invoice_number,
          vendorName: item.vendor_name,
          total: item.total,
          currency: item.currency,
          validationStatus: item.validation_status,
          flaggedItems: item.flagged_items,
          createdAt: item.created_at,
        }));

        setInvoicesList(mappedInvoices);
      } catch (error) {
        console.error(error);
      } finally {
        setIsTableLoading(false);
      }
    };

    loadInvoices();
  }, [setInvoicesList, setIsTableLoading]);

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
