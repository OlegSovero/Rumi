#!/usr/bin/env node

/**
 * Health check script
 */

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3002';

async function checkHealth() {
  console.log('🏥 Checking backend health...\n');

  try {
    const response = await fetch(`${BASE_URL}/health`);
    
    if (!response.ok) {
      console.error('❌ Backend is not healthy');
      process.exit(1);
    }

    const health = await response.json();
    console.log('✅ Backend is healthy!\n');
    console.log(JSON.stringify(health, null, 2));

  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message);
    console.error('\n💡 Make sure the backend is running: npm run dev');
    process.exit(1);
  }
}

checkHealth();
