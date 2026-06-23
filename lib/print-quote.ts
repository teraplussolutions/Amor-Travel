import type { Quote } from "@/lib/crm/types";

type Client = { first_name: string; last_name: string; email?: string | null; phone?: string | null; city?: string | null };
type QuoteItem = { description: string; qty: number; unit_price_eur: number; total_eur: number };

const MKD_RATE = 61.5;
const fmtEur = (n: number) => `€${Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtMkd = (n: number) => `${Math.round(n).toLocaleString("mk-MK")} ден.`;

export function printQuote(quote: Quote & { items?: unknown }, client: Client | undefined, lang: "mk" | "en") {
  const isMk = lang === "mk";
  const items = (quote.items ?? []) as QuoteItem[];
  const total_eur = Number(quote.total_eur ?? items.reduce((s, i) => s + i.total_eur, 0));
  const total_mkd = total_eur * MKD_RATE;
  const dateStr = new Date(quote.created_at ?? Date.now()).toLocaleDateString(isMk ? "mk-MK" : "en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const itemsHtml = items.length > 0 ? `
    <table class="items-table">
      <thead>
        <tr>
          <th style="text-align:left">${isMk ? "Опис / Услуга" : "Description / Service"}</th>
          <th style="text-align:center;width:60px">${isMk ? "Бр." : "Qty"}</th>
          <th style="text-align:right;width:110px">${isMk ? "Ед. цена" : "Unit Price"}</th>
          <th style="text-align:right;width:110px">${isMk ? "Вкупно" : "Total"}</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((it, i) => `
          <tr class="${i % 2 ? "alt" : ""}">
            <td>${it.description}</td>
            <td style="text-align:center">${it.qty}</td>
            <td style="text-align:right">${fmtEur(it.unit_price_eur)}</td>
            <td style="text-align:right;font-weight:700">${fmtEur(it.total_eur)}</td>
          </tr>`).join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align:right;font-weight:800;font-size:15px;color:#174698;padding:14px 16px">${isMk ? "ВКУПНО:" : "TOTAL:"}</td>
          <td style="text-align:right;padding:14px 16px">
            <div style="font-size:22px;font-weight:900;color:#174698">${fmtEur(total_eur)}</div>
            <div style="font-size:12px;color:#64748b;margin-top:2px">${fmtMkd(total_mkd)}</div>
          </td>
        </tr>
      </tfoot>
    </table>` : `<div class="no-items">${isMk ? "Нема ставки." : "No items."}</div>`;

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8"/>
<title>${isMk ? "Понуда" : "Quotation"} ${quote.code}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,900&family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',Arial,sans-serif;font-size:13px;color:#1e293b;background:#fff}
  .page{max-width:820px;margin:0 auto;padding:40px 48px}
  /* Header */
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;margin-bottom:28px;border-bottom:none;position:relative}
  .header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#174698 0%,#FF1D1D 50%,#C9A84C 100%);border-radius:4px}
  .brand-name{font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:900;font-style:italic;color:#174698;letter-spacing:-0.02em}
  .brand-sub{font-size:11px;color:#94a3b8;margin-top:2px;letter-spacing:0.08em;text-transform:uppercase}
  .brand-contact{font-size:11px;color:#64748b;margin-top:6px;line-height:1.6}
  .doc-type{font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:#C9A84C;letter-spacing:0.05em;text-transform:uppercase;text-align:right}
  .doc-code{font-family:monospace;font-size:14px;color:#174698;font-weight:700;text-align:right;margin-top:4px}
  .doc-date{font-size:11px;color:#94a3b8;text-align:right;margin-top:3px}
  /* Status badge */
  .status-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;background:#174698;color:#fff;margin-top:6px}
  /* Sections */
  .section-label{font-size:9px;font-weight:800;color:#C9A84C;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px}
  .client-card{background:linear-gradient(135deg,#f8faff,#f0f4ff);border-radius:12px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #174698}
  .client-name{font-size:17px;font-weight:800;color:#1e293b}
  .client-detail{font-size:12px;color:#64748b;margin-top:2px}
  /* Trip info grid */
  .info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}
  .info-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px}
  .info-label{font-size:9px;font-weight:800;color:#C9A84C;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px}
  .info-value{font-size:14px;font-weight:700;color:#1e293b}
  /* Items table */
  .items-table{width:100%;border-collapse:collapse;margin-bottom:8px;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(23,70,152,0.08)}
  .items-table thead tr{background:#174698}
  .items-table thead th{padding:11px 16px;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em}
  .items-table tbody td{padding:11px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
  .items-table tbody tr.alt td{background:#f8fafc}
  .items-table tfoot td{background:#fff;border-top:2px solid #174698}
  /* Total highlight box */
  .total-box{background:linear-gradient(135deg,#174698,#0f2d5e);border-radius:12px;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
  .total-label{color:rgba(255,255,255,0.7);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em}
  .total-eur{color:#fff;font-size:28px;font-weight:900}
  .total-mkd{color:#C9A84C;font-size:14px;font-weight:600;margin-top:2px}
  /* Notes */
  .notes-box{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:12px;color:#78350f;line-height:1.6}
  .terms-box{padding-top:16px;border-top:1px solid #e2e8f0;margin-bottom:24px}
  .terms-text{font-size:11px;color:#64748b;line-height:1.7;white-space:pre-wrap}
  /* Signatures */
  .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:32px;padding-top:20px;border-top:2px solid #e2e8f0}
  .sig-line{border-top:1px solid #94a3b8;padding-top:8px;margin-top:36px}
  .sig-label{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em}
  /* Footer */
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}
  .footer-brand{font-family:'Playfair Display',Georgia,serif;font-size:14px;font-style:italic;color:#174698;font-weight:700}
  .footer-text{font-size:10px;color:#94a3b8}
  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    @page{margin:0.5in;size:A4}
  }
</style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand-name">Amor Travel</div>
      <div class="brand-sub">${isMk ? "Туристичка агенција" : "Travel Agency"}</div>
      <div class="brand-contact">
        📍 Скопје, Македонија<br/>
        📞 +389 70 123 456<br/>
        🌐 amortravel.net
      </div>
    </div>
    <div>
      <div class="doc-type">${isMk ? "ПОНУДА" : "QUOTATION"}</div>
      <div class="doc-code">#${quote.code}</div>
      <div class="doc-date">${dateStr}</div>
      <div><span class="status-badge">${quote.status ?? "Draft"}</span></div>
    </div>
  </div>

  ${client ? `
  <!-- Client -->
  <div class="section-label">${isMk ? "Клиент" : "Client"}</div>
  <div class="client-card">
    <div class="client-name">${client.first_name} ${client.last_name}</div>
    ${client.email ? `<div class="client-detail">✉️ ${client.email}</div>` : ""}
    ${client.phone ? `<div class="client-detail">📞 ${client.phone}</div>` : ""}
    ${client.city ? `<div class="client-detail">📍 ${client.city}</div>` : ""}
  </div>` : ""}

  <!-- Trip Details -->
  <div class="section-label">${isMk ? "Детали за патување" : "Trip Details"}</div>
  <div class="info-grid">
    ${quote.destination ? `<div class="info-card"><div class="info-label">✈️ ${isMk ? "Дестинација" : "Destination"}</div><div class="info-value">${quote.destination}</div></div>` : ""}
    ${quote.departure_date ? `<div class="info-card"><div class="info-label">📅 ${isMk ? "Поаѓање" : "Departure"}</div><div class="info-value">${quote.departure_date}</div></div>` : ""}
    ${quote.return_date ? `<div class="info-card"><div class="info-label">🔙 ${isMk ? "Враќање" : "Return"}</div><div class="info-value">${quote.return_date}</div></div>` : ""}
    <div class="info-card"><div class="info-label">👥 ${isMk ? "Патници" : "Travelers"}</div><div class="info-value">${quote.travelers ?? 1}</div></div>
    ${quote.expiry_date ? `<div class="info-card"><div class="info-label">⏳ ${isMk ? "Важи до" : "Valid Until"}</div><div class="info-value">${quote.expiry_date}</div></div>` : ""}
  </div>

  <!-- Items -->
  <div class="section-label">${isMk ? "Ставки / Услуги" : "Items / Services"}</div>
  ${itemsHtml}

  <!-- Total -->
  <div class="total-box">
    <div>
      <div class="total-label">${isMk ? "Вкупна сума" : "Grand Total"}</div>
      <div class="total-eur">${fmtEur(total_eur)}</div>
      <div class="total-mkd">${fmtMkd(total_mkd)}</div>
    </div>
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,0.5);font-size:10px;text-transform:uppercase;letter-spacing:0.1em">${isMk ? "По патник" : "Per traveler"}</div>
      <div style="color:#C9A84C;font-size:18px;font-weight:800">${fmtEur(total_eur / Math.max(1, quote.travelers ?? 1))}</div>
    </div>
  </div>

  ${quote.notes ? `<div class="notes-box">💬 ${quote.notes}</div>` : ""}

  ${quote.terms ? `
  <div class="terms-box">
    <div class="section-label">${isMk ? "Услови и одредби" : "Terms & Conditions"}</div>
    <div class="terms-text">${quote.terms}</div>
  </div>` : ""}

  <!-- Signatures -->
  <div class="sig-grid">
    <div>
      <div style="font-size:11px;color:#64748b;margin-bottom:4px">${isMk ? "Потпис на агент:" : "Agent Signature:"}</div>
      <div class="sig-line"><div class="sig-label">${isMk ? "Овластен претставник" : "Authorized Representative"}</div></div>
    </div>
    <div>
      <div style="font-size:11px;color:#64748b;margin-bottom:4px">${isMk ? "Потпис на клиент:" : "Client Signature:"}</div>
      <div class="sig-line"><div class="sig-label">${isMk ? "Клиент / Корисник" : "Client / Customer"}</div></div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-brand">Amor Travel</div>
    <div class="footer-text">${isMk ? "Генерирано" : "Generated"}: ${dateStr} · amortravel.net</div>
  </div>
</div>
</body>
</html>`;

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) { alert("Allow pop-ups to print"); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}
