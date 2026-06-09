"use client";

import { useRef, useState } from "react";
import DragArea from "./DragInput/DragArea";
import Dropdown from "./Dropdown/Dropdown";
import { useMSMEStore } from "@/store/useStore";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isInvoiceFormIncomplete =
    !selectedOption || !nik || !referenceNumber || !selectedFile;

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

  const handleSubmit = () => {};

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
        disabled={isInvoiceFormIncomplete}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default UploadBox;
