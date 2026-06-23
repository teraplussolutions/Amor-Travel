// PDF export utility — opens a print window with a styled table
export type ExportCol = { mk: string; en: string };
export type ExportRow = (string | number | null | undefined)[];

export function exportPDF(opts: {
  titleMk: string;
  titleEn: string;
  columns: ExportCol[];
  rows: ExportRow[];
  lang: "mk" | "en";
  subtitle?: string;
}) {
  const { titleMk, titleEn, columns, rows, lang, subtitle } = opts;
  const title = lang === "mk" ? titleMk : titleEn;
  const now = new Date().toLocaleDateString(lang === "mk" ? "mk-MK" : "en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const headers = columns.map((c) => (lang === "mk" ? c.mk : c.en));

  const tableRows = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${cell ?? "—"}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: #1e293b; background: #fff; padding: 24px 28px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 3px solid #174698; padding-bottom: 14px; }
  .brand { font-size: 20px; font-weight: 800; color: #174698; letter-spacing: -0.01em; }
  .brand span { color: #FF1D1D; }
  .meta { text-align: right; font-size: 10px; color: #64748b; }
  h1 { font-size: 15px; font-weight: 800; color: #174698; margin-bottom: 4px; }
  .subtitle { font-size: 10px; color: #64748b; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  thead tr { background: #174698; }
  thead th { padding: 8px 10px; text-align: left; color: #fff; font-weight: 700; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr:hover { background: #eff6ff; }
  td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  .footer { margin-top: 18px; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
  .count { font-weight: 700; color: #174698; }
  @media print {
    body { padding: 10px; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="brand">Amor <span>Travel</span></div>
    <div style="font-size:9px;color:#64748b;margin-top:2px">amortravel.net</div>
  </div>
  <div class="meta">
    <div>${lang === "mk" ? "Датум" : "Date"}: <strong>${now}</strong></div>
    <div>${lang === "mk" ? "Вкупно записи" : "Total records"}: <strong class="count">${rows.length}</strong></div>
  </div>
</div>
<h1>${title}</h1>
${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
<table>
  <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
  <tbody>${tableRows}</tbody>
</table>
<div class="footer">
  <span>Amor Travel Agency — ${lang === "mk" ? "Извоз" : "Export"} PDF</span>
  <span>${lang === "mk" ? "Генерирано" : "Generated"}: ${now}</span>
</div>
</body>
</html>`;

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) { alert("Allow pop-ups to export PDF"); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}
