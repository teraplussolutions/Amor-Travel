import { getTranslations } from "next-intl/server";
import { LanguagePicker } from "@/components/LanguagePicker";
import { HeaderCurrencyBadge } from "@/components/HeaderCurrencyBadge";
import {
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons/SocialIcons";
import { SITE } from "@/lib/site-defaults";

const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

export async function HeaderTopBar() {
  const t = await getTranslations("public");

  return (
    <div className="header-top-bar">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <MapPinIcon className="hidden h-4 w-4 shrink-0 text-amor-red sm:block" />
          <p className="hidden min-w-0 truncate text-[0.9375rem] font-medium text-amor-blue sm:block">
            {SITE.address.mk}
          </p>
          <a
            href={phoneHref}
            className="header-top-bar__phone sm:hidden"
            aria-label={`${t("phoneLabel")}: ${SITE.phone}`}
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{SITE.phone}</span>
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderCurrencyBadge />

          <a
            href={phoneHref}
            className="header-top-bar__phone hidden sm:inline-flex"
            aria-label={`${t("phoneLabel")}: ${SITE.phone}`}
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            <span>{SITE.phone}</span>
          </a>

          <div className="header-social" role="list" aria-label={t("followUs")}>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="header-social__link"
              aria-label="Facebook"
              role="listitem"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="header-social__link"
              aria-label="Instagram"
              role="listitem"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>

          <LanguagePicker variant="header" className="hidden md:flex" />
        </div>
      </div>
    </div>
  );
}
