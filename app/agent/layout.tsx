import { StaffShell } from "@/components/StaffShell";
import { ScrollButtons } from "@/components/ScrollButtons";

const navItems = [
  { href: "/agent",          labelMk: "Почетна",          labelEn: "Dashboard",      bottomNav: true },
  { href: "/agent/clients",  labelMk: "Клиенти",          labelEn: "Clients",        bottomNav: true },
  { href: "/agent/quotes",   labelMk: "Понуди",           labelEn: "Quotations",     bottomNav: true },
  { href: "/agent/sales",    labelMk: "Продажби",         labelEn: "Sales",          bottomNav: true },
  { href: "/agent/expenses", labelMk: "Трошоци",          labelEn: "Expenses" },
  { href: "/agent/vouchers", labelMk: "Ваучери",          labelEn: "Vouchers" },
  { href: "/agent/search",   labelMk: "Пребарај летови",  labelEn: "Search flights" },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell
      titleMk="Amor Travel Агент"
      titleEn="Amor Travel Agent"
      subtitleMk="CRM, понуди, продажби и дневни операции"
      subtitleEn="CRM, quotes, sales, and daily operations"
      navItems={navItems}
      accent="agent"
    >
      {children}
      <ScrollButtons />
    </StaffShell>
  );
}
