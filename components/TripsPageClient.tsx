"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { convertEurMkd, formatDualCurrency } from "@/lib/currency";
import type { ImportedTrip } from "@/lib/trips/types";

type TripsPageClientProps = {
  trips: ImportedTrip[];
  locale: "mk" | "en";
  emptyLabel: string;
  detailsLabel: string;
};

type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

export function TripsPageClient({ trips, locale, emptyLabel, detailsLabel }: TripsPageClientProps) {
  const isEn = locale === "en";
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [destination, setDestination] = useState("");

  // Build unique destination list
  const destinations = useMemo(() => {
    const set = new Set<string>();
    trips.forEach((t) => {
      const d = isEn ? (t.destination_en || t.destination_mk) : t.destination_mk;
      if (d) set.add(d);
    });
    return Array.from(set).sort();
  }, [trips, isEn]);

  const filtered = useMemo(() => {
    let list = [...trips];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => {
        const title = (isEn ? (t.title_en || t.title_mk) : t.title_mk) ?? "";
        const dest = (isEn ? (t.destination_en || t.destination_mk) : t.destination_mk) ?? "";
        return title.toLowerCase().includes(q) || dest.toLowerCase().includes(q);
      });
    }

    // Destination filter
    if (destination) {
      list = list.filter((t) => {
        const dest = isEn ? (t.destination_en || t.destination_mk) : t.destination_mk;
        return dest === destination;
      });
    }

    // Date from
    if (dateFrom) {
      list = list.filter((t) => !t.departure_date || t.departure_date >= dateFrom);
    }

    // Date to
    if (dateTo) {
      list = list.filter((t) => !t.return_date || t.return_date <= dateTo);
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "newest") {
        return (b.departure_date ?? "").localeCompare(a.departure_date ?? "");
      }
      if (sort === "oldest") {
        return (a.departure_date ?? "").localeCompare(b.departure_date ?? "");
      }
      if (sort === "price_asc") {
        return (a.price_early_eur ?? 0) - (b.price_early_eur ?? 0);
      }
      if (sort === "price_desc") {
        return (b.price_early_eur ?? 0) - (a.price_early_eur ?? 0);
      }
      return 0;
    });

    return list;
  }, [trips, search, destination, dateFrom, dateTo, sort, isEn]);

  const hasFilters = search || destination || dateFrom || dateTo || sort !== "newest";

  function clearFilters() {
    setSearch("");
    setDestination("");
    setDateFrom("");
    setDateTo("");
    setSort("newest");
  }

  const inputStyle = {
    borderColor: "rgba(23,70,152,0.2)",
    background: "white",
  };

  const inputClass =
    "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-amor-blue/20";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
      {/* Filter bar */}
      <div
        className="mb-10 rounded-2xl p-6"
        style={{ background: "var(--amor-soft)", boxShadow: "0 2px 16px rgba(23,70,152,0.06)" }}
      >
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="mb-1 flex w-full items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--amor-blue)" }} aria-hidden>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span className="text-base font-bold" style={{ color: "var(--amor-blue)" }}>
              {isEn ? "Search & Filter" : "Пребарување и Филтер"}
            </span>
            {hasFilters && !filtersOpen && (
              <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: "var(--amor-red)", color: "#fff" }}>
                {isEn ? "active" : "активен"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                className="text-sm font-medium text-amor-red underline underline-offset-2 hover:opacity-70"
              >
                {isEn ? "Clear" : "Исчисти"}
              </button>
            )}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--amor-blue)", transform: filtersOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} aria-hidden>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </button>

        {/* Collapsible: search + destination + dates */}
        {filtersOpen && (
          <div className="grid gap-4 pt-4 pb-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                {isEn ? "Search" : "Пребарај"}
              </label>
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amor-blue/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isEn ? "Destination or trip name…" : "Дестинација или наслов…"}
                  className={inputClass + " pl-9"}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                {isEn ? "Destination" : "Дестинација"}
              </label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">{isEn ? "All destinations" : "Сите дестинации"}</option>
                {destinations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                {isEn ? "Departure from" : "Поаѓање од"}
              </label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} style={inputStyle} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                {isEn ? "Return by" : "Враќање до"}
              </label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
        )}

        {/* Sort — always visible */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-blue)" }}>
            {isEn ? "Sort:" : "Сортирај:"}
          </span>
          {(
            [
              { key: "newest", labelEn: "Newest first", labelMk: "Најнови" },
              { key: "oldest", labelEn: "Oldest first", labelMk: "Најстари" },
              { key: "price_asc", labelEn: "Price ↑", labelMk: "Цена ↑" },
              { key: "price_desc", labelEn: "Price ↓", labelMk: "Цена ↓" },
            ] as { key: SortOption; labelEn: string; labelMk: string }[]
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSort(opt.key)}
              className="rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200"
              style={
                sort === opt.key
                  ? { background: "var(--amor-blue)", color: "white", boxShadow: "0 2px 8px rgba(23,70,152,0.25)" }
                  : { background: "white", color: "var(--amor-blue)", border: "1px solid rgba(23,70,152,0.2)" }
              }
            >
              {isEn ? opt.labelEn : opt.labelMk}
            </button>
          ))}
          <span className="ml-auto text-xs text-amor-text/50">
            {filtered.length} {isEn ? "trips" : "патувања"}
          </span>
        </div>
      </div>

            {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-amor-blue/30" aria-hidden>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p className="text-lg font-medium text-amor-text/60">{emptyLabel}</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-sm text-amor-blue underline">
              {isEn ? "Clear filters" : "Исчисти филтри"}
            </button>
          )}
        </div>
      ) : (
        <ul className="trip-grid">
          {filtered.map((trip) => {
            const price =
              trip.price_early_eur != null
                ? formatDualCurrency(convertEurMkd(trip.price_early_eur, "EUR"), { locale })
                : null;
            const title = (isEn ? (trip.title_en || trip.title_mk) : trip.title_mk) ?? trip.slug;
            const dest = (isEn ? (trip.destination_en || trip.destination_mk) : trip.destination_mk) ?? "";

            return (
              <li
                key={trip.slug}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: "0 4px 24px rgba(23,70,152,0.08)" }}
              >
                {trip.hero_image ? (
                  <Link href={`/trips/${trip.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-amor-soft">
                    <Image
                      src={trip.hero_image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
                    {price && (
                      <div
                        className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-sm font-bold text-white"
                        style={{ background: "linear-gradient(135deg, var(--amor-gold), #a8883a)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                      >
                        {price}
                      </div>
                    )}
                  </Link>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-amor-soft px-4 text-center text-base font-medium text-amor-blue">
                    {dest}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 className="font-bold leading-snug" style={{ color: "var(--amor-blue)", fontSize: "1.05rem" }}>
                    {title}
                  </h2>
                  {dest && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-amor-text/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {dest}
                    </p>
                  )}
                  {trip.departure_date && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-amor-text/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {trip.departure_date}{trip.return_date ? ` — ${trip.return_date}` : ""}
                    </p>
                  )}
                  {!trip.hero_image && price && (
                    <p className="mt-3 text-lg font-bold" style={{ color: "var(--amor-gold)" }}>{price}</p>
                  )}
                  <div className="my-4 h-px w-12" style={{ background: "linear-gradient(90deg, var(--amor-gold), transparent)" }} />
                  <Link
                    href={`/trips/${trip.slug}`}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg, var(--amor-blue), #0f2d5e)", color: "#ffffff" }}
                  >
                    {detailsLabel}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
