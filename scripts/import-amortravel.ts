import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ImportedTrip, ImportStats, TripSource } from "../lib/trips/types";
import { discoverLocalImages, matchLocalImage } from "../lib/trips/image-matcher";
import {
  extractTripSlugs,
  normalizeDedupeKey,
  parseTripPage,
  simpleEnDestination,
  simpleEnTitle,
} from "../lib/trips/parser";

const BASE_URL = "https://amortravel.mk";
const FACEBOOK_URLS = [
  "https://www.facebook.com/amortravelagency",
  "https://www.facebook.com/share/1b71G9NuQJ/",
];

type RawTrip = Omit<
  ImportedTrip,
  "title_en" | "destination_en" | "hero_image" | "image_match" | "published" | "imported_at"
>;

type FacebookResult = {
  accessible: boolean;
  note: string;
  trips: RawTrip[];
};

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "AmorTravelImport/1.0 (+https://amortravel.net)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function runWorker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  return results;
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

function mergeTrips(existing: RawTrip, incoming: RawTrip, source: TripSource): RawTrip {
  const pickLonger = (a: string, b: string) => (b.length > a.length ? b : a);
  const pickArray = (a: string[], b: string[]) => [...new Set([...a, ...b])];

  return {
    slug: existing.slug || incoming.slug,
    title_mk: existing.title_mk || incoming.title_mk,
    destination_mk: existing.destination_mk || incoming.destination_mk,
    departure_date: existing.departure_date ?? incoming.departure_date,
    return_date: existing.return_date ?? incoming.return_date,
    duration_days: existing.duration_days ?? incoming.duration_days,
    duration_nights: existing.duration_nights ?? incoming.duration_nights,
    price_early_eur: existing.price_early_eur ?? incoming.price_early_eur,
    price_regular_eur: existing.price_regular_eur ?? incoming.price_regular_eur,
    included_mk: pickLonger(existing.included_mk, incoming.included_mk),
    excluded_mk: pickLonger(existing.excluded_mk, incoming.excluded_mk),
    program_mk: pickLonger(existing.program_mk, incoming.program_mk),
    itinerary: existing.itinerary.length >= incoming.itinerary.length ? existing.itinerary : incoming.itinerary,
    gallery_images: pickArray(existing.gallery_images, incoming.gallery_images),
    source: [...new Set([...existing.source, source])],
    source_urls: pickArray(existing.source_urls, incoming.source_urls),
  };
}

async function crawlMkTrips(limit?: number): Promise<RawTrip[]> {
  const homepage = await fetchText(BASE_URL);
  const slugs = extractTripSlugs(homepage);
  const selected = limit ? slugs.slice(0, limit) : slugs;

  console.log(`Found ${slugs.length} trip slugs on amortravel.mk — fetching ${selected.length}…`);

  const parsed = await mapPool(selected, 6, async (slug) => {
    const pageUrl = `${BASE_URL}/trips/${slug}`;
    try {
      const html = await fetchText(pageUrl);
      const trip = parseTripPage(html, slug, pageUrl);
      return {
        slug: trip.slug,
        title_mk: trip.title_mk,
        destination_mk: trip.destination_mk,
        departure_date: trip.departure_date,
        return_date: trip.return_date,
        duration_days: trip.duration_days,
        duration_nights: trip.duration_nights,
        price_early_eur: trip.price_early_eur,
        price_regular_eur: trip.price_regular_eur,
        included_mk: trip.included_mk,
        excluded_mk: trip.excluded_mk,
        program_mk: trip.program_mk,
        itinerary: trip.itinerary,
        gallery_images: trip.gallery_images,
        source: ["amortravel.mk"] as TripSource[],
        source_urls: [trip.source_url],
      } satisfies RawTrip;
    } catch (error) {
      console.warn(`Failed ${slug}:`, error instanceof Error ? error.message : error);
      return null;
    }
  });

  return parsed.filter((trip): trip is RawTrip => trip !== null);
}

async function crawlFacebook(): Promise<FacebookResult> {
  for (const url of FACEBOOK_URLS) {
    try {
      const html = await fetchText(url);
      const hasLoginWall =
        /login_form|You must log in|Log in to Facebook|meta property="og:type" content="profile"/i.test(html);
      const tripHints = [...html.matchAll(/(?:патување|trip|€|EUR|Antalya|Dubai|Истанбул)/gi)];

      if (hasLoginWall && tripHints.length < 3) {
        continue;
      }

      return {
        accessible: tripHints.length > 0,
        note: `Partial HTML fetched from ${url} but public post parsing is limited without Graph API.`,
        trips: [],
      };
    } catch (error) {
      continue;
    }
  }

  return {
    accessible: false,
    note:
      "Facebook blocked automated access — login wall / minimal public HTML. Only amortravel.mk data imported.",
    trips: [],
  };
}

function dedupeAndMerge(trips: RawTrip[]): { trips: RawTrip[]; skipped: number; merged: number } {
  const bySlug = new Map<string, RawTrip>();
  const byKey = new Map<string, string>();
  let skipped = 0;
  let merged = 0;

  for (const trip of trips) {
    const slugExisting = bySlug.get(trip.slug);
    if (slugExisting) {
      bySlug.set(trip.slug, mergeTrips(slugExisting, trip, trip.source[0]));
      merged++;
      continue;
    }

    const dedupeKey = normalizeDedupeKey(trip.title_mk, trip.destination_mk, trip.departure_date);
    const keySlug = byKey.get(dedupeKey);
    if (keySlug) {
      const existing = bySlug.get(keySlug)!;
      bySlug.set(keySlug, mergeTrips(existing, trip, trip.source[0]));
      merged++;
      continue;
    }

    bySlug.set(trip.slug, trip);
    byKey.set(dedupeKey, trip.slug);
  }

  skipped = trips.length - bySlug.size - merged;
  if (skipped < 0) skipped = 0;

  return { trips: [...bySlug.values()], skipped, merged };
}

async function attachImages(
  projectRoot: string,
  trips: RawTrip[],
): Promise<{ trips: ImportedTrip[]; unmatched: string[] }> {
  const localImages = discoverLocalImages(projectRoot);
  const usedPaths = new Set<string>();
  const unmatched: string[] = [];
  const assetsDir = path.join(projectRoot, "public", "site-assets", "trips");

  const enriched: ImportedTrip[] = [];

  for (const trip of trips) {
    let hero_image: string | null = null;
    let image_match: ImportedTrip["image_match"] = "none";
    const gallery_images = [...trip.gallery_images];

    if (gallery_images.length > 0) {
      const filename = `${trip.slug}-hero${path.extname(new URL(gallery_images[0]).pathname) || ".jpg"}`;
      const dest = path.join(assetsDir, trip.slug, filename);
      const ok = await downloadImage(gallery_images[0], dest);
      if (ok) {
        hero_image = `/site-assets/trips/${trip.slug}/${filename}`;
        image_match = "page";
        usedPaths.add(hero_image);
      }
    }

    if (!hero_image) {
      const local = matchLocalImage(trip.title_mk, trip.destination_mk, localImages, usedPaths);
      hero_image = local.publicPath;
      image_match = local.match;
    }

    if (!hero_image) {
      unmatched.push(`${trip.slug} — ${trip.title_mk}`);
    }

    enriched.push({
      ...trip,
      title_en: simpleEnTitle(trip.title_mk, trip.destination_mk),
      destination_en: simpleEnDestination(trip.destination_mk),
      hero_image,
      gallery_images,
      image_match,
      published: false,
      imported_at: new Date().toISOString(),
    });
  }

  return { trips: enriched, unmatched };
}

function copyPicsToPublic(projectRoot: string) {
  const picsDir = path.join(projectRoot, "Pics");
  const destDir = path.join(projectRoot, "public", "images", "destinations");
  if (!fs.existsSync(picsDir)) return;

  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(picsDir)) {
    const src = path.join(picsDir, file);
    const dest = path.join(destDir, file);
    if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
}

function loadExisting(projectRoot: string): ImportedTrip[] {
  const file = path.join(projectRoot, "data", "imported-trips.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as ImportedTrip[];
}

function upsertBySlug(existing: ImportedTrip[], incoming: ImportedTrip[]) {
  const map = new Map(existing.map((trip) => [trip.slug, trip]));
  let updated = 0;
  let imported = 0;

  for (const trip of incoming) {
    if (map.has(trip.slug)) {
      const prev = map.get(trip.slug)!;
      map.set(trip.slug, {
        ...trip,
        published: prev.published,
        imported_at: new Date().toISOString(),
      });
      updated++;
    } else {
      map.set(trip.slug, trip);
      imported++;
    }
  }

  return {
    trips: [...map.values()].sort((a, b) => a.title_mk.localeCompare(b.title_mk, "mk")),
    imported,
    updated,
  };
}

export async function runImport(projectRoot: string, options?: { limit?: number }) {
  copyPicsToPublic(projectRoot);

  const [mkTrips, facebook] = await Promise.all([crawlMkTrips(options?.limit), crawlFacebook()]);
  const combined = [...mkTrips, ...facebook.trips];
  const { trips: deduped, skipped, merged } = dedupeAndMerge(combined);
  const { trips: withImages, unmatched } = await attachImages(projectRoot, deduped);

  const existing = loadExisting(projectRoot);
  const { trips: finalTrips, imported, updated } = upsertBySlug(existing, withImages);

  const dataDir = path.join(projectRoot, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "imported-trips.json"), JSON.stringify(finalTrips, null, 2));

  const stats: ImportStats = {
    imported,
    updated,
    skipped_duplicates: skipped,
    merged,
    facebook_accessible: facebook.accessible,
    facebook_note: facebook.note,
    unmatched_images: unmatched,
  };

  fs.writeFileSync(path.join(dataDir, "import-log.json"), JSON.stringify({ ...stats, ran_at: new Date().toISOString() }, null, 2));

  return { trips: finalTrips, stats };
}

async function main() {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

  console.log("Amor Travel — import from amortravel.mk + Facebook\n");
  const { trips, stats } = await runImport(projectRoot, { limit });

  console.log("\n--- Import complete ---");
  console.log(`Total trips in catalog: ${trips.length}`);
  console.log(`New: ${stats.imported} | Updated: ${stats.updated}`);
  console.log(`Merged (mk+fb): ${stats.merged} | Skipped duplicates: ${stats.skipped_duplicates}`);
  console.log(`Facebook: ${stats.facebook_accessible ? "partial" : "blocked"} — ${stats.facebook_note}`);
  console.log(`Unmatched images: ${stats.unmatched_images.length}`);
  if (stats.unmatched_images.length > 0) {
    console.log(stats.unmatched_images.slice(0, 10).join("\n"));
    if (stats.unmatched_images.length > 10) {
      console.log(`… and ${stats.unmatched_images.length - 10} more`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
