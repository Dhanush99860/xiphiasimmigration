"use client";

import * as React from "react";
import { Banknote, Wallet, Info, CalendarDays } from "lucide-react";

type PriceItem = {
  label: string;
  amount?: number;
  currency?: string;
  when?: string;
  notes?: string;
};
type ProofItem = {
  label?: string;
  amount: number;
  currency?: string;
  notes?: string;
};

export default function Prices({
  items,
  proofOfFunds = [],
  defaultCurrency = "USD",
}: {
  items: PriceItem[];
  proofOfFunds?: ProofItem[];
  defaultCurrency?: string;
}) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasProof = Array.isArray(proofOfFunds) && proofOfFunds.length > 0;
  if (!hasItems && !hasProof) return null;

  /* ---------- helpers ---------- */
  const fmt = (amt?: number, cur?: string) => {
    if (typeof amt !== "number" || Number.isNaN(amt)) return "—";
    const c = (cur || defaultCurrency || "USD").toUpperCase();
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: c,
        maximumFractionDigits: 0,
      }).format(amt);
    } catch {
      return `${amt.toLocaleString()} ${c}`;
    }
  };

  const sumByCurrency = <T extends { amount?: number; currency?: string }>(
    list: T[]
  ) => {
    const map = new Map<string, number>();
    for (const row of list) {
      if (typeof row.amount !== "number" || Number.isNaN(row.amount)) continue;
      const c = (row.currency || defaultCurrency || "USD").toUpperCase();
      map.set(c, (map.get(c) || 0) + row.amount);
    }
    return [...map.entries()].map(([currency, total]) => ({ currency, total }));
  };

  const itemTotals = hasItems ? sumByCurrency(items) : [];
  const proofTotals = hasProof ? sumByCurrency(proofOfFunds) : [];

  /* ---------- UI ---------- */
  return (
    <section aria-labelledby="prices-title" className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-rose-600/10 px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
          Costs
        </span>
        <h3 id="prices-title" className="text-lg font-semibold">
          Program fees & proof of funds
        </h3>
      </div>

      {/* Fees table (scrollable on mobile, never cropped) */}
      {hasItems ? (
        <div
          className="
            rounded-2xl bg-gradient-to-br from-white to-slate-50
            dark:from-neutral-900/60 dark:to-neutral-900/20
            ring-1 ring-slate-200/70 dark:ring-neutral-800/70 shadow-sm
          "
        >
          <div className="px-4 pt-4 sm:px-6 sm:pt-6 flex items-center gap-2">
            <Banknote className="h-4 w-4 opacity-75" aria-hidden />
            <p className="text-sm opacity-80">Program fee breakdown</p>
          </div>

          {/* scroll wrapper */}
          <div className="relative mt-3">
            {/* subtle edge fade for scroll context */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent" />

            <div className="overflow-x-auto px-4 sm:px-6 pb-4">
              <table className="min-w-[720px] w-full text-sm">
                <thead>
                  <tr className="text-left text-[12px] uppercase tracking-wide opacity-70">
                    <th className="py-2 pr-4 font-semibold">Item</th>
                    <th className="py-2 pr-4 font-semibold">Price</th>
                    <th className="py-2 pr-4 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        When
                      </span>
                    </th>
                    <th className="py-2 pr-4 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        Notes
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr
                      key={`${it.label}-${i}`}
                      className="border-t border-slate-200/70 dark:border-neutral-800/70"
                    >
                      <td className="py-3 pr-4 font-medium">{it.label}</td>
                      <td className="py-3 pr-4 tabular-nums">
                        {fmt(it.amount, it.currency)}
                      </td>
                      <td className="py-3 pr-4">{it.when ?? "—"}</td>
                      <td className="py-3 pr-4 opacity-80">
                        {it.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* mobile hint */}
              <p className="mt-2 text-[12px] opacity-60 sm:hidden">
                Swipe horizontally to see all columns.
              </p>
            </div>
          </div>

          {/* Per-currency totals */}
          {itemTotals.length ? (
            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {itemTotals.map(({ currency, total }) => (
                  <span
                    key={currency}
                    className="
                      inline-flex items-center gap-1 rounded-full
                      bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300
                      ring-1 ring-rose-200/70 dark:ring-rose-800/60
                      px-3 py-1 text-xs font-medium
                    "
                    aria-label={`Estimated total in ${currency}`}
                  >
                    <Banknote className="h-3.5 w-3.5" />
                    Total ({currency}): {fmt(total, currency)}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[12px] opacity-60">
                Totals are estimated; items with different currencies are shown
                separately.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Proof of funds (card grid, never cropped) */}
      {hasProof ? (
        <div
          className="
            rounded-2xl p-4 sm:p-6
            bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-neutral-900/20
            ring-1 ring-amber-200/70 dark:ring-amber-800/60
          "
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 opacity-75" aria-hidden />
            <h4 className="text-base font-semibold">Proof of funds</h4>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {proofOfFunds.map((p, i) => (
              <li
                key={`${p.label || "pf"}-${i}`}
                className="
                  rounded-xl p-3
                  bg-white/80 dark:bg-white/5
                  ring-1 ring-amber-200/70 dark:ring-amber-800/60
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">
                    {p.label || "Applicant"}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {fmt(p.amount, p.currency)}
                  </span>
                </div>
                {p.notes ? (
                  <p className="mt-1 text-xs opacity-80">{p.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>

          {/* totals */}
          {proofTotals.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {proofTotals.map(({ currency, total }) => (
                <span
                  key={currency}
                  className="
                    inline-flex items-center gap-1 rounded-full
                    bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300
                    ring-1 ring-amber-200/70 dark:ring-amber-800/60
                    px-3 py-1 text-xs font-medium
                  "
                >
                  Required ({currency}): {fmt(total, currency)}
                </span>
              ))}
            </div>
          ) : null}

          <p className="mt-3 text-[12px] opacity-70">
            Figures are indicative and may change. Exact amounts are confirmed
            during onboarding and depend on family size, location and program
            updates.
          </p>
        </div>
      ) : null}
    </section>
  );
}
