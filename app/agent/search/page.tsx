"use client";

import { useState } from "react";

const QUICK_LINKS = [
  { label: "Aviasales", url: "https://www.aviasales.com", desc: "Best price flight search", icon: "✈️" },
  { label: "Booking.com", url: "https://www.booking.com", desc: "Hotels & accommodation", icon: "🏨" },
  { label: "Skyscanner", url: "https://www.skyscanner.com", desc: "Compare all airlines", icon: "🔍" },
  { label: "Airbnb", url: "https://www.airbnb.com", desc: "Unique stays worldwide", icon: "🏠" },
  { label: "TripAdvisor", url: "https://www.tripadvisor.com", desc: "Reviews & recommendations", icon: "⭐" },
  { label: "Ryanair", url: "https://www.ryanair.com", desc: "Low-cost EU flights", icon: "🟡" },
  { label: "Wizzair", url: "https://wizzair.com", desc: "Budget carrier, Balkans", icon: "🟣" },
  { label: "Turkish Airlines", url: "https://www.turkishairlines.com", desc: "Hub flights via IST", icon: "🔴" },
];

export default function SearchPage() {
  const [origin, setOrigin] = useState("SKP");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");

  const aviasalesUrl = dest
    ? `https://www.aviasales.com/search/${origin}${date ? date.replace(/-/g, "").slice(4) + date.replace(/-/g, "").slice(2, 4) : ""}${dest}1`
    : "https://www.aviasales.com";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Flight & Travel Search</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Quick access to search tools — links open in a new tab</p>
      </div>

      {/* Quick search */}
      <div style={{ background: "linear-gradient(135deg,#0f2d5e,#174698)", borderRadius: 20, padding: "28px 32px", marginBottom: 32, color: "#fff" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)", borderRadius: 4, marginBottom: 20 }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#C9A84C", marginBottom: 16 }}>✈️ Quick Aviasales Search</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: 12, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>From (IATA)</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase().slice(0, 3))}
              placeholder="SKP"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 16, fontWeight: 700, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>To (IATA)</label>
            <input
              value={dest}
              onChange={(e) => setDest(e.target.value.toUpperCase().slice(0, 3))}
              placeholder="BCN"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 16, fontWeight: 700, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none" }}
            />
          </div>
          <a
            href={aviasalesUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#C9A84C,#a8883a)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", textDecoration: "none", display: "inline-block", whiteSpace: "nowrap" }}
          >Search ✈️</a>
        </div>
      </div>

      {/* Quick links grid */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Booking Platforms</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        {QUICK_LINKS.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div
              style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px rgba(23,70,152,0.07)", borderLeft: "4px solid #174698", transition: "transform 0.15s,box-shadow 0.15s", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(23,70,152,0.14)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(23,70,152,0.07)"; }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{l.icon}</div>
              <div style={{ fontWeight: 700, color: "#174698", fontSize: "0.95rem" }}>{l.label}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{l.desc}</div>
              <div style={{ fontSize: 11, color: "#C9A84C", marginTop: 8 }}>Open ↗</div>
            </div>
          </a>
        ))}
      </div>

      {/* IATA quick reference */}
      <div style={{ marginTop: 32, background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(23,70,152,0.07)" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#174698", marginBottom: 14 }}>🗺️ Common IATA Codes (Balkans & Nearby)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            ["SKP","Skopje"],["BEG","Belgrade"],["ZAG","Zagreb"],["SOF","Sofia"],
            ["TIA","Tirana"],["OHD","Ohrid"],["IST","Istanbul"],["VIE","Vienna"],
            ["MUC","Munich"],["FCO","Rome"],["BCN","Barcelona"],["CDG","Paris"],
            ["LHR","London"],["AMS","Amsterdam"],["DXB","Dubai"],["ATH","Athens"],
          ].map(([code, city]) => (
            <div key={code} style={{ background: "#f8fafc", borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: "#174698", fontFamily: "monospace" }}>{code}</span>
              <span style={{ color: "#64748b", marginLeft: 4 }}>{city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
