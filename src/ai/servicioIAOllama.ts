import type { ServicioIA, TareaGenerada } from './tipos';
import { PICTOGRAMA_POR_DEFECTO, quitarAcentos, sugerirPictograma, VOCABULARIO } from './vocabulario';
import { chatOllama, parsearJsonSeguro } from './ollamaCliente';
import { servicioIAMock } from './servicioIAMock';

const IDS_VOCABULARIO = VOCABULARIO.map(({ id }) => id).join(', ');

const SYSTEM_PROMPTS = {
  frase: 'Convierte pictogramas en una frase natural y breve en español. Conserva todas las palabras, especialmente no, más, yo y quiero. Responde solo con la frase.',
  pictogramas: `Convierte el texto en JSON {"ids":[numero,...]}. Usa solo estos IDs ARASAAC: ${IDS_VOCABULARIO}. Máximo 6 IDs.`,
  tarea: `Divide una tarea infantil en 2 a 5 pasos breves. Responde solo JSON con {"etiqueta":"...","pasos":[{"instruccion":"...","pictogramaId":numero}]}. Usa IDs ARASAAC de esta lista cuando encajen: ${IDS_VOCABULARIO}. Si no encaja, usa ${PICTOGRAMA_POR_DEFECTO}.`,
  ayuda: 'Reformula el paso para un niño en una o dos frases cortas, positivas y sencillas. Responde solo con el texto.',
};

function fallbackFrase(secuencia: { etiqueta: string }[]): string {
  const text = secuencia.map(({ etiqueta }) => etiqueta.trim()).filter(Boolean).join(' ');
  if (!text) return '';
  const sentence = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

async function conFallback<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.warn('[Rumi IA] Ollama no disponible; usando mock.', error);
    return fallback();
  }
}

function validarTarea(task: TareaGenerada): TareaGenerada | null {
  const steps = (task.pasos ?? []).slice(0, 5).map((step) => ({
    instruccion: step.instruccion?.trim() || '',
    pictogramaId: VOCABULARIO.some(({ id }) => id === step.pictogramaId)
      ? step.pictogramaId
      : sugerirPictograma(step.instruccion || ''),
  })).filter((step) => step.instruccion);
  return steps.length ? { etiqueta: task.etiqueta?.trim() || 'Tarea', pasos: steps } : null;
}

export const servicioIAOllama: ServicioIA = {
  pictogramasAFrase(secuencia) {
    return conFallback(async () => {
      const result = await chatOllama({
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.frase },
          { role: 'user', content: secuencia.map(({ etiqueta }) => etiqueta).join(' | ') },
        ],
        temperature: 0.1,
      });
      return result || fallbackFrase(secuencia);
    }, () => servicioIAMock.pictogramasAFrase(secuencia));
  },

  fraseAPictogramas(texto) {
    return conFallback(async () => {
      const raw = await chatOllama({
        json: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPTS.pictogramas }, { role: 'user', content: texto }],
      });
      const parsed = parsearJsonSeguro<{ ids?: number[] }>(raw);
      const ids = (parsed?.ids ?? []).filter((id) => VOCABULARIO.some(({ id: validId }) => validId === id));
      return ids.length ? ids : servicioIAMock.fraseAPictogramas(texto);
    }, () => servicioIAMock.fraseAPictogramas(texto));
  },

  descomponerTarea(texto) {
    return conFallback(async () => {
      const raw = await chatOllama({
        json: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPTS.tarea }, { role: 'user', content: texto }],
      });
      const parsed = parsearJsonSeguro<TareaGenerada>(raw);
      return (parsed && validarTarea(parsed)) || servicioIAMock.descomponerTarea(texto);
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
