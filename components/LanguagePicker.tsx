"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

type LanguagePickerProps = {
  /** Document/export language — one language per generated file */
  mode?: "ui" | "document";
  value?: AppLocale;
  onChange?: (locale: AppLocale) => void;
  className?: string;
  compact?: boolean;
};

export function LanguagePicker({
  mode = "ui",
  value,
  onChange,
  className = "",
  compact = false,
}: LanguagePickerProps) {
  const t = useTranslations("common");
  const uiLocale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const selected = value ?? uiLocale;

  function handleSelect(nextLocale: AppLocale) {
    if (mode === "document") {
      onChange?.(nextLocale);
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {!compact ? (
        <span className="text-base font-medium text-amor-text">
          {mode === "document" ? t("chooseLanguage") : t("language")}
        </span>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {routing.locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => handleSelect(locale)}
            className={`min-h-11 rounded-lg px-3 text-base transition-colors sm:px-4 ${
              selected === locale
                ? "bg-amor-blue text-white"
                : "bg-amor-soft text-amor-text hover:bg-amor-sidebar"
            }`}
            aria-label={locale === "mk" ? t("macedonian") : t("english")}
          >
            {compact ? locale.toUpperCase() : locale === "mk" ? t("macedonian") : t("english")}
          </button>
        ))}
      </div>
    </div>
  );
}
