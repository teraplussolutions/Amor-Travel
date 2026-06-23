"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { BRAND_LOGO } from "@/lib/site-images";
import Image from "next/image";

export default function SetupPage() {
  const [email, setEmail] = useState("teraplussolutions@gmail.com");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("Admin");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Use Supabase signUp (will create + confirm via email, or we can use admin API)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: "admin" } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setDone(true);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0a1f40 0%, #174698 100%)", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #C9A84C, #FF1D1D, #C9A84C)" }} />
        <div style={{ padding: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <Image src={BRAND_LOGO.src} alt="Amor Travel" width={100} height={100} style={{ width: 100, height: 100, objectFit: "contain" }} />
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", fontWeight: 900, fontStyle: "italic", color: "#FF1D1D", margin: "8px 0 4px" }}>Amor Travel</h1>
            <p style={{ fontSize: 13, color: "#6b7280" }}>First-time admin setup</p>
          </div>

          {done ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
              <p style={{ color: "#16a34a", fontWeight: 700, marginBottom: 8 }}>✓ Account created!</p>
              <p style={{ color: "#374151", fontSize: 14, marginBottom: 12 }}>Check your email to confirm, then <a href="/login" style={{ color: "#174698" }}>go to login</a>.</p>
              <p style={{ color: "#6b7280", fontSize: 12 }}>If email confirmation is disabled in Supabase, you can log in directly.</p>
            </div>
          ) : (
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password (min 8 chars)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={{ width: "100%", padding: "0.6rem 0.875rem", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
              </div>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.6rem", fontSize: 13, color: "#dc2626" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ padding: "0.75rem", background: "linear-gradient(135deg, #174698, #0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer", marginTop: 4 }}>
                {loading ? "Creating…" : "Create Admin Account"}
              </button>
              <a href="/login" style={{ textAlign: "center", fontSize: 13, color: "#174698" }}>Already have an account? Sign in</a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
