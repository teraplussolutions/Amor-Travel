import { StaffShell } from "@/components/StaffShell";

const navItems = [
  { href: "/agent", label: "Dashboard", bottomNav: true },
  { href: "/agent/clients", label: "Clients", bottomNav: true },
  { href: "/agent/quotes", label: "Quotations", bottomNav: true },
  { href: "/agent/sales", label: "Sales", bottomNav: true },
  { href: "/agent/expenses", label: "Expenses" },
  { href: "/agent/vouchers", label: "Vouchers" },
  { href: "/agent/search", label: "Search flights" },
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffShell
      title="Amor Travel Agent"
      subtitle="CRM, quotes, sales, and daily operations"
      navItems={navItems}
      accent="agent"
    >
      {children}
    </StaffShell>
  );
}
