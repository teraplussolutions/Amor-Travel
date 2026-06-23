import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-amor-blue">404</h1>
      <p className="mt-4 text-lg">Page not found.</p>
      <Link href="/" className="btn-primary mt-8 inline-flex w-fit">
        Home
      </Link>
    </main>
  );
}
