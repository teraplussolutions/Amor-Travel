import { StaffShell } from "@/components/StaffShell";
import { ScrollButtons } from "@/components/ScrollButtons";

const navItems = [
  { href: "/admin/panel", label: "Admin Panel", bottomNav: true },
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
      acc