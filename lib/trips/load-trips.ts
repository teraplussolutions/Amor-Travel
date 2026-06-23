import fs from "node:fs";
import path from "node:path";
import type { ImportedTrip } from "./types";

let cache: ImportedTrip[] | null = null;

export function loadImportedTrips(): ImportedTrip[] {
  if (cache) return cache;

  // On Vercel, admin writes to /tmp/amor-trips.json — prefer that over the bundled file
  const tmpFile = "/tmp/amor-trips.json";
  const dataFile = path.join(process.cwd(), "data", "imported-trips.json");
  const file = fs.existsSync(tmpFile) ? tmpFile : dataFile;

  if (!fs.existsSync(file)) {
    cache = [];
    return cache;
  }

  cache = JSON.parse(fs.readFileSync(file, "utf8")) as ImportedTrip[];
  return cache;
}

export function getTripBySlug(slug: string): ImportedTrip | undefined {
  return loadImportedTrips().find((trip) => trip.slug === slug);
}

export function getPublishedTrips(): ImportedTrip[] {
  return loadImportedTrips().filter((trip) => (trip.published || trip.hero_image) && !trip.hidden);
}

export function clearTripsCache() {
  cache = null;
}
