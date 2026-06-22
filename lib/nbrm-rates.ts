import type { CurrencyCode } from "./currency";

export type NbrmRateRecord = {
  currency: CurrencyCode;
  rate: number;
  rateDate: string;
  source: "nbrm";
};

const NBRM_API_URL =
  "https://www.nbrm.mk/KLServiceNOV/GetExchangeRate";

/**
 * Fetches the latest EUR middle rate from NBRM.
 * Phase 1 skeleton — wired to cron in a later phase.
 */
export async function fetchLatestEurRate(): Promise<NbrmRateRecord | null> {
  try {
    const response = await fetch(NBRM_API_URL, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    const rate = extractEurMiddleRate(data);

    if (!rate) {
      return null;
    }

    return {
      currency: "EUR",
      rate,
      rateDate: new Date().toISOString().slice(0, 10),
      source: "nbrm",
    };
  } catch {
    return null;
  }
}

function extractEurMiddleRate(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.MiddleRate === "number") {
    return record.MiddleRate;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const nested = extractEurMiddleRate(item);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}
