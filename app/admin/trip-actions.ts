"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import type { ImportedTrip } from "@/lib/trips/types";

const TRIPS_FILE = path.join(process.cwd(), "data", "imported-trips.json");
const TRIPS_TMP = "/tmp/amor-trips.json";

function readTrips(): ImportedTrip[] {
  const file = fs.existsSync(TRIPS_TMP) ? TRIPS_TMP : TRIPS_FILE;
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as ImportedTrip[];
  } catch {
    return [];
  }
}

function writeTrips(trips: ImportedTrip[]) {
  try {
    fs.writeFileSync(TRIPS_TMP, JSON.stringify(trips, null, 2), "utf8");
  } catch {
    fs.mkdirSync(path.dirname(TRIPS_FILE), { recursive: true });
    fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2), "utf8");
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export type TripFormData = {
  slug?: string;
  title_mk: string;
  title_en: string;
  destination_mk: string;
  destination_en: string;
  departure_date: string;
  return_date: string;
  duration_days: number;
  duration_nights: string;
  price_early_eur: number | null;
  price_regular_eur: number | null;
  included_mk: string;
  excluded_mk: string;
  program_mk: string;
  hero_image: string | null;
  published: boolean;
  hidden?: boolean;
};

export async function saveTrip(
  data: TripFormData,
): Promise<{ error?: string; slug?: string }> {
  try {
    const trips = readTrips();
    const slug = data.slug || slugify(data.title_mk || data.title_en);
    if (!slug) return { error: "Title is required to generate a slug." };
    const existingIndex = trips.findIndex((t) => t.slug === slug);
    const now = new Date().toISOString();
    const trip: ImportedTrip = {
      slug,
      title_mk: data.title_mk,
      title_en: data.title_en,
      destination_mk: data.destination_mk,
      destination_en: data.destination_en,
      departure_date: data.departure_date || null,
      return_date: data.return_date || null,
      duration_days: data.duration_days || null,
      duration_nights: data.duration_nights || null,
      price_early_eur: data.price_early_eur ?? null,
      price_regular_eur: data.price_regular_eur ?? null,
      included_mk: data.included_mk || "",
      excluded_mk: data.excluded_mk || "",
      program_mk: data.program_mk || "",
      itinerary: existingIndex >= 0 ? trips[existingIndex].itinerary : [],
      hero_image: data.hero_image || null,
      gallery_images: existingIndex >= 0 ? trips[existingIndex].gallery_images : [],
      source: existingIndex >= 0 ? trips[existingIndex].source : [],
      source_urls: existingIndex >= 0 ? trips[existingIndex].source_urls : [],
      published: data.published,
      hidden: data.hidden ?? (existingIndex >= 0 ? (trips[existingIndex].hidden ?? false) : false),
      imported_at: existingIndex >= 0 ? trips[existingIndex].imported_at : now,
      image_match: existingIndex >= 0 ? trips[existingIndex].image_match : "none",
    };
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.unshift(trip);
    }
    writeTrips(trips);
    revalidatePath("/");
    revalidatePath("/mk");
    revalidatePath("/en");
    revalidatePath("/mk/patuvanja");
    revalidatePath("/en/patuvanja");
    revalidatePath(`/mk/trips/${slug}`);
    revalidatePath(`/en/trips/${slug}`);
    revalidatePath("/admin/panel");
    return { slug };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save trip." };
  }
}

export async function deleteTrip(slug: string): Promise<{ error?: string }> {
  try {
    const trips = readTrips();
    const filtered = trips.filter((t) => t.slug !== slug);
    writeTrips(filtered);
    revalidatePath("/admin/panel");
    revalidatePath("/mk/patuvanja");
    revalidatePath("/en/patuvanja");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete trip." };
  }
}

export async function toggleTripPublished(
  slug: string,
  published: boolean,
): Promise<{ error?: string }> {
  try {
    const trips = readTrips();
    const idx = trips.findIndex((t) => t.slug === slug);
    if (idx < 0) return { error: "Trip not found." };
    trips[idx].published = published;
    writeTrips(trips);
    revalidatePath("/admin/panel");
    revalidatePath("/mk/patuvanja");
    revalidatePath("/en/patuvanja");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update trip." };
  }
}

export async function toggleTripHidden(
  slug: string,
  hidden: boolean,
): Promise<{ error?: string }> {
  try {
    const trips = readTrips();
    const idx = trips.findIndex((t) => t.slug === slug);
    if (idx < 0) return { error: "Trip not found." };
    trips[idx].hidden = hidden;
    writeTrips(trips);
    revalidatePath("/admin/panel");
    revalidatePath("/mk/patuvanja");
    revalidatePath("/en/patuvanja");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update trip." };
  }
}

export async function loadAllTrips(): Promise<ImportedTrip[]> {
  return readTrips();
}
