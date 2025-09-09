"use client";

import * as React from "react";

/**
 * FAQAccordion — neutral, accessible, dark/light correct
 * - Buttons with aria-expanded/controls + region
 * - Smooth height animation (CSS grid rows)
 * - Deep-linkable hash + hash-sync
 * - Explicit color tokens to guarantee contrast
 */
export default function FAQAccordion({
  faqs,
}: {
  faqs?: { q: string; a: string }[];
}) {
  if (!faqs?.length) return null;

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const slugs = React.useMemo(() => faqs.map((f) => slugify(f.q)), [faqs]);

  React.useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(
        (typeof window !== "undefined" ? window.location.hash : "").replace("#", "")
      );
      if (!hash) return;
      const idx = slugs.indexOf(hash);
      if (idx >= 0) setOpenIndex(idx);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [slugs]);

  const onToggle = (idx: number) => {
    setOpenIndex((cur) => {
      const next = cur === idx ? null : idx;
      if (typeof window !== "undefined") {
        const nextHash = next === null ? "" : `#${slugs[next]}`;
        if (window.history?.replaceState) {
          const url = nextHash
            ? `${window.location.pathname}${window.location.search}${nextHash}`
            : `${window.location.pathname}${window.location.search}`;
          window.history.replaceState(null, "", url);
        }
      }
      return next;
    });
  };

  return (
    <section
      role="region"
      aria-label="Frequently asked questions"
      className="
        
        pt-3 sm:pt-4
        text-light_text dark:text-dark_text
      "
    >
        <header className="mb-3">
                  <h2 className="text-xl font-semibold">Frequently asked questions</h2>
                </header>
      <div
        className="
          overflow-visible rounded-xl
          ring-1 ring-inset ring-border dark:ring-dark_border
          divide-y divide-border/70 dark:divide-dark_border/70
          bg-transparent
        "
      >
        
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          const panelId = `faq-panel-${i}-${slugs[i]}`;
          const buttonId = `faq-button-${i}-${slugs[i]}`;

          return (
            <div key={panelId} className="px-3 sm:px-4">
              {/* Question row */}
              <h4 className="m-0">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => onToggle(i)}
                  className="
                    group flex w-full items-start justify-between gap-3 sm:gap-4 py-4 sm:py-5 text-left rounded-lg
                    hover:bg-grey/60 dark:hover:bg-darklight/70
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-border dark:focus-visible:ring-dark_border
                    text-light_text dark:text-dark_text
                  "
                >
                  <span className="min-w-0 pr-2">
                    <span className="block text-15 sm:text-16 font-semibold leading-6">
                      {f.q}
                    </span>
                  </span>

                  {/* Chevron: black in light, white in dark */}
                  <span
                    className="
                      mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                      bg-light_bg dark:bg-dark_bg
                      ring-1 ring-inset ring-border dark:ring-dark_border
                      text-light_text dark:text-dark_text
                      transition-transform duration-300
                      group-aria-expanded:rotate-180
                    "
                    aria-hidden
                    aria-expanded={isOpen}
                  >
                    <Chevron className="h-4 w-4" />
                  </span>
                </button>
              </h4>

              {/* Answer (animated height) */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={[
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  "motion-reduce:transition-none",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div className="
                    pb-4 sm:pb-5
                    text-14 sm:text-15 leading-7
                    text-light_text dark:text-dark_text
                    whitespace-pre-line
                  ">
                    {f.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------ helpers ------------ */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
