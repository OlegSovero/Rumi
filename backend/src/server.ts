import express, { type Express } from 'express';
import cors from 'cors';
import { config } from './config';
import pictogramRoutes from './routes/pictogram.routes';
import userRoutes from './routes/user.routes';
import dataRoutes from './routes/data.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Express = express();

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Rumi Backend Orchestrator',
    database: config.supabase.url ? 'Supabase connected' : 'No database',
  });
});

// API Routes
app.use('/api/pictograms', pictogramRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n🚀 Rumi Backend Orchestrator started successfully!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Frontend URL: ${config.frontendUrl}`);
  console.log(`🤖 Gemma 4: ${config.gemma4.apiKey ? 'Configured ✓' : 'Not configured'}`);
  console.log(`🎨 ARASAAC API: ${config.arasaac.baseUrl}`);
  console.log(`💾 Supabase: ${config.supabase.url ? 'Connected' : 'Not configured'}`);
  console.log('\n✅ Available endpoints:');
  console.log(`   GET  /health - Health check`);
  console.log('\n   📊 Pictograms & Translations:');
  console.log(`   POST /api/pictograms/translate - Translate text to pictograms`);
  console.log(`   GET  /api/pictograms/history - Get translation history`);
  console.log(`   POST /api/pictograms/history/:id/favorite - Toggle favorite`);
  console.log(`   DEL  /api/pictograms/history/:id - Delete translation`);
  console.log(`   GET  /api/pictograms/stats - Get user stats`);
  console.log('\n   👤 User & Preferences:');
  console.log(`   GET  /api/user/profile - Get user profile`);
  console.log(`   PUT  /api/user/profile - Update profile`);
  console.log(`   GET  /api/user/preferences - Get preferences`);
  console.log(`   PUT  /api/user/preferences - Set preferences`);
  console.log(`   GET  /api/user/pictograms/:category - Get pictograms by category`);
  console.log(`   POST /api/user/pictograms - Save pictogram`);
  console.log(`   POST /api/user/pictograms/usage - Log pictogram usage`);
  console.log(`   GET  /api/user/pictograms-most-used - Get most used pictograms`);
  console.log('\n   📝 Tasks & Phrases:');
  console.log(`   GET  /api/data/tasks - Get all tasks`);
  console.log(`   POST /api/data/tasks - Create task`);
  console.log(`   PUT  /api/data/tasks/:taskId - Update task`);
  console.log(`   DEL  /api/data/tasks/:taskId - Delete task`);
  console.log(`   POST /api/data/tasks/:taskId/complete - Log task completion`);
  console.log(`   GET  /api/data/phrases - Get phrases`);
  console.log(`   POST /api/data/phrases - Save phrase`);
  console.log(`   GET  /api/data/phrases/search?q=text - Search phrases\n`);
});

export default app;
