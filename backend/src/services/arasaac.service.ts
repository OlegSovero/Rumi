import { config } from '../config';
import type { ArasaacPictogram } from '../types/interfaces';

export class ArasaacService {
  private baseUrl: string;
  private staticUrl: string;

  constructor() {
    this.baseUrl = config.arasaac.baseUrl;
    this.staticUrl = config.arasaac.staticUrl;
  }

  async searchPictogram(lemma: string): Promise<string | null> {
    const url = `${this.baseUrl}/pictograms/es/search/${encodeURIComponent(lemma)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`❌ Pictogram not found for lemma: "${lemma}"`);
          return null;
        }
        throw new Error(`ARASAAC API error: ${response.status}`);
      }

      const data = (await response.json()) as ArasaacPictogram[];

      if (!data || data.length === 0) {
        console.warn(`❌ No pictograms returned for lemma: "${lemma}"`);
        return null;
      }

      const pictogramId = data[0]._id;
      return `${this.staticUrl}/${pictogramId}/${pictogramId}_300.png`;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching pictogram for "${lemma}":`, error.message);
      }
      return null;
    }
  }

  async searchMultiplePictograms(lemmas: string[]): Promise<(string | null)[]> {
    const promises = lemmas.map((lemma) => this.searchPictogram(lemma));
    return Promise.all(promises);
  }
}
