"use client";

import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { BRAND_LOGO } from "@/lib/site-images";
import { SITE } from "@/lib/site-defaults";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("redirect") || "/admin";
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password reset link sent! Check your email.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0a1f40 0%, #0f2d5e 50%, #174698 100%)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Gold accent line */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #C9A84C, #FF1D1D, #C9A84C)" }} />

        <div style={{ padding: "2.5rem 2rem 2rem" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
            <Image
              src={BRAND_LOGO.src}
              alt={BRAND_LOGO.altEn}
              width={90}
              height={90}
              style={{ width: 90, height: 90, objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "1.75rem",
                fontWeight: 900,
                fontStyle: "italic",
                color: "#FF1D1D",
                lineHeight: 1.1,
                marginTop: 8,
              }}
            >
              {SITE.companyName}
            </span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              {mode === "login" ? "Staff Portal — Sign in to continue" : "Reset your password"}
            </span>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@amortravel.net"
                  style={{
                    width: "100%", padding: "0.65rem 0.875rem",
                    border: "1.5px solid #d1d5db", borderRadius: 10,
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#174698")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "0.65rem 0.875rem",
                    border: "1.5px solid #d1d5db", borderRadius: 10,
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#174698")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.625rem 0.875rem", fontSize: 13, color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "0.75rem",
                  background: loading ? "#9ca3af" : "linear-gradient(135deg, #174698, #0f2d5e)",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                  marginTop: 4,
                }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => { setMode("forgot"); setError(""); }}
                style={{ background: "none", border: "none", color: "#174698", fontSize: 13, cursor: "pointer", textAlign: "center", padding: 0 }}
              >
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@amortravel.net"
                  style={{
                    width: "100%", padding: "0.65rem 0.875rem",
                    border: "1.5px solid #d1d5db", borderRadius: 10,
                    fontSize: 15, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.625rem 0.875rem", fontSize: 13, color: "#dc2626" }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "0.625rem 0.875rem", fontSize: 13, color: "#16a34a" }}>
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                style={{
                  width: "100%", padding: "0.75rem",
                  background: loading ? "#9ca3af" : "linear-gradient(135deg, #FF1D1D, #c21515)",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
                  marginTop: 4,
                }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                style={{ background: "none", border: "none", color: "#174698", fontSize: 13, cursor: "pointer", textAlign: "center", padding: 0 }}
              >
                ← Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
