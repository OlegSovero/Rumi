import { Router } from 'express';
import { translateTextToPictograms } from '../controllers/pictogram.controller';

const router = Router();

router.post('/translate', translateTextToPictograms);

export default router;
