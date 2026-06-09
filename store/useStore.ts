import { create } from "zustand";

type MSMEStore = {
  selectedFile: File | null;
  selectedOption: string;

  nik: string;
  referenceNumber: string;

  setSelectedFile: (file: File | null) => void;
  setSelectedOption: (option: string) => void;
  setNik: (nik: string) => void;
  setReferenceNumber: (referenceNumber: string) => void;
};

export const useMSMEStore = create<MSMEStore>((set) => ({
  selectedFile: null,
  selectedOption: "",
  nik: "",
  referenceNumber: "",

  setSelectedFile: (file) =>
    set({
      selectedFile: file,
    }),
  setSelectedOption: (option) =>
    set({
      selectedOption: option,
    }),
  setNik: (nik) =>
    set({
      nik,
    }),
  setReferenceNumber: (referenceNumber) =>
    set({
      referenceNumber,
    }),
}));
