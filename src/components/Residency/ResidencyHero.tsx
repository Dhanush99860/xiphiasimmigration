import Breadcrumb from "@/components/Common/Breadcrumb";

export default function ResidencyHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl p-6 mb-8 bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-primary/5 dark:via-darkmode dark:to-secondary/5">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/10 dark:bg-primary/20 blur-2xl" />

      {/* breadcrumb */}
      <Breadcrumb />

      {/* main heading */}
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-midnight_text dark:text-dark_text pt-4">
        Discover Your Ideal Residency by Investment
      </h1>

      {/* intro text */}
      <p className="mt-2 text-sm md:text-base text-neutral-600 line-clamp-3 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-5">
        Compare global programmes, see requirements and timelines, and move forward with guidance
        from our experts.
      </p>

      {/* overview heading */}
      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors mt-4">
        What is residency by investment?
      </h2>

      {/* overview description */}
      <p className="mt-2 text-sm md:text-base text-neutral-600 dark:text-gray-300">
        Residency by investment lets high-net-worth individuals obtain long-term residency by
        investing in real estate, businesses or government instruments. Benefits include living
        with family, access to education & healthcare, and improved global mobility.
      </p>
    </section>
  );
}
