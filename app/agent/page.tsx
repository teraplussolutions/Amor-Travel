export default function AgentHomePage() {
  return (
    <section>
      <h1 className="text-amor-blue">Agent dashboard</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
        Welcome to the Amor Travel agent workspace. Quotes, clients, and sales modules
        will be added in later phases.
      </p>
      <div className="dashboard-grid mt-8">
        <article className="card">
          <p className="text-lg font-medium">Clients</p>
          <p className="mt-2 text-base">Manage profiles and import lists.</p>
        </article>
        <article className="card">
          <p className="text-lg font-medium">Quotations</p>
          <p className="mt-2 text-base">Build offers with EUR + MKD totals.</p>
        </article>
        <article className="card">
          <p className="text-lg font-medium">Sales</p>
          <p className="mt-2 text-base">Track bookings and invoices.</p>
        </article>
      </div>
    </section>
  );
}
