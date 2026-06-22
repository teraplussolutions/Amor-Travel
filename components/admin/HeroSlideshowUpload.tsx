"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

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
  const [slides, setSlides] = useState<HeroSlide[]>([
    { id: newSlideId(), url: "" },
  ]);

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
