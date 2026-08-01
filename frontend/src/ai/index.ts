import type { ServicioIA } from './tipos';
import { servicioIAMock } from './servicioIAMock';
import { servicioIAOllama } from './servicioIAOllama';

// Punto único de acceso al servicio de IA.
// Por defecto: Ollama local (Gemma). Si NEXT_PUBLIC_IA_PROVIDER=mock, fuerza el simulador.

const provider = (process.env.NEXT_PUBLIC_IA_PROVIDER ?? 'ollama').toLowerCase();

export const servicioIA: ServicioIA = provider === 'mock' ? servicioIAMock : servicioIAOllama;

export type { ServicioIA, TareaGenerada, PasoGenerado } from './tipos';
export { servicioIAMock } from './servicioIAMock';
export { servicioIAOllama } from './servicioIAOllama';
export { comprobarOllama, type EstadoOllama } from './ollamaCliente';
