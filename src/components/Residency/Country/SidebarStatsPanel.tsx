import * as React from "react";
import SectionHeader, { AccentIcon } from "./SectionHeader";
import { Layers, BadgeDollarSign, Clock } from "lucide-react";

/* ================================
   Types
================================== */
type Props = {
  programsCount: number;
  investRange: string;
  timelineRange: string;       // e.g. "4–8 months", "40 months"
  className?: string;
  loading?: boolean;
  updatedAt?: string;          // optional ISO or display string
  showTimelineBar?: boolean;   // default: true
  timeScaleMonths?: number | "auto"; // default: "auto"
};

/* ================================
   Component
================================== */
export default function SidebarStatsPanel({
  programsCount,
  investRange,
  timelineRange,
  className,
  loading = false,
  updatedAt,
  showTimelineBar = true,
  timeScaleMonths = "auto",
}: Props) {
  const headerId = "snapshot-" + React.useId();
  const t = React.useMemo(() => parseTimeline(timelineRange), [timelineRange]);
  const label = React.useMemo(() => formatTimelineLabel(t, timelineRange), [t, timelineRange]);
  const scale =
    timeScaleMonths === "auto" ? chooseScale(t, 60) : timeScaleMonths;

  if (!loading && !programsCount && !investRange && !timelineRange) return null;

  return (
    <section
      aria-labelledby={headerId}
      className={[
        
       
        "backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-neutral-950/60",
        className || "",
      ].join(" ")}
    >

      <div id={headerId}>
        <SectionHeader eyebrow="Snapshot" title="At a glance" color="sky" />
      </div>
      {updatedAt ? (
        <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
          Updated <time dateTime={toISO(updatedAt)}>{toNiceDate(updatedAt)}</time>
        </p>
      ) : null}

      {/* Responsive, compact metric tiles */}
      <dl className="mt-4 grid grid-cols-1 gap-3">
        <MetricTile
          label="Programs"
          color="blue"
          icon={<Layers className="h-4 w-4" aria-hidden="true" />}
          value={
            loading ? (
              <Skeleton />
            ) : (
              <span aria-label={`${programsCount} programs`}>
                {new Intl.NumberFormat().format(programsCount)}
              </span>
            )
          }
          badge="Total"
        />

        <MetricTile
          label="Investment"
          color="green" // use 'green' to avoid emerald/alias issues
          icon={<BadgeDollarSign className="h-4 w-4" aria-hidden="true" />}
          value={loading ? <Skeleton /> : <Truncate title={investRange}>{investRange}</Truncate>}
          badge="From"
        />

        <MetricTile
          label="Timeline"
          color="violet"
          icon={<Clock className="h-4 w-4" aria-hidden="true" />}
          value={loading ? <Skeleton /> : <Truncate title={label}>{label}</Truncate>}
          badge={t.hasRange ? "Range" : "Avg"}
          footer={
            showTimelineBar && t.avg != null ? (
              <TimelineBar
                avg={t.avg}
                min={t.hasRange ? t.min! : null}
                max={t.hasRange ? t.max! : null}
                scale={scale}
                ariaLabel={label}
              />
            ) : null
          }
        />
      </dl>
    </section>
  );
}

/* ================================
   Subcomponents
================================== */

function MetricTile({
  label,
  value,
  icon,
  color,
  badge,
  footer,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: "blue" | "green" | "violet";
  badge?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl p-3 sm:p-3.5",
        "bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900/40",
        "ring-1 ring-neutral-200 dark:ring-neutral-800",
        "transition shadow-xs motion-safe:hover:-translate-y-0.5 hover:shadow-sm",
        "focus-within:ring-2 focus-within:ring-sky-400/50 dark:focus-within:ring-sky-500/40",
      ].join(" ")}
      role="group"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-black/5 dark:bg-white/5 blur-2xl"
      />
      <div className="flex items-start gap-3">
        <AccentIcon color={color}>{icon}</AccentIcon>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <dt className="text-[11px] uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
              {label}
            </dt>
            {badge ? (
              <span className="rounded-full border border-neutral-200 dark:border-neutral-800 px-2 py-[2px] text-[10px] leading-none text-neutral-600 dark:text-neutral-300 bg-white/70 dark:bg-neutral-900/60">
                {badge}
              </span>
            ) : null}
          </div>

          <dd
            className="mt-1 text-[15px] sm:text-sm font-semibold text-black dark:text-white leading-6"
            aria-live="polite"
          >
            {value}
          </dd>

          {footer ? <div className="mt-2">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

function Truncate({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <span
      className="block max-w-[70vw] sm:max-w-[26ch] whitespace-nowrap overflow-hidden text-ellipsis"
      title={typeof children === "string" ? children : title}
    >
      {children}
    </span>
  );
}

function Skeleton() {
  return (
    <span className="inline-block h-[1em] w-24 rounded bg-neutral-200/70 dark:bg-neutral-800/70 animate-pulse align-middle" />
  );
}

/** Clear, compact timeline with optional range band */
function TimelineBar({
  avg,
  min,
  max,
  scale,
  ariaLabel,
}: {
  avg: number;             // months
  min: number | null;      // months
  max: number | null;      // months
  scale: number;           // total scale in months
  ariaLabel: string;
}) {
  const showBand =
    min != null &&
    max != null &&
    Math.abs(max - min) >= 1; // only draw band if it’s meaningful

  const clampPct = (v: number) => Math.max(0, Math.min(100, (v / scale) * 100));
  const avgPct = clampPct(avg);
  const minPct = min != null ? clampPct(min) : null;
  const maxPct = max != null ? clampPct(max) : null;

  return (
    <div className="space-y-1" aria-label={ariaLabel}>
      <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
        {showBand && minPct != null && maxPct != null ? (
          <div
            className="absolute top-0 h-full bg-violet-200/70 dark:bg-violet-900/40"
            style={{ left: `${minPct}%`, width: `${Math.max(2, maxPct - minPct)}%` }}
            aria-hidden
          />
        ) : null}
        <div
          className="absolute top-0 h-full w-[2px] bg-violet-600 dark:bg-violet-400"
          style={{ left: `${avgPct}%` }}
          aria-hidden
        />
      </div>

      {/* Clean, non-confusing ticks */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>0&nbsp;mo</span>
        <span>~{Math.round(avg)}&nbsp;mo</span>
        <span>{scale}&nbsp;mo</span>
      </div>
    </div>
  );
}

/* ================================
   Utilities
================================== */

// Parse "4–8 months", "6-9 m", "40 months", etc. Returns months.
function parseTimeline(input: string) {
  const s = (input || "")
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const nums = (s.match(/(\d+(\.\d+)?)/g) || []).map(Number);
  if (nums.length >= 2) {
    const [a, b] = nums;
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    const avg = (min + max) / 2;
    return { min, max, avg, hasRange: max - min >= 1 };
  }
  if (nums.length === 1) {
    const avg = nums[0];
    return { min: null, max: null, avg, hasRange: false };
  }
  return { min: null, max: null, avg: null, hasRange: false };
}

// If value is a single number or min==max, show "≈ 40 mo"; else "4–8 mo"
function formatTimelineLabel(
  t: { min: number | null; max: number | null; avg: number | null; hasRange: boolean },
  original: string
) {
  if (t.avg == null) return original || "—";
  if (t.hasRange && t.min != null && t.max != null) {
    return `${stripZero(t.min)}–${stripZero(t.max)} mo`;
  }
  return `≈ ${stripZero(Math.round(t.avg))} mo`;
}

function stripZero(n: number) {
  // keep integers (e.g., 40 not 40.0)
  return Number.isInteger(n) ? String(n) : String(n.toFixed(1));
}

// Choose a readable scale: pad ~25% and round up to the nearest 6 mo (min 24)
function chooseScale(
  t: { min: number | null; max: number | null; avg: number | null },
  fallback = 60
) {
  const target = Math.max(t.max ?? 0, t.avg ?? 0);
  if (!target) return fallback;
  const padded = Math.ceil(target * 1.25);
  const step = 6;
  return Math.max(24, Math.ceil(padded / step) * step);
}

// ISO or display string → ISO
function toISO(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toISOString();
}
function toNiceDate(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime())
    ? d
    : new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
}
