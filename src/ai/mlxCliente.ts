const MLX_BASE = '/api/mlx';
const MLX_MODEL = process.env.NEXT_PUBLIC_MLX_MODEL || 'mlx-community/gemma-4-e4b-it-4bit';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type ChatResponse = { choices?: { message?: { content?: string } }[] };

export async function comprobarMlx(): Promise<boolean> {
  const response = await fetch(`${MLX_BASE}/v1/models`);
  return response.ok;
}

export async function chatMlx(messages: ChatMessage[], options: { json?: boolean; temperature?: number } = {}) {
  const response = await fetch(`${MLX_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MLX_MODEL,
      stream: false,
      temperature: options.temperature ?? 0.2,
      max_tokens: 300,
      messages,
      ...(options.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) throw new Error(`MLX chat HTTP ${response.status}`);
  const data = (await response.json()) as ChatResponse;
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}

export function parsearJsonMlx<T>(text: string): T | null {
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

export { MLX_MODEL };
