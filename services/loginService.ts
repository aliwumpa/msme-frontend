const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.16.120:3333";

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json();
};
