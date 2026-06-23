import { getLocale, getTranslations } from "next-intl/server";
import { formatMkd } from "@/lib/currency";
import { fetchLatestEurRate } from "@/lib/nbrm-rates";

export async function HeaderCurrencyBadge() {
  const locale = (await getLocale()) as "mk" | "en";
  const t = await getTranslations("public");
  const rateRecord = await fetchLatestEurRate();
  const rate = rateRecord?.rate ?? 61.7;
  const mkdFormatted = formatMkd(rate, locale);

  return (
    <div
      className="header-currency-badge"
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
