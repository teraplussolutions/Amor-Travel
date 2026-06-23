import { StaffShell } from "@/components/StaffShell";

const navItems = [{ href: "/super-admin", labelMk: "Преглед", labelEn: "Overview", bottomNav: true }];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell
      titleMk="Супер Админ"
      titleEn="Super Admin"
      subtitleMk="Сопственик на платформата"
      subtitleEn="Platform owner — agencies and white-label"
      navItems={navItems}
      accent="super"
    >
      {children}
    </StaffShell>
  );
}
