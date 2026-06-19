"use client";

import { useEffect, Dispatch, SetStateAction, useState } from "react";
import { useLoginStore } from "@/store/useStore";
import { getSubmissionDetail } from "@/services/submissionDetail";

type ReviewPanelProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  selectedInvoice: String | null;
};

const ReviewPanel = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedInvoice,
}: ReviewPanelProps) => {
  const headerPanel = "original document";
  const [isClosing, setIsClosing] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const role = useLoginStore((state) => state.role);
  const documentUrl = invoiceDetail?.document_url
    ? `${process.env.NEXT_PUBLIC_API_URL}${invoiceDetail.document_url}`
    : null;
  const isDocImage = documentUrl && /\.(jpg|jpeg|png)$/i.test(documentUrl);

  const getFindingStatus = (passed: boolean) => {
    return passed ? "success" : "error";
  };

  const errorCount =
    invoiceDetail?.validation_results?.filter((item: any) => !item.passed)
      .length ?? 0;

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      if (!selectedInvoice) return;

      try {
        setIsLoadingDetail(true);
        setDetailError("");

        const result = await getSubmissionDetail(selectedInvoice.toString());

        console.log(result, "invoice detail");

        setInvoiceDetail(result.data);
      } catch (error) {
        console.error(error);
        setDetailError("Failed to load invoice details");
      } finally {
        setIsLoadingDetail(false);
      }
    };

    if (isDrawerOpen) {
      fetchInvoiceDetail();
    }
  }, [isDrawerOpen, selectedInvoice]);

  if (!isDrawerOpen) return null;

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsDrawerOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const renderDocumentPreviewController = () => {
    if (!isDocImage) return null;

    return (
      <div className="review-panel__document-actions">
        <button onClick={() => setZoom((prev) => Math.max(prev - 25, 50))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6"
            />
          </svg>
        </button>
        <button onClick={() => setZoom((prev) => Math.min(prev + 25, 300))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
            />
          </svg>
        </button>
        <span>{zoom}%</span>
      </div>
    );
  };

  const renderPreviewSelectedFile = () => {
    if (!documentUrl) return <p>No document selected</p>;

    if (isDocImage)
      return (
        <img
          src={documentUrl!}
          alt="Preview"
          style={{
            transform: `scale(${zoom / 100})`,
          }}
        />
      );

    return (
      <iframe
        src={`${documentUrl}#zoom=${zoom}`}
        width="100%"
        height="100%"
        title="Document Preview"
      />
    );
  };

  const renderDocumentPreview = () => {
    return (
      <div className="review-panel__document">
        <div className="review-panel__document-header">
          <p>{headerPanel.toUpperCase()}</p>
          {renderDocumentPreviewController()}
        </div>

        <div className="review-panel__document-preview">
          {renderPreviewSelectedFile()}
        </div>
      </div>
    );
  };

  const renderReviewActionPanel = () => {
    if (role !== "admin") return;

    return (
      <div className="review-panel__actions">
        <button className="secondary">Flag for Review</button>
        <button className="primary">Approve Submission</button>
      </div>
    );
  };

  // const renderReviewPanel = () => {
  //   if (isLoadingDetail) {
  //     return (
  //       <>
  //         <div className="review-panel__overlay" onClick={handleClose}></div>

  //         <aside className="review-panel open">
  //           <div className="review-panel__loading">
  //             <span className="icon-loader"></span>
  //             <p>Loading invoice details...</p>
  //           </div>
  //         </aside>
  //       </>
  //     );
  //   }
  // };

  return (
    <>
      {/* Overlay */}
      <div className="review-panel__overlay" onClick={handleClose}></div>

      {/* Drawer */}
      <aside className={`review-panel ${isClosing ? "closing" : "open"}`}>
        <div className="review-panel__header">
          <div>
            <h2>Submission Details</h2>
            <p>
              ID: {invoiceDetail?.invoice_number ?? "-"} ・ Received{" "}
              {invoiceDetail?.created_at
                ? new Date(invoiceDetail.created_at).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
          <button onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {renderReviewActionPanel()}

        <div className="review-panel__content">
          {renderDocumentPreview()}
          <div className="review-panel__findings">
            <div className="review-panel__findings-header">
              <h3>Prompt Checker Results</h3>
              <span>{errorCount} ERROR</span>
            </div>

            <div className="review-panel__finding-list">
              {invoiceDetail?.validation_results?.map(
                (item: any, idx: number) => (
                  <div
                    key={`key-${idx}`}
                    className={`review-panel__finding ${getFindingStatus(item.passed)}`}
                  >
                    <div>
                      <span
                        className={
                          item.passed
                            ? "review-panel__green-circle"
                            : "review-panel__red-circle"
                        }
                      ></span>

                      <span>{item.rule_name}</span>
                    </div>

                    <p>{item.message}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ReviewPanel;
