export type TripSource = "amortravel.mk" | "facebook";

export type ItineraryDay = {
  day: number;
  title_mk: string;
  body_mk: string;
};

export type ImportedTrip = {
  slug: string;
  title_mk: string;
  title_en: string;
  destination_mk: string;
  destination_en: string;
  departure_date: string | null;
  return_date: string | null;
  duration_days: number | null;
  duration_nights: string | null;
  price_early_eur: number | null;
  price_regular_eur: number | null;
  included_mk: string;
  excluded_mk: string;
  program_mk: string;
  itinerary: ItineraryDay[];
  hero_image: string | null;
  gallery_images: string[];
  source: TripSource[];
  source_urls: string[];
  published: boolean;
  imported_at: string;
  image_match: "page" | "keyword" | "none";
};

export type ImportStats = {
  imported: number;
  updated: number;
  skipped_duplicates: number;
  merged: number;
  facebook_accessible: boolean;
  facebook_note: string;
  unmatched_images: string[];
};
