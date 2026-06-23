"use client";
import { exportPDF } from "@/lib/export-pdf";
import { useStaffLang } from "@/components/StaffLangContext";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Expense } from "@/lib/crm/types";
import { EXPENSE_CATEGORIES, MKD_RATE, fmtEur } from "@/lib/crm/types";

const supabase = createClient();

const CAT_COLORS: Record<string, string> = {
  Office: "#174698", Marketing: "#FF1D1D", Travel: "#C9A84C",
  Supplier: "#7c3aed", Software: "#0891b2", Salary: "#15803d",
  Tax: "#b45309", Other: "#64748b",
};

function Modal({ expense, onClose, onSaved }: {
  expense: Partial<Expense> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Expense>>(expense ?? {
    description: "", category: "Office", amount_eur: 0,
    expense_date: new Date().toISOString().split("T")[0],
    payment_type: "Cash", is_recurring: false,
  });
  const [customCat, setCustomCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof Expense, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const isCustom = form.category === "__custom__";

  async function save() {
    if (!form.description) { setErr("Потребен е опис"); return; }
    if (isCustom && !customCat) { setErr("Внеси категорија"); return; }
    setSaving(true); setErr("");
    const amount_eur = Number(form.amount_eur ?? 0);
    const payload: Record<string, unknown> = {
      ...form,
      category: isCustom ? customCat : form.category,
      amount_eur,
      amount_mkd: amount_eur * MKD_RATE,
    };
    delete payload.id; delete payload.code; delete payload.created_at;
    if (form.id) {
      const { error } = await supabase.from("expenses").update(payload).eq("id", form.id);
      if (error) { setErr(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("expenses").insert(payload);
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
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#174698" }}>{form.id ? "Уреди трошок" : "Нов трошок"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>
        {err && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>{err}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Description *</label>
            <input value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={isCustom ? "__custom__" : (form.category ?? "Office")} onChange={(e) => set("category", e.target.value)} style={inputStyle}>
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="__custom__">+ Custom…</option>
            </select>
          </div>
          {isCustom && (
            <div>
              <label style={labelStyle}>Custom Category</label>
              <input value={customCat} onChange={(e) => setCustomCat(e.target.value)} style={inputStyle} placeholder="e.g. Insurance" />
            </div>
          )}
          <div>
            <label style={labelStyle}>Subcategory</label>
            <input value={form.subcategory ?? ""} onChange={(e) => set("subcategory", e.target.value)} style={inputStyle} placeholder="Optional" />
          </div>
          <div>
            <label style={labelStyle}>Amount (€)</label>
            <input type="number" min={0} step={0.01} value={form.amount_eur ?? 0} onChange={(e) => set("amount_eur", +e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.expense_date ?? ""} onChange={(e) => set("expense_date", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Payment</label>
            <select value={form.payment_type ?? "Cash"} onChange={(e) => set("payment_type", e.target.value)} style={inputStyle}>
              {["Cash", "Bank Transfer", "Card", "Custom"].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Reference ID</label>
            <input value={form.reference_id ?? ""} onChange={(e) => set("reference_id", e.target.value)} style={inputStyle} placeholder="Invoice #, receipt…" />
          </div>
          <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="recurring" checked={form.is_recurring ?? false} onChange={(e) => set("is_recurring", e.target.checked)} style={{ width: 16, height: 16 }} />
            <label htmlFor="recurring" style={{ fontSize: 14, color: "#1e293b" }}>Recurring expense</label>
          </div>
          {form.is_recurring && (
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Recurrence Period</label>
              <select value={form.recurrence_period ?? ""} onChange={(e) => set("recurrence_period", e.target.value)} style={inputStyle}>
                <option value="">Select…</option>
                {["Monthly", "Quarterly", "Yearly"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", cursor: "pointer", fontWeight: 700, opacity: saving ? 0.7 : 1 }}>{saving ? "Се зачувува..." : "Зачувај трошок"}</button>
        </div>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Expense> | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pdfLang, setPdfLang] = useState<"mk"|"en">("mk");
  const { lang } = useStaffLang();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    setExpenses((data ?? []) as Expense[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function deleteExp() {
    if (!delId) return;
    await supabase.from("expenses").delete().eq("id", delId);
    setDelId(null); load();
  }

  const filtered = expenses.filter((e) => {
    const q = search.toLowerCase();
    const ms = !q || `${e.description} ${e.category} ${e.code}`.toLowerCase().includes(q);
    return ms && (catFilter === "All" || e.category === catFilter);
  });

  const totalFiltered = filtered.reduce((s, e) => s + Number(e.amount_eur), 0);

  // Build category breakdown
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount_eur);
    return acc;
  }, {});

  const allCategories = Object.keys(byCategory).sort();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#174698" }}>Expenses</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{expenses.length} records · Total {fmtEur(expenses.reduce((s, e) => s + Number(e.amount_eur), 0))}</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#174698,#0f2d5e)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Add Expense</button>
      </div>

      {/* Category breakdown */}
      {allCategories.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          {allCategories.map((cat) => (
            <div key={cat} style={{ background: "#fff", borderRadius: 12, padding: "10px 16px", boxShadow: "0 2px 10px rgba(23,70,152,0.07)", borderLeft: `4px solid ${CAT_COLORS[cat] ?? "#64748b"}`, cursor: "pointer" }} onClick={() => setCatFilter(catFilter === cat ? "All" : cat)}>
              <div style={{ fontSize: 11, color: "#64748b" }}>{cat}</div>
              <div style={{ fontWeight: 800, color: CAT_COLORS[cat] ?? "#64748b", fontSize: "1rem" }}>{fmtEur(byCategory[cat])}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: "#f8fafc", borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 20, overflow: "hidden" }}>
        <button type="button" onClick={() => setFiltersOpen(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#174698", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            {lang === "mk" ? "Пребарај и Филтер" : "Search & Filter"}
            {(search || catFilter !== "All") && <span style={{ background: "#FF1D1D", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{lang === "mk" ? "активен" : "active"}</span>}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#174698" strokeWidth="2" style={{ transform: filtersOpen ? "rotate(180deg)" : "none", transition: "0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
        </button>
        {filtersOpen && (
          <div style={{ padding: "0 16px 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input placeholder={lang === "mk" ? "Пребарај опис, категорија..." : "Search description, category..."} value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, background: "#fff" }} />
            <button onClick={() => setCatFilter("All")} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", borderColor: catFilter === "All" ? "#174698" : "#e2e8f0", background: catFilter === "All" ? "#174698" : "#fff", color: catFilter === "All" ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{lang === "mk" ? "Сите" : "All"}</button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{lang === "mk" ? "Извоз:" : "Export:"}</span>
        {(["mk","en"] as const).map(l => (
          <button key={l} onClick={() => setPdfLang(l)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid", borderColor: pdfLang === l ? "#174698" : "#e2e8f0", background: pdfLang === l ? "#174698" : "#fff", color: pdfLang === l ? "#fff" : "#64748b", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{l.toUpperCase()}</button>
        ))}
        <button onClick={() => exportPDF({
          titleMk: "Трошоци", titleEn: "Expenses",
          columns: [
            { mk: "Код", en: "Code" }, { mk: "Датум", en: "Date" }, { mk: "Опис", en: "Description" },
            { mk: "Категорија", en: "Category" }, { mk: "Износ (€)", en: "Amount (€)" },
            { mk: "Износ (ден)", en: "Amount (MKD)" }, { mk: "Плаќање", en: "Payment" }
          ],
          rows: filtered.map(e => [e.code, e.expense_date ?? "—", e.description, e.category,
            Number(e.amount_eur).toFixed(2), Number(e.amount_mkd ?? 0).toFixed(0), e.payment_type ?? "—"]),
          lang: pdfLang,
          subtitle: `${lang === "mk" ? "Вкупно" : "Total"}: €${filtered.reduce((s,e) => s + Number(e.amount_eur), 0).toFixed(2)}`,
        })} style={{ padding: "7px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#FF1D1D,#c01515)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          PDF
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(23,70,152,0.07)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Code", "Date", "Опис", "Категорија", "Износ", "Payment", ""].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: "#174698" }}>{e.code}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{e.expense_date}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>{e.description}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: (CAT_COLORS[e.category] ?? "#64748b") + "18", color: CAT_COLORS[e.category] ?? "#64748b", border: `1px solid ${(CAT_COLORS[e.category] ?? "#64748b")}40`, borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{e.category}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#b45309" }}>{fmtEur(Number(e.amount_eur))}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>{e.payment_type}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setEditing(e); setModalOpen(true); }} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#174698" }}>Edit</button>
                        <button onClick={() => setDelId(e.id)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#FF1D1D" }}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr style={{ borderTop: "2px solid #e2e8f0", background: "#f8fafc" }}>
                    <td colSpan={4} style={{ padding: "12px 16px", fontWeight: 700, color: "#64748b" }}>Total ({filtered.length} records)</td>
                    <td style={{ padding: "12px 16px", fontWeight: 800, color: "#b45309", fontSize: "1.05rem" }}>{fmtEur(totalFiltered)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {filtered.length === 0 && <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>No expenses found.</div>}
        </div>
      )}

      {modalOpen && <Modal expense={editing} onClose={() => setModalOpen(false)} onSaved={load} />}
      {delId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 380, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontWeight: 800, color: "#FF1D1D", marginBottom: 8 }}>Delete Expense?</h3>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <button onClick={() => setDelId(null)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={deleteExp} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#FF1D1D", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
