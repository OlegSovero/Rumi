const OLLAMA_BASE = '/api/ollama';
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'gemma4:e2b';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type ChatOptions = {
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
};

type OllamaTagsResponse = { models?: { name: string }[] };
type OllamaChatResponse = { message?: { content?: string } };

function elegirModelo(disponibles: string[]): string {
  if (disponibles.includes(OLLAMA_MODEL)) return OLLAMA_MODEL;
  return disponibles.find((model) => model.startsWith('gemma4')) ?? disponibles[0] ?? OLLAMA_MODEL;
}

export async function listarModelosOllama(): Promise<string[]> {
  const response = await fetch(`${OLLAMA_BASE}/api/tags`);
  if (!response.ok) throw new Error(`Ollama tags HTTP ${response.status}`);
  const data = (await response.json()) as OllamaTagsResponse;
  return (data.models ?? []).map(({ name }) => name);
}

export async function chatOllama(options: ChatOptions): Promise<string> {
  const model = elegirModelo(await listarModelosOllama());
  const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: options.messages,
      stream: false,
      format: options.json ? 'json' : undefined,
      options: { temperature: options.temperature ?? 0.2 },
    }),
  });

  if (!response.ok) throw new Error(`Ollama chat HTTP ${response.status}`);
  const data = (await response.json()) as OllamaChatResponse;
  return data.message?.content?.trim() ?? '';
}

export function parsearJsonSeguro<T>(text: string): T | null {
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(clean.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
}
