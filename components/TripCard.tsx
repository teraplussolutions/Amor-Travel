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
    <article className="card flex h-full flex-col overflow-hidden p-0">
      {imageSrc ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-amor-sidebar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <h3 className="text-amor-blue">{title}</h3>
        <p className="mt-3 break-words text-lg font-semibold leading-snug text-amor-red sm:text-xl">
          {price}
        </p>
        <p className="mt-3 flex-1 text-base leading-relaxed text-amor-text">{description}</p>
        <Link href={href} className="btn-secondary mt-6 w-full sm:w-auto">
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
