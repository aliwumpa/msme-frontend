"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import DragArea from "./DragInput/DragArea";
import Dropdown from "./Dropdown/Dropdown";
import { useMSMEStore } from "@/store/useStore";
import { scanDocuments, uploadDocument } from "@/services/documentService";
import { getSubmissionList } from "@/services/submissionList";

const UploadBox = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allowedContentTypes = ".pdf,.png,.jpg,.jpeg";

  const selectedFile = useMSMEStore((state) => state.selectedFile);
  const setSelectedFile = useMSMEStore((state) => state.setSelectedFile);
  const selectedOption = useMSMEStore((state) => state.selectedOption);
  const nik = useMSMEStore((state) => state.nik);
  const setNik = useMSMEStore((state) => state.setNik);

  const referenceNumber = useMSMEStore((state) => state.referenceNumber);
  const setReferenceNumber = useMSMEStore((state) => state.setReferenceNumber);
  const setIsTableLoading = useMSMEStore((state) => state.setIsTableLoading);
  const setInvoicesList = useMSMEStore((state) => state.setInvoicesList);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const isInvoiceFormIncomplete =
    !selectedOption || !nik || !referenceNumber || !selectedFile;
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const basePath =
    process.env.NODE_ENV === "production" ? "/msme-frontend" : "";

  const preventDefaultBehavior = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaultBehavior(e);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaultBehavior(e);
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    preventDefaultBehavior(e);

    if (isLoading) return;

    setIsDragging(false);

    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (isLoading || !inputRef.current) return;

    inputRef.current.click();
  };
  const handleFileSelect = (files: FileList | null) => {
    if (!files || isLoading) return;

    const file = files[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const setMappingInvoices = (invoices: any) => {
    const mappedInvoices = invoices.data.map((item: any) => ({
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
  };

  const waitForScanCompletion = async (documentId: string) => {
    while (true) {
      const result = await scanDocuments(documentId);

      if (result.success === true) {
        setIsScanning(false);
        setHasResult(true);
        setResultMessage(result.message);
        return result;
      }

      if (result.error) {
        setIsScanning(false);
        setHasResult(true);
        setResultMessage(result.message);
        throw new Error("Document scan failed");
      }

      await sleep(3000);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      setHasResult(false);
      setIsError(false);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("nik", nik);
      formData.append("ref_number", referenceNumber);
      formData.append("rule_type", selectedOption);

      // HIT UPLOAD DOCUMENT
      const uploadResult = await uploadDocument(formData);

      if (uploadResult.error) {
        setIsError(true);
        setHasResult(true);
        setResultMessage(uploadResult.message);
        return;
      }

      // HIT SCAN DOCUMENT
      setIsScanning(true);
      await sleep(2000); // DELAY before hit scan API

      const documentId = uploadResult.data.document_id;
      if (!documentId) {
        throw new Error("There is no document id");
      }
      await waitForScanCompletion(documentId);

      //HIT SUBMISSION LIST
      setIsTableLoading(true);
      const invoices = await getSubmissionList();
      await sleep(2000); // DELAY for table loading
      setMappingInvoices(invoices);
      setIsTableLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNIKInput = () => {
    return (
      <div className="upload-box__nik-input-wrapper">
        <label htmlFor="nikInput" className="dropdown__label">
          NIK
        </label>

        <input
          id="nikInput"
          type="text"
          value={nik}
          maxLength={16}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setNik(value);
          }}
        />
      </div>
    );
  };

  const renderReferenceNumberInput = () => {
    return (
      <div className="upload-box__ref-input-wrapper">
        <label htmlFor="refInput" className="dropdown__label">
          Reference Number
        </label>

        <input
          id="refInput"
          type="text"
          value={referenceNumber}
          onChange={(e) => {
            setReferenceNumber(e.target.value);
          }}
        />
      </div>
    );
  };

  const renderInvoiceRequestForm = () => {
    return (
      <div className="upload-box__request-form-wrapper">
        <Dropdown />
        {renderNIKInput()}
        {renderReferenceNumberInput()}
      </div>
    );
  };

  const renderFetchDocumentResult = () => {
    if (!hasResult && !isScanning) {
      return null;
    }

    if (isScanning) {
      return (
        <>
          <span className="icon-loader"></span>
          <span>Scanning document</span>
        </>
      );
    }

    return (
      <>
        {isError ? (
          <Image
            src={`${basePath}/icon-error.svg`}
            alt="error"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src={`${basePath}/icon-success.svg`}
            alt="success"
            width={24}
            height={24}
          />
        )}

        <p>{resultMessage}</p>
      </>
    );
  };
  return (
    <div className="upload-box__outer-wrapper">
      {renderInvoiceRequestForm()}
      <div
        className="upload-box__input-wrapper"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept={allowedContentTypes}
          hidden
        />
        <DragArea selectedFileName={selectedFile ? selectedFile.name : null} />
      </div>
      <button
        type="submit"
        className="upload-box__request-form-submit"
        disabled={isInvoiceFormIncomplete || isLoading}
        onClick={handleSubmit}
      >
        Submit
      </button>
      <div className="upload-box__result-wrapper">
        {renderFetchDocumentResult()}
      </div>
    </div>
  );
};

export default UploadBox;
