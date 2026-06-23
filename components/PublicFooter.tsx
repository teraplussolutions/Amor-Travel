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

type PublicFooterProps = { locale: string };

const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address.en)}`;

export async function PublicFooter({ locale }: PublicFooterProps) {
  const t = await getTranslations("public");
  const loc = locale === "en" ? "en" : "mk";
  const logoAlt = loc === "mk" ? BRAND_LOGO.altMk : BRAND_LOGO.altEn;
  const isEn = loc === "en";

  return (
    <footer style={{ background: "linear-gradient(160deg, #0a1f40 0%, #0f2d5e 50%, #174698 100%)" }}>
      {/* Gold accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red), var(--amor-gold))" }} />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">

          {/* Brand column — same style as header */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={BRAND_LOGO.src}
                alt={logoAlt}
                width={80}
                height={80}
                style={{ width: 80, height: 80, objectFit: "contain", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  fontStyle: "italic",
                  letterSpacing: "-0.01em",
                  color: "var(--amor-red)",
                  lineHeight: 1.1,
                }}
              >
                {SITE.companyName}
              </span>
            </Link>

            <div style={{ height: 1, width: 48, background: "linear-gradient(90deg, var(--amor-gold), transparent)", margin: "20px 0" }} />

            <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: 260 }}>
              {t("footerTagline")}
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[
                { href: SITE.social.facebook, label: "Facebook", icon: <FacebookIcon className="h-4 w-4" /> },
                { href: SITE.social.instagram, label: "Instagram", icon: <InstagramIcon className="h-4 w-4" /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social__link"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 40, height: 40, borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    background: "rgba(255,255,255,0.08)",
                    transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links + address */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--amor-gold)", marginBottom: 20 }}>
              {isEn ? "Quick Links" : "Брзи Врски"}
            </h3>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/", labelMk: "Почетна", labelEn: "Home" },
                { href: "/patuvanja", labelMk: "Патувања", labelEn: "Trips" },
                { href: "/kontakt", labelMk: "Контакт", labelEn: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.75)", transition: "color 0.2s" }}
                >
                  <span style={{ width: 16, height: 1, background: "var(--amor-gold)", display: "inline-block", flexShrink: 0 }} />
                  {isEn ? link.labelEn : link.labelMk}
                </Link>
              ))}
            </nav>

            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--amor-gold)", marginTop: 28, marginBottom: 12 }}>
              {t("addressLabel")}
            </h3>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", gap: 10, color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.6, textDecoration: "none", transition: "color 0.2s" }}
            >
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--amor-gold)" }} />
              <span style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                {isEn ? SITE.address.en : SITE.address.mk}
              </span>
            </a>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--amor-gold)", marginBottom: 20 }}>
              {t("contactTitle")}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <li>
                <a href={phoneHref} style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.8)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,29,29,0.2)", flexShrink: 0 }}>
                    <PhoneIcon className="h-4 w-4" style={{ color: "#FF1D1D" }} />
                  </span>
                  <span>
                    <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{t("phoneLabel")}</span>
                    <span style={{ color: "#fff" }}>{SITE.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.publicEmail}`} style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.8)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,29,29,0.2)", flexShrink: 0 }}>
                    <MailIcon className="h-4 w-4" style={{ color: "#FF1D1D" }} />
                  </span>
                  <span>
                    <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{t("emailLabel")}</span>
                    <span style={{ color: "#fff" }}>{SITE.publicEmail}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} {SITE.companyName}. {t("footerRights")}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            {isEn ? "North Macedonia" : "Северна Македонија"} · IATA
          </p>
        </div>
      </div>
    </footer>
  );
}
