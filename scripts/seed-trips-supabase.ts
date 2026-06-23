/**
 * Seed default Amor Travel agency + trips from data/imported-trips.json.
 * Requires .env.local with Supabase URL + service role key.
 * Run: npm run seed:trips
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { ImportedTrip } from "../lib/trips/types";
import { SITE } from "../lib/site-defaults";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const env: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function sanitizeDate(value: string | null): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [, , day] = value.split("-").map(Number);
  if (day < 1 || day > 31) return null;
  const d = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  return value;
}

function toRow(agencyId: string, trip: ImportedTrip) {
  return {
    agency_id: agencyId,
    slug: trip.slug,
    title_mk: trip.title_mk,
    title_en: trip.title_en,
    destination_mk: trip.destination_mk,
    destination_en: trip.destination_en,
    departure_date: sanitizeDate(trip.departure_date),
    return_date: sanitizeDate(trip.return_date),
    duration_days: trip.duration_days,
    duration_nights: trip.duration_nights,
    price_early_eur: trip.price_early_eur,
    price_regular_eur: trip.price_regular_eur,
    included_mk: trip.included_mk,
    excluded_mk: trip.excluded_mk,
    program_mk: trip.program_mk,
    itinerary: trip.itinerary,
    hero_image: trip.hero_image,
    gallery_images: trip.gallery_images,
    source: trip.source,
    source_urls: trip.source_urls,
    image_match: trip.image_match,
    published: trip.published,
    imported_at: trip.imported_at,
  };
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingAgency } = await supabase
    .from("agencies")
    .select("id")
    .eq("slug", "amor-travel")
    .maybeSingle();

  let agencyId = existingAgency?.id as string | undefined;

  if (!agencyId) {
    const { data, error } = await supabase
      .from("agencies")
      .insert({
        slug: "amor-travel",
        name: SITE.companyName,
        domain: SITE.domain,
        is_active: true,
      })
      .select("id")
      .single();
    if (error) throw error;
    agencyId = data.id;
    console.log("Created agency amor-travel");
  } else {
    console.log("Agency amor-travel already exists");
  }

  const { data: existingSettings } = await supabase
    .from("site_settings")
    .select("id")
    .eq("agency_id", agencyId)
    .maybeSingle();

  if (!existingSettings) {
    const { error } = await supabase.from("site_settings").insert({
      agency_id: agencyId,
      company_name: SITE.companyName,
      public_email: SITE.publicEmail,
      private_email: SITE.privateEmail,
      phone: SITE.phone,
      address_mk: SITE.address.mk,
      address_en: SITE.address.en,
      social: SITE.social,
      logo_url: "/images/brand/amor-logo.png",
    });
    if (error) throw error;
    console.log("Created site_settings");
  }

  const jsonPath = resolve(process.cwd(), "data", "imported-trips.json");
  const trips = JSON.parse(readFileSync(jsonPath, "utf8")) as ImportedTrip[];
  console.log(`Upserting ${trips.length} trips…`);

  const batchSize = 50;
  let upserted = 0;
  for (let i = 0; i < trips.length; i += batchSize) {
    const batch = trips.slice(i, i + batchSize).map((t) => toRow(agencyId!, t));
    const { error } = await supabase
      .from("trips")
      .upsert(batch, { onConflict: "agency_id,slug" });
    if (error) throw error;
    upserted += batch.length;
    console.log(`  ${upserted}/${trips.length}`);
  }

  const { count } = await supabase
    .from("trips")
    .select("*", { count: "exact", head: true })
    .eq("agency_id", agencyId);

  console.log(`Done. trips row count for agency: ${count ?? "?"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
