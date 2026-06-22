import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { TripCard } from "@/components/TripCard";
import { convertEurMkd, formatDualCurrency } from "@/lib/currency";
import { SITE } from "@/lib/site-defaults";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("public");
  const common = await getTranslations("common");

  const samplePrice = formatDualCurrency(convertEurMkd(450, "EUR"), {
    locale: locale as "mk" | "en",
  });

  const samplePrice2 = formatDualCurrency(convertEurMkd(620, "EUR"), {
    locale: locale as "mk" | "en",
  });

  const contactPath = locale === "en" ? "/en/kontakt" : "/kontakt";
  const tripsPath = locale === "en" ? "/en/patuvanja" : "/patuvanja";

  const trips = [
    {
      title: locale === "en" ? "Antalya — 7 nights" : "Antalya — 7 ноќи",
      price: samplePrice,
      description:
        locale === "en"
          ? "All-inclusive beach holiday with direct flights."
          : "All inclusive одмор на плажа со директни летови.",
    },
    {
      title: locale === "en" ? "Paris — 4 nights" : "Пaris — 4 ноќи",
      price: samplePrice2,
      description:
        locale === "en"
          ? "City break with hotel and guided tour."
          : "Градско патување со хотел и воден обиколка.",
    },
    {
      title: t("contactTitle"),
      price: SITE.phone,
      description: t("contactIntro"),
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <section className="bg-amor-sidebar px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="max-w-3xl text-amor-blue">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed sm:mt-6 sm:text-xl">
            {t("heroSubtitle")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href={contactPath} className="btn-primary w-full sm:w-auto">
              {t("ctaRequestQuote")}
            </Link>
            <Link href={tripsPath} className="btn-secondary w-full sm:w-auto">
              {t("ctaViewTrips")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-amor-blue">{t("featuredTrips")}</h2>
          <div className="trip-grid mt-6 sm:mt-8">
            {trips.map((trip) => (
              <TripCard
                key={trip.title}
                title={trip.title}
                price={trip.price}
                description={trip.description}
                href={trip.title === t("contactTitle") ? contactPath : tripsPath}
                ctaLabel={
                  trip.title === t("contactTitle") ? common("contact") : t("ctaViewTrips")
                }
              />
            ))}
          </div>
          <p className="mt-8 text-base text-amor-blue">
            <span className="font-medium">{common("contact")}: </span>
            {SITE.publicEmail}
          </p>
        </div>
      </section>
    </main>
  );
}
