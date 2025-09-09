import Link from "next/link";
import Image from "next/image";
import type { CountryMeta } from "@/lib/residency-content";

/**
 * CountryCard — premium, glossy country tile
 * - Subtle gradient border (glow on hover), glassy surface, soft lift
 * - Hero image with gentle zoom + sheen sweep on hover
 * - Clean typography; CTA arrow glides for feedback
 * - Fully clickable, accessible, responsive; no extra JS
 */

type Variant = "compact" | "standard" | "plush";

export default function CountryCard({
  country,
  variant = "standard",
}: {
  country: CountryMeta;
  variant?: Variant;
}) {
  const sizes = {
    compact: {
      pad: "p-3",
      imgAspect: "aspect-[6/3]",
    },
    standard: {
      pad: "p-4",
      imgAspect: "aspect-[16/10] sm:aspect-[4/3]",
    },
    plush: {
      pad: "p-5",
      imgAspect: "aspect-[16/9] sm:aspect-[4/3]",
    },
  }[variant];

  const summaryId = `country-summary-${country.countrySlug}`;

  return (
    <Link
      href={`/residency/${country.countrySlug}`}
      aria-label={`${country.title} – explore programs`}
      aria-describedby={country.summary ? summaryId : undefined}
      className={[
        // Card container
        "group relative isolate block overflow-hidden rounded-2xl",
        // Glassy panel + gentle lift on hover/focus
        "bg-white/70 dark:bg-neutral-900/60 backdrop-blur",
        "shadow-sm hover:shadow-xl transition-all duration-300 ease-out will-change-transform",
        "hover:-translate-y-0.5 focus:-translate-y-0.5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
      ].join(" ")}
    >
      {/* Gradient border (glow on hover) */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 rounded-2xl",
          "ring-1 ring-black/5 dark:ring-white/10",
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
          "before:[background:linear-gradient(135deg,rgba(217,70,239,0.25),rgba(56,189,248,0.25),rgba(16,185,129,0.25))]",
          "before:[-webkit-mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)]",
          "before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]",
          "before:opacity-0 group-hover:before:opacity-100 group-focus-visible:before:opacity-100",
          "before:transition-opacity before:duration-300",
        ].join(" ")}
      />

      {/* Image */}
      <div
        className={[
          "relative w-full overflow-hidden",
          sizes.imgAspect,
          "bg-neutral-100 dark:bg-neutral-800",
        ].join(" ")}
      >
        {country.heroImage ? (
          <Image
            src={country.heroImage}
            alt={`${country.title} hero image`}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : null}

        {/* Sheen sweep */}
        <span
          aria-hidden
          className="
            pointer-events-none absolute inset-0
            translate-x-[-60%] group-hover:translate-x-[60%] transition-transform duration-700 ease-out
            bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.7),transparent)]
            opacity-0 group-hover:opacity-60
            will-change-transform
          "
        />

        {/* Inner ring for image edge definition */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"
        />
      </div>

      {/* Content */}
      <div className={["flex flex-col", sizes.pad].join(" ")}>
        <h3 className="text-lg md:text-xl font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          {country.title}
        </h3>

        {country.summary ? (
          <p
            id={summaryId}
            className="mt-2 text-sm md:text-[15px] leading-6 text-neutral-600 dark:text-neutral-300 line-clamp-3"
          >
            {country.summary}
          </p>
        ) : null}

        <span
          className="
            mt-3 inline-flex items-center text-sm md:text-base font-medium
            text-sky-700 dark:text-sky-300
          "
        >
          Explore Programs
          <span
            aria-hidden
            className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>

      {/* Soft bottom gradient to anchor content (subtle, premium) */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-x-0 bottom-0 h-10
          bg-gradient-to-t from-white/70 dark:from-neutral-900/60 to-transparent
        "
      />
    </Link>
  );
}
