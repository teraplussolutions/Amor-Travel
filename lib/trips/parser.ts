import type { ItineraryDay } from "./types";

const MONTHS: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

export function extractTripSlugs(html: string): string[] {
  const slugs = new Set<string>();
  const pattern = /href="\/trips\/([^"?#]+)"/g;
  for (const match of html.matchAll(pattern)) {
    slugs.add(match[1].trim());
  }
  return [...slugs];
}

export function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&times;/g, "×")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseDateToken(token: string): string | null {
  const cleaned = token.trim().replace(/\.$/, "");
  const numeric = cleaned.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (numeric) {
    const [, d, m, y] = numeric;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parts = cleaned.replace(/,/g, "").split(/\s+/);
  if (parts.length !== 3) return null;
  const month = MONTHS[parts[0].toLowerCase().replace(/\./g, "")];
  if (!month) return null;
  const day = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

export function parseTripPage(html: string, slug: string, pageUrl: string) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Raw = h1Match ? stripHtml(h1Match[1]) : slug;
  const [titlePart, destinationPart] = h1Raw.split(",").map((part) => part.trim());

  const title_mk = titlePart || slug;
  const destination_mk = destinationPart || titlePart || slug;

  const imageMatches = [
    ...html.matchAll(/src="(\/files\/patuvanja\/[^"]+)"/g),
    ...html.matchAll(/src="(https?:\/\/amortravel\.mk\/files\/patuvanja\/[^"]+)"/g),
  ].map((match) => match[1]);

  const gallery_images = [...new Set(imageMatches.map((src) => absolutize(src, pageUrl)))];

  const priceBlock = html.match(/(\d+)\s*ЕУР[\s\S]{0,120}?(\d+)\s*ЕУР/i);
  const price_early_eur = priceBlock ? Number(priceBlock[1]) : null;
  const price_regular_eur = priceBlock ? Number(priceBlock[2]) : null;

  const dateMatches = [...html.matchAll(
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z.]*\s+\d{1,2},\s+\d{4}|\d{1,2}\.\d{1,2}\.\d{4}/gi,
  )].map((match) => parseDateToken(match[0]));

  const departure_date = dateMatches[0] ?? null;
  const return_date = dateMatches[1] ?? null;

  const durationMatch = html.match(/(\d+)\s*dena/i);
  const duration_days = durationMatch ? Number(durationMatch[1]) : null;

  const nightsMatch = html.match(/(\d+\s*НОЌ[^\n<]*)/i) ?? html.match(/(\d+\s*НОЌИ[^\n<]*)/i);
  const duration_nights = nightsMatch ? stripHtml(nightsMatch[1]) : null;

  const includedSection = extractSection(html, "Цената вклучува", "Цената НЕ вклучува");
  const excludedSection = extractSection(html, "Цената НЕ вклучува", "План за патувањето");
  const programSection = extractSection(html, "План за патувањето", "Цена со рана уплата");

  const itinerary = parseItinerary(programSection || html);

  return {
    slug,
    title_mk,
    destination_mk,
    departure_date,
    return_date,
    duration_days,
    duration_nights,
    price_early_eur,
    price_regular_eur,
    included_mk: includedSection,
    excluded_mk: excludedSection,
    program_mk: programSection,
    itinerary,
    gallery_images,
    source_url: pageUrl,
  };
}

function extractSection(html: string, startLabel: string, endLabel: string): string {
  const startIdx = html.indexOf(startLabel);
  if (startIdx === -1) return "";
  const endIdx = html.indexOf(endLabel, startIdx + startLabel.length);
  const slice = endIdx === -1 ? html.slice(startIdx) : html.slice(startIdx, endIdx);
  return stripHtml(slice.replace(startLabel, "").trim());
}

function parseItinerary(text: string): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const pattern = /(\d+)\s*ден\s*:\s*([^\n]+)\n([\s\S]*?)(?=\n\d+\s*ден\s*:|$)/gi;
  for (const match of text.matchAll(pattern)) {
    days.push({
      day: Number(match[1]),
      title_mk: match[2].trim(),
      body_mk: match[3].trim(),
    });
  }
  return days;
}

function absolutize(src: string, pageUrl: string): string {
  if (src.startsWith("http")) return src;
  const base = new URL(pageUrl);
  return new URL(src, base.origin).href;
}

export function simpleEnTitle(titleMk: string, destinationMk: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/во\s+([А-Ша-ш]+)/gi, "in $1"],
    [/за\s+8\s*ми\s*март/gi, "for 8 March"],
    [/за\s+велигден/gi, "for Easter"],
    [/за\s+1\s*ви\s*мај/gi, "for 1 May"],
    [/за\s+24\s*ти\s*мај/gi, "for 24 May"],
    [/лето\s+2026/gi, "Summer 2026"],
    [/крстарење/gi, "Cruise"],
    [/магична/gi, "Magical"],
    [/патување/gi, "Trip"],
  ];

  let value = titleMk;
  for (const [pattern, replacement] of replacements) {
    value = value.replace(pattern, replacement);
  }

  if (/[А-Ша-шЃЅЈКЛЉНЊОПРСТЌЋУФХЦЧЏШ]/u.test(value)) {
    return `${destinationMk} — ${titleMk}`;
  }

  return value.trim();
}

export function simpleEnDestination(destinationMk: string): string {
  const map: Record<string, string> = {
    грција: "Greece",
    турција: "Turkey",
    италија: "Italy",
    франција: "France",
    шпанија: "Spain",
    srbija: "Serbia",
    србија: "Serbia",
    унгарија: "Hungary",
    чешка: "Czech Republic",
    австрија: "Austria",
    дубаи: "Dubai",
    dubai: "Dubai",
    кипар: "Cyprus",
    малta: "Malta",
    малта: "Malta",
    јордан: "Jordan",
    израел: "Israel",
    либан: "Lebanon",
    португалија: "Portugal",
    грузија: "Georgia",
    јапонија: "Japan",
    узбекистан: "Uzbekistan",
    индија: "India",
    бrazil: "Brazil",
    оман: "Oman",
    норвешка: "Norway",
    албанија: "Albania",
    хрватска: "Croatia",
    словенија: "Slovenia",
    bosna: "Bosnia and Herzegovina",
    romanija: "Romania",
    "crna gora": "Montenegro",
    china: "China",
    кina: "China",
  };

  const key = destinationMk.toLowerCase().trim();
  return map[key] ?? destinationMk;
}

export function normalizeDedupeKey(title: string, destination: string, departureDate: string | null): string {
  const norm = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  return [norm(title), norm(destination), departureDate ?? "no-date"].join("|");
}
