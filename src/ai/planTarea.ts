import { PICTOGRAM_CATALOG } from '../data/pictogramCatalog';
import { PICTOGRAMA_POR_DEFECTO, quitarAcentos, sugerirPictograma } from './vocabulario';
import type { PlanTarea, TareaGenerada } from './tipos';

function tokens(text: string): string[] {
  return quitarAcentos(text).split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function findPictogram(step: PlanTarea['steps'][number]): number {
  const queries = [step.action, ...step.queries].map(quitarAcentos);
  let bestId = PICTOGRAMA_POR_DEFECTO;
  let bestScore = 0;

  for (const entry of PICTOGRAM_CATALOG) {
    const fields = [entry.etiqueta, ...entry.sinonimos, ...entry.accionesRelacionadas, ...entry.contextos].map(quitarAcentos);
    const score = queries.reduce((total, query) => {
      if (!query) return total;
      if (fields.includes(query)) return total + 10;
      const queryTokens = tokens(query);
      return total + queryTokens.reduce((subtotal, token) => subtotal + (fields.some((field) => field.includes(token)) ? 2 : 0), 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestId = entry.id;
    }
  }

  return bestScore > 0 ? bestId : sugerirPictograma(step.text);
}

export function resolverPlan(plan: PlanTarea): TareaGenerada {
  const steps = (Array.isArray(plan.steps) ? plan.steps : [])
    .filter((step) => typeof step?.action === 'string' && typeof step?.text === 'string' && step.action.trim() && step.text.trim())
    .slice(0, 6)
    .map((step) => ({
      ...step,
      queries: Array.isArray(step.queries) ? step.queries.filter((query): query is string => typeof query === 'string') : [],
    }))
    .map((step) => ({ instruccion: step.text.trim(), pictogramaId: findPictogram(step) }));

  return {
    etiqueta: typeof plan.taskName === 'string' && plan.taskName.trim() ? plan.taskName.trim() : 'Nueva tarea',
    pasos: steps.length ? steps : [{ instruccion: typeof plan.taskName === 'string' ? plan.taskName.trim() : 'Nueva tarea', pictogramaId: PICTOGRAMA_POR_DEFECTO }],
  };
}
