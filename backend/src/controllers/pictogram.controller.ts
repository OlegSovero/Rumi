import type { Request, Response } from 'express';
import { TranslateRequestSchema, type PictogramResult } from '../types/schemas';
import { Gemma4Service } from '../services/gemma4.service';
import { ArasaacService } from '../services/arasaac.service';
import { SupabaseService } from '../services/supabase.service';
import { ZodError } from 'zod';

const gemma4Service = new Gemma4Service();
const arasaacService = new ArasaacService();
const supabaseService = new SupabaseService();

export const translateTextToPictograms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text } = TranslateRequestSchema.parse(req.body);
    const userId = (req.headers['x-user-id'] as string) || 'anonymous';
    const sessionId = (req.headers['x-session-id'] as string) || undefined;

    console.log(`📝 Received text: "${text}" from user: ${userId}`);

    const llmResponse = await gemma4Service.extractLemmas(text);
    console.log(`🧠 Extracted ${llmResponse.concepts.length} concepts from LLM`);

    const lemmas = llmResponse.concepts.map((concept) => concept.lemma);
    const imageUrls = await arasaacService.searchMultiplePictograms(lemmas);

    const results: PictogramResult[] = llmResponse.concepts.map((concept, index) => ({
      originalWord: concept.originalWord,
      lemma: concept.lemma,
      imageUrl: imageUrls[index],
    }));

    // Guardar en Supabase
    try {
      await supabaseService.saveTranslation({
        user_id: userId,
        text,
        concepts: results,
        session_id: sessionId,
        favorite: false,
      });
      console.log('✅ Translation saved to database');
    } catch (dbError) {
      console.error('⚠️  Failed to save to database:', dbError);
      // No fallar la petición si el guardado falla
    }

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

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.headers['x-user-id'] as string) || 'anonymous';
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const favoritesOnly = req.query.favorites === 'true';
    const searchText = req.query.search as string;

    const history = await supabaseService.getTranslations(userId, {
      limit,
      offset,
      favoritesOnly,
      searchText,
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.headers['x-user-id'] as string) || 'anonymous';
    const { id } = req.params;

    const newState = await supabaseService.toggleTranslationFavorite(userId, id);

    res.status(200).json({ favorite: newState });
  } catch (error) {
    console.error('❌ Error toggling favorite:', error);
    res.status(500).json({
      error: 'Failed to toggle favorite',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.headers['x-user-id'] as string) || 'anonymous';
    const { id } = req.params;

    await supabaseService.deleteTranslation(userId, id);

    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting translation:', error);
    res.status(500).json({
      error: 'Failed to delete translation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.headers['x-user-id'] as string) || 'anonymous';

    const stats = await supabaseService.getUserStats(userId);

    res.status(200).json(stats);
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
