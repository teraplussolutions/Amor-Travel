type Client = { first_name: string; last_name: string };
type Voucher = {
  code: string; type: string; value: number; status: string;
  description?: string | null; expiry_date?: string | null;
  uses_limit?: number | null; uses_remaining?: number | null;
};

export function printVoucher(voucher: Voucher, client: Client | undefined) {
  const valueLabel =
    voucher.type === "percent" ? `${voucher.value}%`
    : voucher.type === "fixed" ? `€${voucher.value}`
    : "FREE";
  const valueDesc =
    voucher.type === "percent" ? "DISCOUNT"
    : voucher.type === "fixed" ? "OFF"
    : "GIFT";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Voucher ${voucher.code}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,900&family=Inter:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0a1628;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;font-family:'Inter',Arial,sans-serif}
  .card{
    width:100%;max-width:680px;
    border-radius:24px;
    overflow:hidden;
    position:relative;
    box-shadow:0 40px 80px rgba(0,0,0,0.6);
  }
  /* Layered background */
  .bg{
    position:absolute;inset:0;
    background:linear-gradient(135deg,#0a1628 0%,#0f2d5e 40%,#1a4080 70%,#0a1628 100%);
  }
  /* Decorative circles */
  .circle1{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%);top:-100px;right:-80px}
  .circle2{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(23,70,152,0.4) 0%,transparent 70%);bottom:-80px;left:-60px}
  /* Dotted pattern */
  .dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px);background-size:24px 24px}
  /* Content */
  .content{position:relative;z-index:10;padding:40px 48px}
  /* Top bar */
  .top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px}
  .agency-name{font-family:'Playfair Display',Georgia,serif;font-size:22px;font-style:italic;font-weight:900;color:#fff;letter-spacing:-0.01em}
  .agency-name span{color:#C9A84C}
  .agency-tagline{font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.15em;margin-top:2px}
  .voucher-label{text-align:right}
  .voucher-tag{font-size:10px;font-weight:800;color:#C9A84C;text-transform:uppercase;letter-spacing:0.2em;border:1px solid rgba(201,168,76,0.4);padding:4px 12px;border-radius:20px}
  /* Gold divider */
  .divider{height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:0 0 32px}
  /* Value */
  .value-section{text-align:center;margin-bottom:36px}
  .value-amount{font-family:'Playfair Display',Georgia,serif;font-size:80px;font-weight:900;color:#fff;line-height:1;text-shadow:0 0 60px rgba(201,168,76,0.4)}
  .value-desc{font-size:13px;font-weight:800;color:#C9A84C;text-transform:uppercase;letter-spacing:0.25em;margin-top:6px}
  ${voucher.description ? `.value-note{font-size:13px;color:rgba(255,255,255,0.6);margin-top:10px;font-style:italic}` : ""}
  /* Info row */
  .info-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
  .info-item{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;text-align:center;backdrop-filter:blur(4px)}
  .info-item-label{font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:4px}
  .info-item-value{font-size:14px;font-weight:700;color:#fff}
  /* Code section */
  .code-section{background:rgba(201,168,76,0.1);border:2px dashed rgba(201,168,76,0.5);border-radius:16px;padding:20px 24px;text-align:center;margin-bottom:32px}
  .code-label{font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.2em;margin-bottom:8px}
  .code-value{font-family:monospace;font-size:28px;font-weight:900;color:#C9A84C;letter-spacing:0.2em}
  /* Bottom */
  .bottom{display:flex;justify-content:space-between;align-items:center}
  .status-badge{padding:6px 16px;border-radius:20px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;background:${voucher.status === "Active" ? "linear-gradient(135deg,#15803d,#166534)" : "rgba(255,255,255,0.1)"};color:#fff}
  .footer-text{font-size:10px;color:rgba(255,255,255,0.3);text-align:right}
  /* Gold strips */
  .strip-top{height:5px;background:linear-gradient(90deg,#C9A84C,#FF1D1D,#C9A84C)}
  .strip-bottom{height:5px;background:linear-gradient(90deg,#174698,#C9A84C,#174698)}
  @media print{
    body{background:#0a1628;-webkit-print-color-adjust:exact;print-color-adjust:exact;min-height:unset;padding:0}
    .card{max-width:100%;box-shadow:none}
    @page{margin:0;size:A5 landscape}
  }
</style>
</head>
<body>
<div class="card">
  <div class="bg"></div>
  <div class="circle1"></div>
  <div class="circle2"></div>
  <div class="dots"></div>
  <div class="strip-top"></div>
  <div class="content">
    <!-- Top -->
    <div class="top-bar">
      <div>
        <div class="agency-name">Amor <span>Travel</span></div>
        <div class="agency-tagline">Travel Agency · Macedonia</div>
      </div>
      <div class="voucher-label">
        <div class="voucher-tag">✦ Travel Voucher</div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Value -->
    <div class="value-section">
      <div class="value-amount">${valueLabel}</div>
      <div class="value-desc">${valueDesc}</div>
      ${voucher.description ? `<div class="value-note">${voucher.description}</div>` : ""}
    </div>

    <!-- Info -->
    <div class="info-row">
      ${client ? `
      <div class="info-item">
        <div class="info-item-label">Issued To</div>
        <div class="info-item-value">${client.first_name} ${client.last_name}</div>
      </div>` : `
      <div class="info-item">
        <div class="info-item-label">Type</div>
        <div class="info-item-value">${voucher.type.charAt(0).toUpperCase() + voucher.type.slice(1)}</div>
      </div>`}
      <div class="info-item">
        <div class="info-item-label">Valid Until</div>
        <div class="info-item-value">${voucher.expiry_date ?? "—"}</div>
      </div>
      <div class="info-item">
        <div class="info-item-label">Uses Left</div>
        <div class="info-item-value">${voucher.uses_remaining ?? "∞"}</div>
      </div>
    </div>

    <!-- Code -->
    <div class="code-section">
      <div class="code-label">Voucher Code</div>
      <div class="code-value">${voucher.code}</div>
    </div>

    <!-- Bottom -->
    <div class="bottom">
      <span class="status-badge">${voucher.status}</span>
      <div class="footer-text">amortravel.net<br/>Valid for travel services only</div>
    </div>
  </div>
  <div class="strip-bottom"></div>
</div>
</body>
</html>`;

  const w = window.open("", "_blank", "width=800,height=550");
  if (!w) { alert("Allow pop-ups to print"); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}
