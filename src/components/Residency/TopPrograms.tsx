import Link from "next/link";
import Image from "next/image";
import type { ProgramMeta } from "@/lib/residency-content";

/**
 * TopPrograms — compact, non-overlapping mobile-first cards
 * - Smaller type & tighter spacing for phones
 * - Fixed row height + min-w-0 to prevent text overflow
 * - Title clamped to 2 lines, meta line is single-line & truncates
 * - Chips are tiny (10–11px) and capped to 2 to avoid crowding
 * - Stable image crop; no layout shift
 */
export default function TopPrograms({ programs }: { programs: ProgramMeta[] }) {
  if (!programs?.length) return null;

  return (
    <section aria-labelledby="top-programs-heading" className="mt-4">
      <h2 id="top-programs-heading" className="sr-only">
        Top programs
      </h2>

      <ul className="flex flex-col gap-2.5">
        {programs.map((p) => {
          const imgSrc =
            (("image" in p) && (p as any).image) ||
            (("heroImage" in p) && (p as any).heroImage) ||
            null;

          const timeline =
            typeof p.timelineMonths === "number" && !Number.isNaN(p.timelineMonths)
              ? `${p.timelineMonths} months`
              : "Timeline varies";

          const investment =
            typeof (p as any).minInvestment === "number"
              ? money((p as any).minInvestment, (p as any).currency)
              : null;

          // keep at most 2 chips to avoid wrapping on small screens
          const chips = Array.isArray(p.tags) ? p.tags.slice(0, 2) : [];

          return (
            <li key={`${p.countrySlug}-${p.programSlug}`}>
              <Link
                href={`/residency/${p.countrySlug}/${p.programSlug}`}
                aria-label={`View ${p.title} in ${p.country}`}
                className={[
                  "group relative block w-full rounded-2xl",
                  "bg-white/80 dark:bg-neutral-900/60 backdrop-blur",
                  "ring-1 ring-neutral-200/70 dark:ring-neutral-800/70",
                  "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  "p-2.5 sm:p-3",
                ].join(" ")}
              >
                {/* Row: fixed height to prevent image/text overlap */}
                <div className="flex h-24 items-stretch gap-2.5 sm:h-28 sm:gap-3">
                  {/* Media */}
                  <div className="relative h-full w-24 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt=""
                        fill
                        sizes="(max-width:640px) 6rem, 7rem"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[11px] text-neutral-500 dark:text-neutral-400">
                        No image
                      </div>
                    )}
                    <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    {/* Country kicker */}
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {p.country}
                    </div>

                    {/* Title (clamped) */}
                    <h3 className="mt-0.5 text-[14px] sm:text-[15px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-2">
                      {p.title}
                    </h3>

                    {/* Meta — single line + truncate to avoid overlap */}
                    <p className="mt-0.5 text-[12px] text-neutral-600 dark:text-neutral-400 truncate">
                      <span className="tabular-nums">{timeline}</span>
                      {investment ? <>&nbsp;·&nbsp;<span className="tabular-nums">{investment}</span></> : null}
                    </p>

                    {/* Chips (tiny, max 2) */}
                    {chips.length ? (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {chips.map((t) => (
                          <span
                            key={t}
                            className="
                              inline-flex items-center rounded-full
                              px-1.5 py-0.5 text-[10px]
                              ring-1 ring-neutral-200 dark:ring-neutral-700
                              bg-black/5 dark:bg-white/10
                              text-neutral-700 dark:text-neutral-300
                              max-w-[10rem] truncate
                            "
                            title={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* CTA */}
                    <span className="mt-1.5 inline-flex items-center text-[12px] font-medium text-sky-700 dark:text-sky-300">
                      View details
                      <span
                        aria-hidden
                        className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* helpers */
function money(amount: number, currency?: string) {
  const c = (currency || "").toUpperCase();
  if (!c) return amount.toLocaleString();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${c}`;
  }
}
