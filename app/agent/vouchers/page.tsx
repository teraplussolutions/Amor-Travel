"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Voucher, VoucherType, Client } from "@/lib/crm/types";
import { fmtEur } from "@/lib/crm/types";

const supabase = createClient();

const STATUS_COLORS = { Active: "#15803d", Used: "#174698", Expired: "#64748b" };

function Badge({ label, color }: { label: string; color: string }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}40`, borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{label}</span>;
}

function Modal({ voucher, clients, onClose, onSaved }: {
  voucher: Partial<Voucher> | null;
  clients: Client[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Voucher>>(voucher ?? {
    type: "percent", value: 10, description: "", uses_limit: 1, uses_remaining: 1, status: "Active",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof Voucher, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true); setErr("");
    const payload: Record<string, unknown> = { ...form };
    delete payload.id; delete payload.code; delete payload.created_at; delete payload.clients;
    if (form.id) {
      const { error } = await supabase.from("vouchers").update(payload).eq("id", form.id);
      if (error) { setErr(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("vouchers").insert(payload);
      if (error) { setErr(error.message); setSaving(false); return; }
    }
    setSaving(false); onSaved(); onClose();
  }

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, background: "#f8fafc", boxSizing: "border-box" as const };
  const labelStyle = { display: "block" as const, fontSize: 12, fontWeight: 700 as const, color: "#174698", marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#174698" }}>{form.id ? "Edit Voucher" : "New Voucher"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>
        {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>{err}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Type</label>
            <select value={form.type ?? "percent"} onChange={(e) => set("type", e.target.value as VoucherType)} style={inputStyle}>
              <option value="percent">% Discount</option>
              <option value="fixed">€ Fixed discount</option>
              <option value="free">Free (gift)</option>
            </select>
          </div>
          {form.type !== "free" && (
            <div>
              <label style={labelStyle}>Value {form.type === "percent" ? "(%)" : "(€)"}</label>
              <input type="number" min={0} step={form.type === "percent" ? 1 : 0.01} value={form.value ?? 0} onChange={(e) => set("value", +e.target.value)} style={inputStyle} />
            </div>
          )}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Description</label>
            <input value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} style={inputStyle} placeholder="e.g. Summer 2026 promo" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Client (optional)</label>
            <select value={form.client_id ?? ""} onChange={(e) => set("client_id", e.target.value || undefined)} style={inputStyle}>
              <option value="">— Any client —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input type="date" value={form.expiry_date ?? ""} onChange={(e) => set("expiry_date", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Max Uses</label>
            <input type="number" min={1} value={form.uses_limit ?? 1} onChange={(e) => { set("uses_limit", +e.target.value); set("uses_remaining", +e.target.value); }} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status ?? "Active"} onChange={(e) => set("status", e.target.value)} style={inputStyle}>
              {["Active", "Used", "Expired"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Save Voucher"}</button>
        </div>
      </div>
    </div>
  );
}

function PrintVoucher({ voucher, client, onClose }: { voucher: Voucher; client?: Client; onClose: () => void }) {
  const valueLabel = voucher.type === "percent" ? `${voucher.value}% Попуст` : voucher.type === "fixed" ? fmtEur(voucher.value) + " Попуст" : "Бесплатно";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 600, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <span style={{ fontWeight: 700, color: "#174698" }}>Voucher — {voucher.code}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => window.print()} style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "#174698", color: "#fff", fontWeight: 700, cursor: "pointer" }}>🖨️ Print</button>
            <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>✕</button>
          </div>
        </div>
        {/* Voucher design */}
        <div style={{ padding: 32 }}>
          <div style={{ border: "3px solid #C9A84C", borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg,#0f2d5e 0%,#174698 100%)" }}>
            {/* Gold top strip */}
            <div style={{ height: 6, background: "linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)" }} />
            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#C9A84C", letterSpacing: "0.05em" }}>AMOR TRAVEL</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>ПАТНИЧКИ ВАУЧЕР</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>КОД</div>
                  <div style={{ fontSize: 16, fontFamily: "monospace", fontWeight: 800, color: "#fff", letterSpacing: "0.1em" }}>{voucher.code}</div>
                </div>
              </div>
              <div style={{ margin: "24px 0", textAlign: "center", padding: "20px", background: "rgba(201,168,76,0.15)", borderRadius: 16, border: "1px solid rgba(201,168,76,0.3)" }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#C9A84C" }}>{valueLabel}</div>
                {voucher.description && <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>{voucher.description}</div>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {client && (
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>За клиент</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 }}>{client.first_name} {client.last_name}</div>
                  </div>
                )}
                {voucher.expiry_date && (
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Важи до</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 }}>{voucher.expiry_date}</div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ height: 6, background: "linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Voucher> | null>(null);
  const [printing, setPrinting] = useState<Voucher | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: v }, { data: c }] = await Promise.all([
      supabase.from("vouchers").select("*, clients(first_name,last_name)").order("created_at", { ascending: false }),
      supabase.from("clients").select("id,first_name,last_name").order("first_name"),
    ]);
    setVouchers((v ?? []) as Voucher[]);
    setClients((c ?? []) as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = vouchers.filter((v) => statusFilter === "All" || v.status === statusFilter);
  const printClient = printing ? clients.find((c) => c.id === printing.client_id) : undefined;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Vouchers</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{vouchers.length} total</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ New Voucher</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Active", "Used", "Expired"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", borderColor: statusFilter === s ? "#174698" : "#e2e8f0", background: statusFilter === s ? "#174698" : "#fff", color: statusFilter === s ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {filtered.map((v) => {
            const cl = v.clients as Client | undefined;
            const valueLabel = v.type === "percent" ? `${v.value}%` : v.type === "fixed" ? fmtEur(v.value) : "FREE";
            return (
              <div key={v.id} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(23,70,152,0.08)", overflow: "hidden" }}>
                <div style={{ height: 4, background: "linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)" }} />
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#174698" }}>{v.code}</div>
                    <Badge label={v.status} color={STATUS_COLORS[v.status]} />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#C9A84C", margin: "10px 0" }}>{valueLabel}</div>
                  {v.description && <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{v.description}</div>}
                  {cl && <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 600 }}>👤 {cl.first_name} {cl.last_name}</div>}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
                    <span>Uses: {v.uses_remaining}/{v.uses_limit}</span>
                    {v.expiry_date && <span>Expires: {v.expiry_date}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button onClick={() => setPrinting(v)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #C9A84C", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#C9A84C" }}>🎫 Print</button>
                    <button onClick={() => { setEditing(v); setModalOpen(true); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#174698" }}>Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ color: "#94a3b8", padding: 40, textAlign: "center", gridColumn: "1/-1" }}>No vouchers found.</div>}
        </div>
      )}

      {modalOpen && <Modal voucher={editing} clients={clients} onClose={() => setModalOpen(false)} onSaved={load} />}
      {printing && <PrintVoucher voucher={printing} client={printClient} onClose={() => setPrinting(null)} />}
    </div>
  );
}
