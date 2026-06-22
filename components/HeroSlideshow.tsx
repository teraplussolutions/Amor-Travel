"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SiteImage } from "@/lib/site-images";
import { imageAlt } from "@/lib/site-images";

type HeroSlideshowProps = {
  slides: SiteImage[];
  title: string;
  subtitle: string;
  locale: "mk" | "en";
  children?: React.ReactNode;
  intervalMs?: number;
};

export function HeroSlideshow({
  slides,
  title,
  subtitle,
  locale,
  children,
  intervalMs = 6000,
}: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  const activeSlide = slides[activeIndex] ?? slides[0];

  return (
    <section className="relative isolate min-h-[420px] w-full overflow-hidden bg-amor-white sm:min-h-[480px] lg:min-h-[520px]">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={slide.src}
            alt={imageAlt(slide, locale)}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Light red/blue gradient overlay — no dark full bleed */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-amor-red/35 via-amor-white/55 to-amor-blue/35"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center px-4 py-14 sm:min-h-[480px] sm:px-6 sm:py-16 lg:min-h-[520px]">
        {activeSlide?.destination ? (
          <p className="mb-3 text-lg font-medium text-amor-blue sm:text-xl">
            {activeSlide.destination}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-amor-blue">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed sm:mt-6 sm:text-xl">
          {subtitle}
        </p>
        {children ? (
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            {children}
          </div>
        ) : null}

        {slides.length > 1 ? (
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 transition-colors ${
                  index === activeIndex
                    ? "bg-amor-red/15"
                    : "bg-transparent hover:bg-amor-soft"
                }`}
                aria-label={`Show slide ${index + 1}: ${slide.destination ?? imageAlt(slide, locale)}`}
              >
                <span
                  className={`block h-3 w-3 rounded-full border-2 ${
                    index === activeIndex
                      ? "border-amor-red bg-amor-red"
                      : "border-amor-blue/50 bg-amor-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
