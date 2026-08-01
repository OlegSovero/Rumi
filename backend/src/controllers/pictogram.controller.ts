import type { Request, Response } from 'express';
import { TranslateRequestSchema, type PictogramResult } from '../types/schemas';
import { VertexAIService } from '../services/vertexai.service';
import { ArasaacService } from '../services/arasaac.service';
import { ZodError } from 'zod';

const vertexAIService = new VertexAIService();
const arasaacService = new ArasaacService();

export const translateTextToPictograms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text } = TranslateRequestSchema.parse(req.body);

    console.log(`📝 Received text: "${text}"`);

    const llmResponse = await vertexAIService.extractLemmas(text);
    console.log(`🧠 Extracted ${llmResponse.concepts.length} concepts from LLM`);

    const lemmas = llmResponse.concepts.map((concept) => concept.lemma);
    const imageUrls = await arasaacService.searchMultiplePictograms(lemmas);

    const results: PictogramResult[] = llmResponse.concepts.map((concept, index) => ({
      originalWord: concept.originalWord,
      lemma: concept.lemma,
      imageUrl: imageUrls[index],
    }));

    console.log(`✅ Successfully processed ${results.length} pictograms`);
    
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('❌ Validation error:', error.errors);
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      console.error('❌ Error processing request:', error.message);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
      return;
    }

    console.error('❌ Unknown error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  }
};
