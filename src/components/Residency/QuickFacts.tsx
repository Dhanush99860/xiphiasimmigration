// components/Residency/QuickFacts.tsx
// Signature unchanged: { minInvestment, currency, timelineMonths, tags }
// Elegant, prominent "at-a-glance" block with clear hierarchy, soft tints,
// large tabular numbers, and responsive layout. Zero JS; SSR-friendly.

import * as React from "react";
import { Banknote, Clock, Sparkles } from "lucide-react";

export default function QuickFacts({
  minInvestment,
  currency,
  timelineMonths,
  tags,
}: {
  minInvestment?: number;
  currency?: string;
  timelineMonths?: number;
  tags?: string[];
}) {
  const hasMin = typeof minInvestment === "number" && !Number.isNaN(minInvestment);
  const hasTimeline = typeof timelineMonths === "number" && !Number.isNaN(timelineMonths);

  const minDisplay = hasMin ? formatMoney(minInvestment!, currency) : "No minimum";
  const timelineDisplay = hasTimeline ? pluralizeMonths(timelineMonths!) : "Varies";

  const allTags = Array.isArray(tags) ? tags.filter(Boolean) : [];
  const MAX_TAGS = 6;
  const shownTags = allTags.slice(0, MAX_TAGS);
  const extraCount = Math.max(0, allTags.length - shownTags.length);

  return (
    <section aria-labelledby="quickfacts-title" className="scroll-mt-28">
      {/* Eyebrow */}
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-sky-600/10 px-2 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
          At a glance
        </span>
        <h2 id="quickfacts-title" className="text-sm font-semibold opacity-80">
          Quick facts
        </h2>
      </div>

      {/* Container */}
      <div
        className="
          rounded-2xl p-4 sm:p-6
          bg-gradient-to-br from-slate-50 to-white dark:from-neutral-900/60 dark:to-neutral-900/20
          ring-1 ring-slate-200/70 dark:ring-neutral-800/70
          shadow-sm
        "
      >
        <div className="grid gap-6 md:grid-cols-3">
          {/* Minimum investment */}
          <dl className="grid gap-2">
            <dt className="flex items-center gap-2 text-[11px] uppercase tracking-wide opacity-75">
              <IconBadge>
                <Banknote className="h-4 w-4" aria-hidden />
              </IconBadge>
              Minimum investment
            </dt>
            <dd className="text-3xl sm:text-4xl font-semibold tabular-nums leading-none">
              {minDisplay}
            </dd>
            {currency ? (
              <dd className="text-xs opacity-70">Currency: {currency}</dd>
            ) : null}
          </dl>

          {/* Typical timeline */}
          <dl className="grid gap-2 md:border-l md:border-slate-200/70 md:dark:border-neutral-800/70 md:pl-6">
            <dt className="flex items-center gap-2 text-[11px] uppercase tracking-wide opacity-75">
              <IconBadge>
                <Clock className="h-4 w-4" aria-hidden />
              </IconBadge>
              Typical timeline
            </dt>
            <dd className="text-3xl sm:text-4xl font-semibold tabular-nums leading-none">
              {timelineDisplay}
            </dd>
            <dd className="text-xs opacity-70">From application start</dd>
          </dl>

          {/* Highlights */}
          <div className="grid gap-2 md:border-l md:border-slate-200/70 md:dark:border-neutral-800/70 md:pl-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide opacity-75">
              <IconBadge>
                <Sparkles className="h-4 w-4" aria-hidden />
              </IconBadge>
              Highlights
            </div>

            <div className="flex flex-wrap gap-2">
              {shownTags.length > 0 ? (
                <>
                  {shownTags.map((t) => (
                    <span
                      key={t}
                      className="
                        inline-flex items-center rounded-full
                        bg-black/5 px-3 py-1 text-xs text-black
                        dark:bg-white/10 dark:text-gray-100
                        ring-1 ring-black/5 dark:ring-white/10
                      "
                    >
                      {t}
                    </span>
                  ))}
                  {extraCount > 0 ? (
                    <span
                      aria-label={`${extraCount} more highlights`}
                      className="
                        inline-flex items-center rounded-full
                        bg-slate-100 px-3 py-1 text-xs text-slate-700
                        dark:bg-neutral-800 dark:text-neutral-300
                        ring-1 ring-slate-200 dark:ring-neutral-700
                      "
                    >
                      +{extraCount} more
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-xs opacity-70">Add highlights in front-matter</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex h-6 w-6 items-center justify-center rounded-md
        bg-white text-slate-700 ring-1 ring-slate-200
        dark:bg-white/10 dark:text-white dark:ring-neutral-700
      "
      aria-hidden
    >
      {children}
    </span>
  );
}

function pluralizeMonths(m: number) {
  return `${m} month${m === 1 ? "" : "s"}`;
}

function formatMoney(amount: number, currency?: string) {
  if (Number.isNaN(amount)) return "—";
  if (!currency) return compactNumber(amount);

  // ISO 4217 currency code (e.g., CAD, USD, EUR)
  if (/^[A-Z]{3}$/.test(currency)) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      // fall through to generic
    }
  }
  return `${compactNumber(amount)} ${currency}`;
}

function compactNumber(n: number) {
  // Compact but stable formatting for big figures (e.g., 1,200,000 -> 1.2M)
  try {
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    // Fallback if Intl settings aren’t available
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
  }
}
