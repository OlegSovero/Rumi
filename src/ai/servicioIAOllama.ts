import type { ServicioIA, TareaGenerada } from './tipos';
import { chatOllama, parsearJsonSeguro } from './ollamaCliente';
import { PICTOGRAMA_POR_DEFECTO, sugerirPictograma, VOCABULARIO } from './vocabulario';
import { servicioIAMock } from './servicioIAMock';

// Implementación real: Gemma vía Ollama local (offline).
// Misma interfaz ServicioIA que el mock — las pantallas no cambian.

const IDS_VOCABULARIO = VOCABULARIO.map((v) => v.id).join(', ');

const SISTEMA_DESCOMPONER = `Eres Rumi, asistente de CAA (comunicación aumentativa) para niños autistas no verbales.
Descompones tareas cotidianas en pasos cortos, concretos y en español sencillo (infinitivo o imperativo suave).
Responde SOLO JSON válido con esta forma:
{"etiqueta":"nombre corto de la tarea","pasos":[{"instruccion":"paso corto","pictogramaId":numero}]}
Reglas:
- Entre 2 y 5 pasos.
- Cada instruccion: máximo 6 palabras, sin metáforas.
- pictogramaId debe ser uno de estos IDs ARASAAC si encaja: ${IDS_VOCABULARIO}. Si no, usa ${PICTOGRAMA_POR_DEFECTO}.
- No añadas texto fuera del JSON.`;

const SISTEMA_FRASE = `Eres Rumi. Conviertes una secuencia de pictogramas (etiqueta) en una frase natural en español para un niño.
Responde SOLO con la frase, sin comillas ni explicación.`;

const SISTEMA_PICTOS = `Eres Rumi. Dado un texto del niño o familia, eliges pictogramas ARASAAC.
Responde SOLO JSON: {"ids":[numero,...]} usando solo estos IDs: ${IDS_VOCABULARIO}.
Máximo 6 ids, en orden de la frase.`;

const SISTEMA_REFORMULAR = `Eres Gemma, la ayudante amable de Rumi. Reformulas un paso de rutina para un niño autista que no entiende.
Usa español muy simple, positivo, en 1 o 2 oraciones cortas. Empieza con ánimo (ej. "Vamos a...").
Responde SOLO con el texto de ayuda, sin JSON ni comillas.`;

function enriquecerPictogramas(tarea: TareaGenerada): TareaGenerada {
  return {
    etiqueta: tarea.etiqueta?.trim() || 'Tarea',
    pasos: (tarea.pasos ?? []).slice(0, 5).map((p) => {
      const instruccion = (p.instruccion || '').trim();
      const id =
        typeof p.pictogramaId === 'number' && VOCABULARIO.some((v) => v.id === p.pictogramaId)
          ? p.pictogramaId
          : sugerirPictograma(instruccion);
      return { instruccion, pictogramaId: id };
    }),
  };
}

async function conFallback<T>(accion: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await accion();
  } catch (err) {
    console.warn('[Rumi IA] Ollama falló, usando mock:', err);
    return fallback();
  }
}

export const servicioIAOllama: ServicioIA = {
  async pictogramasAFrase(secuencia) {
    return conFallback(async () => {
      const lista = secuencia.map((it) => it.etiqueta).join(', ');
      const texto = await chatOllama({
        messages: [
          { role: 'system', content: SISTEMA_FRASE },
          { role: 'user', content: `Pictogramas: ${lista}` },
        ],
        temperature: 0.3,
      });
      return texto || secuencia.map((it) => it.etiqueta).join(' ');
    }, () => servicioIAMock.pictogramasAFrase(secuencia));
  },

  async fraseAPictogramas(texto) {
    return conFallback(async () => {
      const bruto = await chatOllama({
        json: true,
        messages: [
          { role: 'system', content: SISTEMA_PICTOS },
          { role: 'user', content: texto },
        ],
      });
      const parsed = parsearJsonSeguro<{ ids?: number[] }>(bruto);
      const ids = (parsed?.ids ?? []).filter((id) => VOCABULARIO.some((v) => v.id === id));
      if (ids.length === 0) return servicioIAMock.fraseAPictogramas(texto);
      return ids;
    }, () => servicioIAMock.fraseAPictogramas(texto));
  },

  async descomponerTarea(texto) {
    return conFallback(async () => {
      const bruto = await chatOllama({
        json: true,
        messages: [
          { role: 'system', content: SISTEMA_DESCOMPONER },
          { role: 'user', content: `Tarea: ${texto}` },
        ],
      });
      const parsed = parsearJsonSeguro<TareaGenerada>(bruto);
      if (!parsed?.pasos?.length) return servicioIAMock.descomponerTarea(texto);
      const enriquecida = enriquecerPictogramas(parsed);
      if (enriquecida.pasos.length === 0) return servicioIAMock.descomponerTarea(texto);
      return enriquecida;
    }, () => servicioIAMock.descomponerTarea(texto));
  },

  async reformularPaso(instruccion) {
    return conFallback(async () => {
      const texto = await chatOllama({
        messages: [
          { role: 'system', content: SISTEMA_REFORMULAR },
          { role: 'user', content: `Paso: ${instruccion}` },
        ],
        temperature: 0.4,
      });
      return texto || `Vamos a ${instruccion.trim().toLowerCase()}. Tú puedes.`;
    }, () => servicioIAMock.reformularPaso(instruccion));
  },
};
