"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";

const AIRPORTS = [
  // North Macedonia
  { code: "SKP", name: "Скопје / Skopje", country: "Македонија" },
  { code: "OHD", name: "Охрид / Ohrid", country: "Македонија" },
  // Balkans
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
  // Turkey
  { code: "IST", name: "Истанбул / Istanbul", country: "Турција" },
  { code: "SAW", name: "Истанбул Sabiha / Istanbul SAW", country: "Турција" },
  { code: "AYT", name: "Анталија / Antalya", country: "Турција" },
  { code: "ADB", name: "Измир / Izmir", country: "Турција" },
  { code: "DLM", name: "Даламан / Dalaman", country: "Турција" },
  { code: "BJV", name: "Бодрум / Bodrum", country: "Турција" },
  // Middle East & Levant
  { code: "BEY", name: "Бејрут / Beirut", country: "Либан" },
  { code: "AMM", name: "Аман / Amman", country: "Јордан" },
  { code: "TLV", name: "Тел Авив / Tel Aviv", country: "Израел" },
  { code: "DAM", name: "Дамаск / Damascus", country: "Сирија" },
  { code: "BGW", name: "Багдад / Baghdad", country: "Ирак" },
  { code: "DXB", name: "Дубаи / Dubai", country: "ОАЕ" },
  { code: "AUH", name: "Абу Даби / Abu Dhabi", country: "ОАЕ" },
  { code: "SHJ", name: "Шарџа / Sharjah", country: "ОАЕ" },
  { code: "DOH", name: "Доха / Doha", country: "Катар" },
  { code: "KWI", name: "Кувајт / Kuwait City", country: "Кувајт" },
  { code: "RUH", name: "Ријад / Riyadh", country: "Саудиска Арабија" },
  { code: "JED", name: "Џеда / Jeddah", country: "Саудиска Арабија" },
  { code: "BAH", name: "Бахреин / Bahrain", country: "Бахреин" },
  { code: "MCT", name: "Маскат / Muscat", country: "Оман" },
  // North Africa
  { code: "CAI", name: "Каиро / Cairo", country: "Египет" },
  { code: "HRG", name: "Хургада / Hurghada", country: "Египет" },
  { code: "SSH", name: "Шарм ел Шеик / Sharm el-Sheikh", country: "Египет" },
  { code: "LXR", name: "Луксор / Luxor", country: "Египет" },
  { code: "TUN", name: "Тунис / Tunis", country: "Тунизија" },
  { code: "CMN", name: "Казабланка / Casablanca", country: "Мароко" },
  { code: "RAK", name: "Маракеш / Marrakech", country: "Мароко" },
  { code: "ALG", name: "Алжир / Algiers", country: "Алжир" },
  // Western Europe
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
  // Asia
  { code: "BKK", name: "Бангкок / Bangkok", country: "Тајланд" },
  { code: "HKT", name: "Пукет / Phuket", country: "Тајланд" },
  { code: "SIN", name: "Сингапур / Singapore", country: "Сингапур" },
  { code: "KUL", name: "Куала Лумпур / Kuala Lumpur", country: "Малезија" },
  { code: "NRT", name: "Токио / Tokyo Narita", country: "Јапонија" },
  { code: "HND", name: "Токио Ханеда / Tokyo Haneda", country: "Јапонија" },
  // Americas
  { code: "JFK", name: "Њујорк / New York JFK", country: "САД" },
  { code: "LAX", name: "Лос Анџелес / Los Angeles", country: "САД" },
  { code: "MIA", name: "Мајами / Miami", country: "САД" },
  { code: "ORD", name: "Чикаго / Chicago", country: "САД" },
  { code: "YYZ", name: "Торонто / Toronto", country: "Канада" },
  { code: "GRU", name: "Сао Паоло / São Paulo", country: "Бразил" },
];

type Airport = { code: string; name: string; country: string };
type TripType = "roundtrip" | "oneway";
type ResultEngine = "aviasales" | "skyscanner" | "kiwi" | "google";

function AirportInput({
  label, value, onChange, placeholder,
}: {
  label: string; value: Airport | null; onChange: (a: Airport) => void; placeholder: string;
}) {
  const [query, setQuery] = useState(value ? `${value.name.split("/")[1]?.trim() ?? value.name} (${value.code})` : "");
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
                setQuery(`${displayName} (${a.code})`);
                setOpen(false);
              }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
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
  { id: "google", label: "Google Flights", icon: "🌐", color: "#4285F4" },
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
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function fmtAviasalesDate(d: string) {
    if (!d) return "";
    const dt = new Date(d);
    return String(dt.getDate()).padStart(2, "0") + String(dt.getMonth() + 1).padStart(2, "0");
  }

  function buildUrl(eng: ResultEngine): string {
    if (!origin || !dest) return "#";
    const o = origin.code, d2 = dest.code;
    const dep = date, ret = returnDate;

    switch (eng) {
      case "aviasales": {
        const depFmt = fmtAviasalesDate(dep);
        const retFmt = tripType === "roundtrip" && ret ? fmtAviasalesDate(ret) : "";
        const pax = passengers;
        if (tripType === "roundtrip" && retFmt)
          return `https://www.aviasales.com/search/${o}${depFmt}${d2}${retFmt}${pax}`;
        return `https://www.aviasales.com/search/${o}${depFmt}${d2}${pax}`;
      }
      case "skyscanner": {
        const depFmt = dep.replace(/-/g, "");
        const retFmt = tripType === "roundtrip" && ret ? ret.replace(/-/g, "") : "";
        if (tripType === "roundtrip" && retFmt)
          return `https://www.skyscanner.com/transport/flights/${o.toLowerCase()}/${d2.toLowerCase()}/${depFmt}/${retFmt}/`;
        return `https://www.skyscanner.com/transport/flights/${o.toLowerCase()}/${d2.toLowerCase()}/${depFmt}/`;
      }
      case "kiwi": {
        const depFmt = dep ? dep.split("-").reverse().join("/") : "";
        const retFmt = tripType === "roundtrip" && ret ? ret.split("-").reverse().join("/") : "";
        const type = tripType === "oneway" ? "no-return" : "";
        if (tripType === "roundtrip" && retFmt)
          return `https://www.kiwi.com/en/search/results/${o}/${d2}/${depFmt}/${retFmt}`;
        return `https://www.kiwi.com/en/search/results/${o}/${d2}/${depFmt}${type ? `/${type}` : ""}`;
      }
      case "google": {
        const depFmt = dep;
        const retFmt = tripType === "roundtrip" && ret ? ret : "";
        const type = tripType === "oneway" ? "fs" : "r";
        return `https://www.google.com/travel/flights/search?tfs=CBwQARooag0IAhIJL20vMGZneXhfEgoyMDI0LTA3LTE1cgwIAxIIL20vMGtuam8&tfu=CmxDalJJTlVOVlJuTlZXalZ3TjJneVFYcHdiMFk1Unkwdm0ySmtFZ1JHVlU5MFZFY3RZbll4TFRVMExUbHpUM2xaTXkxeVpYWkRhV1F0TVdScFpHRXdNeTFvZVc5Mk1WUkJRbVF3TVJBQ0dBSVNBZ29BEgcIAhIDU0tQGgcIAxIDQkVZ`;
      }
    }
  }

  function handleSearch() {
    if (!origin || !dest || !date) return;
    setIframeBlocked(false);
    setSearched(true);
  }

  const currentUrl = searched ? buildUrl(engine) : "";

  const canSearch = !!(origin && dest && date);

  const inputStyle = {
    width: "100%",
    p