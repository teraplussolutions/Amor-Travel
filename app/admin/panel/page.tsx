import { AdminPanelClient } from "@/components/admin/AdminPanelClient";
import { loadAllTrips } from "@/app/admin/trip-actions";
import { listUsers } from "@/app/admin/user-actions";
import { ADMIN_HERO_DEFAULTS } from "@/lib/site-images";

export default async function AdminPanelPage() {
  const [trips, usersResult] = await Promise.all([
    loadAllTrips(),
    listUsers(),
  ]);

  return (
    <AdminPanelClient
      trips={trips}
      users={usersResult.users ?? []}
      heroDefaults={ADMIN_HERO_DEFAULTS.map((s) => s.src)}
    />
  );
}
