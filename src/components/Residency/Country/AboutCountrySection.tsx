import React from "react";
import SectionHeader from "./SectionHeader";
import {
  Users,
  Landmark,
  Languages,
  BadgeDollarSign,
  Clock,
  CloudSun,
} from "lucide-react";

export type CountryFacts = {
  population?: number | string;
  capital?: string;
  language?: string;
  currency?: string;
  timeZone?: string;
  climate?: string;
};

type Accent = "blue" | "emerald" | "violet" | "amber" | "sky" | "rose";

export default function AboutCountrySection({
  country,
  overview,
  facts,
}: {
  country: string;
  overview?: string;
  facts?: CountryFacts;
}) {
  if (!overview && !facts) return null;

  const items = buildFactItems(facts);

  return (
    <section
      id="about"
      className="scroll-mt-28"
      aria-labelledby="about-heading"
    >
      <SectionHeader eyebrow="Overview" title={`About ${country}`}  />

      {overview ? (
        <p className="mt-3 text-[15px] leading-7 text-neutral-800">{overview}</p>
      ) : null}

      {items.length ? (
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={`${country} key facts`}>
          {items.map((it) => (
            <StatCard key={it.label} item={it} />
          ))}
        </dl>
      ) : null}
    </section>
  );
}

/* ----------------- Subcomponents ----------------- */

function Chip({ label, value, color }: { label: string; value: React.ReactNode; color: Accent }) {
  const c = accent(color);
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${c.chipBg} ${c.chipText} ${c.chipRing} ring-1`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      <span className="font-semibold">{label}:</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

type FactItem = {
  label: string;
  value?: React.ReactNode;
  Icon: React.ElementType;
  accent: Accent;
};

function StatCard({ item }: { item: FactItem }) {
  const c = accent(item.accent);
  const IconCmp = item.Icon;

  return (
    <div className="group h-full rounded-xl bg-gradient-to-b from-white to-neutral-50 ring-1 ring-neutral-200 p-4 transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${c.bubbleBg} ${c.iconText}`}>
          <IconCmp className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-600">{item.label}</dt>
          <dd className="mt-0.5 text-[15px] font-semibold text-black leading-6 break-words">{item.value ?? "—"}</dd>
        </div>
      </div>
      
    </div>
  );
}

/* ----------------- Data builder ----------------- */

function buildFactItems(facts?: CountryFacts): FactItem[] {
  if (!facts) return [];
  const list: FactItem[] = [
    {
      label: "Population",
      value: typeof facts.population === "number" ? Number(facts.population).toLocaleString() : facts.population,
      Icon: Users,
      accent: "blue",
    },
    { label: "Capital", value: facts.capital, Icon: Landmark, accent: "emerald" },
    { label: "Language", value: facts.language, Icon: Languages, accent: "violet" },
    { label: "Currency", value: facts.currency, Icon: BadgeDollarSign, accent: "amber" },
    { label: "Time zone", value: facts.timeZone, Icon: Clock, accent: "sky" },
    { label: "Climate", value: facts.climate, Icon: CloudSun, accent: "rose" },
  ];
  return list.filter((i) => i.value !== undefined && i.value !== "");
}

/* ----------------- Accent tokens ----------------- */

function accent(k: Accent) {
  switch (k) {
    case "blue":
      return {
        chipBg: "bg-blue-50",
        chipText: "text-blue-800",
        chipRing: "ring-blue-100",
        bubbleBg: "bg-blue-50",
        iconText: "text-blue-700",
        dot: "bg-blue-600",
      };
    case "emerald":
      return {
        chipBg: "bg-emerald-50",
        chipText: "text-emerald-800",
        chipRing: "ring-emerald-100",
        bubbleBg: "bg-emerald-50",
        iconText: "text-emerald-700",
        dot: "bg-emerald-600",
      };
    case "violet":
      return {
        chipBg: "bg-violet-50",
        chipText: "text-violet-800",
        chipRing: "ring-violet-100",
        bubbleBg: "bg-violet-50",
        iconText: "text-violet-700",
        dot: "bg-violet-600",
      };
    case "amber":
      return {
        chipBg: "bg-amber-50",
        chipText: "text-amber-800",
        chipRing: "ring-amber-100",
        bubbleBg: "bg-amber-50",
        iconText: "text-amber-700",
        dot: "bg-amber-600",
      };
    case "sky":
      return {
        chipBg: "bg-sky-50",
        chipText: "text-sky-800",
        chipRing: "ring-sky-100",
        bubbleBg: "bg-sky-50",
        iconText: "text-sky-700",
        dot: "bg-sky-600",
      };
    case "rose":
      return {
        chipBg: "bg-rose-50",
        chipText: "text-rose-800",
        chipRing: "ring-rose-100",
        bubbleBg: "bg-rose-50",
        iconText: "text-rose-700",
        dot: "bg-rose-600",
      };
  }
}
