"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

type Ans = "yes" | "no" | "";
type Question = { id: string; label: string; desc?: string };
type Policy = { type: "all" } | { type: "any" } | { type: "threshold"; minYes: number };
type VerdictText = {
  successTitle: string;
  successText: string;
  cautionTitle: string;
  cautionText: string;
};
type QuickCheckCTAs = {
  primaryHref?: string;
  primaryText?: string;
  secondaryHref?: string;
  secondaryText?: string;
};
type QuickCheckConfig = {
  questions: Question[];
  policy?: Policy;
  verdict?: VerdictText;
  ctas?: QuickCheckCTAs;
};

const DEFAULT_POLICY: Policy = { type: "all" };
const DEFAULT_VERDICT: VerdictText = {
  successTitle: "Looks eligible",
  successText: "You seem to meet the key criteria — talk to an advisor to confirm.",
  cautionTitle: "May be eligible",
  cautionText: "Some answers need review. There may be alternative routes.",
};
const DEFAULT_CTAS: Required<QuickCheckCTAs> = {
  primaryHref: "/PersonalBooking",
  primaryText: "Book a Free Consultation",
  secondaryHref: "/residency/eligibility",
  secondaryText: "Full eligibility checker",
};

export default function EligibilityQuickCheck({ config }: { config?: QuickCheckConfig | null }) {
  const reduceMotion = useReducedMotion();
  const questions = Array.isArray(config?.questions) ? config!.questions : [];
  if (!questions.length) return null;

  const policy = config?.policy ?? DEFAULT_POLICY;
  const verdictText = config?.verdict ?? DEFAULT_VERDICT;
  const ctas = { ...DEFAULT_CTAS, ...(config?.ctas || {}) };

  // Persist answers per unique question set
  const storageKey = useMemo(
    () => `eligibility-quickcheck:${questions.map((q) => q.id).join("|")}`,
    [questions]
  );

  const [answers, setAnswers] = useState<Record<string, Ans>>(
    Object.fromEntries(questions.map((q) => [q.id, ""]))
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, Ans>;
        const filtered = Object.fromEntries(
          questions.map((q) => [q.id, (parsed[q.id] as Ans) ?? ""])
        );
        setAnswers(filtered);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers, storageKey]);

  const answered = Object.values(answers).filter((v) => v !== "").length;
  const yesCount = Object.values(answers).filter((v) => v === "yes").length;
  const noCount = Object.values(answers).filter((v) => v === "no").length;
  const progress = Math.round((answered / questions.length) * 100);
  const ready = answered === questions.length;

  // Refs for focus/scroll to next question
  const qRefs = useRef<Record<string, HTMLFieldSetElement | null>>({});

  // Typed ref setter (must return void)
  const setFieldsetRef =
    (id: string) =>
    (el: HTMLFieldSetElement | null): void => {
      qRefs.current[id] = el;
    };

  function setAns(id: string, value: "yes" | "no") {
    setAnswers((s) => ({ ...s, [id]: value }));
    // Auto-advance to next unanswered (respect reduced motion)
    const idx = questions.findIndex((q) => q.id === id);
    const next =
      questions.slice(idx + 1).find((q) => !answers[q.id] || answers[q.id] === "") ||
      questions.find((q) => !answers[q.id] || answers[q.id] === "");
    if (next && next.id !== id) {
      const el = qRefs.current[next.id];
      if (el) {
        if (!reduceMotion) el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el.querySelector<HTMLInputElement>('input[type="radio"]')?.focus(), 50);
      }
    }
  }

  function reset() {
    const fresh = Object.fromEntries(questions.map((q) => [q.id, ""])) as Record<string, Ans>;
    setAnswers(fresh);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }

  const ok = useMemo(() => {
    if (!ready) return null;
    switch (policy.type) {
      case "all":
        return yesCount === questions.length;
      case "any":
        return yesCount >= 1;
      case "threshold":
        return yesCount >= policy.minYes;
      default:
        return false;
    }
  }, [ready, yesCount, questions.length, policy]);

  function PillRadio({
    name,
    value,
    checked,
    onChange,
    label,
  }: {
    name: string;
    value: "yes" | "no";
    checked: boolean;
    onChange: (v: "yes" | "no") => void;
    label: string;
  }) {
    const inputId = useId();
    const onKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        onChange(value === "yes" ? "no" : "yes");
      }
    };
    const palette =
      value === "yes"
        ? checked
          ? "bg-emerald-600 text-white hover:bg-emerald-600"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300"
        : checked
        ? "bg-rose-600 text-white hover:bg-rose-600"
        : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-300";

    return (
      <div className="relative">
        <input
          id={`${inputId}-${name}-${value}`}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <label
          htmlFor={`${inputId}-${name}-${value}`}
          onKeyDown={onKeyDown}
          tabIndex={0}
          className={[
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm",
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 cursor-pointer",
            palette,
          ].join(" ")}
          aria-pressed={checked}
          aria-label={`${label}: ${value === "yes" ? "Yes" : "No"}`}
        >
          {value === "yes" ? (
            <CheckCircle className="h-4 w-4" aria-hidden />
          ) : (
            <AlertTriangle className="h-4 w-4" aria-hidden />
          )}
          {value === "yes" ? "Yes" : "No"}
        </label>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="eligibility-heading"
      role="region"
      className="
        rounded-2xl p-5
        bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/25 dark:to-teal-900/20
        ring-1 ring-emerald-200/70 dark:ring-emerald-800/60
        text-black dark:text-white
      "
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-md bg-emerald-600/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Start ~10 sec
          </span>
          <h3 id="eligibility-heading" className="text-lg font-semibold pt-2">
            Quick eligibility check
          </h3>
          <p className="text-sm opacity-80 mt-1">
            Answer {questions.length} short question{questions.length > 1 ? "s" : ""} — get a fast indication and next steps.
          </p>
        </div>
      </header>

      {/* Progress + stats */}
      <div className="mt-4" aria-live="polite">
        <div
          className="w-full h-2 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Eligibility questions progress"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 18 }}
            className={`h-2 rounded-full ${progress === 100 ? "bg-emerald-600" : "bg-emerald-500"}`}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[13px]">
          <span className="font-medium">{answered}/{questions.length} answered</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5">
              <CheckCircle className="h-3.5 w-3.5" /> {yesCount} yes
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 px-2 py-0.5">
              <AlertTriangle className="h-3.5 w-3.5" /> {noCount} no
            </span>
            <span className="opacity-70">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="mt-4 space-y-3">
        {questions.map((q, idx) => {
          const val = answers[q.id];
          return (
            <fieldset
              key={q.id}
              ref={setFieldsetRef(q.id)}
              className="
                p-3 rounded-xl
                bg-white/70 dark:bg-white/5
                ring-1 ring-emerald-200/60 dark:ring-emerald-800/50
              "
            >
              <legend className="text-sm font-semibold">
                <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] align-middle">
                  {idx + 1}
                </span>
                {q.label}
              </legend>
              {q.desc ? (
                <p id={`${q.id}-desc`} className="mt-1 text-xs opacity-80">
                  {q.desc}
                </p>
              ) : null}

              <div className="mt-2 flex items-center gap-2" role="radiogroup" aria-label={q.label}>
                <PillRadio
                  name={q.id}
                  value="yes"
                  checked={val === "yes"}
                  onChange={(v) => setAns(q.id, v)}
                  label={q.label}
                />
                <PillRadio
                  name={q.id}
                  value="no"
                  checked={val === "no"}
                  onChange={(v) => setAns(q.id, v)}
                  label={q.label}
                />
              </div>
            </fieldset>
          );
        })}
      </div>

      {/* Result / CTA */}
      <div className="mt-5" aria-live="polite">
        {ready ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
            className={[
              "rounded-xl p-4 ring-1",
              ok
                ? "bg-emerald-50 dark:bg-emerald-900/25 ring-emerald-200/70 dark:ring-emerald-800/60"
                : "bg-amber-50 dark:bg-amber-900/25 ring-amber-200/70 dark:ring-amber-800/60",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5" aria-hidden>
                {ok ? (
                  <CheckCircle className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                )}
              </div>
              <div>
                <div className="font-semibold">
                  {ok ? verdictText.successTitle : verdictText.cautionTitle}
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {ok ? verdictText.successText : verdictText.cautionText}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <Link
                href={ctas.primaryHref!}
                className="inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label={ctas.primaryText}
              >
                {ctas.primaryText}
              </Link>

              {ctas.secondaryHref && ctas.secondaryText ? (
                <Link
                  href={ctas.secondaryHref}
                  className="inline-flex justify-center rounded-lg ring-1 ring-emerald-200 dark:ring-emerald-800 px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  aria-label={ctas.secondaryText}
                >
                  {ctas.secondaryText}
                </Link>
              ) : null}

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 ring-1 ring-emerald-200 dark:ring-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Reset answers"
              >
                <RefreshCw className="w-4 h-4" aria-hidden />
                Reset
              </button>
            </div>
          </motion.div>
        ) : (
          <p className="mt-2 text-sm opacity-80">
            Select answers above to get an instant indication and tailored next steps.
          </p>
        )}
      </div>

      <footer className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs opacity-70">We respect your privacy — no data is stored.</p>
        <Link
          href="/contact"
          className="text-sm underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
          aria-label="Contact us"
        >
          Contact us
        </Link>
      </footer>
    </section>
  );
}
