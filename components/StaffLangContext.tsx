"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { StaffLang } from "@/lib/staff-i18n";

type StaffLangCtx = {
  lang: StaffLang;
  setLang: (l: StaffLang) => void;
  toggle: () => void;
};

const Ctx = createContext<StaffLangCtx>({
  lang: "mk",
  setLang: () => {},
  toggle: () => {},
});

export function StaffLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<StaffLang>("mk");
  function toggle() { setLang((l) => (l === "mk" ? "en" : "mk")); }
  return <Ctx.Provider value={{ lang, setLang, toggle }}>{children}</Ctx.Provider>;
}

export function useStaffLang() { return useContext(Ctx); }
