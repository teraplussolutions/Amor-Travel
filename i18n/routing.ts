import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["mk", "en"],
  defaultLocale: "mk",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
