"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function AdminSettingsPage() {
  return (
    <section className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-amor-blue">Site settings</h1>
        <p className="mt-4 text-base sm:text-lg">
          Upload logo and hero images — works from phone camera or gallery. All
          images are auto-compressed on the server.
        </p>
      </div>

      <div className="card">
        <ImageUploadField
          folder="logo"
          namePrefix="logo"
          label="Logo image"
          hint="PNG or SVG with text — quality 90 for graphics."
          aspectClass="aspect-[3/1] max-w-sm"
          alt="Amor Travel logo"
        />
      </div>

      <div className="card">
        <ImageUploadField
          folder="hero"
          namePrefix="hero-settings"
          label="Primary hero image"
          hint="Wide travel photo — 16:9 preview, object-fit cover."
          aspectClass="aspect-video"
          alt="Homepage hero"
        />
      </div>
    </section>
  );
}
