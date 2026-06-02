"use client";

import { useRef, useState } from "react";
import DragArea from "./DragInput/DragArea";

type UploadBoxProps = {
  selectedFile: File | null;
  setSelectedFile: (value: File | null) => void;
};

const UploadBox = ({ selectedFile, setSelectedFile }: UploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allowedContentTypes = ".pdf,.png,.jpg,.jpeg";

  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  return (
    <div className="upload-box__outer-wrapper">
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
    </div>
  );
};

export default UploadBox;
