"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";

const AIRPORTS = [
  { code: "SKP", name: "Скопје / Skopje", country: "Македонија" },
  { code: "OHD", name: "Охрид / Ohrid", country: "Македонија" },
  { code: "BEG", name: "Белград / Belgrade", country: "Србија" },
  { code: "TIA", name: "Тирана / Tirana", country: "Албанија" },
  { code: "PRN", name: "Приштина / Pristina", country: "Косово" },
  { code: "SJJ", name: "Сараево / Sarajevo", country: "Босна" },
  { code: "POD", name: "Подгорица / Podgorica", country: "Црна Гора" },
  { code: "SOF", name: "Софија / Sofia", country: "Бугарија" },
  { code: "VAR", name: "Варна / Varna", country: "Бугарија" },
  { code: "BOJ", name: "Бургас / Burgas", country: "Бугарија" },
  { code: "OTP", name: "Букурешт / Bucharest", country: "Романија" },
  { code: "ATH", name: "Атина / Athens", country: "Грција" },
  { code: "SKG", name: "Солун / Thessaloniki", country: "Грција" },
  { code: "HER", name: "Ираклион / Heraklion", country: "Грција" },
  { code: "RHO", name: "Родос / Rhodes", country: "Грција" },
  { code: "CFU", name: "Крф / Corfu", country: "Грција" },
  { code: "DBV", name: "Дубровник / Dubrovnik", country: "Хрватска" },
  { code: "SPU", name: "Сплит / Split", country: "Хрватска" },
  { code: "ZAG", name: "Загреб / Zagreb", country: "Хрватска" },
  { code: "LJU", name: "Љубљана / Ljubljana", country: "Словенија" },
  { code: "IST", name: "Истанбул / Istanbul", country: "Турција" },
  { code: "SAW", name: "Истанбул SAW / Istanbul SAW", country: "Турција" },
  { code: "AYT", name: "Анталија / Antalya", country: "Турција" },
  { code: "ADB", name: "Измир / Izmir", country: "Турција" },
  { code: "DLM", name: "Даламан / Dalaman", country: "Турција" },
  { code: "BJV", name: "Бодрум / Bodrum", country: "Турција" },
  { code: "BEY", name: "Бејрут / Beirut", country: "Либан" },
  { code: "AMM", name: "Аман / Amman", country: "Јордан" },
  { code: "TLV", name: "Тел Авив / Tel Aviv", country: "Израел" },
  { code: "DAM", name: "Дамаск / Damascus", country: "Сирија" },
  { code: "DXB", name: "Дубаи / Dubai", country: "ОАЕ" },
  { code: "AUH", name: "Абу Даби / Abu Dhabi", country: "ОАЕ" },
  { code: "SHJ", name: "Шарџа / Sharjah", country: "ОАЕ" },
  { code: "DOH", name: "Доха / Doha", country: "Катар" },
  { code: "KWI", name: "Кувајт / Kuwait City", country: "Кувајт" },
  { code: "RUH", name: "Ријад / Riyadh", country: "Саудиска Арабија" },
  { code: "JED", name: "Џеда / Jeddah", country: "Саудиска Арабија" },
  { code: "BAH", name: "Бахреин / Bahrain", country: "Бахреин" },
  { code: "MCT", name: "Маскат / Muscat", country: "Оман" },
  { code: "CAI", name: "Каиро / Cairo", country: "Египет" },
  { code: "HRG", name: "Хургада / Hurghada", country: "Египет" },
  { code: "SSH", name: "Шарм ел Шеик / Sharm el-Sheikh", country: "Египет" },
  { code: "LXR", name: "Луксор / Luxor", country: "Египет" },
  { code: "TUN", name: "Тунис / Tunis", country: "Тунизија" },
  { code: "CMN", name: "Казабланка / Casablanca", country: "Мароко" },
  { code: "RAK", name: "Маракеш / Marrakech", country: "Мароко" },
  { code: "ALG", name: "Алжир / Algiers", country: "Алжир" },
  { code: "LHR", name: "Лондон Хитроу / London Heathrow", country: "Велика Британија" },
  { code: "LGW", name: "Лондон Гатвик / London Gatwick", country: "Велика Британија" },
  { code: "CDG", name: "Париз / Paris CDG", country: "Франција" },
  { code: "ORY", name: "Париз Орли / Paris Orly", country: "Франција" },
  { code: "AMS", name: "Амстердам / Amsterdam", country: "Холандија" },
  { code: "FRA", name: "Франкфурт / Frankfurt", country: "Германија" },
  { code: "MUC", name: "Минхен / Munich", country: "Германија" },
  { code: "BER", name: "Берлин / Berlin", country: "Германија" },
  { code: "VIE", name: "Виена / Vienna", country: "Австрија" },
  { code: "ZRH", name: "Цирих / Zurich", country: "Швајцарија" },
  { code: "GVA", name: "Женева / Geneva", country: "Швајцарија" },
  { code: "FCO", name: "Рим / Rome", country: "Италија" },
  { code: "MXP", name: "Милано / Milan Malpensa", country: "Италија" },
  { code: "VCE", name: "Венеција / Venice", country: "Италија" },
  { code: "BCN", name: "Барселона / Barcelona", country: "Шпанија" },
  { code: "MAD", name: "Мадрид / Madrid", country: "Шпанија" },
  { code: "LIS", name: "Лисабон / Lisbon", country: "Португалија" },
  { code: "DUB", name: "Даблин / Dublin", country: "Ирска" },
  { code: "BRU", name: "Брисел / Brussels", country: "Белгија" },
  { code: "CPH", name: "Копенхаген / Copenhagen", country: "Данска" },
  { code: "ARN", name: "Стокхолм / Stockholm", country: "Шведска" },
  { code: "OSL", name: "Осло / Oslo", country: "Норвешка" },
  { code: "HEL", name: "Хелсинки / Helsinki", country: "Финска" },
  { code: "PRG", name: "Прага / Prague", country: "Чешка" },
  { code: "BUD", name: "Будимпешта / Budapest", country: "Унгарија" },
  { code: "WAW", name: "Варшава / Warsaw", country: "Полска" },
  { code: "BKK", name: "Бангкок / Bangkok", country: "Тајланд" },
  { code: "HKT", name: "Пукет / Phuket", country: "Тајланд" },
  { code: "SIN", name: "Сингапур / Singapore", country: "Сингапур" },
  { code: "KUL", name: "Куала Лумпур / Kuala Lumpur", country: "Малезија" },
  { code: "NRT", name: "Токио / Tokyo Narita", country: "Јапонија" },
  { code: "JFK", name: "Њујорк / New York JFK", country: "САД" },
  { code: "LAX", name: "Лос Анџелес / Los Angeles", country: "САД" },
  { code: "MIA", name: "Мајами / Miami", country: "САД" },
  { code: "ORD", name: "Чикаго / Chicago", country: "САД" },
];

type Airport = { code: string; name: string; country: string };
type TripType = "roundtrip" | "oneway";
type ResultEngine = "aviasales" | "skyscanner" | "kiwi";

function AirportInput({ label, value, onChange, placeholder }: {
  label: string; value: Airport | null; onChange: (a: Airport) => void; placeholder: string;
}) {
  const [query, setQuery] = useState(value ? value.code : "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length < 1 ? [] : AIRPORTS.filter((a) =>
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
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </label>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 15, fontWeight: 600, outline: "none", boxSizing: "border-box" }}
      />
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200, background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", marginTop: 4, overflow: "hidden" }}>
          {filtered.map((a) => (
            <button
              key={a.code}
              type="button"
              onClick={() => {
                onChange(a);
                const displayName = a.name.includes("/") ? a.name.split("/")[1].trim() : a.name;
                setQuery(displayName + " (" + a.code + ")");
                setOpen(false);
              }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f1f5ff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
            >
              <span style={{ background: "#174698", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 13, fontWeight: 800, minWidth: 42, textAlign: "center" }}>{a.code}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                  {a.name.includes("/") ? a.name.split("/")[1].trim() : a.name}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.name.includes("/") ? a.name.split("/")[0].trim() : ""}</div>
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto" }}>{a.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ENGINES: { id: ResultEngine; label: string; icon: string; color: string }[] = [
  { id: "aviasales", label: "Aviasales", icon: "✈️", color: "#FF6B35" },
  { id: "skyscanner", label: "Skyscanner", icon: "🔍", color: "#0770E3" },
  { id: "kiwi", label: "Kiwi.com", icon: "🥝", color: "#00B2A1" },
];

export default function SearchPage() {
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [origin, setOrigin] = useState<Airport | null>({ code: "SKP", name: "Скопје / Skopje", country: "Македонија" });
  const [dest, setDest] = useState<Airport | null>(null);
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [engine, setEngine] = useState<ResultEngine>("aviasales");
  const [searched, setSearched] = useState(false);

  function fmtAviasalesDate(d: string) {
    if (!d) return "";
    const dt = new Date(d);
    return String(dt.getDate()).padStart(2, "0") + String(dt.getMonth() + 1).padStart(2, "0");
  }

  function buildUrl(eng: ResultEngine): string {
    if (!origin || !dest) return "#";
    const o = origin.code;
    const d2 = dest.code;
    const pax = passengers;
    if (eng === "aviasales") {
      const depFmt = fmtAviasalesDate(date);
      const retFmt = tripType === "roundtrip" && returnDate ? fmtAviasalesDate(returnDate) : "";
      if (tripType === "roundtrip" && retFmt) {
        return "https://www.aviasales.com/search/" + o + depFmt + d2 + retFmt + pax;
      }
      return "https://www.aviasales.com/search/" + o + depFmt + d2 + pax;
    }
    if (eng === "skyscanner") {
      const depFmt = date.replace(/-/g, "");
      const retFmt = tripType === "roundtrip" && returnDate ? returnDate.replace(/-/g, "") : "";
      if (tripType === "roundtrip" && retFmt) {
        return "https://www.skyscanner.com/transport/flights/" + o.toLowerCase() + "/" + d2.toLowerCase() + "/" + depFmt + "/" + retFmt + "/";
      }
      return "https://www.skyscanner.com/transport/flights/" + o.toLowerCase() + "/" + d2.toLowerCase() + "/" + depFmt + "/";
    }
    if (eng === "kiwi") {
      const depFmt = date ? date.split("-").reverse().join("/") : "";
      const retFmt = tripType === "roundtrip" && returnDate ? returnDate.split("-").reverse().join("/") : "";
      if (tripType === "roundtrip" && retFmt) {
        return "https://www.kiwi.com/en/search/results/" + o + "/" + d2 + "/" + depFmt + "/" + retFmt;
      }
      return "https://www.kiwi.com/en/search/results/" + o + "/" + d2 + "/" + depFmt;
    }
    return "#";
  }

  function handleSearch() {
    if (!origin || !dest || !date) return;
    setSearched(true);
    // Auto-open default engine in new tab since iframes are blocked
    const url = buildUrl("aviasales");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const canSearch = !!(origin && dest && date);
  const currentUrl = searched ? buildUrl(engine) : "";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "2px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Пребарај летови</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Внеси детали — резултатите се прикажуваат директно подолу</p>
      </div>

      {/* Search form */}
      <div style={{ background: "linear-gradient(135deg,#0a1f40,#174698)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, color: "#fff" }}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)", borderRadius: 4, marginBottom: 20 }} />

        {/* Trip type toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {([ ["roundtrip", "↔️ Round Trip"], ["oneway", "→ One Way"] ] as [TripType, string][]).map(([t, lbl]) => (
            <button key={t} onClick={() => setTripType(t)} style={{ padding: "7px 18px", borderRadius: 20, border: "2px solid", borderColor: tripType === t ? "#C9A84C" : "rgba(255,255,255,0.25)", background: tripType === t ? "rgba(201,168,76,0.25)" : "transparent", color: tripType === t ? "#C9A84C" : "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {lbl}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Патници</label>
            <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} style={{ ...inputStyle, width: 70, padding: "7px 10px" }}>
              {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: tripType === "roundtrip" ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", gap: 12, alignItems: "end", marginBottom: 18 }}>
          <AirportInput label="Од" value={origin} onChange={setOrigin} placeholder="Скопје (SKP)" />
          <AirportInput label="До" value={dest} onChange={setDest} placeholder="Напиши град или код..." />
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Поаѓање</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          {tripType === "roundtrip" && (
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Враќање</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} min={date} style={inputStyle} />
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={!canSearch}
          style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: canSearch ? "linear-gradient(135deg,#C9A84C,#a8883a)" : "rgba(255,255,255,0.15)", color: canSearch ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 800, fontSize: 16, cursor: canSearch ? "pointer" : "not-allowed" }}
        >
          {canSearch ? "✈️  Прикажи достапни летови" : "Внеси дестинација и датум за да пребараш"}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {/* Engine tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {ENGINES.map((eng) => (
              <button key={eng.id} onClick={() => setEngine(eng.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 12, border: "2px solid", borderColor: engine === eng.id ? eng.color : "#e2e8f0", background: engine === eng.id ? eng.color + "15" : "#fff", color: engine === eng.id ? eng.color : "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                <span>{eng.icon}</span><span>{eng.label}</span>
              </button>
            ))}
            <a href={currentUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 12, border: "2px solid #174698", background: "#174698", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", marginLeft: "auto" }}>
              Отвори во нов таб ↗
            </a>
          </div>

          {/* Summary */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 16px", marginBottom: 12, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", border: "1px solid #e2e8f0" }}>
            <span style={{ fontWeight: 800, color: "#174698", fontSize: 15 }}>{origin?.code} → {dest?.code}{tripType === "roundtrip" && returnDate ? " → " + origin?.code : ""}</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>📅 {date}{tripType === "roundtrip" && returnDate ? " — " + returnDate : ""}</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>👤 {passengers} патник{passengers > 1 ? "а" : ""}</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{tripType === "roundtrip" ? "↔️ Round Trip" : "→ One Way"}</span>
          </div>

          {/* Launch buttons - iframes blocked by booking sites */}
          <div style={{ background: "#fff", borderRadius: 16, border: "2px solid #e2e8f0", padding: 28 }}>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20, textAlign: "center" }}>
              ✅ Search ready — click a platform below to view results in a new tab:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {ENGINES.map((eng) => (
                <a
                  key={eng.id}
                  href={buildUrl(eng.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 14, background: eng.color + "10", border: "2px solid " + eng.color + "40", textDecoration: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = eng.color + "20"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = eng.color + "10"; }}
                >
                  <span style={{ fontSize: 28 }}>{eng.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: eng.color, fontSize: 16 }}>{eng.label}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Open results ↗</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick links */}
      {!searched && (
        <>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Брзи врски</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
            {[
              { label: "Aviasales", url: "https://www.aviasales.com", desc: "Најниски цени", icon: "✈️", color: "#FF6B35" },
              { label: "Skyscanner", url: "https://www.skyscanner.com", desc: "Споредба на авиокомпании", icon: "🔍", color: "#0770E3" },
              { label: "Kiwi.com", url: "https://www.kiwi.com", desc: "Комбинирани рути", icon: "🥝", color: "#00B2A1" },
              { label: "Booking.com", url: "https://www.booking.com", desc: "Хотели и сместување", icon: "🏨", color: "#003580" },
              { label: "Turkish Airlines", url: "https://www.turkishairlines.com", desc: "Хаб преку Истанбул", icon: "🔴", color: "#e81932" },
              { label: "Wizz Air", url: "https://wizzair.com", desc: "Нискобуџетни летови", icon: "🟣", color: "#c6006f" },
              { label: "Ryanair", url: "https://www.ryanair.com", desc: "Нискобуџетни ЕУ летови", icon: "🟡", color: "#073590" },
              { label: "TripAdvisor", url: "https://www.tripadvisor.com", desc: "Рецензии и препораки", icon: "⭐", color: "#34e0a1" },
            ].map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff", borderRadius: 14, textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid " + l.color + "25" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "none"; }}
              >
                <span style={{ fontSize: 22 }}>{l.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: l.color, fontSize: 14 }}>{l.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
