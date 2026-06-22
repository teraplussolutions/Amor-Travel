"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguagePicker } from "@/components/LanguagePicker";
import { MobileNav, MenuButton } from "@/components/MobileNav";
import { SITE } from "@/lib/site-defaults";

const navLinks = [
  { href: "/", labelKey: "home" as const },
  { href: "/patuvanja", labelKey: "trips" as const },
  { href: "/kontakt", labelKey: "contact" as const },
];

export function PublicHeader() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const linkClass = (href: string) =>
    `min-h-11 rounded-lg px-4 py-2 text-nav transition-colors ${
      isActive(href)
        ? "bg-amor-sidebar font-semibold text-amor-blue"
        : "text-amor-text hover:bg-amor-soft hover:text-amor-blue"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-amor-soft bg-amor-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="min-w-0 shrink">
          <p className="truncate text-xl font-bold text-amor-red sm:text-2xl">
            {SITE.companyName}
          </p>
          <p className="truncate text-sm text-amor-blue sm:text-base">{SITE.domain}</p>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {t(item.labelKey)}
            </Link>
          ))}
          <LanguagePicker className="ml-2 !flex-row !items-center !gap-3" />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguagePicker compact className="!flex-row !items-center !gap-2" />
          <MenuButton onClick={() => setMenuOpen(true)} />
        </div>
      </div>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={SITE.companyName}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(item.href)}
              onClick={() => setMenuOpen(false)}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      </MobileNav>
    </header>
  );
}
