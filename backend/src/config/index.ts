import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  vertexAI: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    model: 'gemini-1.5-flash-002',
  },
  arasaac: {
    baseUrl: 'https://api.arasaac.org/v1',
    staticUrl: 'https://static.arasaac.org/pictograms',
  },
} as const;

if (!config.vertexAI.projectId) {
  console.warn('⚠️  GOOGLE_CLOUD_PROJECT not set in environment variables');
}
