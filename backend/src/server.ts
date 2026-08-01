import express, { type Express } from 'express';
import cors from 'cors';
import { config } from './config';
import pictogramRoutes from './routes/pictogram.routes';
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
  });
});

app.use('/api/pictograms', pictogramRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n🚀 Rumi Backend Orchestrator started successfully!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Frontend URL: ${config.frontendUrl}`);
  console.log(`🤖 Vertex AI Project: ${config.vertexAI.projectId || 'Not configured'}`);
  console.log(`📍 Vertex AI Location: ${config.vertexAI.location}`);
  console.log(`🎨 ARASAAC API: ${config.arasaac.baseUrl}`);
  console.log('\n✅ Available endpoints:');
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/pictograms/translate - Translate text to pictograms\n`);
});

export default app;
