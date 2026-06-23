import Image from "next/image";
import { Link } from "@/i18n/navigation";

type TripCardProps = {
  title: string;
  price: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function TripCard({
  title,
  price,
  description,
  href = "/kontakt",
  ctaLabel = "Details",
  imageSrc,
  imageAlt = "",
}: TripCardProps) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 24px rgba(23,70,152,0.08), 0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image — full clickable */}
      {imageSrc ? (
        <Link href={href} className="relative block aspect-[4/3] w-full overflow-hidden bg-amor-sidebar">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
          {/* Price badge */}
          <div
            className="absolute bottom-3 right-3 rounded-full px-3 py-1 text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--amor-gold), #a8883a)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {price}
          </div>
          {/* View arrow overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
              style={{ background: "rgba(23,70,152,0.85)", backdropFilter: "blur(4px)" }}
            >
              {ctaLabel}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link href={href} className="group/title">
          <h3
            className="font-bold leading-snug transition-colors duration-200 group-hover/title:text-amor-red"
            style={{ color: "var(--amor-blue)", fontSize: "1.05rem" }}
          >
            {title}
          </h3>
        </Link>

        {!imageSrc && (
          <p className="mt-2 text-lg font-bold" style={{ color: "var(--amor-gold)" }}>
            {price}
          </p>
        )}

        <p className="mt-3 flex-1 text-base leading-relaxed text-amor-text">
          {description}
        </p>

        <div
          className="my-4 h-px w-12"
          style={{ background: "linear-gradient(90deg, var(--amor-gold), transparent)" }}
        />

        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, var(--amor-blue), #0f2d5e)" }}
        >
          {ctaLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
