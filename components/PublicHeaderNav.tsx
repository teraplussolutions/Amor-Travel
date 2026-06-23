"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguagePicker } from "@/components/LanguagePicker";
import { MobileNav, MenuButton } from "@/components/MobileNav";
import { HeaderCurrencyBadgeClient } from "@/components/HeaderCurrencyBadgeClient";
import {
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons/SocialIcons";
import { SITE } from "@/lib/site-defaults";
import { BRAND_LOGO } from "@/lib/site-images";

const navLinks = [
  { href: "/", labelKey: "home" as const },
  { href: "/patuvanja", labelKey: "trips" as const },
  { href: "/kontakt", labelKey: "contact" as const },
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

  const linkClass = (href: string) =>
    `header-nav-link${isActive(href) ? " header-nav-link--active" : ""}`;

  return (
    <div className="header-main">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link href="/" className="header-brand group flex items-center gap-3">
          {/* Logo — large, no border/circle */}
          <Image
            src={BRAND_LOGO.src}
            alt={locale === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn}
            width={110}
            height={110}
            priority
            style={{
              width: 110,
              height: 110,
              objectFit: "contain",
              flexShrink: 0,
              transition: "transform 0.25s ease",
            }}
            className="group-hover:scale-105"
          />

          {/* Site name — all red, Playfair, large */}
          <span
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: "-0.01em",
              color: "var(--amor-red)",
              lineHeight: 1.1,
            }}
          >
            {SITE.companyName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguagePicker variant="header" />
          <MenuButton onClick={() => setMenuOpen(true)} />
        </div>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} title={SITE.companyName}>
        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-link${isActive(item.href) ? " mobile-nav-link--active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.labelKey)}
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
            <HeaderCurrencyBadgeClient />
            <div className="flex items-center gap-3 pt-1">
              <span className="text-base font-medium text-amor-blue">{tPublic("followUs")}</span>
              <div className="header-social">
                <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="header-social__link" aria-label="Facebook">
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="header-social__link" aria-label="Instagram">
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
            <LanguagePicker variant="header" className="w-fit" />
          </div>
        </div>
      </MobileNav>
    </div>
  );
}
