// src/components/Residency/ResidencyPreview.tsx
import { getResidencyCountries } from "@/lib/residency-content";
import CountryCarousel from "./CountryCarousel";

export default function ResidencyCountrySection() {
  const items = getResidencyCountries(); // all countries, no limit

  return (
    <CountryCarousel
      items={items}
      title="Residency by Country"
      description="Discover trusted residency pathways across popular countries."
      ctaText="View all countries"
      ctaHref="/residency"
    />
  );
}
