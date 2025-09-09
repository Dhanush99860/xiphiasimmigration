import * as React from "react";
import SectionHeader from "./SectionHeader";
import { CheckCircle2 } from "lucide-react";

/** You can pass simple strings OR richer objects with detail text */
type Benefit =
  | string
  | {
      title: string;
      detail?: string;
    };

type Props = {
  country: string;
  points?: Benefit[];
  className?: string;
  columns?: 1 | 2;     // default 1; set 2 for wider pages (still no boxes)
  dense?: boolean;     // tighter spacing
  accent?: "green" | "blue"; // accent hue family
};

export default function WhyCountrySection({
  country,
  points,
  className,
  columns = 1,
  dense = false,
  accent = "green",
}: Props) {
  if (!Array.isArray(points) || points.length === 0) return null;

  const headerId = "why-" + slugify(country);
  const padY = dense ? "py-2.5" : "py-3.5";
  const gap = dense ? "gap-2.5" : "gap-3";
  const txtSize = dense ? "text-[14px] leading-6" : "text-[15px] leading-7";
  const acc = getAccent(accent);

  return (
    <section
      id="why"
      aria-labelledby={headerId}
      className={[
        "scroll-mt-28 ",
        className || "",
      ].join(" ")}
    >
      {/* slim brand accent */}


      <div id={headerId}>
        <SectionHeader eyebrow="Key Points" title={`Why ${country}?`} color="green" />
      </div>

      {/* Layout:
          - columns=1: classic list with dividers
          - columns=2: responsive two-column list without boxes (no per-row divider) */}
      {columns === 1 ? (
        <ul
          role="list"
          aria-label={`Top Key Points of ${country}`}
          className={[
            "mt-4 divide-y divide-border dark:divide-dark_border",
          ].join(" ")}
        >
          {points.map((p, idx) => {
            const { title, detail } = normalize(p);
            return (
              <li key={idx} className={[padY].join(" ")}>
                <div className={["flex items-start", gap].join(" ")}>
                  <BulletIcon accent={acc} />
                  <div className="min-w-0">
                    <h3
                      className={["font-medium", txtSize].join(" ")}
                      title={title}
                    >
                      {title}
                    </h3>
                    {detail ? (
                      <p className="mt-1 text-[13px] leading-6 text-charcoalGray dark:text-dark_text/80 whitespace-pre-wrap">
                        {detail}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul
          role="list"
          aria-label={`Top Key Points of ${country}`}
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2"
        >
          {points.map((p, idx) => {
            const { title, detail } = normalize(p);
            return (
              <li key={idx} className="relative">
                <div className={["flex items-start", gap].join(" ")}>
                  {/* subtle left accent bar per item (not a box) */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.4rem] h-[1.15rem] w-[2px] rounded bg-success/40 dark:bg-success/35"
                  />
                  <div className="pl-3">
                    <div className="flex items-start gap-2.5">
                      <BulletIcon accent={acc} />
                      <div className="min-w-0">
                        <h3
                          className={["font-medium", txtSize].join(" ")}
                          title={title}
                        >
                          {title}
                        </h3>
                        {detail ? (
                          <p className="mt-1 text-[13px] leading-6 text-charcoalGray dark:text-dark_text/80 whitespace-pre-wrap">
                            {detail}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ---------- pieces ---------- */

function BulletIcon({ accent }: { accent: ReturnType<typeof getAccent> }) {
  return (
    <span
      aria-hidden
      className={[
        "mt-[2px] grid h-7 w-7 shrink-0 place-items-center rounded-full",
        accent.iconBg, accent.iconRing,
      ].join(" ")}
    >
      <CheckCircle2 className={`h-4 w-4 ${accent.icon}`} />
    </span>
  );
}

/* ---------- helpers ---------- */

function normalize(p: Benefit): { title: string; detail?: string } {
  if (typeof p === "string") return { title: p };
  return { title: p.title, detail: p.detail };
}

function getAccent(a: "green" | "blue") {
  if (a === "blue") {
    return {
      topline: "bg-gradient-to-r from-primary/80 via-primary/30 to-primary/80",
      iconBg: "bg-primary/15 dark:bg-primary/20",
      iconRing: "ring-1 ring-primary/25",
      icon: "text-primary",
    };
  }
  return {
    topline: "bg-gradient-to-r from-success/70 via-primary/30 to-success/70",
    iconBg: "bg-success/15 dark:bg-success/20",
    iconRing: "ring-1 ring-success/25",
    icon: "text-success",
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
