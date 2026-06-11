import { create } from "zustand";
import { persist } from "zustand/middleware";

type LoginStore = {
  token: string;
  username: string;
  role: string;

  setToken: (token: string) => void;
  setUsername: (username: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
};

type FileTable = {
  fileType: string;
  fileSize: string;
  setFileType: (type: string) => void;
  setFileSize: (size: string) => void;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  total: number;
  currency: string;
  validationStatus: string;
  flaggedItems: number;
  createdAt: string;
};

type MSMEStore = {
  selectedFile: File | null;
  selectedOption: string;
  nik: string;
  referenceNumber: string;
  isTableLoading: boolean;
  invoicesList: Invoice[];
  setSelectedFile: (file: File | null) => void;
  setSelectedOption: (option: string) => void;
  setNik: (nik: string) => void;
  setReferenceNumber: (referenceNumber: string) => void;
  setIsTableLoading: (loading: boolean) => void;
  setInvoicesList: (invoice: Invoice[]) => void;
};

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      token: "",
      username: "",
      role: "",

      setToken: (token) => set({ token }),
      setUsername: (username) => set({ username }),
      setRole: (role) => set({ role }),

      logout: () =>
        set({
          token: "",
          username: "",
          role: "",
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useFileStore = create<FileTable>((set) => ({
  fileSize: "0",
  fileType: "",
  setFileSize: (size) =>
    set({
      fileSize: size,
    }),
  setFileType: (type) =>
    set({
      fileType: type,
    }),
}));

export const useMSMEStore = create<MSMEStore>((set) => ({
  selectedFile: null,
  selectedOption: "",
  nik: "",
  referenceNumber: "",
  isTableLoading: false,
  invoicesList: [],

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
  setIsTableLoading: (loading) =>
    set({
      isTableLoading: loading,
    }),
  setInvoicesList: (invoicesList) =>
    set({
      invoicesList,
    }),
}));
