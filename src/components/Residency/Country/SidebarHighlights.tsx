import * as React from "react";
import SectionHeader from "./SectionHeader";
import { CheckCircle2 } from "lucide-react";

export default function SidebarHighlights({ points }: { points?: string[] }) {
  if (!Array.isArray(points) || points.length === 0) return null;

  return (
    <section aria-labelledby="highlights-title"
    >
      <SectionHeader
        eyebrow="Highlights"
        title="Why founders choose this"
        className="text-midnight_text dark:text-dark_text"
      />

      <ul
        className="
          mt-4
          grid grid-cols-1
          gap-2.5 sm:gap-3
        "
        role="list"
        aria-describedby="highlights-subtext"
      >
        <span id="highlights-subtext" className="sr-only">
          Key reasons this program is attractive for founders
        </span>

        {points.map((pt, idx) => (
          <li
            key={idx}
            className="
              group relative overflow-hidden
              rounded-xl
              ring-1 ring-inset ring-border dark:ring-dark_border
              bg-grey dark:bg-slateGray
              text-light_text dark:text-dark_text
              transition-colors
              hover:bg-white/85 dark:hover:bg-deepSlate/70
              focus-within:ring-2 focus-within:ring-primary
            "
          >
            {/* Subtle top-right glow */}
            <div
              className="
                pointer-events-none absolute -top-8 -right-8 h-24 w-24
                rounded-full opacity-0 blur-220
                bg-primary/15 dark:bg-primary/20
                transition-opacity duration-300
                group-hover:opacity-100
              "
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-[auto,1fr,auto] items-start gap-3 p-3.5">
              {/* Leading icon badge */}
              <span
                className="
                  mt-0.5 grid h-8 w-8 place-items-center shrink-0
                  rounded-full
                  bg-light_bg dark:bg-darklight
                  ring-1 ring-primary/30
                "
                aria-hidden="true"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
              </span>

              {/* Copy */}
              <p className="min-w-0 text-14 leading-6 break-words hyphens-auto">
                {pt}
              </p>

              {/* Index pill */}
              <span
                className="
                  ml-2 mt-0.5 inline-flex items-center justify-center
                  rounded-full px-2 py-0.5
                  text-[11px] font-medium tabular-nums
                  bg-light_bg dark:bg-darklight
                  ring-1 ring-inset ring-border dark:ring-dark_border
                  text-light_text/80 dark:text-dark_text/80
                "
                aria-label={`Highlight ${idx + 1}`}
              >
                {idx + 1}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
