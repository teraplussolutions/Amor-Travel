"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { BRAND_LOGO } from "@/lib/site-images";
import { SITE } from "@/lib/site-defaults";

export default function CrmLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    const dest = params.get("redirect") || "/agent";
    router.refresh();
    setTimeout(() => router.push(dest), 100);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2d5e 0%, #174698 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "16px 28px 20px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <Image src={BRAND_LOGO.src} alt="Amor Travel" width={120} height={120} style={{ width: 120, height: 120, objectFit: "contain", margin: "0 auto" }} />
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", fontWeight: 900, fontStyle: "italic", color: "#FF1D1D", marginTop: 2 }}>
            {SITE.companyName}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>CRM — Agent Portal</div>
        </div>

        <div style={{ height: 3, background: "linear-gradient(90deg,#174698,#FF1D1D,#C9A84C)", borderRadius: 4, marginBottom: 14 }} />

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@amortravel.net"
              style={{ width: "100%", padding: "0.65rem 0.875rem", border: "1.5px solid #d1d5db", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Лозинка / Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.65rem 0.875rem", border: "1.5px solid #d1d5db", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", padding: "0.8rem", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? "Се најавувам..." : "Влези во CRM"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
          Само за вработени во Amor Travel
        </div>
      </div>
    </div>
  );
}
