"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguagePicker } from "@/components/LanguagePicker";
import { MobileNav, MenuButton } from "@/components/MobileNav";
import {
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons/SocialIcons";
import { SITE } from "@/lib/site-defaults";
import { BRAND_LOGO } from "@/lib/site-images";

function HomeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function PlaneIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
}
function ContactIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}

const navLinks = [
  { href: "/", labelKey: "home" as const, Icon: HomeIcon },
  { href: "/patuvanja", labelKey: "trips" as const, Icon: PlaneIcon },
  { href: "/kontakt", labelKey: "contact" as const, Icon: ContactIcon },
];

const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

export function PublicHeaderNav() {
  const t = useTranslations("common");
  const tPublic = useTranslations("public");
  const locale = useLocale() as "mk" | "en";
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="header-main">
      {/* ── DESKTOP ── */}
      <div className="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:flex lg:px-8" style={{ minHeight: 80 }}>
        <Link href="/" className="header-brand group flex items-center gap-3" style={{ flexShrink: 0 }}>
          <Image src={BRAND_LOGO.src} alt={locale === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn}
            width={180} height={180} priority
            style={{ width: "clamp(90px, 14vw, 180px)", height: "clamp(90px, 14vw, 180px)", objectFit: "contain", flexShrink: 0 }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.01em", color: "var(--amor-red)", lineHeight: 1.1, whiteSpace: "nowrap" }}>
            {SITE.companyName}
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main" style={{ flex: 1, justifyContent: "center" }}>
          {navLinks.map(({ href, labelKey, Icon }) => (
            <Link key={href} href={href} className={`header-nav-link${isActive(href) ? " header-nav-link--active" : ""}`} style={{ gap: "0.4rem", display: "inline-flex", alignItems: "center" }}>
              <Icon />{t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          <a href={phoneHref} className="header-top-bar__phone" style={{ fontSize: "0.85rem", padding: "0.3rem 0.75rem" }}>
            <PhoneIcon className="h-3.5 w-3.5" />{SITE.phone}
          </a>
          <div className="header-social">
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="header-social__link" aria-label="Facebook"><FacebookIcon className="h-4 w-4" /></a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="header-social__link" aria-label="Instagram"><InstagramIcon className="h-4 w-4" /></a>
          </div>
          <LanguagePicker variant="header" />
        </div>
      </div>

      {/* ── MOBILE: [logo + name centered] [hamburger right] ── */}
      <div className="flex items-center px-3 lg:hidden" style={{ minHeight: 76 }}>
        {/* Logo + Name together — centered */}
        <Link href="/" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}>
          <Image
            src={BRAND_LOGO.src}
            alt={locale === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn}
            width={70} height={70} priority
            style={{ width: 70, height: 70, objectFit: "contain", flexShrink: 0 }}
          />
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.2rem, 5.5vw, 1.5rem)", fontWeight: 900, fontStyle: "italic", color: "var(--amor-red)", lineHeight: 1.1 }}>
            {SITE.companyName}
          </span>
        </Link>
        {/* Hamburger right */}
        <div style={{ flexShrink: 0 }}>
          <MenuButton onClick={() => setMenuOpen(true)} />
        </div>
      </div>

      {/* ── Mobile nav drawer ── */}
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} title={SITE.companyName}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Nav buttons */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }} aria-label="Mobile">
            {navLinks.map(({ href, labelKey, Icon }, i) => {
              const active = isActive(href);
              const colors = ["#174698", "#C9A84C", "#FF1D1D"];
              const accent = colors[i % colors.length];
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px 20px", borderRadius: 16,
                  background: active ? `linear-gradient(135deg, ${accent}18, ${accent}08)` : "#f8fafc",
                  border: `2px solid ${active ? accent : "#e8ecf4"}`,
                  textDecoration: "none",
                  boxShadow: active ? `0 4px 20px ${accent}25` : "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: active ? accent : `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#fff" : accent }}>
                    <Icon />
                  </span>
                  <span style={{ fontSize: "1.05rem", fontWeight: 700, color: active ? accent : "#1e293b" }}>
                    {t(labelKey)}
                  </span>
                  <span style={{ marginLeft: "auto", color: active ? accent : "#cbd5e1", fontSize: 18 }}>›</span>
                </Link>
              );
            })}
          </nav>

          {/* Gold divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C, transparent)", marginBottom: 24 }} />

          {/* Contact card */}
          <div style={{ borderRadius: 20, background: "linear-gradient(135deg, #0a1f40, #174698)", padding: "22px 20px", marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>Contact us</p>
            <a href={phoneHref} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 14, marginBottom: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", textDecoration: "none" }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: "#FF1D1D20", border: "1px solid #FF1D1D50", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PhoneIcon className="h-5 w-5" style={{ color: "#FF1D1D" }} />
              </span>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Phone</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{SITE.phone}</div>
              </div>
            </a>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 16px", borderRadius: 14, marginBottom: 16, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: "#C9A84C20", border: "1px solid #C9A84C50", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <MapPinIcon className="h-5 w-5" style={{ color: "#C9A84C" }} />
              </span>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Address</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{SITE.address.mk}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Follow us</span>
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <LanguagePicker variant="header" className="w-fit" />
          </div>
        </div>
      </MobileNav>
    </div>
  );
}
