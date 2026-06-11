const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.16.120:3333";

export const getSubmissionDetail = async (invoiceId: string) => {
  const response = await fetch(`${API_URL}/api/v1/invoices/${invoiceId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};
