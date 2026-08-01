import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  descomponerTarea,
  extraerConceptos,
  pictogramasAFrase,
  reformularPaso,
} from '@/lib/server/google-ai';
import { searchPictogram } from '@/lib/server/arasaac';
import { PICTOGRAM_IDS } from '@/data/pictogramCatalog';
import { resolverPlan } from '@/ai/planTarea';
import { validarInterpretacion } from '@/ai/comunicacion';

export const runtime = 'nodejs';

const RequestSchema = z.discriminatedUnion('operation', [
  z.object({
    operation: z.literal('pictogramasAFrase'),
    secuencia: z.array(z.object({ id: z.number(), etiqueta: z.string() })).max(100),
  }),
  z.object({ operation: z.literal('fraseAPictogramas'), texto: z.string().min(1).max(1000) }),
  z.object({ operation: z.literal('descomponerTarea'), texto: z.string().min(1).max(1000) }),
  z.object({ operation: z.literal('reformularPaso'), instruccion: z.string().min(1).max(1000) }),
]);

export async function POST(request: Request) {
  try {
    const body = RequestSchema.parse(await request.json());

    switch (body.operation) {
      case 'pictogramasAFrase':
        return NextResponse.json({ result: validarInterpretacion(await pictogramasAFrase(body.secuencia), body.secuencia) });
      case 'fraseAPictogramas': {
        const { concepts } = await extraerConceptos(body.texto);
        const pictogramIds = await Promise.all(concepts.map(({ lemma }) => searchPictogram(lemma)));
        return NextResponse.json({ result: pictogramIds.filter((id): id is number => id !== null && PICTOGRAM_IDS.has(id)) });
      }
      case 'descomponerTarea': {
        const plan = await descomponerTarea(body.texto);
        return NextResponse.json({ result: resolverPlan(plan) });
      }
      case 'reformularPaso':
        return NextResponse.json({ result: await reformularPaso(body.instruccion) });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Unexpected AI error';
    console.error('AI route error:', message);
    return NextResponse.json({ error: 'AI service unavailable', message }, { status: 503 });
  }
}
