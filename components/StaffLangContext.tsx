"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { StaffLang } from "@/lib/staff-i18n";

type StaffLangCtx = {
  lang: StaffLang;
  setLang: (l: StaffLang) => void;
  toggle: () => void;
};

const defaultCtx: StaffLangCtx = {
  lang: "mk",
  setLang: () => {},
  toggle: () => {},
};

const Ctx = createContext<StaffLangCtx>(defaultCtx);

export function StaffLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<StaffLang>("mk");
  function toggle() { setLang((l) => (l === "mk" ? "en" : "mk")); }
  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

// Safe hook — returns default MK when called outside provider (e.g. during SSR)
export function useStaffLang(): StaffLangCtx {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useContext(Ctx);
  } catch {
    return defaultCtx;
  }
}
