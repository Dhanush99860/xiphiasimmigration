import type { Metadata } from "next";
import {
  getResidencyCountries,
  getResidencyPrograms,
  ProgramMeta,
  CountryMeta,
} from "@/lib/residency-content";
// ❌ remove this: import TopPrograms from "@/components/Residency/TopPrograms";
import ResidencyHero from "@/components/Residency/ResidencyHero";
import ResidencyLanding from "@/components/Residency/ResidencyLanding";
import Platform from "@/components/Home/platform";
import ArticlesPreview from "@/components/Common/ArticlesSection/ArticlesPreview";
import { getAllArticlesMeta } from "@/lib/getArticles";

import Footer from "@/components/Layout/Footer";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Residency Programs – Countries & Options",
  description:
    "Explore residency pathways by country. Compare timelines, requirements and costs. Book a personal consultation.",
  alternates: { canonical: "/residency" },
  openGraph: { images: ["/og.jpg"] },
  twitter: { images: ["/og.jpg"], card: "summary_large_image" },
};

function pickTopPrograms(all: ProgramMeta[], n = 10): ProgramMeta[] {
  const ranked = [...all].sort((a, b) => {
    const tA = a.timelineMonths ?? 999;
    const tB = b.timelineMonths ?? 999;
    if (tA !== tB) return tA - tB;
    const iA = a.minInvestment ?? Number.MAX_SAFE_INTEGER;
    const iB = b.minInvestment ?? Number.MAX_SAFE_INTEGER;
    if (iA !== iB) return iA - iB;
    return (a.title + a.country).localeCompare(b.title + b.country);
  });
  return ranked.slice(0, n);
}

export default function ResidencyPage() {
  const countries: CountryMeta[] = getResidencyCountries();
  const programs = getResidencyPrograms();
  const top10 = pickTopPrograms(programs, 10);

  const articles = getAllArticlesMeta(); // same as Home

  return (
    <>
      <main className="max-w-screen-2xl mx-auto px-4 py-10">
        <ResidencyHero />
        <ResidencyLanding countries={countries} topPrograms={top10} />
      </main>
      <Platform />
      <ArticlesPreview articles={articles} limit={6} />    
      <Footer />
    </>
  );
}


