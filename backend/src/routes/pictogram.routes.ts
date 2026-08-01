import { Router } from 'express';
import {
  translateTextToPictograms,
  getHistory,
  toggleFavorite,
  deleteHistory,
  getUserStats,
} from '../controllers/pictogram.controller';

const router = Router();

// Traducir texto a pictogramas y guardar en histórico
router.post('/translate', translateTextToPictograms);

// Obtener histórico de traducciones
router.get('/history', getHistory);

// Marcar/desmarcar traducción como favorita
router.post('/history/:id/favorite', toggleFavorite);

// Eliminar traducción del histórico
router.delete('/history/:id', deleteHistory);

// Obtener estadísticas del usuario
router.get('/stats', getUserStats);

export default router;
