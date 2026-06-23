import { StaffShell } from "@/components/StaffShell";
import { ScrollButtons } from "@/components/ScrollButtons";

const navItems = [
  { href: "/admin/panel", labelMk: "Админ Панел", labelEn: "Admin Panel", bottomNav: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell
      titleMk="Amor Travel Админ"
      titleEn="Amor Travel Admin"
      subtitleMk="Содржина на веб-сајтот amortravel.net"
      subtitleEn="Website content for amortravel.net"
      navItems={navItems}
      accent="admin"
    >
      {children}
      <ScrollButtons />
    </StaffShell>
  );
}
