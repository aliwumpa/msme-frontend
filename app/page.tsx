"use client";

import { useState } from "react";
import { login } from "@/services/loginService";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const username = useLoginStore((state) => state.username);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const setToken = useLoginStore((state) => state.setToken);
  const setUsername = useLoginStore((state) => state.setUsername);
  const setRole = useLoginStore((state) => state.setRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login(username, password);
      if (!result.data) {
        throw new Error("There is no data in login response");
      }

      setToken(result.data.token);
      setUsername(result.data.username ?? "-");
      setRole(result.data.role ?? "-");
      setIsLeaving(true);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="msme__outer-wrapper msme__login-wrapper">
      <main
        className={`msme__login ${isLeaving ? "msme__login-leaving" : ""}`}
        onAnimationEnd={() => {
          if (isLeaving) {
            router.replace("/dashboard");
          }
        }}
      >
        <h1>Sign in</h1>
        <form className="msme__login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="usernameInput">Username</label>
            <input
              id="usernameInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="passwordInput">Password</label>
            <input
              id="passwordInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="msme__login-error">{error}</div>}

          <button type="submit" disabled={loading}>
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
}
