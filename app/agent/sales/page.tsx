"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Sale, SaleItem, Client, SaleStatus, PaymentType } from "@/lib/crm/types";
import { MKD_RATE, fmtEur, fmtMkd } from "@/lib/crm/types";
import { useStaffLang } from "@/components/StaffLangContext";

const supabase = createClient();

  const { lang } = useStaffLang();
  const mk = lang === "mk";
const STATUS_COLORS: Record<SaleStatus, string> = {
  Pending: "#b45309", Completed: "#15803d", Cancelled: "#64748b", Refunded: "#7c3aed",
};

function Badge({ label, color }: { label: string; color: string }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}40`, borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{label}</span>;
}

function Modal({ sale, clients, onClose, onSaved }: {
  sale: Partial<Sale> | null;
  clients: Client[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Sale>>(sale ?? {
    destination: "", departure_date: "", return_date: "", travelers: 1,
    payment_type: "Cash", status: "Completed", language: "mk",
    items: [], revenue_eur: 0, supplier_cost_eur: 0, profit_eur: 0,
    revenue_mkd: 0, profit_mkd: 0, discount_eur: 0,
  });
  const [items, setItems] = useState<SaleItem[]>((sale?.items as SaleItem[]) ?? []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof Sale, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function addItem() {
    setItems((p) => [...p, { description: "", qty: 1, unit_price_eur: 0, cost_eur: 0, total_eur: 0 }]);
  }
  function setItem(i: number, k: keyof SaleItem, v: string | number) {
    setItems((p) => p.map((it, idx) => {
      if (idx !== i) return it;
      const updated = { ...it, [k]: v };
      updated.total_eur = updated.qty * updated.unit_price_eur;
      return updated;
    }));
  }
  function removeItem(i: number) { setItems((p) => p.filter((_, idx) => idx !== i)); }

  const revenue_eur = items.reduce((s, it) => s + it.total_eur, 0) - (form.discount_eur ?? 0);
  const cost_eur = items.reduce((s, it) => s + it.qty * it.cost_eur, 0);
  const profit_eur = revenue_eur - cost_eur;
  const margin = revenue_eur > 0 ? ((profit_eur / revenue_eur) * 100).toFixed(1) : "0";

  async function save() {
    setSaving(true); setErr("");
    const payload: Record<string, unknown> = {
      ...form, items,
      revenue_eur, supplier_cost_eur: cost_eur, profit_eur,
      revenue_mkd: revenue_eur * MKD_RATE, profit_mkd: profit_eur * MKD_RATE,
      updated_at: new Date().toISOString(),
    };
    delete payload.id; delete payload.code; delete payload.created_at; delete payload.clients;
    if (form.id) {
      const { error } = await supabase.from("sales").update(payload).eq("id", form.id);
      if (error) { setErr(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("sales").insert(payload);
      if (error) { setErr(error.message); setSaving(false); return; }
    }
    setSaving(false); onSaved(); onClose();
  }

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc", boxSizing: "border-box" as const };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 700 as const, color: "#174698", marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 720, maxHeight: "92vh", overflowY: "auto", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#174698" }}>{form.id ? "Edit Sale" : "New Sale"}</h2>
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
          <div>
            <label style={labelStyle}>Destination</label>
            <input value={form.destination ?? ""} onChange={(e) => set("destination", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Travelers</label>
            <input type="number" min={1} value={form.travelers ?? 1} onChange={(e) => set("travelers", +e.target.value)} style={inputStyle} />
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
            <label style={labelStyle}>Payment</label>
            <select value={form.payment_type ?? "Cash"} onChange={(e) => set("payment_type", e.target.value as PaymentType)} style={inputStyle}>
              {["Cash", "Bank Transfer", "Card", "Custom"].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status ?? "Completed"} onChange={(e) => set("status", e.target.value)} style={inputStyle}>
              {["Pending", "Completed", "Cancelled", "Refunded"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Airline</label>
            <input value={form.airline ?? ""} onChange={(e) => set("airline", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Booking Ref / PNR</label>
            <input value={form.booking_ref ?? ""} onChange={(e) => set("booking_ref", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Discount (€)</label>
            <input type="number" min={0} step={0.01} value={form.discount_eur ?? 0} onChange={(e) => set("discount_eur", +e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={labelStyle}>Line Items (Revenue / Cost)</label>
            <button onClick={addItem} style={{ padding: "4px 12px", borderRadius: 8, border: "1px solid #174698", background: "#fff", color: "#174698", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
          </div>
          {items.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13, padding: "10px 0" }}>No items yet.</div>}
          {items.map((it, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 50px 90px 80px 80px 24px", gap: 6, marginBottom: 8, alignItems: "center" }}>
              <input placeholder="Description" value={it.description} onChange={(e) => setItem(i, "description", e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <input type="number" placeholder="Qty" min={1} value={it.qty} onChange={(e) => setItem(i, "qty", +e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <input type="number" placeholder="€/unit sell" min={0} step={0.01} value={it.unit_price_eur} onChange={(e) => setItem(i, "unit_price_eur", +e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <input type="number" placeholder="€ cost" min={0} step={0.01} value={it.cost_eur} onChange={(e) => setItem(i, "cost_eur", +e.target.value)} style={{ ...inputStyle, width: "auto" }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>{fmtEur(it.total_eur)}</div>
              <button onClick={() => removeItem(i)} style={{ border: "none", background: "none", color: "#FF1D1D", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
          ))}
          {items.length > 0 && (
            <div style={{ marginTop: 12, padding: "14px 16px", background: "#f8fafc", borderRadius: 12, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[
                [mk ? "Приход" : "Revenue", fmtEur(revenue_eur), "#174698"],
                ["Cost", fmtEur(cost_eur), "#b45309"],
                [mk ? "Добивка" : "Profit", fmtEur(profit_eur), profit_eur >= 0 ? "#15803d" : "#FF1D1D"],
                ["Margin", `${margin}%`, profit_eur >= 0 ? "#15803d" : "#FF1D1D"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color }}>{val}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Notes</label>
          <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Save Sale"}</button>
        </div>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Sale> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("sales").select("*, clients(first_name,last_name,email,phone)").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,code,first_name,last_name").order("first_name"),
    ]);
    setSales((s ?? []) as Sale[]);
    setClients((c ?? []) as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = sales.filter((s) => {
    const q = search.toLowerCase();
    const cl = s.clients as Client | undefined;
    const ms = !q || `${s.code} ${s.destination ?? ""} ${cl?.first_name ?? ""} ${cl?.last_name ?? ""}`.toLowerCase().includes(q);
    return ms && (statusFilter === "All" || s.status === statusFilter);
  });

  const totals = filtered.reduce((acc, s) => ({
    revenue: acc.revenue + Number(s.revenue_eur),
    profit: acc.profit + Number(s.profit_eur),
  }), { revenue: 0, profit: 0 });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Sales</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{sales.length} total · Revenue {fmtEur(sales.reduce((s, r) => s + Number(r.revenue_eur), 0))}</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ New Sale</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: mk ? "Приход" : "Revenue", value: fmtEur(totals.revenue), color: "#174698" },
          { label: mk ? "Добивка" : "Profit", value: fmtEur(totals.profit), color: "#15803d" },
          { label: "MKD Profit", value: fmtMkd(totals.profit * MKD_RATE), color: "#C9A84C" },
          { label: "Margin", value: totals.revenue > 0 ? `${((totals.profit / totals.revenue) * 100).toFixed(1)}%` : "—", color: "#7c3aed" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 2px 12px rgba(23,70,152,0.07)", borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontWeight: 800, fontSize: "1.15rem", color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input placeholder="Search code, destination, client…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc" }} />
        {["All", "Pending", "Completed", "Cancelled", "Refunded"].map((s) => (
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
                  {["Code", "Client", "Destination", mk ? "Приход" : "Revenue", "Cost", mk ? "Добивка" : "Profit", "Payment", "Status", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const cl = s.clients as Client | undefined;
                  const profitColor = Number(s.profit_eur) >= 0 ? "#15803d" : "#FF1D1D";
                  return (
                    <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#174698", fontWeight: 600 }}>{s.code}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>{cl ? `${cl.first_name} ${cl.last_name}` : "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{s.destination ?? "—"}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#174698" }}>{fmtEur(Number(s.revenue_eur))}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#b45309" }}>{fmtEur(Number(s.supplier_cost_eur))}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: profitColor }}>{fmtEur(Number(s.profit_eur))}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{s.payment_type}</td>
                      <td style={{ padding: "12px 16px" }}><Badge label={s.status} color={STATUS_COLORS[s.status]} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => { setEditing(s); setModalOpen(true); }} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#174698" }}>Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>No sales found.</div>}
        </div>
      )}

      {modalOpen && <Modal sale={editing} clients={clients} onClose={() => setModalOpen(false)} onSaved={load} />}
    </div>
  );
}
