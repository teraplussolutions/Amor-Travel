"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { saveTrip, deleteTrip, toggleTripPublished } from "@/app/admin/trip-actions";
import { createUser, changePassword, deleteUser } from "@/app/admin/user-actions";
import type { ImportedTrip } from "@/lib/trips/types";
import type { AgentUser } from "@/app/admin/user-actions";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "hero" | "trips" | "team";

type Props = {
  trips: ImportedTrip[];
  users: AgentUser[];
  heroDefaults: string[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Root Component ──────────────────────────────────────────────────────────

export function AdminPanelClient({ trips: initialTrips, users: initialUsers, heroDefaults }: Props) {
  const [tab, setTab] = useState<Tab>("hero");
  const [trips, setTrips] = useState(initialTrips);
  const [users, setUsers] = useState(initialUsers);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "hero", label: "Hero & Logo", icon: "🖼️" },
    { id: "trips", label: "Trips", icon: "✈️" },
    { id: "team", label: "Team", icon: "👥" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ color: "#174698" }} className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-base text-gray-500 mt-1">Manage your website content, trips, and team</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-white shadow text-[#174698]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === "hero" && <HeroLogoPanel heroDefaults={heroDefaults} />}
      {tab === "trips" && (
        <TripsPanel
          trips={trips}
          onTripsChange={setTrips}
        />
      )}
      {tab === "team" && (
        <TeamPanel
          users={users}
          onUsersChange={setUsers}
        />
      )}
    </div>
  );
}

// ─── Hero & Logo Panel ───────────────────────────────────────────────────────

function HeroLogoPanel({ heroDefaults }: { heroDefaults: string[] }) {
  const [logoUrl, setLogoUrl] = useState("");
  const [heroSlots, setHeroSlots] = useState(() =>
    heroDefaults.slice(0, 5).map((src, i) => ({ id: i, url: src }))
  );

  function addSlot() {
    setHeroSlots((prev) => [...prev, { id: Date.now(), url: "" }]);
  }

  function removeSlot(id: number) {
    if (heroSlots.length <= 1) return;
    setHeroSlots((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Logo */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏷️</span>
          <h2 style={{ color: "#174698" }} className="text-lg font-bold">Agency Logo</h2>
        </div>
        <p className="text-sm text-gray-500">Upload your logo — PNG or SVG with transparency recommended.</p>
        <div className="max-w-sm">
          <ImageUploadField
            folder="logo"
            namePrefix="amor-logo"
            label="Logo image"
            hint="Auto-compressed to WebP. Will appear in header and footers."
            aspectClass="aspect-[3/1]"
            value={logoUrl}
            onChange={setLogoUrl}
            alt="Amor Travel logo"
          />
        </div>
      </section>

      {/* Hero slideshow */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌄</span>
            <h2 style={{ color: "#174698" }} className="text-lg font-bold">Homepage Hero Slideshow</h2>
          </div>
          <button
            type="button"
            onClick={addSlot}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "#174698" }}
          >
            + Add slide
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Upload wide hero images (21:9 ratio works best). Each one becomes a slide on the homepage.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {heroSlots.map((slot, idx) => (
            <div key={slot.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Slide {idx + 1}</span>
                {heroSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(slot.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <ImageUploadField
                folder="hero"
                namePrefix={`hero-slide-${idx + 1}`}
                label=""
                aspectClass="aspect-[21/9]"
                value={slot.url}
                onChange={(url) =>
                  setHeroSlots((prev) =>
                    prev.map((s) => (s.id === slot.id ? { ...s, url } : s))
                  )
                }
                alt={`Hero slide ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Trips Panel ─────────────────────────────────────────────────────────────

type TripView = "list" | "form";

function TripsPanel({
  trips,
  onTripsChange,
}: {
  trips: ImportedTrip[];
  onTripsChange: (trips: ImportedTrip[]) => void;
}) {
  const [view, setView] = useState<TripView>("list");
  const [editingTrip, setEditingTrip] = useState<ImportedTrip | null>(null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState("");

  const filtered = trips.filter(
    (t) =>
      t.title_mk?.toLowerCase().includes(search.toLowerCase()) ||
      t.destination_en?.toLowerCase().includes(search.toLowerCase()) ||
      t.destination_mk?.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setEditingTrip(null);
    setView("form");
  }

  function openEdit(trip: ImportedTrip) {
    setEditingTrip(trip);
    setView("form");
  }

  function handleToggle(slug: string, published: boolean) {
    startTransition(async () => {
      const res = await toggleTripPublished(slug, published);
      if (res.error) {
        setStatusMsg("Error: " + res.error);
      } else {
        onTripsChange(
          trips.map((t) => (t.slug === slug ? { ...t, published } : t))
        );
      }
    });
  }

  function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteTrip(slug);
      if (res.error) {
        setStatusMsg("Error: " + res.error);
      } else {
        onTripsChange(trips.filter((t) => t.slug !== slug));
        setStatusMsg("Trip deleted.");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    });
  }

  if (view === "form") {
    return (
      <TripForm
        trip={editingTrip}
        onBack={() => setView("list")}
        onSaved={(updated) => {
          if (editingTrip) {
            onTripsChange(trips.map((t) => (t.slug === updated.slug ? updated : t)));
          } else {
            onTripsChange([updated, ...trips]);
          }
          setView("list");
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {statusMsg && (
        <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">{statusMsg}</div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search trips…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 sm:max-w-xs"
          style={{ "--tw-ring-color": "#174698" } as React.CSSProperties}
        />
        <button
          type="button"
          onClick={openNew}
          className="rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow"
          style={{ background: "#174698" }}
        >
          + New Trip
        </button>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} trip{filtered.length !== 1 ? "s" : ""}</p>

      <div className="space-y-3">
        {filtered.map((trip) => (
          <div
            key={trip.slug}
            className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {trip.hero_image ? (
                <Image
                  src={trip.hero_image}
                  alt={trip.title_en}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 leading-tight">{trip.title_mk}</p>
                  <p className="text-sm text-gray-500">{trip.destination_en} • {fmtDate(trip.departure_date)}</p>
                  {trip.price_regular_eur && (
                    <p className="text-sm font-medium" style={{ color: "#174698" }}>
                      €{trip.price_regular_eur}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    trip.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {trip.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(trip)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(trip.slug, !trip.published)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 ${
                    trip.published ? "bg-gray-400 hover:bg-gray-500" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {trip.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(trip.slug, trip.title_mk)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            {search ? "No trips match your search." : "No trips yet. Create your first trip!"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Trip Form ───────────────────────────────────────────────────────────────

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

      if (res.error) {
        setError(res.error);
        return;
      }

      // Build updated trip object for local state
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
        imported_at: trip?.imported_at ?? new Date().toISOString(),
        image_match: trip?.image_match ?? "none",
      };

      onSaved(saved);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:border-[#174698] focus:ring-1 focus:ring-[#174698]";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          ← Back
        </button>
        <h2 style={{ color: "#174698" }} className="text-xl font-bold">
          {isNew ? "New Trip" : "Edit Trip"}
        </h2>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Hero image */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Hero Image</h3>
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
      </div>

      {/* Basic info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">Basic Information</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Title (Macedonian) *</label>
            <input
              type="text"
              required
              value={form.title_mk}
              onChange={(e) => set("title_mk", e.target.value)}
              className={inputCls}
              placeholder="Патување во Бари"
            />
          </div>
          <div>
            <label className={labelCls}>Title (English)</label>
            <input
              type="text"
              value={form.title_en}
              onChange={(e) => set("title_en", e.target.value)}
              className={inputCls}
              placeholder="Trip to Bari"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Destination (MK)</label>
            <input
              type="text"
              value={form.destination_mk}
              onChange={(e) => set("destination_mk", e.target.value)}
              className={inputCls}
              placeholder="ИТАЛИЈА"
            />
          </div>
          <div>
            <label className={labelCls}>Destination (EN)</label>
            <input
              type="text"
              value={form.destination_en}
              onChange={(e) => set("destination_en", e.target.value)}
              className={inputCls}
              placeholder="Italy"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelCls}>Departure Date</label>
            <input
              type="date"
              value={form.departure_date}
              onChange={(e) => set("departure_date", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Return Date</label>
            <input
              type="date"
              value={form.return_date}
              onChange={(e) => set("return_date", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Duration (days)</label>
            <input
              type="number"
              min="1"
              value={form.duration_days}
              onChange={(e) => set("duration_days", e.target.value)}
              className={inputCls}
              placeholder="5"
            />
          </div>
          <div>
            <label className={labelCls}>Nights / board type</label>
            <input
              type="text"
              value={form.duration_nights}
              onChange={(e) => set("duration_nights", e.target.value)}
              className={inputCls}
              placeholder="4 ноќевања со појадок"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Early-bird price (EUR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price_early_eur}
              onChange={(e) => set("price_early_eur", e.target.value)}
              className={inputCls}
              placeholder="450.00"
            />
          </div>
          <div>
            <label className={labelCls}>Regular price (EUR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price_regular_eur}
              onChange={(e) => set("price_regular_eur", e.target.value)}
              className={inputCls}
              placeholder="499.00"
            />
          </div>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => set("published", !form.published)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.published ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                form.published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {form.published ? "Published (visible on website)" : "Draft (hidden from website)"}
          </span>
        </div>
      </div>

      {/* Program */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">Program & Details</h3>

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
          <p className="mt-1 text-xs text-gray-400">Paste the full program text. Use blank lines between days.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Included (MK)</label>
            <textarea
              rows={5}
              value={form.included_mk}
              onChange={(e) => set("included_mk", e.target.value)}
              className={inputCls}
              placeholder="• Превоз со автобус&#10;• Сместување со појадок&#10;• Водич"
              style={{ resize: "vertical" }}
            />
          </div>
          <div>
            <label className={labelCls}>Not Included (MK)</label>
            <textarea
              rows={5}
              value={form.excluded_mk}
              onChange={(e) => set("excluded_mk", e.target.value)}
              className={inputCls}
              placeholder="• Ручек и вечера&#10;• Влезници за музеи&#10;• Лично осигурување"
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow disabled:opacity-60"
          style={{ background: "#174698" }}
        >
          {isPending ? "Saving…" : isNew ? "Create Trip" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Team Panel ──────────────────────────────────────────────────────────────

function TeamPanel({
  users,
  onUsersChange,
}: {
  users: AgentUser[];
  onUsersChange: (users: AgentUser[]) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [changingPw, setChangingPw] = useState<AgentUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  // Create user form
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "admin">("agent");

  // Change password form
  const [newPwVal, setNewPwVal] = useState("");

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 4000);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser(newEmail, newPw, newName, newRole);
      if (res.error) {
        flash("Error: " + res.error);
        return;
      }
      const newUser: AgentUser = {
        id: res.id!,
        email: newEmail,
        name: newName,
        role: newRole,
        created_at: new Date().toISOString(),
        last_sign_in_at: null,
      };
      onUsersChange([...users, newUser]);
      setNewEmail(""); setNewName(""); setNewPw(""); setNewRole("agent");
      setShowCreate(false);
      flash("User created successfully.");
    });
  }

  function handleDelete(user: AgentUser) {
    if (!confirm(`Delete user "${user.email}"? They will lose access immediately.`)) return;
    startTransition(async () => {
      const res = await deleteUser(user.id);
      if (res.error) { flash("Error: " + res.error); return; }
      onUsersChange(users.filter((u) => u.id !== user.id));
      flash("User deleted.");
    });
  }

  function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (!changingPw) return;
    startTransition(async () => {
      const res = await changePassword(changingPw.id, newPwVal);
      if (res.error) { flash("Error: " + res.error); return; }
      setChangingPw(null); setNewPwVal("");
      flash("Password updated.");
    });
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:border-[#174698] focus:ring-1 focus:ring-[#174698]";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";

  return (
    <div className="space-y-5">
      {msg && (
        <div className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
          msg.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 style={{ color: "#174698" }} className="text-lg font-bold">Team Members</h2>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-xl px-4 py-2 text-sm font-bold text-white"
          style={{ background: "#174698" }}
        >
          {showCreate ? "Cancel" : "+ Add Agent"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-[#174698]/20 bg-blue-50 p-5 space-y-4"
        >
          <h3 className="font-bold" style={{ color: "#174698" }}>New Agent Account</h3>
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
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            style={{ background: "#174698" }}
          >
            {isPending ? "Creating…" : "Create Account"}
          </button>
        </form>
      )}

      {/* Change password modal */}
      {changingPw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleChangePw}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-bold text-gray-800">Change Password</h3>
            <p className="text-sm text-gray-500">For: <strong>{changingPw.email}</strong></p>
            <div>
              <label className={labelCls}>New Password (min 8 chars)</label>
              <input
                required
                type="password"
                minLength={8}
                value={newPwVal}
                onChange={(e) => setNewPwVal(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: "#174698" }}
              >
                {isPending ? "Saving…" : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => { setChangingPw(null); setNewPwVal(""); }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600"
              >
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
            No agents yet. Add your first team member.
          </div>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            {/* Avatar */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
              style={{ background: user.role === "admin" ? "#FF1D1D" : "#174698" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role}
                </span>
                {user.last_sign_in_at && (
                  <span className="text-xs text-gray-400">
                    Last login: {fmtDate(user.last_sign_in_at)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => { setChangingPw(user); setNewPwVal(""); }}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Change PW
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(user)}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
