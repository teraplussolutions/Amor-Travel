"use client";

import { useEffect, useState } from "react";

export function ScrollButtons() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: "1.25rem",
        bottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        zIndex: 50,
      }}
    >
      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #174698, #0f2d5e)",
          border: "none", cursor: "pointer", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(23,70,152,0.35)",
          transition: "transform 0.2s, opacity 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <button
        aria-label="Scroll to bottom"
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #C9A84C, #a8892e)",
          border: "none", cursor: "pointer", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
          transition: "transform 0.2s, opacity 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(2px)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}
