import type { Metadata } from "next";
import { SITE } from "@/lib/site-defaults";

export const SITE_URL = new URL("https://amortravel.net");

export const BRAND_OG_IMAGE = "/og-default.png";
export const BRAND_LOGO_OG = "/images/brand/amor-logo-512.png";

export const SITE_DESCRIPTION = {
  mk: "Организирани патувања, екскурзии и индивидуални понуди низ Европа и пошироко — Amor Travel, Свети Николе.",
  en: "Organised trips, excursions, and custom travel across Europe and beyond — Amor Travel, North Macedonia.",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function localePath(locale: string, pathname = ""): string {
  const normalized = pathname.startsWith("/") ? pathname : pathname ? `/${pathname}` : "";
  return locale === "mk" ? normalized || "/" : `/${locale}${normalized}`;
}

export function siteTitle(): string {
  return SITE.companyName;
}

export function siteDescription(locale: "mk" | "en"): string {
  return SITE_DESCRIPTION[locale];
}

export function buildOpenGraphImage(url: string, alt: string) {
  const lower = url.toLowerCase();
  const type = lower.endsWith(".png")
    ? ("image/png" as const)
    : lower.endsWith(".webp")
      ? ("image/webp" as const)
      : ("image/jpeg" as const);

  return {
    url: absoluteUrl(url),
    width: 1200,
    height: 630,
    alt,
    type,
  };
}

export function defaultSiteMetadata(locale: "mk" | "en" = "mk"): Metadata {
  const title = siteTitle();
  const description = siteDescription(locale);
  const ogImage = buildOpenGraphImage(BRAND_OG_IMAGE, `${SITE.companyName} logo`);

  return {
    title: {
      default: title,
      template: `%s | ${SITE.companyName}`,
    },
    description,
    metadataBase: SITE_URL,
    alternates: {
      canonical: absoluteUrl(localePath(locale)),
      languages: {
        mk: absoluteUrl("/"),
        en: absoluteUrl("/en"),
      },
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: BRAND_LOGO_OG, sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: locale === "mk" ? "mk_MK" : "en_US",
      url: absoluteUrl(localePath(locale)),
      siteName: SITE.companyName,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function tripOgImage(heroImage: string | null): string {
  return heroImage ? absoluteUrl(heroImage) : absoluteUrl(BRAND_OG_IMAGE);
}
