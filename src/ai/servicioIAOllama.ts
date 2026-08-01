import type { InterpretacionComunicacion, PlanTarea, ServicioIA } from './tipos';
import { quitarAcentos } from './vocabulario';
import { PROMPT_COMUNICACION, validarInterpretacion } from './comunicacion';
import { chatOllama, parsearJsonSeguro } from './ollamaCliente';
import { servicioIAMock } from './servicioIAMock';
import { catalogoParaPrompt, PICTOGRAM_IDS } from '../data/pictogramCatalog';
import { resolverPlan } from './planTarea';

const CATALOGO = catalogoParaPrompt();

const SYSTEM_PROMPTS = {
  frase: PROMPT_COMUNICACION,
  pictogramas: `Convierte el texto en JSON {"ids":[numero,...]}. Usa solo los IDs del catálogo siguiente. Máximo 6 IDs.\n${CATALOGO}`,
  tarea: `Convierte la intención de un cuidador en una rutina visual para un niño. No reformules la petición ni escribas lo que el adulto quiere. Genera entre 2 y 6 acciones distintas, observables y ordenadas. Responde solo JSON con {"taskName":"...","steps":[{"action":"...","text":"...","queries":["..."]}]}. Cada text debe ser corto, literal y desde la perspectiva del niño cuando sea apropiado. Cada query describe la acción u objeto que se debe buscar en un catálogo de pictogramas. No generes IDs. Catálogo disponible:\n${CATALOGO}`,
  ayuda: 'Reformula el paso para un niño en una o dos frases cortas, positivas y sencillas. Responde solo con el texto.',
};

async function conFallback<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.warn('[Rumi IA] Ollama no disponible; usando mock.', error);
    return fallback();
  }
}

export const servicioIAOllama: ServicioIA = {
  pictogramasAFrase(secuencia) {
    return conFallback(async () => {
      const raw = await chatOllama({
        json: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.frase },
          { role: 'user', content: JSON.stringify({ selected_symbols: secuencia.map(({ id, etiqueta }) => ({ id, concept: etiqueta })) }) },
        ],
        temperature: 0.1,
      });
      return validarInterpretacion(parsearJsonSeguro<Partial<InterpretacionComunicacion>>(raw), secuencia);
    }, () => servicioIAMock.pictogramasAFrase(secuencia));
  },

  fraseAPictogramas(texto) {
    return conFallback(async () => {
      const raw = await chatOllama({
        json: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPTS.pictogramas }, { role: 'user', content: texto }],
      });
      const parsed = parsearJsonSeguro<{ ids?: number[] }>(raw);
      const ids = (parsed?.ids ?? []).filter((id) => PICTOGRAM_IDS.has(id));
      return ids.length ? ids : servicioIAMock.fraseAPictogramas(texto);
    }, () => servicioIAMock.fraseAPictogramas(texto));
  },

  descomponerTarea(texto) {
    return conFallback(async () => {
      const raw = await chatOllama({
        json: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPTS.tarea }, { role: 'user', content: texto }],
      });
      const parsed = parsearJsonSeguro<PlanTarea>(raw);
      return parsed?.steps?.length ? resolverPlan(parsed) : servicioIAMock.descomponerTarea(texto);
    }, () => servicioIAMock.descomponerTarea(texto));
  },

  reformularPaso(instruccion) {
    return conFallback(async () => {
      const result = await chatOllama({
        messages: [{ role: 'system', content: SYSTEM_PROMPTS.ayuda }, { role: 'user', content: instruccion }],
        temperature: 0.4,
      });
      return result || `Vamos a ${quitarAcentos(instruccion.trim().toLowerCase())}. Tu puedes.`;
    }, () => servicioIAMock.reformularPaso(instruccion));
  },
};
