"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ADMIN_HERO_DEFAULTS } from "@/lib/site-images";

type HeroSlide = {
  id: string;
  url: string;
};

let slideCounter = 0;

function newSlideId() {
  slideCounter += 1;
  return `hero-${Date.now()}-${slideCounter}`;
}

export function HeroSlideshowUpload() {
  const [slides, setSlides] = useState<HeroSlide[]>(
    ADMIN_HERO_DEFAULTS.map((slide) => ({
      id: newSlideId(),
      url: slide.src,
    })),
  );

  function updateSlide(id: string, url: string) {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, url } : slide)),
    );
  }

  function addSlide() {
    setSlides((prev) => [...prev, { id: newSlideId(), url: "" }]);
  }

  function removeSlide(id: string) {
    setSlides((prev) =>
      prev.length <= 1 ? prev : prev.filter((slide) => slide.id !== id),
    );
  }

  return (
    <div className="space-y-8">
      <div className="card space-y-4">
        <h3 className="text-amor-blue">Default hero preview (from Pics library)</h3>
        <p className="text-base text-amor-text/80">
          These local images are used on the public homepage until Supabase CMS
          overrides are saved.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {ADMIN_HERO_DEFAULTS.map((slide) => (
            <figure
              key={slide.src}
              className="overflow-hidden rounded-xl border border-amor-soft"
            >
              <div className="relative aspect-[21/9] bg-amor-soft">
                <Image
                  src={slide.src}
                  alt={slide.altEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-amor-red/30 via-amor-white/50 to-amor-blue/30"
                  aria-hidden
                />
              </div>
              <figcaption className="space-y-1 p-3">
                <p className="font-medium text-amor-blue">{slide.destination}</p>
                <p className="text-sm text-amor-text/80">{slide.altEn}</p>
                {/* MK alt for future i18n */}
                <p className="text-sm text-amor-text/60">{slide.altMk}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {slides.map((slide, index) => (
        <div key={slide.id} className="card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-amor-blue">Hero slide {index + 1}</h3>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => removeSlide(slide.id)}
                className="text-base font-medium text-amor-red"
              >
                Remove slide
              </button>
            )}
          </div>
          <ImageUploadField
            folder="hero"
            namePrefix={`hero-${index + 1}`}
            label="Homepage hero image"
            hint="Wide travel photo — 21:9 preview, auto-compressed to WebP (max 2560px edge)."
            aspectClass="aspect-[21/9]"
            value={slide.url}
            onChange={(url) => updateSlide(slide.id, url)}
            alt={`Hero slide ${index + 1}`}
          />
        </div>
      ))}

      <button type="button" onClick={addSlide} className="btn-secondary">
        Add hero slide
      </button>
    </div>
  );
}
