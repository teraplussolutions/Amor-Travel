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
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function PlaneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
}
function ContactIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
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
      {/* ── DESKTOP layout ── */}
      <div
        className="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:flex lg:px-8"
        style={{ minHeight: 80 }}
      >
        {/* Brand */}
        <Link href="/" className="header-brand group flex items-center gap-3" style={{ flexShrink: 0 }}>
          <Image
            src={BRAND_LOGO.src}
            alt={locale === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn}
            width={180} height={180} priority
            style={{ width: "clamp(90px, 14vw, 180px)", height: "clamp(90px, 14vw, 180px)", objectFit: "contain", flexShrink: 0, transition: "transform 0.25s ease" }}
            className="group-hover:scale-105"
          />
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)", fontWeight: 900, fontStyle: "italic", letterSpacing: "-0.01em", color: "var(--amor-red)", lineHeight: 1.1, whiteSpace: "nowrap" }}>
            {SITE.companyName}
          </span>
        </Link>

        {/* Centered nav */}
        <nav className="flex items-center gap-1" aria-label="Main" style={{ flex: 1, justifyContent: "center" }}>
          {navLinks.map(({ href, labelKey, Icon }) => (
            <Link key={href} href={href} className={`header-nav-link${isActive(href) ? " header-nav-link--active" : ""}`} style={{ gap: "0.4rem", display: "inline-flex", alignItems: "center" }}>
              <Icon />{t(labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right: phone + social + lang */}
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

      {/* ── MOBILE layout: logo LEFT | name CENTER | hamburger RIGHT ── */}
      <div
        className="flex items-center px-2 lg:hidden"
        style={{ minHeight: 80 }}
      >
        {/* Logo — left, 80px */}
        <Link href="/" style={{ flexShrink: 0 }}>
          <Image
            src={BRAND_LOGO.src}
            alt={locale === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn}
            width={80} height={80} priority
            style={{ width: 80, height: 80, objectFit: "contain", display: "block" }}
          />
        </Link>

        {/* Site name — center, flex:1 so it fills remaining space */}
        <Link href="/" style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
          <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(1.1rem, 5vw, 1.35rem)", fontWeight: 900, fontStyle: "italic", color: "var(--amor-red)", lineHeight: 1.1, display: "block" }}>
            {SITE.companyName}
          </span>
        </Link>

        {/* Hamburger — right */}
        <div style={{ flexShrink: 0 }}>
          <MenuButton onClick={() => setMenuOpen(true)} />
        </div>
      </div>

      {/* Mobile nav drawer */}
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} title={SITE.companyName}>
        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map(({ href, labelKey, Icon }) => (
              <Link key={href} href={href} className={`mobile-nav-link${isActive(href) ? " mobile-nav-link--active" : ""}`} onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon />{t(labelKey)}
              </Link>
            ))}
          </nav>
          <div className="mobile-nav-meta">
            <a href={phoneHref} className="mobile-nav-meta__row">
              <PhoneIcon className="h-5 w-5 shrink-0 text-amor-red" />
              <span>{SITE.phone}</span>
            </a>
            <p className="mobile-nav-meta__row">
              <MapPinIcon className="h-5 w-5 shrink-0 text-amor-red" />
              <span>{SITE.address.mk}</span>
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-base font-medium text-amor-blue">{tPublic("followUs")}</span>
              <div className="header-social">
                <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="header-social__link" aria-label="Facebook"><FacebookIcon className="h-4 w-4" /></a>
                <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="header-social__link" aria-label="Instagram"><InstagramIcon className="h-4 w-4" /></a>
              </div>
            </div>
            <LanguagePicker variant="header" className="w-fit" />
          </div>
        </div>
      </MobileNav>
    </div>
  );
}
