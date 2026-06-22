import Link from "next/link";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { convertEurMkd, formatDualCurrency } from "@/lib/currency";
import { loadImportedTrips } from "@/lib/trips/load-trips";

type PatuvanjaPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PatuvanjaPage({ params }: PatuvanjaPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("public");
  const trips = loadImportedTrips();

  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-amor-blue">{t("tripsCatalogTitle")}</h1>
        <p className="mt-4 max-w-3xl text-xl leading-relaxed">{t("tripsCatalogIntro")}</p>

        {trips.length === 0 ? (
          <p className="mt-10 text-xl">{t("tripsCatalogEmpty")}</p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => {
              const price =
                trip.price_early_eur != null
                  ? formatDualCurrency(convertEurMkd(trip.price_early_eur, "EUR"), {
                      locale: locale as "mk" | "en",
                    })
                  : null;
              const title = locale === "en" ? trip.title_en : trip.title_mk;
              const destination = locale === "en" ? trip.destination_en : trip.destination_mk;
              const href =
                locale === "en" ? `/en/trips/${trip.slug}` : `/trips/${trip.slug}`;

              return (
                <li key={trip.slug} className="card overflow-hidden p-0">
                  {trip.hero_image ? (
                    <div className="relative h-48 w-full bg-amor-soft">
                      <Image
                        src={trip.hero_image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-amor-soft text-lg text-amor-blue">
                      {destination}
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-amor-blue">{title}</h2>
                    <p className="mt-2 text-lg">{destination}</p>
                    {trip.departure_date ? (
                      <p className="mt-2 text-base text-amor-blue">
                        {trip.departure_date}
                        {trip.return_date ? ` — ${trip.return_date}` : ""}
                      </p>
                    ) : null}
                    {price ? (
                      <p className="mt-4 text-xl font-semibold text-amor-red">{price}</p>
                    ) : null}
                    <Link href={href} className="btn-secondary mt-6 inline-block">
                      {t("tripDetails")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
