import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons/SocialIcons";
import { SITE } from "@/lib/site-defaults";
import { BRAND_LOGO } from "@/lib/site-images";

type PublicFooterProps = {
  locale: string;
};

const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

export async function PublicFooter({ locale }: PublicFooterProps) {
  const t = await getTranslations("public");
  const loc = locale === "en" ? "en" : "mk";
  const logoAlt = loc === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn;
  const isEn = loc === "en";

  return (
    <footer
      style={{
        background: "linear-gradient(160deg, #0f2d5e 0%, var(--amor-blue) 60%, #0a1f40 100%)",
      }}
    >
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red), var(--amor-gold))",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src={BRAND_LOGO.src}
                alt={logoAlt}
                width={96}
                height={96}
                className="h-20 w-20 rounded-full bg-white/10 object-contain p-1"
              />
              <span className="text-2xl font-extrabold" style={{ color: "var(--amor-gold)" }}>
                {SITE.companyName}
              </span>
            </Link>

            <div
              className="my-5 h-0.5 w-16"
              style={{ background: "linear-gradient(90deg, var(--amor-gold), transparent)" }}
            />

            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {t("footerTagline")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-200 hover:border-white hover:text-white"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all duration-200 hover:border-white hover:text-white"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Address + Quick links */}
          <div>
            <h3
              className="mb-5 text-sm font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--amor-gold)" }}
            >
              {t("addressLabel")}
            </h3>

            <div className="flex gap-3 text-sm leading-relaxed text-white/75">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-amor-red" />
              <span>{isEn ? SITE.address.en : SITE.address.mk}</span>
            </div>

            <h3
              className="mb-4 mt-8 text-sm font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--amor-gold)" }}
            >
              {isEn ? "Quick Links" : "Брзи Врски"}
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer">
              {[
                { href: "/", labelMk: "Почетна", labelEn: "Home" },
                { href: "/patuvanja", labelMk: "Патувања", labelEn: "Trips" },
                { href: "/kontakt", labelMk: "Контакт", labelEn: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-white/70 transition-colors duration-200 hover:text-white"
                >
                  <span
                    className="h-px w-4 transition-all duration-200 group-hover:w-6"
                    style={{ background: "var(--amor-gold)" }}
                  />
                  {isEn ? link.labelEn : link.labelMk}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="mb-5 text-sm font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--amor-gold)" }}
            >
              {t("contactTitle")}
            </h3>

            <ul className="space-y-4">
              <li>
                <a
                  href={phoneHref}
                  className="flex items-start gap-3 text-sm text-white/75 transition-colors duration-200 hover:text-white"
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,29,29,0.15)" }}
                  >
                    <PhoneIcon className="h-4 w-4 text-amor-red" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/40">
                      {t("phoneLabel")}
                    </span>
                    {SITE.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.publicEmail}`}
                  className="flex items-start gap-3 text-sm text-white/75 transition-colors duration-200 hover:text-white"
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,29,29,0.15)" }}
                  >
                    <MailIcon className="h-4 w-4 text-amor-red" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-white/40">
                      {t("emailLabel")}
                    </span>
                    {SITE.publicEmail}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-6 text-center sm:flex-row sm:text-left"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-sm text-white/45">
            © {new Date().getFullYear()} {SITE.companyName}. {t("footerRights")}
          </p>
          <p className="text-xs text-white/30">
            {isEn ? "North Macedonia" : "Северна Македонија"} · IATA
          </p>
        </div>
      </div>
    </footer>
  );
}
