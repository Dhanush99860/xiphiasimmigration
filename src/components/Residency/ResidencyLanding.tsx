"use client";

import { useMemo, useState } from "react";
import type { CountryMeta, ProgramMeta } from "@/lib/residency-content";
import CountryCard from "./CountryCard";
import TopPrograms from "@/components/Residency/TopPrograms";
import ContactForm from "@/components/ContactForm/index";
import { Search } from "lucide-react";

type Props = {
  countries: CountryMeta[];
  topPrograms?: ProgramMeta[];
};

export default function ResidencyLanding({ countries, topPrograms }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter(
      (c) =>
        c.title.toLowerCase().includes(s) ||
        c.country.toLowerCase().includes(s) ||
        (c.summary?.toLowerCase().includes(s) ?? false)
    );
  }, [countries, q]);

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* --- Mobile-only sticky search bar at very top --- */}
      <div
        role="search"
        className="md:hidden sticky top-0 z-40 -mx-4 px-4 py-3 bg-white/95 dark:bg-darkmode/95 backdrop-blur border-b"
      >
        <label htmlFor="mobileCountrySearch" className="sr-only text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
          Search countries
        </label>

        {/* input wrapper with icon */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            id="mobileCountrySearch"
            type="search"
            placeholder="Type a country name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border bg-white dark:bg-darkmode pl-10 pr-3 py-4 text-sm transition"
            autoComplete="off"
            aria-label="Search countries"
          />
        </div>

        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
          Showing <strong>{filtered.length}</strong> of {countries.length}
        </div>
      </div>

      {/* Countries grid */}
      <div className="order-1 lg:order-1 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => (
            <CountryCard key={c.countrySlug} country={c} variant="compact" />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border bg-white dark:bg-darkmode p-6 text-center sm:col-span-2">
              <p className="text-gray-600 dark:text-gray-300">No countries match your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right column (desktop sticky as before) */}
      <aside className="order-2 lg:order-2 lg:sticky lg:top-6 h-max">
        <div className="rounded-2xl border bg-white dark:bg-darkmode p-5 shadow overflow-visible">
          {/* Desktop search (hidden on mobile to avoid duplication) */}
          <div className="hidden md:block" role="search">
            <label
              htmlFor="countrySearch"
              className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors"
            >
              Search countries
            </label>

            {/* input wrapper with icon */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <input
                id="countrySearch"
                type="search"
                placeholder="Type a country name…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-xl border bg-white dark:bg-darkmode pl-10 pr-3 py-4 text-base  transition"
                autoComplete="off"
                aria-label="Search countries"
              />
            </div>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Showing <strong>{filtered.length}</strong> of {countries.length}
            </div>
          </div>

          {/* Top Programs stays where it is */}
          {topPrograms && topPrograms.length > 0 && (
            <div className="mt-5">
              <header className="mb-3">
                <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  Top Residency Programs
                </h2>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 line-clamp-3">
                  Popular, fast-moving options across countries.
                </p>
              </header>
              <TopPrograms programs={topPrograms} />
            </div>
          )}
        </div>

        <div className="pt-5">
          <ContactForm />
        </div>
      </aside>
    </section>
  );
}
