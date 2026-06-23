import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadImportedTrips } from "@/lib/trips/load-trips";
import { TripsPageClient } from "@/components/TripsPageClient";

type PatuvanjaPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PatuvanjaPage({ params }: PatuvanjaPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("public");
  const trips = loadImportedTrips();

  return (
    <main className="overflow-x-hidden">
      {/* Hero banner */}
      <div
        className="relative px-6 py-16 text-center sm:py-24"
        style={{
          background: "linear-gradient(135deg, #0f2d5e 0%, var(--amor-blue) 60%, rgba(201,168,76,0.15) 100%)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red), var(--amor-gold))" }}
          aria-hidden
        />
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
            <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--amor-gold)" }}>
              {locale === "en" ? "All destinations" : "Сите дестинации"}
            </span>
            <span className="h-px w-10" style={{ background: "var(--amor-gold)" }} />
          </div>
          <h1 className="font-extrabold text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            {t("tripsCatalogTitle")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            {t("tripsCatalogIntro")}
          </p>
        </div>
      </div>

      <TripsPageClient
        trips={trips}
        locale={locale as "mk" | "en"}
        emptyLabel={t("tripsCatalogEmpty")}
        detailsLabel={t("tripDetails")}
      />
    </main>
  );
}
