"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatMkd } from "@/lib/currency";

const DEFAULT_RATE = 61.7;

export function HeaderCurrencyBadgeClient() {
  const locale = useLocale() as "mk" | "en";
  const t = useTranslations("public");
  const mkdFormatted = formatMkd(DEFAULT_RATE, locale);

  return (
    <div
      className="header-currency-badge w-fit"
      title={t("exchangeRateHint")}
      aria-label={`${t("exchangeRateLabel")}: 1 EUR = ${mkdFormatted}`}
    >
      <span className="header-currency-badge__eur" aria-hidden>
        €1
      </span>
      <span className="header-currency-badge__sep" aria-hidden>
        =
      </span>
      <span className="header-currency-badge__mkd">{mkdFormatted}</span>
    </div>
  );
}
