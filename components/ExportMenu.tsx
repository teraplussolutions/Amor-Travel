"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "@/components/LanguagePicker";
import type { AppLocale } from "@/i18n/routing";

type ExportMenuProps = {
  onExport?: (format: "print" | "pdf" | "excel" | "word", locale: AppLocale) => void;
  className?: string;
};

export function ExportMenu({ onExport, className = "" }: ExportMenuProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [docLocale, setDocLocale] = useState<AppLocale>("mk");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const formats = [
    { key: "print" as const, label: t("print") },
    { key: "pdf" as const, label: "PDF" },
    { key: "excel" as const, label: "Excel" },
    { key: "word" as const, label: "Word" },
  ];

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="btn-secondary min-h-12 w-full sm:w-auto"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t("export")}
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-[min(100vw-2rem,18rem)] rounded-xl border border-amor-soft bg-amor-white p-4 shadow-lg sm:left-auto sm:w-72">
          <LanguagePicker
            mode="document"
            value={docLocale}
            onChange={setDocLocale}
            className="mb-4"
          />
          <div className="flex flex-col gap-2">
            {formats.map((format) => (
              <button
                key={format.key}
                type="button"
                className="min-h-12 w-full rounded-lg bg-amor-soft px-4 text-left text-base font-medium text-amor-text hover:bg-amor-sidebar"
                onClick={() => {
                  onExport?.(format.key, docLocale);
                  setOpen(false);
                }}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
