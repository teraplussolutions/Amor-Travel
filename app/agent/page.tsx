"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Stats { clients: number; quotes: number; sales: number; revenue: number; profit: number; expenses: number; }

export default function AgentDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const supabase = createClient();


  const modules = [
    { href: "/agent/clients",  icon: "👥", titleMk: "Клиенти",          titleEn: "Клиенти",       descMk: "Управувај со клиенти, пасоши, историја",       descEn: "Управувај со клиенти, пасоши, историја",   color: "#174698" },
    { href: "/agent/quotes",   icon: "📋", titleMk: "Понуди",            titleEn: "Понуди",         descMk: "Изгради понуди, прати PDF, следи pipeline",    descEn: "Изгради понуди, прати PDF, следи pipeline",      color: "#C9A84C" },
    { href: "/agent/sales",    icon: "💰", titleMk: "Продажби",          titleEn: "Продажби",          descMk: "Евидентирај резервации, следи добивка",        descEn: "Евидентирај резервации, следи добивка",                color: "#15803d" },
    { href: "/agent/expenses", icon: "🧾", titleMk: "Трошоци",           titleEn: "Трошоци",       descMk: "Следи трошоци по категорија",                   descEn: "Следи трошоци по категорија",                      color: "#b45309" },
    { href: "/agent/vouchers", icon: "🎫", titleMk: "Ваучери",           titleEn: "Ваучери",       descMk: "Креирај брендирани патнички ваучери",           descEn: "Креирај брендирани ваучери",               color: "#7c3aed" },
    { href: "/agent/search",   icon: "✈️", titleMk: "Пребарај летови",  titleEn: "Пребарај летови", descMk: "Најди летови преку Aviasales",                  descEn: "Најди летови преку Aviasales",                   color: "#FF1D1D" },
  ];

  useEffect(() => {
    async function load() {
      const [
        { count: clients },
        { count: quotes },
        { data: salesData },
        { data: expData },
      ] = await Promise.all([
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("quotes").select("id", { count: "exact", head: true }),
        supabase.from("sales").select("revenue_eur,profit_eur").eq("status", "Completed"),
        supabase.from("expenses").select("amount_eur"),
      ]);
      const revenue  = salesData?.reduce((s, r) => s + Number(r.revenue_eur), 0) ?? 0;
      const profit   = salesData?.reduce((s, r) => s + Number(r.profit_eur), 0) ?? 0;
      const expenses = expData?.reduce((s, r) => s + Number(r.amount_eur), 0) ?? 0;
      setStats({ clients: clients ?? 0, quotes: quotes ?? 0, sales: salesData?.length ?? 0, revenue, profit, expenses });
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statCards = stats ? [
    { labelMk: "Клиенти",   labelEn: "Клиенти",   value: stats.clients.toString(),     icon: "👥", color: "#174698" },
    { labelMk: "Понуди",    labelEn: "Понуди",    value: stats.quotes.toString(),      icon: "📋", color: "#C9A84C" },
    { labelMk: "Продажби",  labelEn: "Продажби",     value: stats.sales.toString(),       icon: "💰", color: "#15803d" },
    { labelMk: "Приход",    labelEn: "Приход",   value: `€${stats.revenue.toFixed(0)}`, icon: "📈", color: "#174698" },
    { labelMk: "Добивка",   labelEn: "Добивка",    value: `€${stats.profit.toFixed(0)}`,  icon: "✅", color: "#15803d" },
    { labelMk: "Трошоци",   labelEn: "Трошоци",  value: `€${stats.expenses.toFixed(0)}`, icon: "🧾", color: "#FF1D1D" },
  ] : null;

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ color: "var(--amor-blue)", fontSize: "1.6rem", fontWeight: 800 }}>
          {"Почетна — CRM"}
        </h1>
        <p style={{ color: "var(--amor-text)", marginTop: 4, fontSize: 15 }}>
          {"Добредојдовте во Amor Travel CRM — вашето работно место"}
        </p>
        <div style={{ height: 3, width: 48, borderRadius: 8, marginTop: 10, background: "linear-gradient(90deg,#174698,#FF1D1D)" }} />
      </div>

      {statCards ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 16, marginBottom: 40 }}>
          {statCards.map((s) => (
            <div key={s.labelEn} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 16px rgba(23,70,152,0.07)", borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.labelMk}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#94a3b8", marginBottom: 40, fontSize: 14 }}>{"Се вчитува..."}</div>
      )}

      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
        {"Модули"}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {modules.map((m) => (
          <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
            <div
              style={{ background: "#fff", borderRadius: 16, padding: "22px 20px", boxShadow: "0 2px 16px rgba(23,70,152,0.07)", borderLeft: `4px solid ${m.color}`, transition: "transform 0.15s,box-shadow 0.15s", cursor: "pointer" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(23,70,152,0.14)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(23,70,152,0.07)"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, color: m.color, fontSize: "1rem", marginBottom: 6 }}>{m.titleMk}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{m.descMk}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
