import * as React from "react";
import SectionHeader from "./SectionHeader";
import { CheckCircle2 } from "lucide-react";

type Props = {
  items?: string[] | string;
  className?: string;
  /** Set to true if you prefer 1,2,3… instead of check icons */
  numbered?: boolean;
  /** Max columns for wide screens (1 or 2). Default: 2 */
  columns?: 1 | 2;
};

export default function EligibilityRequirements({
  items,
  className,
  numbered = false,
  columns = 2,
}: Props) {
  if (!items) return null;

  const isList = Array.isArray(items);
  const count = isList ? items.length : undefined;

  const gridCols =
    columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";

  return (
    <section
      id="requirements"
      aria-labelledby="eligibility-title"
      className={[
        "scroll-mt-28",
        className || "",
      ].join(" ")}
    >
      {/* slim brand accent */}
      <span
        aria-hidden
        className="block h-[2px] w-full rounded-full mb-3 bg-gradient-to-r from-warning/80 via-primary/30 to-warning/80"
      />

      <div className="mb-3 flex items-center justify-between">
        <div id="eligibility-title">
          <SectionHeader eyebrow="Eligibility" title="Requirements" color="amber" />
        </div>

        {typeof count === "number" ? (
          <span className="ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] bg-light_bg/80 dark:bg-darklight/80 ring-1 ring-border dark:ring-dark_border text-charcoalGray dark:text-dark_text/85">
            <span className="h-2 w-2 rounded-full bg-primary/70" aria-hidden />
            {count} item{count === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {/* Rich text (single string) */}
      {!isList ? (
        <div
          className={[
            "rounded-xl p-4",
            "bg-light_bg/80 dark:bg-darklight/80 ring-1 ring-border dark:ring-dark_border",
            "prose prose-sm dark:prose-invert max-w-none",
          ].join(" ")}
        >
          {items}
        </div>
      ) : numbered ? (
        /* Numbered variant (no boxes), great for step-like requirements */
        <ol
          role="list"
          className={[
            "mt-2 grid gap-y-3 gap-x-6",
            gridCols,
          ].join(" ")}
          aria-label="Eligibility requirements (numbered)"
        >
          {items.map((item, idx) => (
            <li key={idx} className="relative pl-8">
              {/* number badge */}
              <span
                aria-hidden
                className="absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full bg-warning/15 text-[12px] font-semibold ring-1 ring-warning/30 text-light_text dark:text-dark_text"
              >
                {idx + 1}
              </span>
              <p className="text-[15px] leading-7" title={item}>
                {item}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        /* Checklist variant (soft, divider-less, two columns on sm+) */
        <ul
          role="list"
          className={["mt-2 grid gap-y-3 gap-x-6", gridCols].join(" ")}
          aria-label="Eligibility requirements"
        >
          {items.map((item, idx) => (
            <li key={idx} className="relative">
              <div className="flex items-start gap-3">
                {/* accent bullet (not a heavy card) */}
                <span
                  aria-hidden
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success/15 ring-1 ring-success/25 dark:bg-success/20"
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </span>
                <p className="text-[15px] leading-7" title={item}>
                  {item}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
