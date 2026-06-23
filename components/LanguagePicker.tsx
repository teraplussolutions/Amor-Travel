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
  /** @deprecated use variant="compact" */
  compact?: boolean;
  variant?: "default" | "header" | "compact";
};

export function LanguagePicker({
  mode = "ui",
  value,
  onChange,
  className = "",
  compact = false,
  variant,
}: LanguagePickerProps) {
  const t = useTranslations("common");
  const uiLocale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const selected = value ?? uiLocale;
  const resolvedVariant = variant ?? (compact ? "header" : "default");

  function handleSelect(nextLocale: AppLocale) {
    if (nextLocale === selected) return;

    if (mode === "document") {
      onChange?.(nextLocale);
      return;
    }

    router.replace(pathname, { locale: nextLocale });
  }

  if (resolvedVariant === "header") {
    return (
      <div
        className={`lang-switcher ${className}`}
        role="group"
        aria-label={t("language")}
      >
        {routing.locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => handleSelect(locale)}
            className={`lang-switcher__btn${
              selected === locale ? " lang-switcher__btn--active" : ""
            }`}
            aria-label={locale === "mk" ? t("macedonian") : t("english")}
            aria-current={selected === locale ? "true" : undefined}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-base font-medium text-amor-text">
        {mode === "document" ? t("chooseLanguage") : t("language")}
      </span>
      <div className="flex flex-wrap gap-2">
        {routing.locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => handleSelect(locale)}
            className={`min-h-11 rounded-lg px-4 text-base transition-colors ${
              selected === locale
                ? "bg-amor-blue text-white"
                : "bg-amor-soft text-amor-text hover:bg-amor-sidebar"
            }`}
            aria-label={locale === "mk" ? t("macedonian") : t("english")}
          >
            {locale === "mk" ? t("macedonian") : t("english")}
          </button>
        ))}
      </div>
    </div>
  );
}
