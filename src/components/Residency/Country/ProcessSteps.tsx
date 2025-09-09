"use client";

import React, { useId } from "react";
import { Clock, FileText, CheckCircle2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Step =
  | string
  | {
      title: string;
      description?: string;
      /** optional meta */
      duration?: string;
      docs?: string;
      outcome?: string;
    };

export default function ProcessSteps({
  steps,
  heading = "How it works",
}: {
  steps?: Step[] | string;
  heading?: string | null;
}) {
  if (!steps || (Array.isArray(steps) && steps.length === 0)) return null;

  // Single paragraph fallback (keeps old API working)
  if (!Array.isArray(steps) && typeof steps === "string") {
    const uid = useId();
    return (
      <section
        id="process"
        aria-labelledby={`process-heading-${uid}`}
        className="scroll-mt-28"
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
            Process
          </span>
          <h3 id={`process-heading-${uid}`} className="text-21 sm:text-24 font-semibold">
            {heading}
          </h3>
        </div>
        <div className="mt-2 text-14 sm:text-16 leading-7 whitespace-pre-line">{steps}</div>
      </section>
    );
  }

  const list = steps as Step[];
  const uid = useId();
  const headingId = heading ? `process-heading-${uid}` : undefined;

  return (
    <section
      id="process"
      role="region"
      aria-labelledby={heading ? headingId : undefined}
      className="scroll-mt-28 "
    >
      {/* Header like the screenshot */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
            Process
          </span>
          {heading ? (
            <h3 id={headingId} className="text-21 sm:text-24 font-semibold">
              {heading}
            </h3>
          ) : null}
          <span className="ml-auto hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ring-1 ring-border dark:ring-dark_border/80 opacity-70">
            {list.length} step{list.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Timeline list */}
      <ol className="space-y-4 sm:space-y-5" aria-label="Application steps">
        {list.map((raw, i) => {
          const n = i + 1;
          const isLast = i === list.length - 1;
          const step = normalize(raw);
          const palette = paletteByIndex(i);
          const stepId = `step-${uid}-${n}`;

          return (
            <li key={`${step.title ?? String(step.description ?? n)}-${i}`} className="relative">
              {/* Left rail + marker */}
              <div className="absolute left-0 top-0 h-full w-8 sm:w-10">
                {!isLast && (
                  <span
                    className="absolute left-4 sm:left-5 top-6 bottom-0 w-px bg-border dark:bg-dark_border/60"
                    aria-hidden
                  />
                )}
                <span
                  className={[
                    "absolute left-0 top-1 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center",
                    "rounded-full text-[12px] font-semibold tabular-nums ring-2 ring-light_bg dark:ring-dark_bg shadow-sm",
                    palette.dotBg,
                  ].join(" ")}
                  aria-hidden
                >
                  {n}
                </span>
              </div>

              {/* Card */}
              <article
                aria-labelledby={`${stepId}-title`}
                className={[
                  "ml-10 sm:ml-12 rounded-xl p-4 sm:p-5",
                  "bg-white/90 dark:bg-darklight/70",
                  "ring-1 shadow-sm transition",
                  "hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] focus-within:shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
                  palette.cardRing,
                ].join(" ")}
              >
                {/* Thin accent bar */}
                <span className={["block h-1 w-16 rounded-full", palette.accentBar].join(" ")} aria-hidden />

                {/* Title */}
                <h4 id={`${stepId}-title`} className="mt-2 text-16 sm:text-18 font-semibold leading-6">
                  <span className="sr-only">Step {n}: </span>
                  {step.title}
                </h4>

                {/* Description */}
                {step.description ? (
                  <p className="mt-2 text-14 sm:text-15 leading-7 text-light_text/85 dark:text-dark_text/90">
                    {step.description}
                  </p>
                ) : null}

                {/* Meta chips (Guided / Avg time / Docs) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.outcome ? (
                    <Chip icon={<CheckCircle2 className="h-3.5 w-3.5" />}>{step.outcome}</Chip>
                  ) : (
                    <Chip icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Guided</Chip>
                  )}
                  <Chip icon={<Clock className="h-3.5 w-3.5" />}>{step.duration ?? "Avg. 2–4 weeks"}</Chip>
                  {step.docs ? <Chip icon={<FileText className="h-3.5 w-3.5" />}>{step.docs}</Chip> : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- Helpers & UI bits ---------- */

function normalize(s: Step): {
  title: string;
  description?: string;
  duration?: string;
  docs?: string;
  outcome?: string;
} {
  if (typeof s === "string") {
    // If only a string is provided, we treat it as description and generate a title.
    return { title: "Step", description: s };
    // ^ You can change this to extract a title prefix if your strings include one.
  }
  return s;
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center gap-1.5 rounded-full
        px-2.5 py-1 text-[12px]
        ring-1 ring-border dark:ring-dark_border
        bg-black/5 text-light_text/85
        dark:bg-white/10 dark:text-dark_text/90
      "
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}

function paletteByIndex(i: number) {
  // Rotating accent palette to mirror the screenshot’s rhythm
  switch (i % 5) {
    case 0:
      return {
        dotBg: "bg-indigo-600 text-white",
        cardRing: "ring-indigo-200/70 dark:ring-indigo-900/40",
        accentBar: "bg-indigo-500/80 dark:bg-indigo-400/60",
      };
    case 1:
      return {
        dotBg: "bg-emerald-600 text-white",
        cardRing: "ring-emerald-200/70 dark:ring-emerald-900/40",
        accentBar: "bg-emerald-500/80 dark:bg-emerald-400/60",
      };
    case 2:
      return {
        dotBg: "bg-sky-600 text-white",
        cardRing: "ring-sky-200/70 dark:ring-sky-900/40",
        accentBar: "bg-sky-500/80 dark:bg-sky-400/60",
      };
    case 3:
      return {
        dotBg: "bg-rose-600 text-white",
        cardRing: "ring-rose-200/70 dark:ring-rose-900/40",
        accentBar: "bg-rose-500/80 dark:bg-rose-400/60",
      };
    default:
      return {
        dotBg: "bg-amber-600 text-white",
        cardRing: "ring-amber-200/70 dark:ring-amber-900/40",
        accentBar: "bg-amber-500/80 dark:bg-amber-400/60",
      };
  }
}
