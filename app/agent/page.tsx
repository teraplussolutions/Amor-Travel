"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  clients: number;
  quotes: number;
  sales: number;
  revenue: number;
  profit: number;
  expenses: number;
}

const modules = [
  {
    href: "/agent/clients",
    icon: "👥",
    title: "Clients",
    desc: "Manage client profiles, passports, history",
    color: "#174698",
  },
  {
    href: "/agent/quotes",
    icon: "📋",
    title: "Quotes",
    desc: "Build offers, send PDFs, track pipeline",
    color: "#C9A84C",
  },
  {
    href: "/agent/sales",
    icon: "💰",
    title: "Sales",
    desc: "Record bookings, track profit",
    color: "#15803d",
  },
  {
    href: "/agent/expenses",
    icon: "🧾",
    title: "Expenses",
    desc: "Track costs by category",
    color: "#b45309",
  },
  {
    href: "/agent/vouchers",
    icon: "🎫",
    title: "Vouchers",
    desc: "Create branded travel vouchers",
    color: "#7c3aed",
  },
  {
    href: "/agent/search",
    icon: "✈️",
    title: "Search Flights",
    desc: "Find flights via Aviasales",
    color: "#FF1D1D",
  },
];

export default function AgentDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const supabase = createClient();

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
      const revenue = salesData?.reduce((s, r) => s + Number(r.revenue_eur), 0) ?? 0;
      const profit = salesData?.reduce((s, r) => s + Number(r.profit_eur), 0) ?? 0;
      const expenses = expData?.reduce((s, r) => s + Number(r.amount_eur), 0) ?? 0;
      setStats({ clients: clients ?? 0, quotes: quotes ?? 0, sales: salesData?.length ?? 0, revenue, profit, expenses });
    }
    load();
  }, [supabase]);

  const statCards = stats
    ? [
        { label: "Clients", value: stats.clients.toString(), icon: "👥", color: "#174698" },
        { label: "Quotes", value: stats.quotes.toString(), icon: "📋", color: "#C9A84C" },
        { label: "Sales", value: stats.sales.toString(), icon: "💰", color: "#15803d" },
        { label: "Revenue", value: `€${stats.revenue.toFixed(0)}`, icon: "📈", color: "#174698" },
        { label: "Profit", value: `€${stats.profit.toFixed(0)}`, icon: "✅", color: "#15803d" },
        { label: "Expenses", value: `€${stats.expenses.toFixed(0)}`, icon: "🧾", color: "#FF1D1D" },
      ]
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ color: "var(--amor-blue)", fontSize: "1.6rem", fontWeight: 800 }}>
          Agent Dashboard
        </h1>
        <p style={{ color: "var(--amor-text)", marginTop: 4, fontSize: 15 }}>
          Welcome to Amor Travel CRM — your daily workspace
        </p>
        <div style={{ height: 3, width: 48, borderRadius: 8, marginTop: 10, background: "linear-gradient(90deg,#174698,#FF1D1D)" }} />
      </div>

      {/* Stats */}
      {statCards && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 16, marginBottom: 40 }}>
          {statCards.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "18px 20px",
                boxShadow: "0 2px 16px rgba(23,70,152,0.07)",
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {!statCards && (
        <div style={{ color: "#94a3b8", marginBottom: 40, fontSize: 14 }}>Loading stats…</div>
      )}

      {/* Module grid */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
        Modules
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "22px 20px",
                boxShadow: "0 2px 16px rgba(23,70,152,0.07)",
                borderLeft: `4px solid ${m.color}`,
                transition: "transform 0.15s,box-shadow 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(23,70,152,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(23,70,152,0.07)";
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, color: m.color, fontSize: "1rem", marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
