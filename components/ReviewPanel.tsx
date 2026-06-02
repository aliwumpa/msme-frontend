"use client";

import { useEffect, Dispatch, SetStateAction, useState } from "react";

type ReviewPanelProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  selectedFile: File | null;
  selectedInvoice: String | null;
};

const findings = [
  {
    label: "Missing Tax ID",
    status: "error",
    detail: "Required",
  },
  {
    label: "Date Verified",
    status: "success",
    detail: "Within Period",
  },
  {
    label: "Supplier Match",
    status: "success",
    detail: "A-1 Master Data",
  },
];

const ReviewPanel = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedFile,
  selectedInvoice,
}: ReviewPanelProps) => {
  const headerPanel = "original document";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const isImage = selectedFile && selectedFile.type.startsWith("image/");
  const [zoom, setZoom] = useState(50);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  if (!isDrawerOpen) return null;

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsDrawerOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const renderDocumentPreviewController = () => {
    if (!isImage) return null;

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
    if (!previewUrl) return <p>No document selected</p>;

    if (isImage)
      return (
        <img
          src={previewUrl!}
          alt="Preview"
          style={{
            transform: `scale(${zoom / 100})`,
          }}
        />
      );

    return (
      <iframe
        src={`${previewUrl}#zoom=${zoom}`}
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

  return (
    <>
      {/* Overlay */}
      <div className="review-panel__overlay" onClick={handleClose}></div>

      {/* Drawer */}
      <aside className={`review-panel ${isClosing ? "closing" : "open"}`}>
        <div className="review-panel__header">
          <div>
            <h2>Submission Details</h2>
            <p>ID: {selectedInvoice} ・ Received Oct 24, 2023</p>
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

        <div className="review-panel__actions">
          <button className="secondary">Flag for Review</button>
          <button className="primary">Approve Submission</button>
        </div>

        <div className="review-panel__content">
          {renderDocumentPreview()}
          <div className="review-panel__findings">
            <div className="review-panel__findings-header">
              <h3>Prompt Checker Results</h3>
              <span>1 ERROR</span>
            </div>

            <div className="review-panel__finding-list">
              {findings.map((item) => (
                <div
                  key={item.label}
                  className={`review-panel__finding ${item.status || "-"}`}
                >
                  <div>
                    <span
                      className={
                        item.status === "error"
                          ? "review-panel__red-circle"
                          : "review-panel__green-circle"
                      }
                    ></span>
                    <span>{item.label || "-"}</span>
                  </div>
                  <p>{item.detail || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ReviewPanel;
