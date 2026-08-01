type ArasaacPictogram = { _id: number };

const BASE_URL = 'https://api.arasaac.org/v1';

export async function searchPictogram(lemma: string): Promise<number | null> {
  const response = await fetch(`${BASE_URL}/pictograms/es/search/${encodeURIComponent(lemma)}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;
  const pictograms = (await response.json()) as ArasaacPictogram[];
  return pictograms[0]?._id ?? null;
}
