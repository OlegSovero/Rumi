import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  gemma4: {
    apiKey: process.env.GOOGLE_API_KEY || '',
  },
  arasaac: {
    baseUrl: 'https://api.arasaac.org/v1',
    staticUrl: 'https://static.arasaac.org/pictograms',
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
} as const;

if (!config.gemma4.apiKey) {
  console.warn('⚠️  GOOGLE_API_KEY not set in environment variables');
}

if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('⚠️  Supabase credentials not configured');
}
