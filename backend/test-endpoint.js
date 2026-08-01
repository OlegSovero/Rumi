#!/usr/bin/env node

/**
 * Test script para verificar el endpoint del backend
 * Uso: node test-endpoint.js "texto a traducir"
 */

const TEXT = process.argv[2] || 'yo quiero comer una manzana';
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3002';

async function testEndpoint() {
  console.log('🧪 Testing Rumi Backend Orchestrator\n');
  console.log(`📝 Text to translate: "${TEXT}"`);
  console.log(`🔗 Endpoint: ${BASE_URL}/api/pictograms/translate\n`);

  try {
    const response = await fetch(`${BASE_URL}/api/pictograms/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: TEXT }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error response:', error);
      process.exit(1);
    }

    const results = await response.json();
    
    console.log('✅ Success! Results:\n');
    console.log(JSON.stringify(results, null, 2));
    
    console.log('\n📊 Summary:');
    console.log(`   Total concepts: ${results.length}`);
    console.log(`   With images: ${results.filter(r => r.imageUrl).length}`);
    console.log(`   Without images: ${results.filter(r => !r.imageUrl).length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure the backend is running: npm run dev');
    process.exit(1);
  }
}

testEndpoint();
