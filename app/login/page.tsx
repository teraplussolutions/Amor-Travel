"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { BRAND_LOGO } from "@/lib/site-images";
import { SITE } from "@/lib/site-defaults";

type Mode = "login" | "forgot" | "signup";

export default function LoginPage() {
  const [email, setEmail] = useState("teraplussolutions@gmail.com");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    const params = new URLSearchParams(window.location.search);
    const dest = params.get("redirect") || "/admin";
    router.refresh();
    setTimeout(() => router.push(dest), 100);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Reset link sent! Check your email inbox and spam folder.");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name || email, role: "admin" } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Account created! You can now sign in below.");
    setTimeout(() => { setMode("login"); setSuccess(""); }, 2500);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.875rem",
    border: "1.5px solid #d1d5db", borderRadius: 10,
    fontSize: 15, outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, fontWeight: 600,
    color: "#374151", marginBottom: 6,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0a1f40 0%, #0f2d5e 50%, #174698 100%)", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #C9A84C, #FF1D1D, #C9A84C)" }} />
        <div style={{ padding: "1.5rem 2rem 2rem" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
            <Image src={BRAND_LOGO.src} alt={BRAND_LOGO.altEn} width={260} height={260} style={{ width: 260, height: 260, objectFit: "contain" }} />
            <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.75rem", fontWeight: 900, fontStyle: "italic", color: "#FF1D1D", lineHeight: 1.1, marginTop: 8 }}>
              {SITE.companyName}
            </span>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              {mode === "login" ? "Staff Portal" : mode === "forgot" ? "Reset your password" : "Create admin account"}
            </span>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@amortravel.net" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inputStyle} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.625rem", fontSize: 13, color: "#dc2626" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", background: loading ? "#9ca3af" : "linear-gradient(135deg, #174698, #0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer", marginTop: 4 }}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <button type="button" onClick={() => { setMode("forgot"); setError(""); }} style={{ background: "none", border: "none", color: "#174698", cursor: "pointer", padding: 0 }}>Forgot password?</button>
                <button type="button" onClick={() => { setMode("signup"); setError(""); }} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: 0 }}>Create account</button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.625rem", fontSize: 13, color: "#dc2626" }}>{error}</div>}
              {success && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "0.625rem", fontSize: 13, color: "#16a34a" }}>{success}</div>}
              <button type="submit" disabled={loading || !!success} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #FF1D1D, #c21515)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer" }}>
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
              <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: "#174698", fontSize: 13, cursor: "pointer", textAlign: "center" }}>← Back to sign in</button>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password (min 6 chars)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" style={inputStyle} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.625rem", fontSize: 13, color: "#dc2626" }}>{error}</div>}
              {success && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "0.625rem", fontSize: 13, color: "#16a34a" }}>{success}</div>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #174698, #0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer" }}>
                {loading ? "Creating…" : "Create Account"}
              </button>
              <button type="button" onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: "#174698", fontSize: 13, cursor: "pointer", textAlign: "center" }}>← Back to sign in</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
