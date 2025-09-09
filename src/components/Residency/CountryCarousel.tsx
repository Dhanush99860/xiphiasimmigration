// src/components/residency/CountryCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type Item = {
  country: string;
  countrySlug: string;
  heroImage?: string;
  summary?: string;
  introPoints?: string[];
};

function truncateWords(text = "", maxWords = 15) {
  const words = (text || "").trim().split(/\s+/);
  return words.length <= maxWords
    ? (text || "").trim()
    : words.slice(0, maxWords).join(" ") + "…";
}

export default function CountryCarousel({
  items,
  title = "Residency by Country",
  description = "Discover trusted residency pathways across popular countries.",
  ctaText = "View all countries",
  ctaHref = "/residency",
}: {
  items: Item[];
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollOne = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("div") as HTMLElement | null;
    if (!card) return;
    const unit = card.getBoundingClientRect().width + 24; // 24px = gap
    rail.scrollBy({ left: dir * unit, behavior: "smooth" });
  };

  if (!items?.length) return null;

  return (
    <section className="max-w-screen-xl mx-auto py-6 px-4">
      {/* Header with arrows */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight text-light_text dark:text-dark_text">
            {title}
          </h2>
          <p className="text-base md:text-lg text-section dark:text-dark_border mb-6 leading-relaxed">
            {description}
          </p>
          <Link
            href={ctaHref}
            className="inline-block px-6 py-2.5 rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg hover:bg-primary hover:text-white transition text-sm md:text-base font-medium text-light_text dark:text-dark_text shadow-sm"
          >
            {ctaText}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollOne(-1)}
            aria-label="Scroll countries left"
            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeft size={22} className="text-black dark:text-white" />
          </button>
          <button
            onClick={() => scrollOne(1)}
            aria-label="Scroll countries right"
            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ChevronRight size={22} className="text-black dark:text-white" />
          </button>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        className="flex flex-nowrap items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pe-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((c) => {
          const href = `/residency/${c.countrySlug}`;
          const chips = (c.introPoints || []).slice(0, 2);
          return (
            <div
              key={c.countrySlug}
              className="flex-none snap-start basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <article className="h-full flex flex-col rounded-2xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg shadow-sm hover:shadow-md transition">
                {/* Image */}
                <Link href={href} aria-label={`${c.country} residency`}>
                  <div className="relative h-40 sm:h-44 rounded-t-2xl overflow-hidden">
                    <Image
                      src={c.heroImage || `/images/${c.countrySlug}.jpg`}
                      alt={`${c.country} image`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col px-4 py-3">
                  <h3 className="text-base sm:text-lg font-semibold leading-tight text-light_text dark:text-dark_text">
                    <Link
                      href={href}
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                    >
                      {c.country}
                    </Link>
                  </h3>

                  <p className="mt-1 text-sm text-light_grey dark:text-dark_border leading-6 min-h-[42px]">
                    {truncateWords(
                      c.summary || `Residency pathways in ${c.country}.`,
                      15
                    )}
                  </p>

                  {chips.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {chips.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-neutral-50 dark:bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className=" pt-4 w-full border-t mt-4">
                    <Link
                      href={href}
                      className="group w-full flex items-center text-base font-bold tracking-wide 
      text-primary dark:text-neutral-100 transition-all duration-300"
                    >
                      <span>Explore {c.country} Residency</span>
                      <span
                        className="ml-2 inline-block transform transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </div>

                </div>
              </article>
            </div>
          );
        })}
        <div className="flex-none w-1" />
      </div>
    </section>
  );
}
