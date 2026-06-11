const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.16.120:3333";

export const scanDocuments = async (documentId: string) => {
  const response = await fetch(
    `${API_URL}/api/v1/documents/${documentId}/scan`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

export const uploadDocument = async (formData: FormData) => {
  const response = await fetch(`${API_URL}/api/v1/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload document");
  }

  return response.json();
};
