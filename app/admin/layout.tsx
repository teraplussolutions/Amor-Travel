import { StaffShell } from "@/components/StaffShell";

const navItems = [
  { href: "/admin", label: "Dashboard", bottomNav: true },
  { href: "/admin/panel", label: "Website CMS", bottomNav: true },
  { href: "/admin/panel/trips", label: "Trips", bottomNav: true },
  { href: "/admin/panel/settings", label: "Settings", bottomNav: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffShell
      title="Amor Travel Admin"
      subtitle="Website content for amortravel.net"
      navItems={navItems}
      accent="admin"
    >
      {children}
    </StaffShell>
  );
}
