import { VertexAI } from '@google-cloud/vertexai';
import { z } from 'zod';
import type { PasoGenerado, TareaGenerada } from '../../ai/tipos';

const ConceptSchema = z.object({
  originalWord: z.string(),
  lemma: z.string(),
});

const ConceptsResponseSchema = z.object({
  concepts: z.array(ConceptSchema),
});

const TareaGeneradaSchema = z.object({
  etiqueta: z.string(),
  pasos: z.array(z.object({
    instruccion: z.string(),
    pictogramaId: z.number().int(),
  })),
});

const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const modelName = process.env.VERTEX_AI_MODEL || 'gemini-2.5-flash';

function getModel(responseMimeType?: 'application/json'): ReturnType<VertexAI['getGenerativeModel']> {
  if (!projectId) {
    throw new Error('GOOGLE_CLOUD_PROJECT is not configured');
  }

  const vertexAI = new VertexAI({ project: projectId, location });
  return vertexAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      ...(responseMimeType ? { responseMimeType } : {}),
    },
  });
}

async function generateText(prompt: string): Promise<string> {
  const result = await getModel().generateContent(prompt);
  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Vertex AI returned an empty response');
  return text.trim();
}

async function generateJson<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
  const result = await getModel('application/json').generateContent(prompt);
  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Vertex AI returned an empty response');

  return schema.parse(JSON.parse(text));
}

export async function pictogramasAFrase(secuencia: { etiqueta: string }[]): Promise<string> {
  return generateText(`
Eres un asistente de comunicación aumentativa en español.
Convierte esta secuencia de pictogramas en una frase natural y breve.
Responde únicamente con la frase, sin explicaciones.

Pictogramas: ${secuencia.map(({ etiqueta }) => etiqueta).join(', ')}
`);
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

export async function descomponerTarea(texto: string): Promise<TareaGenerada> {
  return generateJson(`
Divide esta tarea infantil en pasos claros y breves en español.
Devuelve únicamente JSON con esta forma:
{"etiqueta":"...","pasos":[{"instruccion":"...","pictogramaId":0}]}
Usa pictogramaId 0 si no conoces un ID adecuado.

Tarea: ${JSON.stringify(texto)}
`, TareaGeneradaSchema);
}

export async function reformularPaso(instruccion: string): Promise<string> {
  return generateText(`Reformula este paso para un niño, en una frase breve, cálida y sencilla: ${JSON.stringify(instruccion)}`);
}

export type { PasoGenerado };
