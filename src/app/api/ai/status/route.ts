import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const provider = (process.env.NEXT_PUBLIC_IA_PROVIDER || process.env.NEXT_PUBLIC_AI_MODE || 'mock').toLowerCase();
const model = provider === 'vertex'
  ? process.env.VERTEX_AI_MODEL || 'not configured'
  : provider === 'ollama'
    ? process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'gemma4:e2b'
    : provider === 'mlx'
      ? process.env.NEXT_PUBLIC_MLX_MODEL || 'mlx-community/gemma-4-e4b-it-4bit'
    : 'mock';

export async function GET() {
  if (provider === 'ollama') {
    try {
      const response = await fetch('http://127.0.0.1:11434/api/tags', { cache: 'no-store' });
      const data = (await response.json()) as { models?: { name: string }[] };
      const models = (data.models ?? []).map(({ name }) => name);
      return NextResponse.json({
        provider,
        model,
        ready: response.ok && models.length > 0,
        detail: response.ok ? `${models.length} modelo(s) local(es) disponible(s)` : 'Ollama no responde',
      });
    } catch {
      return NextResponse.json({ provider, model, ready: false, detail: 'Ollama no responde en localhost:11434' });
    }
  }

  if (provider === 'mlx') {
    try {
      const response = await fetch('http://127.0.0.1:11435/v1/models', { cache: 'no-store' });
      return NextResponse.json({
        provider,
        model,
        ready: response.ok,
        detail: response.ok ? 'Servidor MLX local disponible' : 'MLX no responde en localhost:11435',
      });
    } catch {
      return NextResponse.json({ provider, model, ready: false, detail: 'MLX no responde en localhost:11435' });
    }
  }

  if (provider === 'vertex') {
    const ready = Boolean(process.env.GOOGLE_CLOUD_PROJECT && process.env.VERTEX_AI_MODEL);
    return NextResponse.json({
      provider,
      model,
      ready,
      detail: ready ? 'Configurado; se conecta solo cuando se usa una función de IA' : 'Faltan variables de Vertex AI',
    });
  }

  return NextResponse.json({
    provider: 'mock',
    model: 'mock',
    ready: true,
    detail: 'Respuestas locales; no consume servicios de IA',
  });
}
