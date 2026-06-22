export type CurrencyCode = "EUR" | "MKD";

export type DualAmount = {
  eur: number;
  mkd: number;
  rate: number;
  rateDate: string;
};

export type FormatDualCurrencyOptions = {
  locale?: "mk" | "en";
  rateDate?: string;
};

const DEFAULT_RATE = 61.7;

export function convertEurMkd(
  amount: number,
  from: CurrencyCode,
  rate: number = DEFAULT_RATE,
): DualAmount {
  const normalizedRate = rate > 0 ? rate : DEFAULT_RATE;
  const rateDate = new Date().toISOString().slice(0, 10);

  if (from === "EUR") {
    return {
      eur: roundMoney(amount),
      mkd: roundMoney(amount * normalizedRate),
      rate: normalizedRate,
      rateDate,
    };
  }

  return {
    eur: roundMoney(amount / normalizedRate),
    mkd: roundMoney(amount),
    rate: normalizedRate,
    rateDate,
  };
}

export function formatDualCurrency(
  amount: DualAmount,
  options: FormatDualCurrencyOptions = {},
): string {
  const locale = options.locale ?? "mk";
  const eur = formatEur(amount.eur);
  const mkd = formatMkd(amount.mkd, locale);

  if (locale === "en") {
    return `${eur} · ${mkd}`;
  }

  return `${eur} / ${mkd}`;
}

export function formatEur(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMkd(value: number, locale: "mk" | "en" = "mk"): string {
  const formatted = new Intl.NumberFormat("mk-MK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return locale === "en" ? `${formatted} MKD` : `${formatted} ден.`;
}

export function nbrmRateFootnote(
  rateDate: string,
  locale: "mk" | "en" = "mk",
): string {
  const formattedDate =
    locale === "en"
      ? new Date(rateDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : new Date(rateDate).toLocaleDateString("mk-MK", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

  if (locale === "en") {
    return `NBRM rate as of ${formattedDate}.`;
  }

  return `Соодветен курс на НБРМ од ${formattedDate}.`;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
