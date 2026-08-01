import { z } from 'zod';

export const TranslateRequestSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty').max(1000, 'Text too long'),
});

export const ConceptSchema = z.object({
  originalWord: z.string(),
  lemma: z.string(),
});

export const LLMResponseSchema = z.object({
  concepts: z.array(ConceptSchema),
});

export const PictogramResultSchema = z.object({
  originalWord: z.string(),
  lemma: z.string(),
  imageUrl: z.string().url().nullable(),
});

export type TranslateRequest = z.infer<typeof TranslateRequestSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type LLMResponse = z.infer<typeof LLMResponseSchema>;
export type PictogramResult = z.infer<typeof PictogramResultSchema>;
