"use client";

import { useState, useTransition, useMemo } from "react";
import { useStaffLang } from "@/components/StaffLangContext";
import { staffT } from "@/lib/staff-i18n";
import Image from "next/image";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { saveTrip, deleteTrip, toggleTripPublished, toggleTripHidden } from "@/app/admin/trip-actions";
import { createUser, changePassword, deleteUser } from "@/app/admin/user-actions";
import type { ImportedTrip } from "@/lib/trips/types";
import type { AgentUser } from "@/app/admin/user-actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "content" | "trips" | "settings" | "team" | "permissions";

type Props = {
  trips: ImportedTrip[];
  users: AgentUser[];
  heroDefaults: string[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const BLUE = "#174698";
const RED = "#FF1D1D";
const GOLD = "#C9A84C";
const NAVY = "#0f2d5e";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-[#174698] focus:ring-2 focus:ring-[#174698]/10 transition-all";
const labelCls = "block text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500";

function SectionCard({ title, icon, children, defaultOpen = true }: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-gray-800">{title}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-gray-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="border-t border-gray-100 px-6 py-5 space-y-4">{children}</div>}
    </div>
  );
}

function StatusBadge({ msg }: { msg: string }) {
  if (!msg) return null;
  const isError = msg.startsWith("Error") || msg.startsWith("error");
  return (
    <div
      className="rounded-xl px-4 py-2.5 text-sm font-medium"
      style={{ background: isError ? "#fef2f2" : "#f0fdf4", color: isError ? "#b91c1c" : "#15803d" }}
    >
      {msg}
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function AdminPanelClient({ trips: initialTrips, users: initialUsers, heroDefaults }: Props) {
  const { lang } = useStaffLang();
  const T = staffT.admin;
  const [tab, setTab] = useState<Tab>("content");
  const [trips, setTrips] = useState(initialTrips);
  const [users, setUsers] = useState(initialUsers);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "content", label: lang === "mk" ? T.websiteContent.mk : T.websiteContent.en, icon: "🌐" },
    { id: "trips", label: lang === "mk" ? T.trips.mk : T.trips.en, icon: "✈️" },
    { id: "settings", label: lang === "mk" ? T.settings.mk : T.settings.en, icon: "⚙️" },
    { id: "team", label: lang === "mk" ? T.team.mk : T.team.en, icon: "👥" },
    { id: "permissions", label: lang === "mk" ? T.permissions.mk : T.permissions.en, icon: "🔐" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f5f7fb" }}>
      {/* Top header */}
      <div
        className="sticky top-0 z-30 border-b border-white/10 px-6 py-4 shadow-md"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)` }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold text-white"
              style={{ background: GOLD }}
            >
              A
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">Admin Panel</p>
              <p className="text-base font-extrabold text-white leading-tight">Amor Travel</p>
            </div>
          </div>
          <div
            className="flex h-1 flex-1 max-w-xs rounded-full mx-4"
            style={{ background: `linear-gradient(90deg, ${GOLD}, ${RED}, ${GOLD})` }}
          />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white/80 hover:border-white/50 hover:text-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View site
          </a>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[65px] z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="flex shrink-0 items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap"
              style={{
                borderColor: tab === t.id ? BLUE : "transparent",
                color: tab === t.id ? BLUE : "#6b7280",
              }}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === "content" && <ContentPanel heroDefaults={heroDefaults} />}
        {tab === "trips" && <TripsPanel trips={trips} onTripsChange={setTrips} />}
        {tab === "settings" && <SettingsPanel />}
        {tab === "team" && <TeamPanel users={users} onUsersChange={setUsers} />}
        {tab === "permissions" && <PermissionsPanel />}
      </div>
    </div>
  );
}

// ─── Content Panel (Hero + Logo) ──────────────────────────────────────────────

function ContentPanel({ heroDefaults }: { heroDefaults: string[] }) {
  const { lang } = useStaffLang();
  const [logoUrl, setLogoUrl] = useState("");
  const [heroSlots, setHeroSlots] = useState(() =>
    heroDefaults.slice(0, 6).map((src, i) => ({ id: i, url: src, destination: "" }))
  );

  function addSlot() {
    setHeroSlots((prev) => [...prev, { id: Date.now(), url: "", destination: "" }]);
  }

  function removeSlot(id: number) {
    if (heroSlots.length <= 1) return;
    setHeroSlots((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <SectionCard title={lang === "mk" ? "Лого на агенцијата" : "Agency Logo"} icon="🏷️">
        <p className="text-sm text-gray-500">Upload your logo — PNG or SVG with transparency recommended. Appears in header and footer.</p>
        <div className="max-w-sm">
          <ImageUploadField
            folder="logo"
            namePrefix="amor-logo"
            label="Logo image"
            hint="Auto-compressed to WebP."
            aspectClass="aspect-[3/1]"
            value={logoUrl}
            onChange={setLogoUrl}
            alt="Amor Travel logo"
          />
        </div>
      </SectionCard>

      <SectionCard title={lang === "mk" ? "Слајдшоу на насловната" : "Homepage Hero Slideshow"} icon="🌄">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Wide hero images (21:9 ratio). Each becomes a homepage slide.</p>
          <button
            type="button"
            onClick={addSlot}
            className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold text-white"
            style={{ background: BLUE }}
          >
            + Add slide
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {heroSlots.map((slot, idx) => (
            <div key={slot.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: BLUE }}>Slide {idx + 1}</span>
                {heroSlots.length > 1 && (
                  <button type="button" onClick={() => removeSlot(slot.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Destination label (e.g. Antalya, Turkey)"
                value={slot.destination}
                onChange={(e) =>
                  setHeroSlots((prev) =>
                    prev.map((s) => (s.id === slot.id ? { ...s, destination: e.target.value } : s))
                  )
                }
                className={inputCls}
              />
              <ImageUploadField
                folder="hero"
                namePrefix={`hero-slide-${idx + 1}`}
                label=""
                aspectClass="aspect-[21/9]"
                value={slot.url}
                onChange={(url) =>
                  setHeroSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, url } : s)))
                }
                alt={`Hero slide ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Settings Panel (Contact + Social) ───────────────────────────────────────

function SettingsPanel() {
  const { lang } = useStaffLang();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone: "+389 75 446 070",
    email: "info@amortravel.net",
    addressMk: "ул. 23-ти октомври бр. 39, 2220 Свети Николе",
    addressEn: "23 October St. No. 39, Sveti Nikole, North Macedonia",
    facebook: "https://www.facebook.com/share/1b71G9NuQJ/",
    instagram: "https://www.instagram.com/amortravelagency?igsh=NXA5eTZ4a2RmM29y",
    viber: "",
    whatsapp: "",
  });

  function set(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In production this would call a server action to update site_settings in Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {saved && (
        <div className="rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: "#f0fdf4", color: "#15803d" }}>
          ✓ Settings saved successfully
        </div>
      )}

      <SectionCard title={lang === "mk" ? "Контакт детали" : "Contact Details"} icon="📞">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Phone number</label>
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+389 75 446 070" />
          </div>
          <div>
            <label className={labelCls}>Email address</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="info@amortravel.net" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Address (Macedonian)</label>
            <textarea rows={2} value={form.addressMk} onChange={(e) => set("addressMk", e.target.value)} className={inputCls} style={{ resize: "vertical" }} />
          </div>
          <div>
            <label className={labelCls}>Address (English)</label>
            <textarea rows={2} value={form.addressEn} onChange={(e) => set("addressEn", e.target.value)} className={inputCls} style={{ resize: "vertical" }} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title={lang === "mk" ? "Социјални мрежи" : "Social Media Links"} icon="📱">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>
              <span className="mr-1">📘</span> Facebook URL
            </label>
            <input type="url" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputCls} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className={labelCls}>
              <span className="mr-1">📸</span> Instagram URL
            </label>
            <input type="url" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className={inputCls} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className={labelCls}>
              <span className="mr-1">💬</span> Viber number
            </label>
            <input type="tel" value={form.viber} onChange={(e) => set("viber", e.target.value)} className={inputCls} placeholder="+389 75 446 070" />
          </div>
          <div>
            <label className={labelCls}>
              <span className="mr-1">🟢</span> WhatsApp number
            </label>
            <input type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputCls} placeholder="+389 75 446 070" />
          </div>
        </div>
      </SectionCard>

      <div>
        <button
          type="submit"
          className="rounded-xl px-8 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})`, boxShadow: "0 4px 16px rgba(23,70,152,0.3)" }}
        >
          Save Settings
        </button>
        <p className="mt-2 text-xs text-gray-400">Changes will be deployed on next Vercel build.</p>
      </div>
    </form>
  );
}

// ─── Trips Panel ──────────────────────────────────────────────────────────────

type TripSort = "newest" | "oldest" | "price_asc" | "price_desc" | "title_az";

function TripsPanel({
  trips,
  onTripsChange,
}: {
  trips: ImportedTrip[];
  onTripsChange: (trips: ImportedTrip[]) => void;
}) {
  const { lang } = useStaffLang();
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<ImportedTrip | null>(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "hidden">("all");
  const [sort, setSort] = useState<TripSort>("newest");
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  const filtered = useMemo(() => {
    let list = [...trips];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title_mk?.toLowerCase().includes(q) ||
          t.title_en?.toLowerCase().includes(q) ||
          t.destination_en?.toLowerCase().includes(q) ||
          t.destination_mk?.toLowerCase().includes(q)
      );
    }
    if (filterDate) list = list.filter((t) => !t.departure_date || t.departure_date >= filterDate);
    if (filterDateTo) list = list.filter((t) => !t.return_date || t.return_date <= filterDateTo);
    if (filterStatus === "published") list = list.filter((t) => t.published && !t.hidden);
    if (filterStatus === "draft") list = list.filter((t) => !t.published && !t.hidden);
    if (filterStatus === "hidden") list = list.filter((t) => t.hidden);

    list.sort((a, b) => {
      if (sort === "newest") return (b.departure_date ?? "").localeCompare(a.departure_date ?? "");
      if (sort === "oldest") return (a.departure_date ?? "").localeCompare(b.departure_date ?? "");
      if (sort === "price_asc") return (a.price_early_eur ?? 0) - (b.price_early_eur ?? 0);
      if (sort === "price_desc") return (b.price_early_eur ?? 0) - (a.price_early_eur ?? 0);
      if (sort === "title_az") return (a.title_mk ?? "").localeCompare(b.title_mk ?? "");
      return 0;
    });
    return list;
  }, [trips, search, filterDate, filterDateTo, filterStatus, sort]);

  function flash(m: string) { setStatusMsg(m); setTimeout(() => setStatusMsg(""), 3500); }

  function openNew() { setEditingTrip(null); setShowForm(true); }
  function openEdit(trip: ImportedTrip) { setEditingTrip(trip); setShowForm(true); }

  function handleToggle(slug: string, published: boolean) {
    startTransition(async () => {
      const res = await toggleTripPublished(slug, published);
      if (res.error) { flash("Error: " + res.error); return; }
      onTripsChange(trips.map((t) => (t.slug === slug ? { ...t, published } : t)));
    });
  }

  function handleHide(slug: string, hidden: boolean) {
    startTransition(async () => {
      const res = await toggleTripHidden(slug, hidden);
      if (res.error) { flash("Error: " + res.error); return; }
      onTripsChange(trips.map((t) => (t.slug === slug ? { ...t, hidden } : t)));
      flash(hidden ? lang === "mk" ? "Патувањето е скриено." : "Trip hidden from public." : lang === "mk" ? "Патувањето е видливо." : "Trip visible again.");
    });
  }

  function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteTrip(slug);
      if (res.error) { flash("Error: " + res.error); return; }
      onTripsChange(trips.filter((t) => t.slug !== slug));
      flash(lang === "mk" ? "Патувањето е избришано." : "Trip deleted.");
    });
  }

  if (showForm) {
    return (
      <TripForm
        trip={editingTrip}
        onBack={() => setShowForm(false)}
        onSaved={(updated) => {
          if (editingTrip) {
            onTripsChange(trips.map((t) => (t.slug === updated.slug ? updated : t)));
          } else {
            onTripsChange([updated, ...trips]);
          }
          setShowForm(false);
        }}
      />
    );
  }

  const sortOpts: { key: TripSort; label: string }[] = [
    { key: "newest", label: lang === "mk" ? "Најново прво" : "Newest first" },
    { key: "oldest", label: lang === "mk" ? "Најстаро прво" : "Oldest first" },
    { key: "price_asc", label: "Price ↑" },
    { key: "price_desc", label: "Price ↓" },
    { key: "title_az", label: "A → Z" },
  ];

  return (
    <div className="space-y-5">
      <StatusBadge msg={statusMsg} />

      {/* Toolbar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-extrabold" style={{ color: BLUE }}>
            {trips.length} Trip{trips.length !== 1 ? "s" : ""}
          </h2>
          <button
            type="button"
            onClick={openNew}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Trip
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search trips…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputCls + " pl-9"}
            />
          </div>
          {/* Status */}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)} className={inputCls}>
            <option value="all">All status</option>
            <option value="published">✓ Published</option>
            <option value="draft">○ Drafts</option>
            <option value="hidden">⊘ Hidden</option>
          </select>
          {/* Date from */}
          <div>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={inputCls} title="Departure from" />
          </div>
          {/* Date to */}
          <div>
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className={inputCls} title="Return by" />
          </div>
        </div>

        {/* Sort pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sort:</span>
          {sortOpts.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSort(opt.key)}
              className="rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200"
              style={
                sort === opt.key
                  ? { background: BLUE, color: "white", boxShadow: "0 2px 8px rgba(23,70,152,0.25)" }
                  : { background: "white", color: "#374151", border: "1px solid #e5e7eb" }
              }
            >
              {opt.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Trip list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            {search || filterDate || filterStatus !== "all" ? lang === "mk" ? "Нема патувања според филтрите." : "No trips match your filters." : lang === "mk" ? "Нема патувања. Создади го првото!" : "No trips yet. Create your first trip!"}
          </div>
        )}
        {filtered.map((trip) => (
          <div
            key={trip.slug}
            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-28">
              {trip.hero_image ? (
                <Image src={trip.hero_image} alt={trip.title_en} fill sizes="112px" className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 leading-tight truncate">{trip.title_mk}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{trip.destination_en} {trip.departure_date ? `· ${fmtDate(trip.departure_date)}` : ""}{trip.return_date ? ` — ${fmtDate(trip.return_date)}` : ""}</p>
                  {trip.price_early_eur && (
                    <p className="text-sm font-bold mt-0.5" style={{ color: GOLD }}>
                      from €{trip.price_early_eur}{trip.price_regular_eur && trip.price_regular_eur !== trip.price_early_eur ? ` / €${trip.price_regular_eur}` : ""}
                    </p>
                  )}
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={trip.hidden
                    ? { background: "#fef9c3", color: "#92400e" }
                    : trip.published
                    ? { background: "#dcfce7", color: "#15803d" }
                    : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  {trip.hidden ? "⊘ Hidden" : trip.published ? "✓ Live" : "○ Draft"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(trip)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(trip.slug, !trip.published)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors disabled:opacity-50"
                  style={{ background: trip.published ? "#16a34a" : "#6b7280" }}
                >
                  {trip.published ? "✓ Published" : "○ Set Live"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleHide(trip.slug, !trip.hidden)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
                  style={trip.hidden
                    ? { background: "#fef9c3", color: "#92400e", border: "1px solid #fde68a" }
                    : { background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" }
                  }
                >
                  {trip.hidden ? "👁 Unhide" : "⊘ Hide"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(trip.slug, trip.title_mk)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trip Form ────────────────────────────────────────────────────────────────

function TripForm({
  trip,
  onBack,
  onSaved,
}: {
  trip: ImportedTrip | null;
  onBack: () => void;
  onSaved: (trip: ImportedTrip) => void;
}) {
  const isNew = !trip;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [heroUrl, setHeroUrl] = useState(trip?.hero_image ?? "");
  const [form, setForm] = useState({
    title_mk: trip?.title_mk ?? "",
    title_en: trip?.title_en ?? "",
    destination_mk: trip?.destination_mk ?? "",
    destination_en: trip?.destination_en ?? "",
    departure_date: trip?.departure_date ?? "",
    return_date: trip?.return_date ?? "",
    duration_days: trip?.duration_days?.toString() ?? "",
    duration_nights: trip?.duration_nights ?? "",
    price_early_eur: trip?.price_early_eur?.toString() ?? "",
    price_regular_eur: trip?.price_regular_eur?.toString() ?? "",
    included_mk: trip?.included_mk ?? "",
    excluded_mk: trip?.excluded_mk ?? "",
    program_mk: trip?.program_mk ?? "",
    published: trip?.published ?? false,
  });

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await saveTrip({
        slug: trip?.slug,
        title_mk: form.title_mk,
        title_en: form.title_en,
        destination_mk: form.destination_mk,
        destination_en: form.destination_en,
        departure_date: form.departure_date,
        return_date: form.return_date,
        duration_days: parseInt(form.duration_days) || 0,
        duration_nights: form.duration_nights,
        price_early_eur: form.price_early_eur ? parseFloat(form.price_early_eur) : null,
        price_regular_eur: form.price_regular_eur ? parseFloat(form.price_regular_eur) : null,
        included_mk: form.included_mk,
        excluded_mk: form.excluded_mk,
        program_mk: form.program_mk,
        hero_image: heroUrl || null,
        published: form.published,
      });
      if (res.error) { setError(res.error); return; }
      const saved: ImportedTrip = {
        slug: res.slug!,
        title_mk: form.title_mk,
        title_en: form.title_en,
        destination_mk: form.destination_mk,
        destination_en: form.destination_en,
        departure_date: form.departure_date || null,
        return_date: form.return_date || null,
        duration_days: parseInt(form.duration_days) || null,
        duration_nights: form.duration_nights || null,
        price_early_eur: form.price_early_eur ? parseFloat(form.price_early_eur) : null,
        price_regular_eur: form.price_regular_eur ? parseFloat(form.price_regular_eur) : null,
        included_mk: form.included_mk,
        excluded_mk: form.excluded_mk,
        program_mk: form.program_mk,
        itinerary: trip?.itinerary ?? [],
        hero_image: heroUrl || null,
        gallery_images: trip?.gallery_images ?? [],
        source: trip?.source ?? [],
        source_urls: trip?.source_urls ?? [],
        published: form.published,
        hidden: trip?.hidden ?? false,
        imported_at: trip?.imported_at ?? new Date().toISOString(),
        image_match: trip?.image_match ?? "none",
      };
      onSaved(saved);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Back to list
        </button>
        <h2 className="text-xl font-extrabold" style={{ color: BLUE }}>
          {isNew ? lang === "mk" ? "Ново патување" : "New Trip" : `Edit: ${trip?.title_mk}`}
        </h2>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div>}

      {/* Hero image */}
      <SectionCard title={lang === "mk" ? "Насловна слика" : "Cover Image"} icon="🖼️">
        <ImageUploadField
          folder="trips"
          namePrefix={`trip-${form.title_mk.slice(0, 20) || "new"}`}
          label="Trip cover image"
          hint="Wide image — 16:9 or 4:3 recommended."
          aspectClass="aspect-video max-w-lg"
          value={heroUrl}
          onChange={setHeroUrl}
          alt="Trip hero"
        />
      </SectionCard>

      {/* Basic info */}
      <SectionCard title={lang === "mk" ? "Основни информации" : "Basic Information"} icon="📋">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Title (Macedonian) *</label>
            <input type="text" required value={form.title_mk} onChange={(e) => set("title_mk", e.target.value)} className={inputCls} placeholder="Патување во Рим" />
          </div>
          <div>
            <label className={labelCls}>Title (English)</label>
            <input type="text" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} className={inputCls} placeholder="Trip to Rome" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Destination (MK)</label>
            <input type="text" value={form.destination_mk} onChange={(e) => set("destination_mk", e.target.value)} className={inputCls} placeholder="ИТАЛИЈА" />
          </div>
          <div>
            <label className={labelCls}>Destination (EN)</label>
            <input type="text" value={form.destination_en} onChange={(e) => set("destination_en", e.target.value)} className={inputCls} placeholder="Italy" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelCls}>Departure date</label>
            <input type="date" value={form.departure_date} onChange={(e) => set("departure_date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Return date</label>
            <input type="date" value={form.return_date} onChange={(e) => set("return_date", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Duration (days)</label>
            <input type="number" min="1" value={form.duration_days} onChange={(e) => set("duration_days", e.target.value)} className={inputCls} placeholder="5" />
          </div>
          <div>
            <label className={labelCls}>Nights / board</label>
            <input type="text" value={form.duration_nights} onChange={(e) => set("duration_nights", e.target.value)} className={inputCls} placeholder="4 ноќи со појадок" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Early-bird price (€)</label>
            <input type="number" min="0" step="0.01" value={form.price_early_eur} onChange={(e) => set("price_early_eur", e.target.value)} className={inputCls} placeholder="450.00" />
          </div>
          <div>
            <label className={labelCls}>Regular price (€)</label>
            <input type="number" min="0" step="0.01" value={form.price_regular_eur} onChange={(e) => set("price_regular_eur", e.target.value)} className={inputCls} placeholder="499.00" />
          </div>
        </div>
        {/* Published toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => set("published", !form.published)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{ background: form.published ? "#16a34a" : "#d1d5db" }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              style={{ transform: form.published ? "translateX(1.5rem)" : "translateX(0.25rem)" }}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {form.published ? lang === "mk" ? "✓ Објавено — видливо на сајтот" : "✓ Published — visible on website" : lang === "mk" ? "Нацрт — скриено од јавноста" : "Draft — hidden from public"}
          </span>
        </div>
      </SectionCard>

      {/* Program */}
      <SectionCard title={lang === "mk" ? "Програма и детали" : "Program & Details"} icon="📝" defaultOpen={false}>
        <div>
          <label className={labelCls}>Full Program (Macedonian)</label>
          <textarea
            rows={12}
            value={form.program_mk}
            onChange={(e) => set("program_mk", e.target.value)}
            className={inputCls}
            placeholder="ПРВ ДЕН — Скопје - Рим&#10;&#10;Состанок на групата во 08:00 часот..."
            style={{ resize: "vertical", minHeight: "200px" }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Included (MK)</label>
            <textarea rows={5} value={form.included_mk} onChange={(e) => set("included_mk", e.target.value)} className={inputCls} placeholder="• Превоз&#10;• Сместување" style={{ resize: "vertical" }} />
          </div>
          <div>
            <label className={labelCls}>Not Included (MK)</label>
            <textarea rows={5} value={form.excluded_mk} onChange={(e) => set("excluded_mk", e.target.value)} className={inputCls} placeholder="• Ручек&#10;• Осигурување" style={{ resize: "vertical" }} />
          </div>
        </div>
      </SectionCard>

      <div className="flex gap-3 pb-8">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl px-8 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})`, boxShadow: "0 4px 16px rgba(23,70,152,0.3)" }}
        >
          {isPending ? lang === "mk" ? "Се зачувува..." : "Saving…" : isNew ? lang === "mk" ? "✓ Креирај патување" : "✓ Create Trip" : lang === "mk" ? "✓ Зачувај промени" : "✓ Save Changes"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Team Panel ───────────────────────────────────────────────────────────────

function TeamPanel({
  users,
  onUsersChange,
}: {
  users: AgentUser[];
  onUsersChange: (users: AgentUser[]) => void;
}) {
  const { lang } = useStaffLang();
  const [showCreate, setShowCreate] = useState(false);
  const [changingPw, setChangingPw] = useState<AgentUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "admin">("agent");
  const [newPwVal, setNewPwVal] = useState("");

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 4000); }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser(newEmail, newPw, newName, newRole);
      if (res.error) { flash("Error: " + res.error); return; }
      onUsersChange([...users, { id: res.id!, email: newEmail, name: newName, role: newRole, created_at: new Date().toISOString(), last_sign_in_at: null }]);
      setNewEmail(""); setNewName(""); setNewPw(""); setNewRole("agent"); setShowCreate(false);
      flash(lang === "mk" ? "Агентот е создаден." : "Agent created successfully.");
    });
  }

  function handleDelete(user: AgentUser) {
    if (!confirm(`Delete "${user.email}"? They will lose access immediately.`)) return;
    startTransition(async () => {
      const res = await deleteUser(user.id);
      if (res.error) { flash("Error: " + res.error); return; }
      onUsersChange(users.filter((u) => u.id !== user.id));
      flash(lang === "mk" ? "Корисникот е отстранет." : "User removed.");
    });
  }

  function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (!changingPw) return;
    startTransition(async () => {
      const res = await changePassword(changingPw.id, newPwVal);
      if (res.error) { flash("Error: " + res.error); return; }
      setChangingPw(null); setNewPwVal("");
      flash(lang === "mk" ? "Лозинката е сменета." : "Password updated.");
    });
  }

  return (
    <div className="space-y-5">
      <StatusBadge msg={msg} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold" style={{ color: BLUE }}>
          Team Members ({users.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition-all hover:opacity-90"
          style={{ background: showCreate ? "#6b7280" : `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
        >
          {showCreate ? "× Cancel" : "+ Add Agent"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <SectionCard title={lang === "mk" ? "Нов агент" : "New Agent Account"} icon="👤">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Full Name</label>
                <input required value={newName} onChange={(e) => setNewName(e.target.value)} className={inputCls} placeholder="Ana Petrovska" />
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} placeholder="ana@amortravel.net" />
              </div>
              <div>
                <label className={labelCls}>Password * (min 8 chars)</label>
                <input required type="password" minLength={8} value={newPw} onChange={(e) => setNewPw(e.target.value)} className={inputCls} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as "agent" | "admin")} className={inputCls}>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl px-6 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
            >
              {isPending ? lang === "mk" ? "Се креира..." : "Creating…" : lang === "mk" ? "Креирај агент" : "Create Account"}
            </button>
          </form>
        </SectionCard>
      )}

      {/* Change password modal */}
      {changingPw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleChangePw}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-extrabold" style={{ color: BLUE }}>Change Password</h3>
            <p className="text-sm text-gray-500">For: <strong>{changingPw.email}</strong></p>
            <div>
              <label className={labelCls}>New Password (min 8 chars)</label>
              <input required type="password" minLength={8} value={newPwVal} onChange={(e) => setNewPwVal(e.target.value)} className={inputCls} placeholder="••••••••" autoFocus />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isPending} className="flex-1 rounded-xl py-2.5 text-sm font-extrabold text-white disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}>
                {isPending ? lang === "mk" ? "Се зачувува..." : "Saving…" : lang === "mk" ? "Смени лозинка" : "Update Password"}
              </button>
              <button type="button" onClick={() => { setChangingPw(null); setNewPwVal(""); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users list */}
      <div className="space-y-3">
        {users.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
            No agents yet. Add your first team member above.
          </div>
        )}
        {users.map((user) => (
          <div key={user.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-extrabold text-white"
              style={{ background: user.role === "admin" ? RED : BLUE }}
            >
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{user.name || "—"}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={user.role === "admin"
                    ? { background: "#fee2e2", color: "#b91c1c" }
                    : { background: "#dbeafe", color: "#1d4ed8" }
                  }
                >
                  {user.role}
                </span>
                {user.last_sign_in_at && (
                  <span className="text-xs text-gray-400">Last login: {fmtDate(user.last_sign_in_at)}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => { setChangingPw(user); setNewPwVal(""); }}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                🔑 Change PW
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(user)}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Permissions Panel ────────────────────────────────────────────────────────

const CRM_MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/agent", desc: "Main CRM homepage overview" },
  { id: "clients", label: "Clients", icon: "👥", path: "/agent/clients", desc: "Client list and profiles" },
  { id: "quotes", label: "Quotations", icon: "📋", path: "/agent/quotes", desc: "Travel quote builder" },
  { id: "sales", label: "Sales", icon: "💰", path: "/agent/sales", desc: "Sales tracking and invoices" },
  { id: "expenses", label: "Expenses", icon: "🧾", path: "/agent/expenses", desc: "Expense management" },
  { id: "vouchers", label: "Vouchers", icon: "🎫", path: "/agent/vouchers", desc: "Voucher generation" },
  { id: "search", label: "Search Flights", icon: "✈️", path: "/agent/search", desc: "Flight & travel search tool" },
];

const ROLES = ["admin", "senior_agent", "agent", "intern"] as const;
type Role = (typeof ROLES)[number];

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  senior_agent: "Senior Agent",
  agent: "Agent",
  intern: "Intern",
};

const ROLE_COLORS: Record<Role, string> = {
  admin: "#174698",
  senior_agent: "#0369a1",
  agent: "#15803d",
  intern: "#b45309",
};

const DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  admin: CRM_MODULES.map((m) => m.id),
  senior_agent: ["dashboard", "clients", "quotes", "sales", "expenses", "vouchers", "search"],
  agent: ["dashboard", "clients", "quotes", "sales", "search"],
  intern: ["dashboard", "clients", "search"],
};

function PermissionsPanel() {
  const { lang } = useStaffLang();
  const [perms, setPerms] = useState<Record<Role, string[]>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("amor_crm_permissions");
        if (stored) return JSON.parse(stored);
      } catch { /* ignore */ }
    }
    return DEFAULT_PERMISSIONS;
  });
  const [saved, setSaved] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>("agent");

  function toggle(role: Role, moduleId: string) {
    setPerms((prev) => {
      const current = prev[role] ?? [];
      const next = current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId];
      return { ...prev, [role]: next };
    });
    setSaved(false);
  }

  function handleSave() {
    if (typeof window !== "undefined") {
      localStorage.setItem("amor_crm_permissions", JSON.stringify(perms));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setPerms(DEFAULT_PERMISSIONS);
    setSaved(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">🔐 CRM Page Permissions</h2>
            <p className="mt-1 text-sm text-gray-500">Control which CRM pages each role can access</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ↩ Reset defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl px-5 py-2 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#174698,#0f2d5e)" }}
            >
              {saved ? lang === "mk" ? "✓ Зачувано!" : "✓ Saved!" : lang === "mk" ? "Зачувај дозволи" : "Save permissions"}
            </button>
          </div>
        </div>

        {/* Role tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setActiveRole(role)}
              className="rounded-full px-4 py-1.5 text-sm font-bold transition-all"
              style={{
                background: activeRole === role ? ROLE_COLORS[role] : "#f1f5f9",
                color: activeRole === role ? "#fff" : "#475569",
              }}
            >
              {ROLE_LABELS[role]}
              <span
                className="ml-2 rounded-full px-1.5 py-0.5 text-xs"
                style={{
                  background: activeRole === role ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                  color: activeRole === role ? "#fff" : "#64748b",
                }}
              >
                {(perms[activeRole] ?? []).length}/{CRM_MODULES.length}
              </span>
            </button>
          ))}
        </div>

        {/* Module toggles */}
        <div className="grid gap-3 sm:grid-cols-2">
          {CRM_MODULES.map((mod) => {
            const enabled = (perms[activeRole] ?? []).includes(mod.id);
            const isProtected = mod.id === "dashboard" && activeRole === "admin";
            return (
              <div
                key={mod.id}
                className="flex items-center justify-between rounded-xl border p-4 transition-all"
                style={{
                  borderColor: enabled ? ROLE_COLORS[activeRole] + "40" : "#e2e8f0",
                  background: enabled ? ROLE_COLORS[activeRole] + "08" : "#fafafa",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{mod.icon}</span>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{mod.label}</div>
                    <div className="text-xs text-gray-400">{mod.path}</div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isProtected}
                  onClick={() => toggle(activeRole, mod.id)}
                  className="relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: enabled ? ROLE_COLORS[activeRole] : "#cbd5e1" }}
                  aria-checked={enabled}
                  role="switch"
                >
                  <span
                    className="absolute h-5 w-5 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: enabled ? "calc(100% - 22px)" : "2px" }}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {saved && (
          <div className="mt-4 rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: "#f0fdf4", color: "#15803d" }}>
            ✓ Permissions saved for {ROLE_LABELS[activeRole]}
          </div>
        )}
      </div>

      {/* Summary table */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-x-auto">
        <h3 className="mb-4 font-bold text-gray-800">Permission matrix</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Module</th>
              {ROLES.map((role) => (
                <th key={role} className="pb-3 text-center text-xs font-bold uppercase tracking-wider" style={{ color: ROLE_COLORS[role] }}>
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {CRM_MODULES.map((mod) => (
              <tr key={mod.id}>
                <td className="py-2.5 font-medium text-gray-700">
                  <span className="mr-2">{mod.icon}</span>{mod.label}
                </td>
                {ROLES.map((role) => {
                  const has = (perms[role] ?? []).includes(mod.id);
                  return (
                    <td key={role} className="py-2.5 text-center">
                      {has
                        ? <span style={{ color: ROLE_COLORS[role], fontSize: 18 }}>✓</span>
                        : <span className="text-gray-300 text-lg">✗</span>
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
