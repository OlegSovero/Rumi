import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const response = await fetch(`http://127.0.0.1:11435/${path.join('/')}`, {
    method: request.method,
    headers: { 'Content-Type': 'application/json' },
    body: request.method === 'GET' ? undefined : await request.text(),
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
  });
}

export const GET = proxy;
export const POST = proxy;
