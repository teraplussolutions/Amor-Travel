export function SectionPlaceholder({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-amor-blue">{title}</h1>
      <p className="mt-4 text-lg">Module placeholder — built in a later phase.</p>
    </section>
  );
}
