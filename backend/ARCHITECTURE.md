# 🏗️ Arquitectura Técnica del Backend Orquestador

## Vista General

```
┌─────────────────────────────────────────────────────────────────┐
│                        RUMI BACKEND ORCHESTRATOR                │
└─────────────────────────────────────────────────────────────────┘

         ┌──────────────────┐
         │   Frontend       │
         │   (React)        │
         └────────┬─────────┘
                  │
                  │ HTTP POST /api/pictograms/translate
                  │ { "text": "..." }
                  ▼
         ┌──────────────────┐
         │   Express.js     │
         │   + CORS         │
         └────────┬─────────┘
                  │
                  ├─── Middleware: Body Parser
                  ├─── Middleware: Error Handler
                  │
                  ▼
         ┌──────────────────┐
         │  Pictogram       │
         │  Controller      │
         └────────┬─────────┘
                  │
                  ├──1. Validar con Zod
                  │
                  ├──2. Extraer lemas
                  │    ▼
                  │   ┌──────────────────┐
                  │   │ Vertex AI        │
                  │   │ Service          │
                  │   └──────┬───────────┘
                  │          │
                  │          ▼
                  │   ┌──────────────────┐
                  │   │ Google Cloud     │
                  │   │ Vertex AI        │
                  │   │ (Gemini 1.5)     │
                  │   └──────────────────┘
                  │
                  ├──3. Buscar pictogramas (paralelo)
                  │    ▼
                  │   ┌──────────────────┐
                  │   │ ARASAAC          │
                  │   │ Service          │
                  │   └──────┬───────────┘
                  │          │
                  │          ▼
                  │   ┌──────────────────┐
                  │   │ ARASAAC API      │
                  │   │ (Public)         │
                  │   └──────────────────┘
                  │
                  ├──4. Consolidar resultados
                  │
                  ▼
         ┌──────────────────┐
         │   JSON Response  │
         │   [ { ... } ]    │
         └──────────────────┘
```

## Flujo de Datos Detallado

### 1. Recepción y Validación

```typescript
// Input del frontend
{
  "text": "yo quiero comer una manzana"
}

// Validación con Zod
TranslateRequestSchema.parse(req.body)
// ✅ Valid: continuar
// ❌ Invalid: throw ZodError → 400 Bad Request
```

### 2. Extracción de Lemas con Vertex AI

```typescript
// Prompt al LLM (Gemini 1.5 Flash)
const prompt = `
Eres un experto lingüista español. Extrae los conceptos clave 
y conviértelos en lemas (verbos en infinitivo, sustantivos en singular).

Texto: "yo quiero comer una manzana"

Devuelve JSON:
{
  "concepts": [
    { "originalWord": "quiero", "lemma": "querer" },
    { "originalWord": "comer", "lemma": "comer" },
    { "originalWord": "manzana", "lemma": "manzana" }
  ]
}
`;

// Configuración del modelo
{
  temperature: 0.2,           // Más determinístico
  maxOutputTokens: 2048,
  responseMimeType: 'application/json'  // Forzar JSON
}

// Output del LLM (validado con Zod)
{
  concepts: [
    { originalWord: "quiero", lemma: "querer" },
    { originalWord: "comer", lemma: "comer" },
    { originalWord: "manzana", lemma: "manzana" }
  ]
}
```

### 3. Búsqueda Paralela en ARASAAC

```typescript
// Extraer lemas
const lemmas = ["querer", "comer", "manzana"];

// Peticiones en paralelo con Promise.all()
const promises = lemmas.map(lemma => 
  fetch(`https://api.arasaac.org/v1/pictograms/es/search/${lemma}`)
);

const responses = await Promise.all(promises);

// Para cada respuesta exitosa:
const pictogramId = response[0]._id;
const imageUrl = `https://static.arasaac.org/pictograms/${pictogramId}/${pictogramId}_300.png`;

// Para respuestas 404:
const imageUrl = null;  // No fallar, devolver null
```

### 4. Consolidación de Resultados

```typescript
// Combinar datos
const results = concepts.map((concept, index) => ({
  originalWord: concept.originalWord,
  lemma: concept.lemma,
  imageUrl: imageUrls[index]  // puede ser string o null
}));

// Response final al frontend
[
  {
    "originalWord": "quiero",
    "lemma": "querer",
    "imageUrl": "https://static.arasaac.org/pictograms/2448/2448_300.png"
  },
  {
    "originalWord": "comer",
    "lemma": "comer",
    "imageUrl": "https://static.arasaac.org/pictograms/4086/4086_300.png"
  },
  {
    "originalWord": "manzana",
    "lemma": "manzana",
    "imageUrl": "https://static.arasaac.org/pictograms/3923/3923_300.png"
  }
]
```

## Componentes del Sistema

### Server (server.ts)
- Punto de entrada de la aplicación
- Configuración de Express
- Registro de middleware y rutas
- Manejo global de errores

### Config (config/index.ts)
- Carga de variables de entorno
- Configuración centralizada
- Validación de configuración requerida

### Routes (routes/pictogram.routes.ts)
- Definición de endpoints
- Mapeo de rutas a controladores

### Controllers (controllers/pictogram.controller.ts)
- Lógica de negocio principal
- Orquestación de servicios
- Manejo de errores específicos

### Services

#### vertexai.service.ts
- Cliente de Vertex AI
- Construcción de prompts
- Parseo y validación de respuestas LLM

#### arasaac.service.ts
- Cliente HTTP para ARASAAC API
- Búsqueda de pictogramas
- Construcción de URLs de imágenes
- Manejo de errores 404

### Types

#### schemas.ts
- Esquemas de validación Zod
- Tipos derivados de esquemas
- Validación en runtime

#### interfaces.ts
- Interfaces TypeScript
- Tipos de configuración
- Tipos de respuestas de APIs externas

### Middleware

#### error.middleware.ts
- Manejo global de errores
- Normalización de respuestas de error
- Handler 404 para rutas no encontradas

## Decisiones de Diseño

### 1. TypeScript sobre JavaScript
**Por qué:** Type safety, mejor DX, menos errores en runtime

### 2. Zod para validación
**Por qué:** 
- Validación en runtime + types en compile-time
- Mensajes de error descriptivos
- Fácil mantenimiento de esquemas

### 3. Servicios separados
**Por qué:**
- Separación de responsabilidades
- Facilita testing unitario
- Reutilización de código

### 4. Promise.all() para ARASAAC
**Por qué:**
- Minimiza latencia (paralelo vs secuencial)
- Mejor experiencia de usuario
- Escala mejor con más palabras

### 5. Manejo graceful de errores ARASAAC
**Por qué:**
- No romper toda la respuesta por un pictograma faltante
- Mejor UX: mostrar pictogramas parciales
- Flexibilidad para palabras raras

### 6. Configuración centralizada
**Por qué:**
- Single source of truth
- Fácil cambio de configuración
- Validación temprana de env vars

## Seguridad

### CORS
```typescript
app.use(cors({
  origin: config.frontendUrl,  // Solo frontend permitido
  credentials: true,
}));
```

### Validación de Input
```typescript
// Límites de tamaño
text: z.string()
  .min(1, 'Text cannot be empty')
  .max(1000, 'Text too long')
```

### Error Handling
- No exponer stack traces en producción
- Mensajes de error genéricos para errores internos
- Logging detallado en servidor

## Performance

### Optimizaciones Implementadas

1. **Búsquedas Paralelas**
   - `Promise.all()` para ARASAAC
   - Tiempo constante O(1) vs O(n)

2. **Configuración de Vertex AI**
   - `temperature: 0.2` para respuestas más rápidas
   - `maxOutputTokens: 2048` límite razonable

3. **Streaming No Necesario**
   - Respuestas cortas (JSON estructurado)
   - Espera hasta completar para validar

### Métricas Esperadas

- **Health check:** < 10ms
- **Vertex AI:** 500-2000ms (depende del texto)
- **ARASAAC por palabra:** 100-300ms
- **Total (5 palabras):** 600-2300ms

## Escalabilidad

### Limitaciones Actuales
- Sin cache (cada request llama a Vertex AI)
- Sin rate limiting
- Sin autenticación

### Mejoras Futuras
1. **Cache de lemas**
   ```typescript
   const cache = new Map<string, LLMResponse>();
   // Evitar llamadas repetidas a Vertex AI
   ```

2. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
   ```

3. **Autenticación**
   ```typescript
   import { authenticate } from './middleware/auth';
   router.post('/translate', authenticate, translateTextToPictograms);
   ```

4. **Logging Estructurado**
   ```typescript
   import winston from 'winston';
   logger.info('Request processed', { duration, wordCount });
   ```

## Testing

### Estrategia de Testing

```typescript
// Unit tests
describe('VertexAIService', () => {
  test('should extract lemmas correctly', async () => {
    const result = await service.extractLemmas('yo quiero comer');
    expect(result.concepts).toHaveLength(2);
  });
});

// Integration tests
describe('POST /api/pictograms/translate', () => {
  test('should return pictograms', async () => {
    const response = await request(app)
      .post('/api/pictograms/translate')
      .send({ text: 'yo quiero comer' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
```

## Deployment

### Variables de Entorno Requeridas
```env
PORT=3001
GOOGLE_CLOUD_PROJECT=proyecto-id
GOOGLE_CLOUD_LOCATION=us-central1
FRONTEND_URL=https://frontend.com
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json  # Opcional
```

### Comandos de Deployment
```bash
# Build
npm run build

# Start en producción
NODE_ENV=production npm start
```

### Docker (opcional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

## Monitoreo

### Logs Importantes
```
📝 Received text: "..."           # Input recibido
🧠 Extracted N concepts from LLM  # Respuesta de Vertex AI
❌ Pictogram not found for lemma  # Error ARASAAC (esperado)
✅ Successfully processed N       # Éxito final
❌ Error processing request       # Error general
```

### Health Check
```bash
curl http://localhost:3001/health
```

Responde con:
```json
{
  "status": "healthy",
  "timestamp": "2026-08-01T...",
  "service": "Rumi Backend Orchestrator"
}
```
