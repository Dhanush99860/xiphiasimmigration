// src/components/SidebarProgramsList.tsx
import * as React from "react";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import type { ProgramMeta } from "@/lib/residency-content";

type SidebarProgramsListProps = {
  country: string;
  programs: ProgramMeta[];
  /** Optionally highlight the currently viewed program */
  activeProgramSlug?: string;
};

function formatTimeline(months?: number) {
  if (typeof months === "number" && months > 0) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  return "Timeline varies";
}

function formatInvestment(value?: number, currency?: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (!currency) return value.toLocaleString();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString()} ${currency}`;
  }
}

export default function SidebarProgramsList({
  country,
  programs,
  activeProgramSlug,
}: SidebarProgramsListProps) {
  const hasPrograms = Array.isArray(programs) && programs.length > 0;
  const countrySlug = hasPrograms ? programs[0]?.countrySlug : undefined;

  return (
    <section
      aria-labelledby="programs-heading"
    >
      <SectionHeader eyebrow="Programs" title={`In ${country}`} />

      {!hasPrograms ? (
        <div className="mt-4 rounded-xl border border-dashed border-border dark:border-dark_border p-4 text-14 text-light_text dark:text-dark_text">
          No programs found for {country}.
          <div className="mt-2">
            <Link
              href={countrySlug ? `/residency/${countrySlug}` : "/residency"}
              className="
                inline-flex items-center gap-1
                rounded-lg px-2.5 py-1.5 text-14 font-medium
                ring-1 ring-inset ring-border dark:ring-dark_border
                hover:bg-grey dark:hover:bg-slateGray
                text-light_text dark:text-dark_text
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
              "
            >
              Explore country overview
              <span aria-hidden="true" className="inline-block">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 5l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-4 space-y-2.5" role="list" aria-describedby="programs-subtext">
          <span id="programs-subtext" className="sr-only">
            List of residency programs in {country}
          </span>

          {programs.map((p) => {
            const isActive = !!activeProgramSlug && p.programSlug === activeProgramSlug;
            const timelineLabel = formatTimeline(p.timelineMonths);
            const investmentLabel = formatInvestment(p.minInvestment as number | undefined, p.currency as string | undefined);
            const metaId = `program-meta-${p.countrySlug}-${p.programSlug}`;

            return (
              <li key={`${p.countrySlug}-${p.programSlug}`} className="min-w-0">
                <Link
                  href={`/residency/${p.countrySlug}/${p.programSlug}`}
                  aria-describedby={metaId}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group block rounded-xl p-2.5 sm:p-3 transition ring-1 ring-inset",
                    isActive
                      ? "bg-primary/5 dark:bg-primary/15 ring-primary/30"
                      : "bg-grey dark:bg-slateGray ring-border dark:ring-dark_border hover:bg-white/70 dark:hover:bg-deepSlate/70",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "text-light_text dark:text-dark_text",
                  ].join(" ")}
                >
                  {/* Grid: dot | content | chevron */}
                  <div className="grid grid-cols-[auto,1fr,auto] items-start gap-2.5 sm:gap-3">
                    {/* Accent dot */}
                    <span
                      className={[
                        "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full",
                        isActive ? "bg-primary" : "bg-muted dark:bg-charcoalGray group-hover:bg-primary/70",
                      ].join(" ")}
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <div
                        className={[
                          "text-[13.5px] sm:text-14 font-medium leading-snug line-clamp-2",
                          isActive ? "text-primary" : "text-light_text dark:text-dark_text",
                        ].join(" ")}
                      >
                        {p.title}
                      </div>

                      <div
                        id={metaId}
                        className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-12 text-light_text/70 dark:text-dark_text/70"
                      >
                        {/* timeline badge */}
                        <span
                          className="
                            inline-flex items-center gap-1
                            rounded-md px-1.5 py-0.5
                            bg-light_bg dark:bg-darklight
                            ring-1 ring-inset ring-border dark:ring-dark_border
                          "
                        >
                          <svg
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true"
                          >
                            <path
                              d="M6 2v2M14 2v2M3.5 7h13M5 5h10a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="tabular-nums">{timelineLabel}</span>
                        </span>

                        {/* investment badge */}
                        {typeof p.minInvestment === "number" && p.currency && investmentLabel ? (
                          <span
                            className="
                              inline-flex items-center gap-1
                              rounded-md px-1.5 py-0.5
                              bg-light_bg dark:bg-darklight
                              ring-1 ring-inset ring-border dark:ring-dark_border
                            "
                          >
                            <svg
                              viewBox="0 0 20 20"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              aria-hidden="true"
                            >
                              <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                            </svg>
                            <span className="whitespace-nowrap">
                              From <span className="tabular-nums">{investmentLabel}</span>
                            </span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Chevron */}
                    <span
                      className={[
                        "ml-1 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full transition",
                        isActive ? "text-primary" : "text-light_grey dark:text-charcoalGray group-hover:text-primary",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 5l6 5-6 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
