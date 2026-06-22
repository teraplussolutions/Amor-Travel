export default function AdminHomePage() {
  return (
    <section>
      <h1 className="text-amor-blue">Admin dashboard</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
        Phase 1 foundation. CMS panel, hero images, and trip publishing arrive in Phase 5.
      </p>
      <div className="dashboard-grid mt-8">
        <article className="card">
          <p className="text-lg font-medium">Website CMS</p>
          <p className="mt-2 text-base">Edit hero, trips, and contact settings.</p>
        </article>
        <article className="card">
          <p className="text-lg font-medium">Trips</p>
          <p className="mt-2 text-base">MK + EN fields with image upload.</p>
        </article>
        <article className="card">
          <p className="text-lg font-medium">Settings</p>
          <p className="mt-2 text-base">Logo and contact details.</p>
        </article>
      </div>
    </section>
  );
}
