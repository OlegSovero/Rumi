import type { ServicioIA, TareaGenerada } from './tipos';
import { PICTOGRAMA_POR_DEFECTO, quitarAcentos, sugerirPictograma, VOCABULARIO } from './vocabulario';
import { chatMlx, parsearJsonMlx } from './mlxCliente';
import { servicioIAMock } from './servicioIAMock';

const IDS = VOCABULARIO.map(({ id }) => id).join(', ');
const FALLBACK = servicioIAMock;

async function conFallback<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.warn('[Rumi IA] MLX no disponible; usando mock.', error);
    return fallback();
  }
}

function validarTarea(task: TareaGenerada): TareaGenerada | null {
  const pasos = (task.pasos ?? []).slice(0, 5).map((step) => ({
    instruccion: step.instruccion?.trim() || '',
    pictogramaId: VOCABULARIO.some(({ id }) => id === step.pictogramaId)
      ? step.pictogramaId
      : sugerirPictograma(step.instruccion || ''),
  })).filter((step) => step.instruccion);
  return pasos.length ? { etiqueta: task.etiqueta?.trim() || 'Tarea', pasos } : null;
}

export const servicioIAMlx: ServicioIA = {
  pictogramasAFrase(secuencia) {
    return conFallback(async () => chatMlx([
      { role: 'system', content: 'Convierte pictogramas en una frase natural y breve en español. Conserva todas las palabras, especialmente no, más, yo y quiero. Responde solo con la frase.' },
      { role: 'user', content: secuencia.map(({ etiqueta }) => etiqueta).join(' | ') },
    ], { temperature: 0.1 }), () => FALLBACK.pictogramasAFrase(secuencia));
  },

  fraseAPictogramas(texto) {
    return conFallback(async () => {
      const raw = await chatMlx([
        { role: 'system', content: `Devuelve solo JSON con la forma {"ids":[numero,...]}. Usa únicamente estos IDs ARASAAC: ${IDS}. Máximo 6.` },
        { role: 'user', content: texto },
      ], { json: true });
      const parsed = parsearJsonMlx<{ ids?: number[] }>(raw);
      const ids = (parsed?.ids ?? []).filter((id) => VOCABULARIO.some(({ id: validId }) => validId === id));
      return ids.length ? ids : FALLBACK.fraseAPictogramas(texto);
    }, () => FALLBACK.fraseAPictogramas(texto));
  },

  descomponerTarea(texto) {
    return conFallback(async () => {
      const raw = await chatMlx([
        { role: 'system', content: `Divide la tarea en 2 a 5 pasos breves. Devuelve solo JSON con {"etiqueta":"...","pasos":[{"instruccion":"...","pictogramaId":numero}]}. Usa IDs de esta lista: ${IDS}. Si no encaja, usa ${PICTOGRAMA_POR_DEFECTO}.` },
        { role: 'user', content: texto },
      ], { json: true });
      const parsed = parsearJsonMlx<TareaGenerada>(raw);
      return (parsed && validarTarea(parsed)) || FALLBACK.descomponerTarea(texto);
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
