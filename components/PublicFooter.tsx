import { getTranslations } from "next-intl/server";
import { SITE } from "@/lib/site-defaults";

type PublicFooterProps = {
  locale: string;
};

export async function PublicFooter({ locale }: PublicFooterProps) {
  const t = await getTranslations("public");
  const address = locale === "en" ? SITE.address.en : SITE.address.mk;

  return (
    <footer className="mt-auto border-t border-amor-soft bg-amor-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:flex-wrap md:justify-between md:gap-8">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-amor-blue">{SITE.companyName}</p>
          <p className="mt-2 text-base leading-relaxed">{address}</p>
        </div>
        <div className="flex flex-col gap-2 text-base">
          <p>
            <span className="font-medium text-amor-blue">{t("phoneLabel")}: </span>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="break-all">
              {SITE.phone}
            </a>
          </p>
          <p>
            <span className="font-medium text-amor-blue">{t("emailLabel")}: </span>
            <a href={`mailto:${SITE.publicEmail}`} className="break-all">
              {SITE.publicEmail}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-base">
          <a
            href={SITE.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 inline-flex items-center text-amor-blue underline-offset-2 hover:underline"
          >
            Facebook
          </a>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 inline-flex items-center text-amor-blue underline-offset-2 hover:underline"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
