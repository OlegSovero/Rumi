import type { InterpretacionComunicacion, PlanTarea, ServicioIA } from './tipos';
import { quitarAcentos } from './vocabulario';
import { PROMPT_COMUNICACION, validarInterpretacion } from './comunicacion';
import { chatMlx, parsearJsonMlx } from './mlxCliente';
import { servicioIAMock } from './servicioIAMock';
import { catalogoParaPrompt, PICTOGRAM_IDS } from '../data/pictogramCatalog';
import { resolverPlan } from './planTarea';

const CATALOGO = catalogoParaPrompt();
const FALLBACK = servicioIAMock;

async function conFallback<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.warn('[Rumi IA] MLX no disponible; usando mock.', error);
    return fallback();
  }
}

export const servicioIAMlx: ServicioIA = {
  pictogramasAFrase(secuencia) {
    return conFallback(async () => {
      const raw = await chatMlx([
        { role: 'system', content: PROMPT_COMUNICACION },
        { role: 'user', content: JSON.stringify({ selected_symbols: secuencia.map(({ id, etiqueta }) => ({ id, concept: etiqueta })) }) },
      ], { json: true, temperature: 0.1 });
      return validarInterpretacion(parsearJsonMlx<Partial<InterpretacionComunicacion>>(raw), secuencia);
    }, () => FALLBACK.pictogramasAFrase(secuencia));
  },

  fraseAPictogramas(texto) {
    return conFallback(async () => {
      const raw = await chatMlx([
        { role: 'system', content: `Devuelve solo JSON con la forma {"ids":[numero,...]}. Usa únicamente los IDs del catálogo siguiente. Máximo 6.\n${CATALOGO}` },
        { role: 'user', content: texto },
      ], { json: true });
      const parsed = parsearJsonMlx<{ ids?: number[] }>(raw);
      const ids = (parsed?.ids ?? []).filter((id) => PICTOGRAM_IDS.has(id));
      return ids.length ? ids : FALLBACK.fraseAPictogramas(texto);
    }, () => FALLBACK.fraseAPictogramas(texto));
  },

  descomponerTarea(texto) {
    return conFallback(async () => {
      const raw = await chatMlx([
        { role: 'system', content: `Convierte la intención de un cuidador en una rutina visual para un niño. No reformules la petición ni escribas lo que el adulto quiere. Genera entre 2 y 6 acciones distintas, observables y ordenadas. Devuelve solo JSON con {"taskName":"...","steps":[{"action":"...","text":"...","queries":["..."]}]}. Cada text debe ser corto, literal y desde la perspectiva del niño cuando sea apropiado. Cada query debe describir la acción o el objeto que se debe buscar en un catálogo de pictogramas. No generes IDs. Catálogo disponible:\n${CATALOGO}` },
        { role: 'user', content: texto },
      ], { json: true });
      const parsed = parsearJsonMlx<PlanTarea>(raw);
      return parsed?.steps?.length ? resolverPlan(parsed) : FALLBACK.descomponerTarea(texto);
    }, () => FALLBACK.descomponerTarea(texto));
  },

  reformularPaso(instruccion) {
    return conFallback(async () => {
      const result = await chatMlx([
        { role: 'system', content: 'Reformula el paso para un niño en una o dos frases cortas, positivas y sencillas. Responde solo con el texto.' },
        { role: 'user', content: instruccion },
      ], { temperature: 0.4 });
      return result || `Vamos a ${quitarAcentos(instruccion.trim().toLowerCase())}. Tu puedes.`;
    }, () => FALLBACK.reformularPaso(instruccion));
  },
};
