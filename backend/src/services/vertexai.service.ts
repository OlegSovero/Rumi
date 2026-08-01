import { VertexAI } from '@google-cloud/vertexai';
import { config } from '../config';
import { LLMResponseSchema, type LLMResponse } from '../types/schemas';

export class VertexAIService {
  private vertexAI: VertexAI;
  private model: string;

  constructor() {
    this.vertexAI = new VertexAI({
      project: config.vertexAI.projectId,
      location: config.vertexAI.location,
    });
    this.model = config.vertexAI.model;
  }

  async extractLemmas(text: string): Promise<LLMResponse> {
    const generativeModel = this.vertexAI.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `Eres un experto lingüista español. Tu tarea es extraer los conceptos clave del siguiente texto y convertirlos en lemas (verbos en infinitivo, sustantivos en singular).

Texto: "${text}"

Devuelve un JSON con el siguiente formato exacto:
{
  "concepts": [
    { "originalWord": "palabra tal como aparece", "lemma": "lema normalizado" }
  ]
}

Reglas importantes:
- Los verbos deben estar en infinitivo (ejemplo: "quiero" → "querer")
- Los sustantivos en singular (ejemplo: "manzanas" → "manzana")
- Los artículos (el, la, los, las) deben ser ignorados
- Las preposiciones (de, a, en, con) deben ser ignoradas
- Extrae solo palabras con significado visual (sustantivos, verbos, adjetivos relevantes)
- No incluyas palabras funcionales sin significado visual

Responde ÚNICAMENTE con el JSON, sin texto adicional.`;

    try {
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;
      const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error('No response from Vertex AI');
      }

      const parsedResponse = JSON.parse(textResponse);
      const validatedResponse = LLMResponseSchema.parse(parsedResponse);

      return validatedResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Vertex AI error: ${error.message}`);
      }
      throw new Error('Unknown error calling Vertex AI');
    }
  }
}
