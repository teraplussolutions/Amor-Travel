import { StaffShell } from "@/components/StaffShell";

const navItems = [{ href: "/super-admin", label: "Overview" }];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffShell
      title="Super Admin"
      subtitle="Platform owner — agencies and white-label"
      navItems={navItems}
      accent="super"
    >
      {children}
    </StaffShell>
  );
}
