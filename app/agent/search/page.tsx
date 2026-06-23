"use client";

import { useState, useRef, useEffect } from "react";
import { useStaffLang } from "@/components/StaffLangContext";

// Major airports with IATA codes — typed to get autocomplete
const AIRPORTS = [
  { code: "SKP", name: "Skopje", country: "North Macedonia" },
  { code: "OHD", name: "Ohrid", country: "North Macedonia" },
  { code: "BCN", name: "Barcelona", country: "Spain" },
  { code: "MAD", name: "Madrid", country: "Spain" },
  { code: "LHR", name: "London Heathrow", country: "UK" },
  { code: "LGW", name: "London Gatwick", country: "UK" },
  { code: "STN", name: "London Stansted", country: "UK" },
  { code: "CDG", name: "Paris Charles de Gaulle", country: "France" },
  { code: "ORY", name: "Paris Orly", country: "France" },
  { code: "AMS", name: "Amsterdam Schiphol", country: "Netherlands" },
  { code: "FRA", name: "Frankfurt", country: "Germany" },
  { code: "MUC", name: "Munich", country: "Germany" },
  { code: "BER", name: "Berlin Brandenburg", country: "Germany" },
  { code: "DUS", name: "Düsseldorf", country: "Germany" },
  { code: "HAM", name: "Hamburg", country: "Germany" },
  { code: "VIE", name: "Vienna", country: "Austria" },
  { code: "ZRH", name: "Zurich", country: "Switzerland" },
  { code: "GVA", name: "Geneva", country: "Switzerland" },
  { code: "FCO", name: "Rome Fiumicino", country: "Italy" },
  { code: "MXP", name: "Milan Malpensa", country: "Italy" },
  { code: "LIN", name: "Milan Linate", country: "Italy" },
  { code: "VCE", name: "Venice", country: "Italy" },
  { code: "ATH", name: "Athens", country: "Greece" },
  { code: "SKG", name: "Thessaloniki", country: "Greece" },
  { code: "HER", name: "Heraklion (Crete)", country: "Greece" },
  { code: "RHO", name: "Rhodes", country: "Greece" },
  { code: "CFU", name: "Corfu", country: "Greece" },
  { code: "BEG", name: "Belgrade", country: "Serbia" },
  { code: "SOF", name: "Sofia", country: "Bulgaria" },
  { code: "VAR", name: "Varna", country: "Bulgaria" },
  { code: "BOJ", name: "Burgas", country: "Bulgaria" },
  { code: "TIA", name: "Tirana", country: "Albania" },
  { code: "DBV", name: "Dubrovnik", country: "Croatia" },
  { code: "SPU", name: "Split", country: "Croatia" },
  { code: "ZAG", name: "Zagreb", country: "Croatia" },
  { code: "IST", name: "Istanbul", country: "Turkey" },
  { code: "SAW", name: "Istanbul Sabiha Gökçen", country: "Turkey" },
  { code: "AYT", name: "Antalya", country: "Turkey" },
  { code: "ADB", name: "Izmir", country: "Turkey" },
  { code: "DLM", name: "Dalaman", country: "Turkey" },
  { code: "BJV", name: "Bodrum", country: "Turkey" },
  { code: "DXB", name: "Dubai", country: "UAE" },
  { code: "AUH", name: "Abu Dhabi", country: "UAE" },
  { code: "DOH", name: "Doha", country: "Qatar" },
  { code: "CAI", name: "Cairo", country: "Egypt" },
  { code: "HRG", name: "Hurghada", country: "Egypt" },
  { code: "SSH", name: "Sharm el-Sheikh", country: "Egypt" },
  { code: "CMN", name: "Casablanca", country: "Morocco" },
  { code: "RAK", name: "Marrakech", country: "Morocco" },
  { code: "TUN", name: "Tunis", country: "Tunisia" },
  { code: "JFK", name: "New York JFK", country: "USA" },
  { code: "LAX", name: "Los Angeles", country: "USA" },
  { code: "ORD", name: "Chicago O'Hare", country: "USA" },
  { code: "MIA", name: "Miami", country: "USA" },
  { code: "BKK", name: "Bangkok Suvarnabhumi", country: "Thailand" },
  { code: "DMK", name: "Bangkok Don Mueang", country: "Thailand" },
  { code: "HKT", name: "Phuket", country: "Thailand" },
  { code: "KUL", name: "Kuala Lumpur", country: "Malaysia" },
  { code: "SIN", name: "Singapore Changi", country: "Singapore" },
  { code: "NRT", name: "Tokyo Narita", country: "Japan" },
  { code: "HND", name: "Tokyo Haneda", country: "Japan" },
  { code: "PRG", name: "Prague", country: "Czech Republic" },
  { code: "BUD", name: "Budapest", country: "Hungary" },
  { code: "WAW", name: "Warsaw", country: "Poland" },
  { code: "KRK", name: "Krakow", country: "Poland" },
  { code: "BRU", name: "Brussels", country: "Belgium" },
  { code: "CPH", name: "Copenhagen", country: "Denmark" },
  { code: "ARN", name: "Stockholm Arlanda", country: "Sweden" },
  { code: "OSL", name: "Oslo", country: "Norway" },
  { code: "HEL", name: "Helsinki", country: "Finland" },
  { code: "LIS", name: "Lisbon", country: "Portugal" },
  { code: "OPO", name: "Porto", country: "Portugal" },
  { code: "DUB", name: "Dublin", country: "Ireland" },
  { code: "OTP", name: "Bucharest", country: "Romania" },
  { code: "KIV", name: "Chișinău", country: "Moldova" },
  { code: "EVN", name: "Yerevan", country: "Armenia" },
  { code: "TBS", name: "Tbilisi", country: "Georgia" },
  { code: "GYD", name: "Baku", country: "Azerbaijan" },
  { code: "LJU", name: "Ljubljana", country: "Slovenia" },
  { code: "POD", name: "Podgorica", country: "Montenegro" },
  { code: "TGD", name: "Podgorica (TGD)", country: "Montenegro" },
  { code: "SJJ", name: "Sarajevo", country: "Bosnia" },
  { code: "PRN", name: "Pristina", country: "Kosovo" },
];

type Airport = { code: string; name: string; country: string };

function AirportInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: Airport | null;
  onChange: (a: Airport) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState(value ? `${value.name} (${value.code})` : "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length < 1
    ? []
    : AIRPORTS.filter((a) =>
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </label>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 15, fontWeight: 600, outline: "none", boxSizing: "border-box" }}
      />
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", marginTop: 4, overflow: "hidden" }}>
          {filtered.map((a) => (
            <button
              key={a.code}
              type="button"
              onClick={() => {
                onChange(a);
                setQuery(`${a.name} (${a.code})`);
                setOpen(false);
              }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <span style={{ background: "#174698", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 13, fontWeight: 800, minWidth: 42, textAlign: "center" }}>{a.code}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{a.name}</span>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto" }}>{a.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const { lang } = useStaffLang();
  const mk = lang === "mk";
  const [origin, setOrigin] = useState<Airport | null>({ code: "SKP", name: "Skopje", country: "North Macedonia" });
  const [dest, setDest] = useState<Airport | null>(null);
  const [date, setDate] = useState("");

  // Build Aviasales deep link: /search/SKPBCN1507241
  function buildAviasalesUrl() {
    if (!origin || !dest) return "https://www.aviasales.com";
    let dateStr = "";
    if (date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      dateStr = day + month;
    }
    return `https://www.aviasales.com/search/${origin.code}${dateStr}${dest.code}1`;
  }

  // Build Skyscanner deep link
  function buildSkyscannerUrl() {
    if (!origin || !dest) return "https://www.skyscanner.com";
    const dateStr = date ? date.replace(/-/g, "") : "";
    return `https://www.skyscanner.com/transport/flights/${origin.code.toLowerCase()}/${dest.code.toLowerCase()}/${dateStr}/`;
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>{mk ? "Пребарај летови и патувања" : "Flight & Travel Search"}</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{mk ? "Внеси град или IATA код за да пребараш" : "Type a city or IATA code to search — links open directly on the booking site"}</p>
      </div>

      {/* Quick search */}
      <div style={{ background: "linear-gradient(135deg,#0f2d5e,#174698)", borderRadius: 20, padding: "28px 32px", marginBottom: 32, color: "#fff" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)", borderRadius: 4, marginBottom: 20 }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#C9A84C", marginBottom: 16 }}>{mk ? "✈️ Брзо пребарување летови" : "✈️ Quick Flight Search"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
          <AirportInput
            label={mk ? "Од" : "From"}
            value={origin}
            onChange={setOrigin}
            placeholder="Skopje (SKP)"
          />
          <AirportInput
            label={mk ? "До" : "To"}
            value={dest}
            onChange={setDest}
            placeholder="Type city or code..."
          />
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{mk ? "Датум" : "Date"}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href={buildAviasalesUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg,#C9A84C,#a8883a)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", textDecoration: "none", textAlign: "center" }}
          >
            {mk ? "Пребарај на Aviasales ✈️" : "Search on Aviasales ✈️"}
          </a>
          <a
            href={buildSkyscannerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, padding: "12px 24px", borderRadius: 12, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none", textAlign: "center", border: "2px solid rgba(255,255,255,0.3)" }}
          >
            {mk ? "Пребарај на Skyscanner 🔍" : "Search on Skyscanner 🔍"}
          </a>
        </div>
      </div>

      {/* Quick links grid */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>{mk ? "Платформи за резервации" : "Booking Platforms"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        {QUICK_LINKS.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", background: "#fff", borderRadius: 14, textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0", transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(23,70,152,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
          >
            <span style={{ fontSize: 24 }}>{l.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: "#174698", fontSize: 14 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
