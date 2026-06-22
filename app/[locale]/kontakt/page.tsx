"use client";

import { useLocale, useTranslations } from "next-intl";
import { SITE } from "@/lib/site-defaults";

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("public");
  const common = useTranslations("common");
  const address = locale === "en" ? SITE.address.en : SITE.address.mk;

  return (
    <main className="overflow-x-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-amor-blue">{t("contactTitle")}</h1>
        <p className="mt-4 text-base leading-relaxed sm:text-lg">{t("contactIntro")}</p>

        <div className="mt-8 space-y-3 rounded-xl border border-amor-soft bg-amor-soft/50 p-4 text-base sm:p-6">
          <p className="break-words">
            <span className="font-medium text-amor-blue">{t("addressLabel")}: </span>
            {address}
          </p>
          <p className="break-words">
            <span className="font-medium text-amor-blue">{t("phoneLabel")}: </span>
            {SITE.phone}
          </p>
          <p className="break-words">
            <span className="font-medium text-amor-blue">{t("emailLabel")}: </span>
            {SITE.publicEmail}
          </p>
        </div>

        <form
          className="mt-10 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <label htmlFor="name" className="form-label">
              {common("client")}
            </label>
            <input id="name" name="name" type="text" className="form-input" required />
          </div>
          <div>
            <label htmlFor="email" className="form-label">
              {t("emailLabel")}
            </label>
            <input id="email" name="email" type="email" className="form-input" required />
          </div>
          <div>
            <label htmlFor="phone" className="form-label">
              {t("phoneLabel")}
            </label>
            <input id="phone" name="phone" type="tel" className="form-input" />
          </div>
          <div>
            <label htmlFor="message" className="form-label">
              {t("messageLabel")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="form-input min-h-[8rem] resize-y py-3"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            {common("send")}
          </button>
        </form>
      </div>
    </main>
  );
}
