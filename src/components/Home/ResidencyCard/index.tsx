"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo } from "react";
import { ArrowRight } from "lucide-react";

export type CitizenshipCardProps = {
  country: string;
  flag: string;        // image path
  headline?: string;   // optional short USP
  description: string; // paragraph
};

function Card({ country, flag, headline, description }: CitizenshipCardProps) {
  const slug = useMemo(
    () =>
      country
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    [country]
  );

  return (
    <article
      className="relative flex flex-col h-full min-h-[320px] sm:min-h-[370px] overflow-hidden 
        rounded-2xl 
        bg-light_bg dark:bg-darklight
        border border-gray-200 dark:border-gray-700
        shadow-md hover:shadow-xl 
        transition-all duration-300 hover:-translate-y-1"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Header */}
      <header className="flex items-center gap-5 p-6">
        <div
          className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 
            rounded-full overflow-hidden shadow-md ring-2 
            ring-primary/40 dark:ring-primary/30"
        >
          <Image
            src={flag}
            alt={`${country} flag`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 64px, 80px"
          />
        </div>
        <h3
          id={`${slug}-title`}
          className="text-xl md:text-2xl font-bold 
            text-light_text dark:text-white tracking-tight"
          itemProp="name"
        >
          {country}
        </h3>
      </header>

      {/* Content */}
      <div className="flex flex-col flex-grow px-6 pb-6">
        {headline && (
          <p className="text-primary font-medium text-sm mb-2">{headline}</p>
        )}

        <p
          className="text-sm md:text-base text-light_grey dark:text-gray-300 leading-relaxed flex-grow text-justify"
          itemProp="description"
          aria-labelledby={`${slug}-title`}
        >
          {description}
        </p>

        {/* CTA */}
        <Link
          href={`/programs/${slug}`}
          className="group mt-5 inline-flex items-center justify-center 
            rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide
            border border-primary text-primary
            hover:bg-primary hover:text-white 
            transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label={`${country} residency program`}
        >
          {country} Residency
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export default memo(Card);
