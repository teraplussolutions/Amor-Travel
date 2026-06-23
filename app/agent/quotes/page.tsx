"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Quote, QuoteItem, Client, QuoteStatus, PipelineStage } from "@/lib/crm/types";
import { MKD_RATE, fmtEur, fmtMkd } from "@/lib/crm/types";

const supabase = createClient();

const STATUS_COLORS: Record<QuoteStatus, string> = {
  Draft: "#64748b", Sent: "#174698", Confirmed: "#15803d", Cancelled: "#FF1D1D", Expired: "#b45309",
};
const PIPELINE_COLORS: Record<PipelineStage, string> = {
  Lead: "#64748b", Proposal: "#174698", Negotiation: "#C9A84C",
  Confirmed: "#15803d", Won: "#15803d", Lost: "#FF1D1D",
};

const DEFAULT_TERMS_MK = "Ова е потврдена понуда. Резервацијата е важечка по потпишувањето.\nОткажувањата подлежат на надоместок согласно нашата политика.";
const DEFAULT_TERMS_EN = "This is a confirmed quotation. Booking is valid upon signature.\nCancellations are subject to fees per our policy.";

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: color + "18", color, border: `1px solid ${color}40`, borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{label}</span>
  );
}

function Modal({ quote, clients, onClose, onSaved }: {
  quote: Partial<Quote> | null;
  clients: Client[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Quote>>(quote ?? {
    destination: "", departure_date: "", return_date: "", travelers: 1,
    language: "mk", status: "Draft", pipeline_stage: "Lead",
    items: [], notes: "", total_eur: 0, total_mkd: 0,
    terms: DEFAULT_TERMS_MK,
  });
  const [items, setItems] = useState<QuoteItem[]>((quote?.items as QuoteItem[]) ?? []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof Quote, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function addItem() {
    setItems((prev) => [...prev, { description: "", qty: 1, unit_price_eur: 0, total_eur: 0 }]);
  }
  function setItem(i: number, k: keyof QuoteItem, v: string | number) {
    setItems((prev) => {
      const next = prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item);
      const updated = next.map((it) => ({ ...it, total_eur: it.qty * it.unit_price_eur }));
      return updated;
    });
  }
  function removeItem(i: number) { setItems((prev) => prev.filter((_, idx) => idx !== i)); }

  const total_eur = items.reduce((s, it) => s + it.total_eur, 0);
  const total_mkd = total_eur * MKD_RATE;

  async function save() {
    if (!form.destination) { setErr("Потребна е дестинација"); return; }
    setSaving(true); setErr("");
    const payload: Record<string, unknown> = {
      ...form, items, total_eur, total_mkd,
      updated_at: new Date().toISOString(),
      terms: form.language === "en" ? (form.terms ?? DEFAULT_TERMS_EN) : (form.terms ?? DEFAULT_TERMS_MK),
    };
    delete payload.id; delete payload.code; delete payload.created_at; delete payload.clients;

    if (form.id) {
      const { error } = await supabase.from("quotes").update(payload).eq("id", form.id);
      if (error) { setErr(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("quotes").insert(payload);
      if (error) { setErr(error.message); setSaving(false); return; }
    }
    setSaving(false); onSaved(); onClose();
  }

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc", boxSizing: "border-box" as const };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 700 as const, color: "#174698", marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 700, maxHeight: "92vh", overflowY: "auto", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#174698" }}>{form.id ? "Уреди понуда" : "Нова понуда"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>
        {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>{err}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Client</label>
            <select value={form.client_id ?? ""} onChange={(e) => set("client_id", e.target.value || undefined)} style={inputStyle}>
              <option value="">— No client —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.code})</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Destination *</label>
            <input value={form.destination ?? ""} onChange={(e) => set("destination", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Departure</label>
            <input type="date" value={form.departure_date ?? ""} onChange={(e) => set("departure_date", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Return</label>
            <input type="date" value={form.return_date ?? ""} onChange={(e) => set("return_date", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Travelers</label>
            <input type="number" min={1} value={form.travelers ?? 1} onChange={(e) => set("travelers", +e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Language</label>
            <select value={form.language ?? "mk"} onChange={(e) => { set("language", e.target.value); set("terms", e.target.value === "en" ? DEFAULT_TERMS_EN : DEFAULT_TERMS_MK); }} style={inputStyle}>
              <option value="mk">Macedonian</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status ?? "Draft"} onChange={(e) => set("status", e.target.value)} style={inputStyle}>
              {["Draft","Sent","Confirmed","Cancelled","Expired"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Pipeline Stage</label>
            <select value={form.pipeline_stage ?? "Lead"} onChange={(e) => set("pipeline_stage", e.target.value)} style={inputStyle}>
              {["Lead","Proposal","Negotiation","Confirmed","Won","Lost"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input type="date" value={form.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={labelStyle}>Line Items</label>
            <button onClick={addItem} style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid #174698", background: "#fff", color: "#174698", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
          </div>
          {items.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13, padding: "10px 0" }}>No items yet.</div>}
          {items.map((it, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 90px 80px 28px", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input placeholder="Description" value={it.description} onChange={(e) => setItem(i, "description", e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <input type="number" placeholder="Qty" min={1} value={it.qty} onChange={(e) => setItem(i, "qty", +e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <input type="number" placeholder="€/unit" min={0} step={0.01} value={it.unit_price_eur} onChange={(e) => setItem(i, "unit_price_eur", +e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#174698" }}>{fmtEur(it.total_eur)}</div>
              <button onClick={() => removeItem(i)} style={{ border: "none", background: "none", color: "#FF1D1D", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
          ))}
          {items.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 8, padding: "12px 0", borderTop: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#174698" }}>{fmtEur(total_eur)}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}>{fmtMkd(total_mkd)}</div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Notes</label>
          <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Terms & Conditions</label>
          <textarea value={form.terms ?? ""} onChange={(e) => set("terms", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.7 : 1 }}>{saving ? "Се зачувува..." : "Зачувај понуда"}</button>
        </div>
      </div>
    </div>
  );
}

function PdfPreview({ quote, client, onClose }: { quote: Quote; client?: Client; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMk = quote.language !== "en";
  const items = (quote.items as QuoteItem[]) ?? [];

  function print() { window.print(); }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 720, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <span style={{ fontWeight: 700, color: "#174698" }}>PDF Preview — {quote.code}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={print} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "#174698", color: "#fff", fontWeight: 700, cursor: "pointer" }}>🖨️ Print / Save PDF</button>
            <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>✕</button>
          </div>
        </div>
        <div ref={ref} style={{ padding: "40px 48px", fontFamily: "Arial, sans-serif" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32, borderBottom: "3px solid #174698", paddingBottom: 20 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#174698" }}>AMOR TRAVEL</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Скопје, Македонија | amor.travel</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#C9A84C" }}>{isMk ? "ПОНУДА" : "QUOTATION"}</div>
              <div style={{ fontSize: 13, fontFamily: "monospace", color: "#174698" }}>{quote.code}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{new Date(quote.created_at).toLocaleDateString(isMk ? "mk-MK" : "en-GB")}</div>
            </div>
          </div>

          {/* Client */}
          {client && (
            <div style={{ marginBottom: 24, background: "#f8fafc", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{isMk ? "КЛИЕНТ" : "CLIENT"}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{client.first_name} {client.last_name}</div>
              {client.email && <div style={{ fontSize: 13, color: "#64748b" }}>{client.email}</div>}
              {client.phone && <div style={{ fontSize: 13, color: "#64748b" }}>{client.phone}</div>}
            </div>
          )}

          {/* Trip Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              [isMk ? "Дестинација" : "Дестинација", quote.destination],
              [isMk ? "Поаѓање" : "Departure", quote.departure_date ?? "—"],
              [isMk ? "Враќање" : "Return", quote.return_date ?? "—"],
              [isMk ? "Патници" : "Travelers", String(quote.travelers)],
              ...(quote.expiry_date ? [[isMk ? "Важи до" : "Valid Until", quote.expiry_date]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Items */}
          {items.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "#174698", color: "#fff" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 12 }}>{isMk ? "Опис" : "Description"}</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 12 }}>{isMk ? "Бр." : "Qty"}</th>
                  <th style={{ padding: "10px 14px", textAlign: "right", fontSize: 12 }}>{isMk ? "Ед. цена" : "Unit Price"}</th>
                  <th style={{ padding: "10px 14px", textAlign: "right", fontSize: 12 }}>{isMk ? "Вкупно" : "Total"}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} style={{ background: i % 2 ? "#f8fafc" : "#fff", borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px 14px", fontSize: 13 }}>{it.description}</td>
                    <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 13 }}>{it.qty}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 13 }}>{fmtEur(it.unit_price_eur)}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 13, fontWeight: 700 }}>{fmtEur(it.total_eur)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #174698" }}>
                  <td colSpan={3} style={{ padding: "12px 14px", fontWeight: 800, fontSize: 15, textAlign: "right", color: "#174698" }}>{isMk ? "ВКУПНО:" : "TOTAL:"}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: "#174698" }}>{fmtEur(quote.total_eur)}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>{fmtMkd(quote.total_mkd)}</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {quote.notes && <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "#0c4a6e" }}>{quote.notes}</div>}

          {quote.terms && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{isMk ? "УСЛОВИ И ОДРЕДБИ" : "TERMS & CONDITIONS"}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{quote.terms}</div>
            </div>
          )}

          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
            <div style={{ borderTop: "1px solid #94a3b8", paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{isMk ? "Потпис на агент" : "Agent Signature"}</div>
            </div>
            <div style={{ borderTop: "1px solid #94a3b8", paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{isMk ? "Потпис на клиент" : "Client Signature"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Quote> | null>(null);
  const [preview, setPreview] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: q }, { data: c }] = await Promise.all([
      supabase.from("quotes").select("*, clients(first_name,last_name,email,phone)").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,code,first_name,last_name,email,phone").order("first_name"),
    ]);
    setQuotes((q ?? []) as Quote[]);
    setClients((c ?? []) as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = quotes.filter((q) => {
    const qs = search.toLowerCase();
    const ms = !qs || `${q.code} ${q.destination} ${(q.clients as Client | undefined)?.first_name ?? ""} ${(q.clients as Client | undefined)?.last_name ?? ""}`.toLowerCase().includes(qs);
    const mst = statusFilter === "All" || q.status === statusFilter;
    return ms && mst;
  });

  const previewClient = preview
    ? clients.find((c) => c.id === preview.client_id)
    : undefined;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Quotes</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{quotes.length} total</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ New Quote</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input placeholder="Пребарај код, дестинација, клиент..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc" }} />
        {["All", "Draft", "Sent", "Confirmed", "Cancelled", "Expired"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", borderColor: statusFilter === s ? "#174698" : "#e2e8f0", background: statusFilter === s ? "#174698" : "#fff", color: statusFilter === s ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(23,70,152,0.07)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Code", "Client", "Дестинација", "Dates", "Total", "Статус", "Pipeline", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => {
                  const cl = q.clients as Client | undefined;
                  return (
                    <tr key={q.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#174698", fontWeight: 600 }}>{q.code}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>{cl ? `${cl.first_name} ${cl.last_name}` : "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14 }}>{q.destination}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>
                        <div>{q.departure_date ?? "—"}</div>
                        <div>{q.return_date ?? ""}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 700, color: "#174698" }}>{fmtEur(q.total_eur)}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{fmtMkd(q.total_mkd)}</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}><Badge label={q.status} color={STATUS_COLORS[q.status]} /></td>
                      <td style={{ padding: "12px 16px" }}><Badge label={q.pipeline_stage} color={PIPELINE_COLORS[q.pipeline_stage]} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setPreview(q)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #C9A84C", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#C9A84C" }}>PDF</button>
                          <button onClick={() => { setEditing(q); setModalOpen(true); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#174698" }}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>No quotes found.</div>}
        </div>
      )}

      {modalOpen && <Modal quote={editing} clients={clients} onClose={() => setModalOpen(false)} onSaved={load} />}
      {preview && <PdfPreview quote={preview} client={previewClient} onClose={() => setPreview(null)} />}
    </div>
  );
}
