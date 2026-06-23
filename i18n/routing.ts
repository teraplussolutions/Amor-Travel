import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["mk", "en"],
  defaultLocale: "mk",
  localePrefix: "always",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
