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
    <section
      className="relative isolate w-full overflow-hidden"
      style={{ minHeight: "88vh" }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
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
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Luxury gradient overlay — deep blue left, transparent right, no black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(15,45,94,0.86) 0%, rgba(23,70,152,0.68) 38%, rgba(23,70,152,0.22) 68%, rgba(201,168,76,0.06) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background:
            "linear-gradient(to top, rgba(245,245,245,0.25) 0%, transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, var(--amor-gold), var(--amor-red), var(--amor-gold))",
        }}
        aria-hidden
      />

      <div
        className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-6 py-28 sm:px-10 lg:px-20"
        style={{ minHeight: "88vh" }}
      >
        <div className="max-w-2xl">
          {activeSlide?.destination && (
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--amor-gold)" }} />
              <span
                className="text-sm font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--amor-gold)" }}
              >
                {activeSlide.destination}
              </span>
              <span className="h-px w-8" style={{ background: "var(--amor-gold)" }} />
            </div>
          )}

          <h1
            className="font-extrabold leading-[1.1] text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              textShadow: "0 2px 24px rgba(0,0,0,0.18)",
            }}
          >
            {title}
          </h1>

          <div
            className="mt-5 h-1 w-24 rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--amor-gold), var(--amor-red))",
            }}
          />

          <p
            className="mt-6 leading-relaxed text-white/90"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              textShadow: "0 1px 8px rgba(0,0,0,0.12)",
            }}
          >
            {subtitle}
          </p>

          {children && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {children}
            </div>
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-16 flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Slide ${index + 1}`}
                className="group flex items-center justify-center p-1 transition-all"
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: index === activeIndex ? "2rem" : "0.5rem",
                    height: "0.5rem",
                    background:
                      index === activeIndex
                        ? "var(--amor-gold)"
                        : "rgba(255,255,255,0.45)",
                    boxShadow:
                      index === activeIndex
                        ? "0 0 8px var(--amor-gold)"
                        : "none",
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
