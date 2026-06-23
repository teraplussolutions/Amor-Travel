import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { convertEurMkd, formatDualCurrency } from "@/lib/currency";
import { SITE } from "@/lib/site-defaults";
import {
  absoluteUrl,
  buildOpenGraphImage,
  localePath,
  siteDescription,
  tripOgImage,
} from "@/lib/site-metadata";
import { getTripBySlug } from "@/lib/trips/load-trips";

type TripDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: TripDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const trip = getTripBySlug(slug);

  if (!trip) {
    return {};
  }

  const isEn = locale === "en";
  const title = isEn ? (trip.title_en || trip.title_mk) : trip.title_mk;
  const destination = isEn ? (trip.destination_en || trip.destination_mk) : trip.destination_mk;
  const description = destination || siteDescription(isEn ? "en" : "mk");
  const pagePath = localePath(locale, `/trips/${slug}`);
  const ogImagePath = trip.hero_image ?? "/og-default.png";
  const ogImage = buildOpenGraphImage(ogImagePath, title);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(pagePath),
    },
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "mk_MK",
      url: absoluteUrl(pagePath),
      siteName: SITE.companyName,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [tripOgImage(trip.hero_image)],
    },
  };
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("public");
  const trip = getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const title = locale === "en" ? (trip.title_en || trip.title_mk) : trip.title_mk;
  const destination = locale === "en" ? (trip.destination_en || trip.destination_mk) : trip.destination_mk;
  const backHref = "/patuvanja";

  const earlyPrice =
    trip.price_early_eur != null
      ? formatDualCurrency(convertEurMkd(trip.price_early_eur, "EUR"), {
          locale: locale as "mk" | "en",
        })
      : null;
  const regularPrice =
    trip.price_regular_eur != null
      ? formatDualCurrency(convertEurMkd(trip.price_regular_eur, "EUR"), {
          locale: locale as "mk" | "en",
        })
      : null;

  return (
    <main className="overflow-x-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link href={backHref} className="inline-flex min-h-11 items-center text-lg text-amor-blue underline">
          ← {t("tripsCatalogTitle")}
        </Link>

        {trip.hero_image ? (
          <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-lg bg-amor-soft sm:mt-8">
            <Image
              src={trip.hero_image}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        ) : null}

        <h1 className="mt-8 text-amor-blue">{title}</h1>
        <p className="mt-3 text-xl">{destination}</p>

        {(trip.departure_date || trip.duration_days) && (
          <dl className="mt-6 grid gap-3 text-lg sm:grid-cols-2">
            {trip.departure_date ? (
              <>
                <dt className="font-medium">{locale === "en" ? "Departure" : "Поаѓање"}</dt>
                <dd>{trip.departure_date}</dd>
              </>
            ) : null}
            {trip.return_date ? (
              <>
                <dt className="font-medium">{locale === "en" ? "Return" : "Враќање"}</dt>
                <dd>{trip.return_date}</dd>
              </>
            ) : null}
            {trip.duration_days ? (
              <>
                <dt className="font-medium">{locale === "en" ? "Duration" : "Траење"}</dt>
                <dd>
                  {trip.duration_days} {locale === "en" ? "days" : "дена"}
                  {trip.duration_nights ? ` · ${trip.duration_nights}` : ""}
                </dd>
              </>
            ) : null}
          </dl>
        )}

        {(earlyPrice || regularPrice) && (
          <div className="mt-8 space-y-2">
            {earlyPrice ? (
              <p className="break-words text-xl font-semibold leading-snug text-amor-red sm:text-2xl">
                {locale === "en" ? "Early price" : "Попустна цена"}: {earlyPrice}
              </p>
            ) : null}
            {regularPrice ? (
              <p className="break-words text-lg text-amor-blue sm:text-xl">
                {locale === "en" ? "Regular price" : "Редовна цена"}: {regularPrice}
              </p>
            ) : null}
          </div>
        )}

        {trip.included_mk ? (
          <section className="mt-10">
            <h2 className="text-amor-blue">{locale === "en" ? "Included" : "Вклучено"}</h2>
            <pre className="mt-4 whitespace-pre-wrap text-lg leading-relaxed">{trip.included_mk}</pre>
          </section>
        ) : null}

        {trip.excluded_mk ? (
          <section className="mt-10">
            <h2 className="text-amor-blue">{locale === "en" ? "Not included" : "Не е вклучено"}</h2>
            <pre className="mt-4 whitespace-pre-wrap text-lg leading-relaxed">{trip.excluded_mk}</pre>
          </section>
        ) : null}

        {trip.itinerary.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-amor-blue">{locale === "en" ? "Itinerary" : "Програма"}</h2>
            <ol className="mt-6 space-y-6">
              {trip.itinerary.map((day) => (
                <li key={day.day} className="card">
                  <h3 className="text-xl font-semibold text-amor-blue">
                    {locale === "en" ? `Day ${day.day}` : `${day.day} ден`}: {day.title_mk}
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed">{day.body_mk}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : trip.program_mk ? (
          <section className="mt-10">
            <h2 className="text-amor-blue">{locale === "en" ? "Program" : "Програма"}</h2>
            <pre className="mt-4 whitespace-pre-wrap text-lg leading-relaxed">{trip.program_mk}</pre>
          </section>
        ) : null}
      </div>
    </main>
  );
}
