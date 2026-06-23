"use client";

import { useLocale, useTranslations } from "next-intl";
import { SITE } from "@/lib/site-defaults";

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("public");
  const common = useTranslations("common");
  const isEn = locale === "en";
  const address = isEn ? SITE.address.en : SITE.address.mk;
  const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

  return (
    <main className="overflow-x-hidden">
      {/* Hero banner */}
      <div
        className="relative px-6 py-16 text-center sm:py-24"
        style={{
          background: "linear-gradient(135deg, #0f2d5e 0%, var(--amor-blue) 60%, rgba(201,168,76,0.15) 100%)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red), var(--amor-gold))" }}
          aria-hidden
        />
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--amor-gold)" }}>
              {isEn ? "Get in touch" : "Контактирајте нè"}
            </span>
            <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
          </div>
          <h1
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            {t("contactTitle")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            {t("contactIntro")}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">

          {/* Left — contact info */}
          <div>
            <h2 className="mb-2 text-xl font-extrabold" style={{ color: "var(--amor-blue)" }}>
              {isEn ? "Our Details" : "Нашите Детали"}
            </h2>
            <div
              className="mb-8 h-1 w-12 rounded-full"
              style={{ background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red))" }}
            />

            <div className="space-y-4">
              {/* Address */}
              <div className="rounded-xl p-4" style={{ background: "var(--amor-soft)" }}>
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(23,70,152,0.08)", color: "var(--amor-blue)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                      {t("addressLabel")}
                    </p>
                    <p className="break-words text-sm leading-relaxed text-amor-text">{address}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <a href={phoneHref} className="block rounded-xl p-4 transition-opacity hover:opacity-80" style={{ background: "var(--amor-soft)" }}>
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(23,70,152,0.08)", color: "var(--amor-blue)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <div>
                    <p className="mb-0.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                      {t("phoneLabel")}
                    </p>
                    <p className="text-sm text-amor-text">{SITE.phone}</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a href={`mailto:${SITE.publicEmail}`} className="block rounded-xl p-4 transition-opacity hover:opacity-80" style={{ background: "var(--amor-soft)" }}>
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(23,70,152,0.08)", color: "var(--amor-blue)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <div>
                    <p className="mb-0.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--amor-gold)" }}>
                      {t("emailLabel")}
                    </p>
                    <p className="break-all text-sm text-amor-text">{SITE.publicEmail}</p>
                  </div>
                </div>
              </a>
            </div>

            {/* Social */}
            <div className="mt-8">
              <p className="mb-4 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--amor-blue)" }}>
                {isEn ? "Follow Us" : "Следете нè"}
              </p>
              <div className="flex gap-3">
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: "var(--amor-blue)", color: "var(--amor-blue)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: "var(--amor-red)", color: "var(--amor-red)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "var(--amor-white)",
              boxShadow: "0 4px 32px rgba(23,70,152,0.08)",
            }}
          >
            <h2 className="mb-2 text-xl font-extrabold" style={{ color: "var(--amor-blue)" }}>
              {isEn ? "Send a Message" : "Испратете Порака"}
            </h2>
            <div
              className="mb-6 h-1 w-12 rounded-full"
              style={{ background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red))" }}
            />

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-bold" style={{ color: "var(--amor-blue)" }}>
                    {common("client")} *
                  </label>
                  <input
                    id="name" name="name" type="text" required
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ borderColor: "rgba(23,70,152,0.2)", background: "var(--amor-soft)" }}
                    onFocus={e => { e.target.style.borderColor = "var(--amor-blue)"; e.target.style.boxShadow = "0 0 0 3px rgba(23,70,152,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(23,70,152,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-bold" style={{ color: "var(--amor-blue)" }}>
                    {t("phoneLabel")}
                  </label>
                  <input
                    id="phone" name="phone" type="tel"
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={{ borderColor: "rgba(23,70,152,0.2)", background: "var(--amor-soft)" }}
                    onFocus={e => { e.target.style.borderColor = "var(--amor-blue)"; e.target.style.boxShadow = "0 0 0 3px rgba(23,70,152,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(23,70,152,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-bold" style={{ color: "var(--amor-blue)" }}>
                  {t("emailLabel")} *
                </label>
                <input
                  id="email" name="email" type="email" required
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{ borderColor: "rgba(23,70,152,0.2)", background: "var(--amor-soft)" }}
                  onFocus={e => { e.target.style.borderColor = "var(--amor-blue)"; e.target.style.boxShadow = "0 0 0 3px rgba(23,70,152,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(23,70,152,0.2)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-bold" style={{ color: "var(--amor-blue)" }}>
                  {t("messageLabel")} *
                </label>
                <textarea
                  id="message" name="message" rows={5} required
                  className="w-full resize-y rounded-xl border px-4 py-3 text-sm leading-relaxed outline-none transition-all duration-200"
                  style={{ borderColor: "rgba(23,70,152,0.2)", background: "var(--amor-soft)", minHeight: "8rem" }}
                  onFocus={e => { e.target.style.borderColor = "var(--amor-blue)"; e.target.style.boxShadow = "0 0 0 3px rgba(23,70,152,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(23,70,152,0.2)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, var(--amor-blue), #0f2d5e)",
                  boxShadow: "0 4px 16px rgba(23,70,152,0.3)",
                }}
              >
                {common("send")}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m22 2-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
