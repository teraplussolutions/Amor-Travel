import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { TripCard } from "@/components/TripCard";
import { convertEurMkd, formatDualCurrency } from "@/lib/currency";
import { SITE } from "@/lib/site-defaults";
import {
  FEATURED_TRIPS,
  HERO_SLIDES,
  imageAlt,
} from "@/lib/site-images";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("public");
  const common = await getTranslations("common");
  const loc = locale as "mk" | "en";

  const samplePrice = formatDualCurrency(convertEurMkd(450, "EUR"), { locale: loc });
  const samplePrice2 = formatDualCurrency(convertEurMkd(620, "EUR"), { locale: loc });
  const samplePrice3 = formatDualCurrency(convertEurMkd(780, "EUR"), { locale: loc });
  const samplePrice4 = formatDualCurrency(convertEurMkd(890, "EUR"), { locale: loc });
  const samplePrice5 = formatDualCurrency(convertEurMkd(1200, "EUR"), { locale: loc });
  const samplePrice6 = formatDualCurrency(convertEurMkd(320, "EUR"), { locale: loc });

  const contactPath = "/kontakt";
  const tripsPath = "/patuvanja";

  const trips = [
    {
      title: locale === "en" ? "Antalya — 7 nights" : "Antalya — 7 ноќи",
      price: samplePrice,
      description:
        locale === "en"
          ? "All-inclusive beach holiday with direct flights."
          : "All inclusive одмор на плажа со директни летови.",
      image: FEATURED_TRIPS[0],
    },
    {
      title: locale === "en" ? "Athens — 5 nights" : "Атина — 5 ноќи",
      price: samplePrice2,
      description:
        locale === "en"
          ? "Culture and sea — Acropolis visits and optional island add-ons."
          : "Култура и море — посета на Акропола и опција за острови.",
      image: FEATURED_TRIPS[1],
    },
    {
      title: locale === "en" ? "Vienna — 4 nights" : "Виена — 4 ноќи",
      price: samplePrice3,
      description:
        locale === "en"
          ? "Classic city break with hotel and guided old-town walk."
          : "Градско патување со хотел и водена обиколка.",
      image: FEATURED_TRIPS[2],
    },
    {
      title: locale === "en" ? "Yerevan — 6 nights" : "Ереван — 6 ноќи",
      price: samplePrice4,
      description:
        locale === "en"
          ? "Caucasus heritage, wine routes, and Mount Ararat views."
          : "Кавказско наследство, вински рути и поглед на Арарат.",
      image: FEATURED_TRIPS[3],
    },
    {
      title: locale === "en" ? "Kuala Lumpur — 8 nights" : "Kuala Lumpur — 8 ноќи",
      price: samplePrice5,
      description:
        locale === "en"
          ? "Modern Asia with iconic skylines and easy regional tours."
          : "Модерна Азija со познати неbotnici и регионални тури.",
      image: FEATURED_TRIPS[4],
    },
    {
      title: locale === "en" ? "Sozopol — 7 nights" : "Созопол — 7 ноќи",
      price: samplePrice6,
      description:
        locale === "en"
          ? "Black Sea holiday with old town charm and sandy beaches."
          : "Одмор на Црно Море со стар grad и песочни плажи.",
      image: FEATURED_TRIPS[5],
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <HeroSlideshow
        slides={HERO_SLIDES}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        locale={loc}
      >
        <Link href={contactPath} className="btn-primary w-full sm:w-auto">
          {t("ctaRequestQuote")}
        </Link>
        <Link href={tripsPath} className="btn-secondary w-full sm:w-auto">
          {t("ctaViewTrips")}
        </Link>
      </HeroSlideshow>

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
                href={tripsPath}
                ctaLabel={t("ctaViewTrips")}
                imageSrc={trip.image.src}
                imageAlt={imageAlt(trip.image, loc)}
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
