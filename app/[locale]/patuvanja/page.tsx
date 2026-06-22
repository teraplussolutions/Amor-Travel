import { Link } from "@/i18n/navigation";
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
    <main className="overflow-x-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-amor-blue">{t("tripsCatalogTitle")}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed sm:text-xl">
          {t("tripsCatalogIntro")}
        </p>

        {trips.length === 0 ? (
          <p className="mt-10 text-lg">{t("tripsCatalogEmpty")}</p>
        ) : (
          <ul className="trip-grid mt-8 sm:mt-10">
            {trips.map((trip) => {
              const price =
                trip.price_early_eur != null
                  ? formatDualCurrency(convertEurMkd(trip.price_early_eur, "EUR"), {
                      locale: locale as "mk" | "en",
                    })
                  : null;
              const title = locale === "en" ? trip.title_en : trip.title_mk;
              const destination = locale === "en" ? trip.destination_en : trip.destination_mk;

              return (
                <li key={trip.slug} className="card overflow-hidden p-0">
                  {trip.hero_image ? (
                    <div className="relative aspect-[16/10] w-full bg-amor-soft">
                      <Image
                        src={trip.hero_image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-amor-soft px-4 text-center text-lg text-amor-blue">
                      {destination}
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-amor-blue">{title}</h2>
                    <p className="mt-2 text-base sm:text-lg">{destination}</p>
                    {trip.departure_date ? (
                      <p className="mt-2 break-words text-base text-amor-blue">
                        {trip.departure_date}
                        {trip.return_date ? ` — ${trip.return_date}` : ""}
                      </p>
                    ) : null}
                    {price ? (
                      <p className="mt-4 break-words text-lg font-semibold leading-snug text-amor-red sm:text-xl">
                        {price}
                      </p>
                    ) : null}
                    <Link href={`/trips/${trip.slug}`} className="btn-secondary mt-6 w-full sm:w-auto">
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
