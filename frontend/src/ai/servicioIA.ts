import type { ServicioIA, TareaGenerada } from './tipos';
import { servicioIAMock } from './servicioIAMock';

async function request<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as { result?: T; message?: string };
  if (!response.ok || payload.result === undefined) {
    throw new Error(payload.message || 'AI request failed');
  }
  return payload.result;
}

const servicioIAVertex: ServicioIA = {
  pictogramasAFrase: (secuencia) => request<string>({ operation: 'pictogramasAFrase', secuencia }),
  fraseAPictogramas: (texto) => request<number[]>({ operation: 'fraseAPictogramas', texto }),
  descomponerTarea: (texto) => request<TareaGenerada>({ operation: 'descomponerTarea', texto }),
  reformularPaso: (instruccion) => request<string>({ operation: 'reformularPaso', instruccion }),
};

export const servicioIA = process.env.NEXT_PUBLIC_AI_MODE === 'vertex'
  ? servicioIAVertex
  : servicioIAMock;
