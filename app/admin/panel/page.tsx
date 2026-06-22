import Link from "next/link";
import Image from "next/image";
import { HeroSlideshowUpload } from "@/components/admin/HeroSlideshowUpload";
import { getStorageBackend } from "@/lib/site-storage";
import { UNASSIGNED_DESTINATION_IMAGES } from "@/lib/site-images";

export default function AdminPanelPage() {
  const storageBackend = getStorageBackend();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-amor-blue">Website CMS</h1>
          <p className="mt-4 text-base sm:text-lg">
            Andon-style panel — light UI, auto-compressed image uploads.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/admin/panel/trips" className="btn-secondary w-full sm:w-auto">
            Manage trips
          </Link>
          <Link href="/admin/panel/settings" className="btn-secondary w-full sm:w-auto">
            Site settings
          </Link>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="text-amor-blue">Upload settings</h2>
        <p className="text-base text-amor-text/80">
          Accepts any image type (`accept=&quot;image/*&quot;`). Server compresses
          to WebP (max 2560px longest edge, quality 87 photos / 90 graphics).
          Storage:{" "}
          <span className="font-medium text-amor-blue">
            {storageBackend === "supabase"
              ? "Supabase site-assets bucket"
              : "public/site-assets/ (local)"}
          </span>
          .
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-amor-blue">Homepage hero slideshow</h2>
          <p className="mt-2 text-base text-amor-text/80">
            Upload wide hero images. Preview uses 21:9 with object-fit cover.
          </p>
        </div>
        <HeroSlideshowUpload />
      </section>

      <section className="card space-y-4">
        <h2 className="text-amor-blue">Images awaiting trip assignment</h2>
        <p className="text-base text-amor-text/80">
          Available in <code className="text-amor-blue">public/images/destinations/</code>.
          Assign when creating trips in the CMS.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNASSIGNED_DESTINATION_IMAGES.map((image) => (
            <li
              key={image.src}
              className="flex gap-3 rounded-xl border border-amor-soft p-3"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-amor-soft">
                <Image
                  src={image.src}
                  alt={image.altEn}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-amor-blue">
                  {image.destination ?? "Generic travel"}
                </p>
                <p className="truncate text-sm text-amor-text/80">{image.src}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
