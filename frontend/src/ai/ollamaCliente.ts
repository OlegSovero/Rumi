// Cliente mínimo contra la API local de Ollama (vía rewrite Next.js en /api/ollama).
// Offline: todo ocurre en localhost, sin Google Cloud ni claves.

export const OLLAMA_BASE = process.env.NEXT_PUBLIC_OLLAMA_BASE ?? '/api/ollama';
export const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL ?? 'gemma4:e2b';

export type EstadoOllama = {
  ok: boolean;
  modelo: string;
  modelosDisponibles: string[];
  mensaje: string;
};

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type ChatOptions = {
  model?: string;
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
};

function elegirModelo(disponibles: string[], preferido: string): string {
  if (disponibles.includes(preferido)) return preferido;
  const gemma4 = disponibles.find((m) => m === 'gemma4' || m.startsWith('gemma4:'));
  if (gemma4) return gemma4;
  const gemma3 = disponibles.find((m) => m.startsWith('gemma3'));
  if (gemma3) return gemma3;
  return disponibles[0] ?? preferido;
}

export async function listarModelosOllama(): Promise<string[]> {
  const res = await fetch(`${OLLAMA_BASE}/api/tags`);
  if (!res.ok) throw new Error(`Ollama tags HTTP ${res.status}`);
  const data = (await res.json()) as { models?: { name: string }[] };
  return (data.models ?? []).map((m) => m.name);
}

export async function comprobarOllama(): Promise<EstadoOllama> {
  try {
    const modelos = await listarModelosOllama();
    if (modelos.length === 0) {
      return {
        ok: false,
        modelo: OLLAMA_MODEL,
        modelosDisponibles: [],
        mensaje: 'Ollama responde, pero no hay modelos. Ejecuta: ollama pull gemma4',
      };
    }
    const modelo = elegirModelo(modelos, OLLAMA_MODEL);
    const esGemma4 = modelo === 'gemma4' || modelo.startsWith('gemma4:');
    return {
      ok: true,
      modelo,
      modelosDisponibles: modelos,
      mensaje: esGemma4
        ? `Conectado a ${modelo} (local / offline)`
        : `Conectado a ${modelo}. Para el hackathon: ollama pull gemma4`,
    };
  } catch {
    return {
      ok: false,
      modelo: OLLAMA_MODEL,
      modelosDisponibles: [],
      mensaje: 'Ollama no responde en localhost:11434. ¿Está abierto Ollama?',
    };
  }
}

export async function chatOllama(opts: ChatOptions): Promise<string> {
  const modelos = await listarModelosOllama();
  const model = elegirModelo(modelos, opts.model ?? OLLAMA_MODEL);

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      stream: false,
      format: opts.json ? 'json' : undefined,
      options: {
        temperature: opts.temperature ?? 0.2,
      },
    }),
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    throw new Error(`Ollama chat HTTP ${res.status}: ${detalle.slice(0, 200)}`);
  }

  const data = (await res.json()) as { message?: { content?: string } };
  return (data.message?.content ?? '').trim();
}

export function parsearJsonSeguro<T>(texto: string): T | null {
  const limpio = texto
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(limpio) as T;
  } catch {
    const inicio = limpio.indexOf('{');
    const fin = limpio.lastIndexOf('}');
    if (inicio >= 0 && fin > inicio) {
      try {
        return JSON.parse(limpio.slice(inicio, fin + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
