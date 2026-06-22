"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type FilterBarProps = {
  children: ReactNode;
  className?: string;
};

export function FilterBar({ children, className = "" }: FilterBarProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border border-amor-soft bg-amor-soft/50 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-amor-text md:hidden"
        aria-expanded={open}
      >
        <span>{t("search")} / Filters</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`flex flex-col gap-4 p-4 md:flex-row md:flex-wrap md:items-end ${
          open ? "block" : "hidden md:flex"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

type FilterFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function FilterField({ label, children, className = "" }: FilterFieldProps) {
  return (
    <label className={`flex w-full min-w-0 flex-col gap-2 md:min-w-[12rem] md:flex-1 ${className}`}>
      <span className="text-base font-medium text-amor-text">{label}</span>
      {children}
    </label>
  );
}

export const filterInputClass =
  "w-full min-h-12 rounded-lg border border-amor-soft bg-amor-white px-4 text-lg text-amor-text outline-none focus:border-amor-blue";
