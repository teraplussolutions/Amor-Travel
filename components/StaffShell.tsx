"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { MobileNav, MenuButton } from "@/components/MobileNav";

type StaffNavItem = {
  href: string;
  label: string;
  /** Shown in mobile bottom bar (max 4 recommended) */
  bottomNav?: boolean;
};

type StaffShellProps = {
  title: string;
  subtitle: string;
  navItems: StaffNavItem[];
  children: ReactNode;
  accent?: "agent" | "admin" | "super";
};

export function StaffShell({
  title,
  subtitle,
  navItems,
  children,
  accent = "agent",
}: StaffShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const accentClass =
    accent === "admin"
      ? "text-amor-blue"
      : accent === "super"
        ? "text-amor-red"
        : "text-amor-blue";

  const bottomItems =
    navItems.some((item) => item.bottomNav)
      ? navItems.filter((item) => item.bottomNav)
      : navItems.slice(0, Math.min(4, navItems.length));

  const showMenuButton = navItems.length > bottomItems.length;

  function isActive(href: string) {
    if (href === "/agent" || href === "/admin" || href === "/super-admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const navLinkClass = (href: string) =>
    `block rounded-lg px-4 py-3 text-lg transition-colors ${
      isActive(href)
        ? "bg-white font-semibold text-amor-blue"
        : "text-amor-text hover:bg-white hover:text-amor-blue"
    }`;

  const bottomLinkClass = (href: string) =>
    `flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-center text-[0.9375rem] leading-tight ${
      isActive(href) ? "font-semibold text-amor-blue" : "text-amor-text"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-amor-white lg:flex-row">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-amor-soft bg-amor-sidebar px-6 py-8 lg:flex">
        <div className="mb-10">
          <p className={`text-2xl font-semibold ${accentClass}`}>{title}</p>
          <p className="mt-2 text-base leading-relaxed text-amor-text">{subtitle}</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex min-h-14 items-center gap-3 border-b border-amor-soft bg-amor-white px-4 py-2 lg:hidden">
          <MenuButton onClick={() => setDrawerOpen(true)} />
          <div className="min-w-0 flex-1">
            <p className={`truncate text-lg font-semibold ${accentClass}`}>{title}</p>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden bg-amor-white p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          {children}
        </main>

        {bottomItems.length > 0 ? (
          <nav
            className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-amor-soft bg-amor-white px-1 py-1 lg:hidden"
            aria-label="Quick navigation"
          >
            {bottomItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={bottomLinkClass(item.href)}
              >
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
            {showMenuButton ? (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex min-h-11 flex-1 flex-col items-center justify-center px-1 text-[0.9375rem] text-amor-text"
              >
                Menu
              </button>
            ) : null}
          </nav>
        ) : null}
      </div>

      <MobileNav
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={title}
      >
        <p className="mb-4 text-base leading-relaxed text-amor-text">{subtitle}</p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(item.href)}
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </MobileNav>
    </div>
  );
}
