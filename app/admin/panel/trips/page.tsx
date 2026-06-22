import { TripImagesUpload } from "@/components/admin/TripImagesUpload";

export default function AdminTripsPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-amor-blue">Trips</h1>
        <p className="mt-4 text-base sm:text-lg">
          Upload trip card images — 4:3 preview with object-fit cover, any image
          type accepted.
        </p>
      </div>
      <TripImagesUpload />
    </section>
  );
}
