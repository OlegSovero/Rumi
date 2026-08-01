import { PICTOGRAM_CATALOG, catalogoParaPrompt } from '../data/pictogramCatalog';
import type { EstadoInterpretacion, InterpretacionComunicacion } from './tipos';
import { quitarAcentos } from './vocabulario';

type Simbolo = { etiqueta: string };

const ESTADOS: EstadoInterpretacion[] = ['complete', 'ambiguous', 'incomplete'];

function capitalizar(texto: string): string {
  const limpio = texto.trim();
  return limpio ? limpio.charAt(0).toUpperCase() + limpio.slice(1) : limpio;
}

function opcionesDelCatalogo(): Map<string, string> {
  const opciones = new Map<string, string>();
  for (const entry of PICTOGRAM_CATALOG) {
    opciones.set(quitarAcentos(entry.etiqueta), entry.etiqueta);
    for (const synonym of entry.sinonimos) opciones.set(quitarAcentos(synonym), entry.etiqueta);
  }
  return opciones;
}

const OPCIONES_CATALOGO = opcionesDelCatalogo();
const CATALOGO_COMUNICACION = catalogoParaPrompt();

export function buscarPictograma(etiqueta: string) {
  const canonica = OPCIONES_CATALOGO.get(quitarAcentos(etiqueta.trim()));
  return PICTOGRAM_CATALOG.find((entry) => entry.etiqueta === canonica) ?? null;
}

function sugerenciasValidas(suggestions: unknown): string[] {
  if (!Array.isArray(suggestions)) return [];
  return suggestions
    .filter((suggestion): suggestion is string => typeof suggestion === 'string')
    .map((suggestion) => OPCIONES_CATALOGO.get(quitarAcentos(suggestion.trim())))
    .filter((suggestion): suggestion is string => Boolean(suggestion))
    .filter((suggestion, index, all) => all.indexOf(suggestion) === index)
    .slice(0, 6);
}

export function interpretarMock(secuencia: Simbolo[]): InterpretacionComunicacion {
  const etiquetas = secuencia.map(({ etiqueta }) => etiqueta.trim()).filter(Boolean);
  const literal = etiquetas.join(' ');
  const normalizadas = etiquetas.map(quitarAcentos);

  if (!etiquetas.length) {
    return { literal: '', status: 'incomplete', interpretation: null, confidence: 0, alternatives: [], suggestions: ['yo', 'quiero', 'ayuda'] };
  }

  if (normalizadas.join('|') === 'quiero|no' || normalizadas.join('|') === 'no|quiero') {
    return {
      literal,
      status: 'ambiguous',
      interpretation: null,
      confidence: 0.35,
      alternatives: ['No quiero.', 'Quiero que no...'],
      suggestions: ['comer', 'jugar', 'ir'],
    };
  }

  const tieneQuerer = normalizadas.includes('quiero') || normalizadas.includes('querer');
  const tieneObjeto = etiquetas.length >= 3 && !['quiero', 'querer', 'yo', 'no'].includes(normalizadas[normalizadas.length - 1]);
  if (tieneQuerer && !tieneObjeto) {
    return { literal, status: 'incomplete', interpretation: null, confidence: 0.5, alternatives: [], suggestions: ['comer', 'jugar', 'beber', 'ayuda', 'más'] };
  }

  let interpretation = etiquetas.join(' ').replace(/\byo quiero\b/i, 'quiero').replace(/\byo querer\b/i, 'quiero');
  interpretation = interpretation.replace(/\bno quiero\b/i, 'no quiero');
  return {
    literal,
    status: 'complete',
    interpretation: `${capitalizar(interpretation)}.`,
    confidence: etiquetas.length >= 3 ? 0.96 : 0.8,
    alternatives: [],
    suggestions: [],
  };
}

export function validarInterpretacion(
  raw: Partial<InterpretacionComunicacion> | null,
  secuencia: Simbolo[]
): InterpretacionComunicacion {
  const literal = secuencia.map(({ etiqueta }) => etiqueta.trim()).filter(Boolean).join(' ');
  const fallback = interpretarMock(secuencia);
  if (!raw || !ESTADOS.includes(raw.status as EstadoInterpretacion)) return fallback;

  const status = raw.status as EstadoInterpretacion;
  const interpretation = typeof raw.interpretation === 'string' && raw.interpretation.trim() ? raw.interpretation.trim() : null;
  const confidence = typeof raw.confidence === 'number' && Number.isFinite(raw.confidence)
    ? Math.max(0, Math.min(1, raw.confidence))
    : 0;

  if (status === 'complete' && !interpretation) return { ...fallback, literal };

  const alternatives = Array.isArray(raw.alternatives)
    ? raw.alternatives.filter((alternative): alternative is string => typeof alternative === 'string').slice(0, 3)
    : [];
  const suggestions = sugerenciasValidas(raw.suggestions);

  return {
    literal,
    status: interpretation && status === 'complete' ? 'complete' : status,
    interpretation: status === 'complete' ? interpretation : null,
    confidence,
    alternatives: alternatives.length || status !== 'ambiguous' ? alternatives : fallback.alternatives,
    suggestions: suggestions.length || status !== 'incomplete' ? suggestions : fallback.suggestions,
  };
}

export const PROMPT_COMUNICACION = `Eres un asistente de comunicación aumentativa en español. Interpretas una secuencia de pictogramas seleccionados por un niño.
Tu función NO es hablar por el niño ni adivinar su intención.
Reglas:
1. Conserva literalmente todos los conceptos seleccionados, especialmente no, más, yo y quiero.
2. Solo puedes añadir palabras gramaticales necesarias: artículos, preposiciones, conjugaciones y puntuación.
3. Nunca añadas personas, objetos, deseos, emociones o acciones que no estén seleccionados.
4. Si faltan datos o hay más de una interpretación razonable, no elijas una silenciosamente.
5. Usa status complete solo cuando la frase sea suficientemente clara. Usa ambiguous para varias interpretaciones y incomplete cuando falte información.
6. Las sugerencias deben ser conceptos breves que ayuden a continuar, no sustituyen una selección del niño.
7. Si status es incomplete o ambiguous, devuelve hasta 6 suggestions útiles para continuar. Cada suggestion DEBE ser exactamente la etiqueta de un pictograma del catálogo. No inventes conceptos ni devuelvas sinónimos.
8. Devuelve únicamente JSON con esta forma:
{"literal":"...","status":"complete|ambiguous|incomplete","interpretation":"...|null","confidence":0.0,"alternatives":[],"suggestions":[]}

Catálogo tipado disponible (id, etiqueta, sinónimos, acciones y contextos):
${CATALOGO_COMUNICACION}`;
