import Image from "next/image";

export default function ProgramHero({
  title,
  country,
  tagline,
  heroImage,
}: { title: string; country: string; tagline?: string; heroImage?: string }) {
  return (
    <header className="rounded-3xl bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 md:p-10 mb-6">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div>
          <div className="text-sm text-gray-600">{country}</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold">{title}</h1>
          {tagline && <p className="mt-3 text-gray-700">{tagline}</p>}
        </div>
        {heroImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={heroImage} alt={title} fill className="object-cover" />
          </div>
        )}
      </div>
    </header>
  );
}
