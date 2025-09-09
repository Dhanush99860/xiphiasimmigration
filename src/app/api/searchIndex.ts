import { citizenshipPrograms } from "@/app/api/data";
import { residencyPrograms } from "@/app/api/data";

export type SearchItem = {
  type: "service" | "citizenship" | "residency";
  title: string;
  description?: string;
  url: string;
  image?: string;
};

export const searchIndex: SearchItem[] = [
  // Citizenship Programs
  ...citizenshipPrograms.map((item) => ({
    type: "citizenship" as const, // 👈 this fixes the error
    title: item.country,
    description: item.description,
    url: `/citizenship/${item.country.toLowerCase().replace(/\s+/g, "-")}`,
    image: item.flag,
  })),

  // Residency Programs
  ...residencyPrograms.map((item) => ({
    type: "residency" as const, // 👈 this fixes the error
    title: item.country,
    description: item.description,
    url: `/residency/${item.country.toLowerCase().replace(/\s+/g, "-")}`,
    image: item.flag,
  })),
];
