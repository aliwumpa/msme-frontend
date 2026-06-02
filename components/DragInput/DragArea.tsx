"use client";

import Image from "next/image";

type DragAreaProps = {
  selectedFileName: string | null;
};

const DragArea = ({ selectedFileName }: DragAreaProps) => {
  const allowedContent = ["PDF", "PNG", "JPG"];

  const getAllowedContent = (allowedContent: string[]) => {
    if (!Array.isArray(allowedContent)) return "-";

    return allowedContent.join(", ");
  };

  return (
    <div className="drag-area__wrapper">
      <div className="drag-area__image-wrapper">
        <Image
          src="/upload-file.svg"
          alt="upload file logo"
          width={60}
          height={60}
          loading="eager"
        />
      </div>
      <div className="drag-area__description">
        <p className="drag-area__description-title">
          Upload Invoice for Verification
        </p>
        <p>
          Click or drag and drop your {getAllowedContent(allowedContent)}{" "}
          invoice files here
        </p>
      </div>
      {selectedFileName && (
        <p className="drag-area__file-name">{selectedFileName}</p>
      )}
    </div>
  );
};

export default DragArea;
