"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ArrowRight } from "lucide-react";

export type CitizenshipCardProps = {
  country: string;
  flag: string;        // image path
  headline: string;    // short title / USP
  description: string; // paragraph
};

// Helper to generate clean slugs
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

function Card({ country, flag, headline, description }: CitizenshipCardProps) {
  const slug = slugify(country);

  return (
    <article
      className="relative flex flex-col h-full min-h-[370px] overflow-hidden 
      rounded-2xl 
      bg-light_bg dark:bg-darklight
      border-4 border-blue-50 dark:border-blue-400
      shadow-md hover:shadow-xl 
      transition-all duration-300 hover:-translate-y-1"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Header */}
      <header className="flex items-center gap-5 p-6">
        <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 
          rounded-full overflow-hidden shadow-lg ring-2 
          ring-primary/50 dark:ring-primary/30"
        >
          <Image
            src={flag}
            alt={`${country} flag`}
            fill
            className="object-contain p-2"
            sizes="80px"
            loading="lazy"
          />
        </div>
        <h3
          className="text-xl md:text-2xl font-bold 
          text-light_text dark:text-dark_text tracking-tight"
          itemProp="name"
        >
          {country}
          {headline && (
            <span className="block text-sm font-medium text-primary">
              {headline}
            </span>
          )}
        </h3>
      </header>

      {/* Content */}
      <div className="flex flex-col flex-grow px-6 pb-6">
        <p
          className="text-16 md:leading-7 text-light_grey dark:text-dark_text/70 leading-relaxed flex-grow"
          itemProp="description"
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
            dark:text-dark_text dark:border-dark_border
            dark:hover:bg-primary dark:hover:text-white
            transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label={`${country} citizenship program`}
        >
          {country} Citizenship
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export default memo(Card);
