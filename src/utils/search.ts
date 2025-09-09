import { searchIndex } from "@/app/api/searchIndex";

export function searchItems(query: string) {
  if (!query) return [];

  const lowerQuery = query.toLowerCase();

  return searchIndex.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery)
  );
}
