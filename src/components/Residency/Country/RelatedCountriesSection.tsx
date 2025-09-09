import * as React from "react";
import Link from "next/link";
import type { CountryMeta } from "@/lib/residency-content";

export default function RelatedCountriesSection({
  related,
}: {
  related: CountryMeta[];
}) {
  if (!related?.length) return null;

  const headingId = "related-countries";

  return (
    <section id="related" aria-labelledby={headingId} className="mt-10">
      {/* Slim accent + heading (token-based, light/dark aligned) */}
      <span
        aria-hidden
        className="block h-[2px] w-full rounded-full bg-gradient-to-r from-primary/80 via-secondary/40 to-primary/80"
      />
      <div className="mt-2 px-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoalGray dark:text-dark_text/70">
          Related
        </p>
        <h2 id={headingId} className="mt-1 text-[15px] font-semibold text-light_text dark:text-dark_text">
          You might also be interested in
        </h2>
      </div>

      {/* Use a semantic list; same responsive grid as before */}
      <ul
        role="list"
        className="mt-3 grid gap-3 md:grid-cols-2"
        aria-label="Related destination countries"
      >
        {related.map((c) => (
          <li key={c.countrySlug}>
            <Link
              href={`/residency/${c.countrySlug}`}
              className={[
                "group relative block overflow-hidden rounded-2xl p-4 sm:p-5 transition",
                // Surfaces (no stray neutrals)
                "bg-gradient-to-b from-light_bg to-grey dark:from-darklight dark:to-slateGray/60",
                "ring-1 ring-border dark:ring-dark_border",
                // Motion & focus
                "hover:shadow-sm motion-safe:hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                // Ensure text inherits theme tokens
                "text-light_text dark:text-dark_text",
              ].join(" ")}
              aria-label={`Explore residency in ${c.title}`}
            >
              {/* subtle left rail accent (not a heavy “card” look) */}
              <span
                aria-hidden
                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full bg-primary/30 dark:bg-primary/40"
              />

              <div className="min-w-0 ml-3">
                <div className="text-[15px] font-semibold leading-snug line-clamp-2" title={c.title}>
                  {c.title}
                </div>
                {c.summary ? (
                  <p
                    className="mt-1 text-[13px] leading-6 text-charcoalGray dark:text-dark_text/80 line-clamp-3"
                    title={c.summary}
                  >
                    {c.summary}
                  </p>
                ) : null}
              </div>

              {/* soft hover glow – very subtle */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-black/5 dark:bg-white/5 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
