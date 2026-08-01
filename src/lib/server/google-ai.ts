import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import type { InterpretacionComunicacion, PasoGenerado, PlanTarea } from '../../ai/tipos';
import { catalogoParaPrompt } from '@/data/pictogramCatalog';

const ConceptSchema = z.object({
  originalWord: z.string(),
  lemma: z.string(),
});

const ConceptsResponseSchema = z.object({
  concepts: z.array(ConceptSchema),
});

const InterpretacionComunicacionSchema = z.object({
  literal: z.string(),
  status: z.enum(['complete', 'ambiguous', 'incomplete']),
  interpretation: z.string().nullable(),
  confidence: z.number(),
  alternatives: z.array(z.string()),
  suggestions: z.array(z.string()),
});

const PlanTareaSchema = z.object({
  taskName: z.string(),
  steps: z.array(z.object({
    action: z.string(),
    text: z.string(),
    queries: z.array(z.string()),
  })),
});

const modelName = process.env.GOOGLE_AI_MODEL || 'gemma-4-26b-a4b-it';

function getClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_API_KEY is not configured');
  return new GoogleGenAI({ apiKey });
}

async function generateText(prompt: string): Promise<string> {
  const response = await getClient().models.generateContent({
    model: modelName,
    contents: prompt,
    config: { temperature: 0.2, maxOutputTokens: 2048 },
  });
  const text = response.text;
  if (!text) throw new Error('Google AI returned an empty response');
  return text.trim();
}

async function generateJson<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
  const response = await getClient().models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });
  const text = response.text;
  if (!text) throw new Error('Google AI returned an empty response');
  return schema.parse(JSON.parse(text));
}

export async function pictogramasAFrase(secuencia: { id: number; etiqueta: string }[]): Promise<InterpretacionComunicacion> {
  return generateJson(`
Eres un asistente de comunicación aumentativa en español. Interpretas una secuencia de pictogramas seleccionados por un niño.
Tu función NO es hablar por el niño ni adivinar su intención.
Conserva todos los conceptos, especialmente no, más, yo y quiero. Solo añade palabras gramaticales necesarias.
Nunca añadas personas, objetos, deseos, emociones o acciones que no estén seleccionados.
Si faltan datos o hay varias interpretaciones, usa status ambiguous o incomplete y no elijas silenciosamente.
Devuelve únicamente JSON con esta forma:
{"literal":"...","status":"complete|ambiguous|incomplete","interpretation":"...|null","confidence":0.0,"alternatives":[],"suggestions":[]}

Pictogramas seleccionados: ${JSON.stringify(secuencia.map(({ id, etiqueta }) => ({ id, concept: etiqueta })))}
`, InterpretacionComunicacionSchema);
}

export async function extraerConceptos(texto: string) {
  return generateJson(`
Eres un lingüista experto en español para un comunicador con pictogramas.
Extrae conceptos visuales y conviértelos en lemas: verbos en infinitivo y sustantivos en singular.
Ignora artículos, preposiciones y palabras funcionales.
Devuelve únicamente JSON con esta forma:
{"concepts":[{"originalWord":"...","lemma":"..."}]}

Texto: ${JSON.stringify(texto)}
`, ConceptsResponseSchema);
}

export async function descomponerTarea(texto: string): Promise<PlanTarea> {
  return generateJson(`
Divide esta tarea infantil en pasos claros y breves en español.
Devuelve únicamente JSON con esta forma:
{"taskName":"...","steps":[{"action":"...","text":"...","queries":["..."]}]}
No generes pictogramaId. Cada paso debe ser una acción diferente, observable y ordenada. No reformules la petición del cuidador.

Catálogo:
${catalogoParaPrompt()}

Tarea: ${JSON.stringify(texto)}
`, PlanTareaSchema);
}

export async function reformularPaso(instruccion: string): Promise<string> {
  return generateText(`Reformula este paso para un niño, en una frase breve, cálida y sencilla: ${JSON.stringify(instruccion)}`);
}

export type { PasoGenerado };
