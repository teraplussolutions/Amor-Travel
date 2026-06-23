import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { TripCard } from "@/components/TripCard";
import { convertEurMkd, formatDualCurrency } from "@/lib/currency";
import { SITE } from "@/lib/site-defaults";
import { FEATURED_TRIPS, HERO_SLIDES, imageAlt } from "@/lib/site-images";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("public");
  const loc = locale as "mk" | "en";
  const isEn = loc === "en";

  const contactPath = "/kontakt";
  const tripsPath = "/patuvanja";

  const trips = [
    {
      title: isEn ? "Antalya — 7 nights" : "Анталија — 7 ноќи",
      price: formatDualCurrency(convertEurMkd(450, "EUR"), { locale: loc }),
      description: isEn ? "All-inclusive beach holiday with direct flights." : "All inclusive одмор на плажа со директни летови.",
      image: FEATURED_TRIPS[0],
    },
    {
      title: isEn ? "Athens — 5 nights" : "Атина — 5 ноќи",
      price: formatDualCurrency(convertEurMkd(620, "EUR"), { locale: loc }),
      description: isEn ? "Culture and sea — Acropolis visits and optional island add-ons." : "Култура и море — посета на Акропола и опција за острови.",
      image: FEATURED_TRIPS[1],
    },
    {
      title: isEn ? "Vienna — 4 nights" : "Виена — 4 ноќи",
      price: formatDualCurrency(convertEurMkd(780, "EUR"), { locale: loc }),
      description: isEn ? "Classic city break with hotel and guided old-town walk." : "Градско патување со хотел и водена обиколка.",
      image: FEATURED_TRIPS[2],
    },
    {
      title: isEn ? "Yerevan — 6 nights" : "Ереван — 6 ноќи",
      price: formatDualCurrency(convertEurMkd(890, "EUR"), { locale: loc }),
      description: isEn ? "Caucasus heritage, wine routes, and Mount Ararat views." : "Кавказско наследство, вински рути и поглед на Арарат.",
      image: FEATURED_TRIPS[3],
    },
    {
      title: isEn ? "Kuala Lumpur — 8 nights" : "Куала Лумпур — 8 ноќи",
      price: formatDualCurrency(convertEurMkd(1200, "EUR"), { locale: loc }),
      description: isEn ? "Modern Asia with iconic skylines and easy regional tours." : "Модерна Азија со познати силуети и регионални тури.",
      image: FEATURED_TRIPS[4],
    },
    {
      title: isEn ? "Sozopol — 7 nights" : "Созопол — 7 ноќи",
      price: formatDualCurrency(convertEurMkd(320, "EUR"), { locale: loc }),
      description: isEn ? "Black Sea holiday with old town charm and sandy beaches." : "Одмор на Црно Море со стар град и песочни плажи.",
      image: FEATURED_TRIPS[5],
    },
  ];

  const whyItems = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>,
      titleEn: "Local Experts", titleMk: "Локални Експерти",
      descEn: "Born and based in North Macedonia — we know every route and partner.",
      descMk: "Основани во Северна Македонија — ги познаваме сите рути и партнери.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
      titleEn: "Best Price Promise", titleMk: "Гаранција за Цена",
      descEn: "We compare hundreds of options to get you the best deal every time.",
      descMk: "Споредуваме стотици опции за да ја добиете најдобрата понуда.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
      titleEn: "Full Packages", titleMk: "Целосни Пакети",
      descEn: "Flights, hotels, transfers and excursions — all in one seamless booking.",
      descMk: "Летови, хотели, трансфери и екскурзии — сè во едно резервирање.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
      titleEn: "24/7 Support", titleMk: "Поддршка 24/7",
      descEn: "Our agents are always reachable — before, during, and after your trip.",
      descMk: "Нашите агенти се секогаш достапни — пред, за време и по патувањето.",
    },
  ];

  const stats = [
    { value: "10+", labelEn: "Years of experience", labelMk: "Години искуство" },
    { value: "5,000+", labelEn: "Happy travellers", labelMk: "Задоволни патници" },
    { value: "60+", labelEn: "Destinations", labelMk: "Дестинации" },
    { value: "98%", labelEn: "Satisfaction rate", labelMk: "Задоволство" },
  ];

  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <HeroSlideshow slides={HERO_SLIDES} title={t("heroTitle")} subtitle={t("heroSubtitle")} locale={loc}>
        <Link
          href={contactPath}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, var(--amor-red), #c21515)", boxShadow: "0 4px 16px rgba(255,29,29,0.35)", color: "#ffffff" }}
        >
          {t("ctaRequestQuote")}
        </Link>
        <Link
          href={tripsPath}
          className="inline-flex items-center justify-center gap-2 rounded-lg border-2 px-7 py-3.5 text-sm font-bold backdrop-blur-sm transition-all duration-200 hover:bg-white/10 !text-white"
          style={{ borderColor: "rgba(255,255,255,0.85)", color: "#ffffff", WebkitTextFillColor: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
        >
          {t("ctaViewTrips")}
        </Link>
      </HeroSlideshow>

      {/* STATS BAR */}
      <div style={{ background: "linear-gradient(135deg, var(--amor-blue) 0%, #0f2d5e 100%)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <span className="text-3xl font-extrabold sm:text-4xl" style={{ color: "var(--amor-gold)" }}>
                {s.value}
              </span>
              <span className="mt-1 text-sm font-medium text-white/80">
                {isEn ? s.labelEn : s.labelMk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* WHY AMOR TRAVEL */}
      <section className="bg-amor-soft px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
              <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--amor-gold)" }}>
                {isEn ? "Why choose us" : "Зошто да нè изберете"}
              </span>
              <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
            </div>
            <h2 className="font-extrabold" style={{ color: "var(--amor-blue)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}>
              {isEn ? "The Amor Travel Difference" : "Разликата на Amor Travel"}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <div
                key={item.titleEn}
                className="group flex flex-col items-center rounded-2xl bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: "0 2px 16px rgba(23,70,152,0.07)" }}
              >
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(23,70,152,0.08), rgba(201,168,76,0.12))", color: "var(--amor-blue)" }}
                >
                  {item.icon}
                </div>
                <div
                  className="mb-4 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red))" }}
                />
                <h3 className="mb-2 text-base font-bold" style={{ color: "var(--amor-blue)" }}>
                  {isEn ? item.titleEn : item.titleMk}
                </h3>
                <p className="text-sm leading-relaxed text-amor-text/80">
                  {isEn ? item.descEn : item.descMk}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TRIPS */}
      <section className="bg-amor-white px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-3">
                <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
                <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--amor-gold)" }}>
                  {isEn ? "Curated destinations" : "Избрани дестинации"}
                </span>
              </div>
              <h2 className="font-extrabold" style={{ color: "var(--amor-blue)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}>
                {t("featuredTrips")}
              </h2>
            </div>
            <Link
              href={tripsPath}
              className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200"
              style={{ background: "var(--amor-blue)", color: "#ffffff" }}
            >
              {isEn ? "View all trips →" : "Сите патувања →"}
            </Link>
          </div>

          <div className="trip-grid">
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
        </div>
      </section>

      {/* CONTACT CTA STRIP */}
      <section
        className="relative overflow-hidden px-6 py-20 text-center sm:px-10"
        style={{ background: "linear-gradient(135deg, var(--amor-blue) 0%, #0f2d5e 60%, rgba(201,168,76,0.18) 100%)" }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10" style={{ background: "var(--amor-gold)" }} aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-10" style={{ background: "var(--amor-red)" }} aria-hidden />

        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--amor-gold)" }}>
              {isEn ? "Start planning" : "Започнете да планирате"}
            </span>
            <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
          </div>

          <h2 className="font-extrabold text-white" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}>
            {isEn ? "Ready for your next adventure?" : "Подготвени за вашата следна авантура?"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            {isEn ? "Contact our team today — we'll build the perfect trip just for you." : "Контактирајте нè денес — ќе изградиме совршено патување само за вас."}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={contactPath}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, var(--amor-gold), #a8883a)", color: "#1a1a1a", boxShadow: "0 4px 16px rgba(201,168,76,0.4)" }}
            >
              {t("ctaRequestQuote")}
            </Link>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:border-white/80 hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
