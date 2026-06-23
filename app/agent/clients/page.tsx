"use client";
import { exportPDF } from "@/lib/export-pdf";
import { useStaffLang } from "@/components/StaffLangContext";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Client, ClientType } from "@/lib/crm/types";

const supabase = createClient();

const TYPE_COLORS: Record<ClientType, string> = {
  Regular: "#174698",
  New: "#15803d",
  VIP: "#C9A84C",
  Corporate: "#7c3aed",
  Blacklist: "#FF1D1D",
};

const BLANK: Partial<Client> = {
  first_name: "", last_name: "", email: "", phone: "", phone2: "",
  passport_number: "", nationality: "", city: "", country: "",
  gender: undefined, client_type: "Regular", language_pref: "mk",
  opt_in_marketing: true, notes: "",
};

function Badge({ type }: { type: ClientType }) {
  return (
    <span style={{
      background: TYPE_COLORS[type] + "18",
      color: TYPE_COLORS[type],
      border: `1px solid ${TYPE_COLORS[type]}40`,
      borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600,
    }}>{type}</span>
  );
}

function Modal({ client, onClose, onSaved }: {
  client: Partial<Client> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Client>>(client ?? BLANK);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof Client, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!form.first_name || !form.last_name) { setErr("Потребни се ime i prezime"); return; }
    setSaving(true); setErr("");
    const payload = { ...form };
    delete (payload as Record<string, unknown>).id;
    delete (payload as Record<string, unknown>).code;
    delete (payload as Record<string, unknown>).created_at;
    delete (payload as Record<string, unknown>).updated_at;

    if (form.id) {
      const { error } = await supabase.from("clients").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", form.id);
      if (error) { setErr(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("clients").insert(payload);
      if (error) { setErr(error.message); setSaving(false); return; }
    }
    setSaving(false);
    onSaved();
    onClose();
  }

  const field = (label: string, k: keyof Client, type = "text", opts?: string[]) => (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#174698", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
      {opts ? (
        <select
          value={(form[k] ?? "") as string}
          onChange={(e) => set(k, e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc" }}
        >
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={(form[k] ?? "") as string}
          onChange={(e) => set(k, e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc", boxSizing: "border-box" }}
        />
      )}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#174698" }}>{form.id ? "Уреди клиент" : "Нов клиент"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>
        {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>{err}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {field("First Name *", "first_name")}
          {field("Last Name *", "last_name")}
          {field("Е-пошта", "email", "email")}
          {field("Телефон", "phone", "tel")}
          {field("Phone 2", "phone2", "tel")}
          {field("Passport #", "passport_number")}
          {field("Passport Expiry", "passport_expiry", "date")}
          {field("Date of Birth", "date_of_birth", "date")}
          {field("Gender", "gender", "text", ["", "Male", "Female", "Other"])}
          {field("Nationality", "nationality")}
          {field("Град", "city")}
          {field("Држава", "country")}
          {field("Client Type", "client_type", "text", ["Regular", "New", "VIP", "Corporate", "Blacklist"])}
          {field("Language", "language_pref", "text", ["mk", "en"])}
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#174698", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</label>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.7 : 1 }}
          >{saving ? "Се зачувува..." : "Зачувај клиент"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [editing, setEditing] = useState<Partial<Client> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pdfLang, setPdfLang] = useState<"mk"|"en">("mk");
  const { lang } = useStaffLang();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function deleteClient() {
    if (!delId) return;
    await supabase.from("clients").delete().eq("id", delId);
    setDelId(null);
    load();
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${c.first_name} ${c.last_name} ${c.email ?? ""} ${c.phone ?? ""} ${c.code}`.toLowerCase().includes(q);
    const matchType = typeFilter === "All" || c.client_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Clients</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{clients.length} total</p>
        </div>
        <button
          onClick={() => { setEditing({ ...BLANK }); setModalOpen(true); }}
          style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
        >+ New Client</button>
      </div>

      {/* Filters */}
      <div style={{ background: "#f8fafc", borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 20, overflow: "hidden" }}>
        <button type="button" onClick={() => setFiltersOpen(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#174698", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {lang === "mk" ? "Пребарај и Филтер" : "Search & Filter"}
            {(search || typeFilter !== "All") && <span style={{ background: "#FF1D1D", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{lang === "mk" ? "активен" : "active"}</span>}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#174698" strokeWidth="2" style={{ transform: filtersOpen ? "rotate(180deg)" : "none", transition: "0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
        </button>
        {filtersOpen && (
          <div style={{ padding: "0 16px 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              placeholder={lang === "mk" ? "Пребарај ime, email, телефон, код..." : "Search name, email, phone, code..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, background: "#fff" }}
            />
            {["All", "Regular", "New", "VIP", "Corporate", "Blacklist"].map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", borderColor: typeFilter === t ? "#174698" : "#e2e8f0", background: typeFilter === t ? "#174698" : "#fff", color: typeFilter === t ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Export PDF */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{lang === "mk" ? "Извоз:" : "Export:"}</span>
        {(["mk","en"] as const).map(l => (
          <button key={l} onClick={() => setPdfLang(l)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid", borderColor: pdfLang === l ? "#174698" : "#e2e8f0", background: pdfLang === l ? "#174698" : "#fff", color: pdfLang === l ? "#fff" : "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{l.toUpperCase()}</button>
        ))}
        <button onClick={() => exportPDF({
          titleMk: "Клиенти", titleEn: "Clients",
          columns: [
            { mk: "Код", en: "Code" }, { mk: "Ime", en: "Name" }, { mk: "Емаил", en: "Email" },
            { mk: "Телефон", en: "Phone" }, { mk: "Тип", en: "Type" }, { mk: "Град", en: "City" }
          ],
          rows: filtered.map(c => [c.code, `${c.first_name} ${c.last_name}`, c.email ?? "—", c.phone ?? "—", c.client_type ?? "—", c.city ?? "—"]),
          lang: pdfLang,
          subtitle: `${lang === "mk" ? "Вкупно" : "Total"}: ${filtered.length}`,
        })} style={{ padding: "7px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF1D1D,#c01515)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          PDF
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>No clients found.</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(23,70,152,0.07)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Код", "Ime", "Контакт", "Тип", "Град", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#174698", fontWeight: 600 }}>{c.code}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{c.first_name} {c.last_name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>
                      <div>{c.email ?? "—"}</div>
                      <div>{c.phone ?? ""}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><Badge type={c.client_type} /></td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#64748b" }}>{c.city ?? "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => { setEditing(c); setModalOpen(true); }}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#174698" }}
                        >Edit</button>
                        <button
                          onClick={() => setDelId(c.id)}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#FF1D1D" }}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {modalOpen && <Modal client={editing} onClose={() => setModalOpen(false)} onSaved={load} />}
      {delId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 400, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, color: "#FF1D1D", marginBottom: 8 }}>Delete Client?</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDelId(null)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={deleteClient} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#FF1D1D", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
