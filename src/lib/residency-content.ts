// src/lib/residency-content.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ReactNode } from "react";

/* =========================
 * Types
 * =======================*/
export type CountryMeta = {
  title: string;
  category: "residency";
  country: string;
  countrySlug: string;
  summary?: string;
  tagline?: string;
  heroImage?: string;
  introPoints?: string[];
  seo?: { title?: string; description?: string };
  draft?: boolean;
};

export type Step = { title: string; description?: string };

export type ProgramMeta = {
  title: string;
  category: "residency";
  country: string;
  countrySlug: string;
  programSlug: string;
  tagline?: string;
  minInvestment?: number;
  currency?: "USD" | "EUR" | "AED" | "INR" | "CAD" | "GBP";
  timelineMonths?: number;
  tags?: string[];
  benefits?: string[];
  requirements?: string[];
  processSteps?: Step[];
  faq?: { q: string; a: string }[];
  seo?: { title?: string; description?: string };
  draft?: boolean;
};

/* Sections map returned by loadProgramPageSections */
export type ProgramSections = Record<string, ReactNode>;

/* =========================
 * Constants & helpers
 * =======================*/
const ROOT = path.join(process.cwd(), "content", "residency");
const exists = (p: string) => {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
};
const toTitle = (slug: string) =>
  slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

/** MDX options — NOTE: no `as const` so arrays aren't readonly */
const baseMdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
};

/** slugify section titles, e.g. "Why Choose Us?" -> "why-choose-us" */
function slugify(h: string) {
  return h
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Split MDX body by top-level `###` headings.
 *  Keeps the `<h3>` line in each part so headings still render. */
function splitByH3(md: string): Record<string, string> {
  const lines = md.split(/\r?\n/);
  const out: Record<string, string> = {};
  let current: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (current) out[current] = buf.join("\n").trim();
    buf = [];
  };

  for (const line of lines) {
    const m = /^###\s+(.+?)\s*$/.exec(line);
    if (m) {
      flush();
      current = slugify(m[1]);
      buf.push(line);
    } else {
      if (!current) {
        current = "overview";
        buf.push("### Overview");
      }
      buf.push(line);
    }
  }
  flush();
  return out;
}

/* =========================
 * Lists & slugs
 * =======================*/
export function getResidencyCountrySlugs(): string[] {
  if (!exists(ROOT)) return [];
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getResidencyCountries(): CountryMeta[] {
  const out: CountryMeta[] = [];

  for (const slug of getResidencyCountrySlugs()) {
    const file = path.join(ROOT, slug, "_country.mdx");
    if (!exists(file)) continue;

    const { data } = matter(fs.readFileSync(file, "utf8"));
    const meta = { ...(data as Partial<CountryMeta>) };

    if (!meta.countrySlug) meta.countrySlug = slug;
    if (!meta.country) meta.country = (meta.title as string) || toTitle(slug);
    if (!meta.title) meta.title = meta.country;
    if (!meta.heroImage) meta.heroImage = `/images/${meta.countrySlug}.jpg`;
    if (!meta.category) (meta as any).category = "residency";

    if (!meta.draft) out.push(meta as CountryMeta);
  }

  return out.sort((a, b) => a.country.localeCompare(b.country));
}

export function getResidencyProgramSlugs(countrySlug: string): string[] {
  const dir = path.join(ROOT, countrySlug);
  if (!exists(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => n.endsWith(".mdx") && n !== "_country.mdx")
    .map((n) => n.replace(/\.mdx$/, ""));
}

export function getResidencyPrograms(countrySlug?: string): ProgramMeta[] {
  const countries = countrySlug ? [countrySlug] : getResidencyCountrySlugs();
  const out: ProgramMeta[] = [];

  for (const c of countries) {
    for (const p of getResidencyProgramSlugs(c)) {
      const f = path.join(ROOT, c, `${p}.mdx`);
      const { data } = matter(fs.readFileSync(f, "utf8"));
      const meta = { ...(data as Partial<ProgramMeta>) };

      if (!meta?.draft) {
        if (!meta.programSlug) meta.programSlug = p;
        if (!meta.countrySlug) meta.countrySlug = c;
        if (!meta.category) (meta as any).category = "residency";
        out.push(meta as ProgramMeta);
      }
    }
  }

  return out.sort((a, b) =>
    (a.countrySlug + a.title).localeCompare(b.countrySlug + b.title)
  );
}

/* =========================
 * Renderers
 * =======================*/
export async function loadCountryPage(countrySlug: string) {
  const f = path.join(ROOT, countrySlug, "_country.mdx");
  const source = fs.readFileSync(f, "utf8");
  const { content, frontmatter } = await compileMDX<CountryMeta>({
    source,
    options: {
      parseFrontmatter: true,
      // Cast avoids TS complaining about plugin tuple shapes
      mdxOptions: baseMdxOptions as any,
    },
  });
  return { content, meta: frontmatter };
}

export async function loadProgramPage(countrySlug: string, programSlug: string) {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  const source = fs.readFileSync(f, "utf8");
  const { content, frontmatter } = await compileMDX<ProgramMeta>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: baseMdxOptions as any,
    },
  });

  if (!frontmatter.programSlug) (frontmatter as any).programSlug = programSlug;
  if (!frontmatter.countrySlug) (frontmatter as any).countrySlug = countrySlug;
  if (!frontmatter.category) (frontmatter as any).category = "residency";

  return { content, meta: frontmatter };
}

/* ========= NEW: section-by-section renderer (non-breaking) ========= */
export async function loadProgramPageSections(
  countrySlug: string,
  programSlug: string
): Promise<{ meta: ProgramMeta; sections: ProgramSections }> {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  const raw = fs.readFileSync(f, "utf8");
  const { data, content: body } = matter(raw);

  const meta = { ...(data as Partial<ProgramMeta>) } as ProgramMeta;
  if (!meta.programSlug) meta.programSlug = programSlug;
  if (!meta.countrySlug) meta.countrySlug = countrySlug;
  if (!meta.category) (meta as any).category = "residency";

  const chunks = splitByH3(body);

  const entries = await Promise.all(
    Object.entries(chunks).map(async ([key, md]) => {
      const { content } = await compileMDX({
        source: md,
        options: {
          parseFrontmatter: false,
          mdxOptions: baseMdxOptions as any,
        },
      });
      return [key, content] as const;
    })
  );

  const sections = Object.fromEntries(entries) as ProgramSections;
  return { meta, sections };
}

/* =========================
 * Frontmatter-only helpers
 * =======================*/
export function getProgramFrontmatter(countrySlug: string, programSlug: string) {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  const { data } = matter(fs.readFileSync(f, "utf8"));
  return data as ProgramMeta;
}

export function getCountryFrontmatter(countrySlug: string) {
  const f = path.join(ROOT, countrySlug, "_country.mdx");
  const { data } = matter(fs.readFileSync(f, "utf8"));
  return data as CountryMeta;
}

/* =========================
 * Sitemap helper
 * =======================*/
export function getResidencyUrls() {
  const urls: { url: string }[] = [{ url: "/residency" }];
  for (const c of getResidencyCountrySlugs()) {
    urls.push({ url: `/residency/${c}` });
    for (const p of getResidencyProgramSlugs(c)) {
      urls.push({ url: `/residency/${c}/${p}` });
    }
  }
  return urls;
}
