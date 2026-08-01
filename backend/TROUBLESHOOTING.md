# 🔧 Troubleshooting y FAQ

## 🚨 Problemas Comunes

### 1. Error: "GOOGLE_CLOUD_PROJECT not set"

**Síntoma:**
```
⚠️  GOOGLE_CLOUD_PROJECT not set in environment variables
```

**Solución:**
1. Crea un archivo `.env` en la raíz de `backend/`:
   ```env
   GOOGLE_CLOUD_PROJECT=tu-proyecto-id-aqui
   GOOGLE_CLOUD_LOCATION=us-central1
   ```

2. O exporta la variable:
   ```bash
   # PowerShell
   $env:GOOGLE_CLOUD_PROJECT = "tu-proyecto-id"
   
   # CMD
   set GOOGLE_CLOUD_PROJECT=tu-proyecto-id
   ```

---

### 2. Error: "Could not load the default credentials"

**Síntoma:**
```
Error: Could not load the default credentials
```

**Causas posibles:**
- No has autenticado con Google Cloud
- Las credenciales no están configuradas

**Soluciones:**

#### Opción A: Application Default Credentials (Recomendado para dev)
```bash
gcloud auth application-default login
```

#### Opción B: Service Account Key
1. Ve a Google Cloud Console → IAM & Admin → Service Accounts
2. Crea una service account con el rol "Vertex AI User"
3. Descarga el archivo JSON de credenciales
4. Configura la variable:
   ```bash
   # PowerShell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\key.json"
   
   # CMD
   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\key.json
   ```

---

### 3. Error: "API [aiplatform.googleapis.com] not enabled"

**Síntoma:**
```
Error: API [aiplatform.googleapis.com] not enabled on project
```

**Solución:**
```bash
gcloud services enable aiplatform.googleapis.com
```

O ve a:
https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

---

### 4. Error: CORS al hacer petición desde el frontend

**Síntoma:**
```
Access to fetch at 'http://localhost:3001/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solución:**
Verifica que `FRONTEND_URL` en `.env` coincide con la URL de tu frontend:
```env
FRONTEND_URL=http://localhost:5173
```

Si tu frontend está en otro puerto, cámbialo:
```env
FRONTEND_URL=http://localhost:3000
```

---

### 5. Error: "Cannot find module 'express'"

**Síntoma:**
```
Error: Cannot find module 'express'
```

**Solución:**
```bash
cd backend
npm install
```

---

### 6. Error: Puerto 3001 ya en uso

**Síntoma:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solución:**

#### Opción A: Cambiar el puerto
Edita `.env`:
```env
PORT=3002
```

#### Opción B: Matar el proceso que usa el puerto
```powershell
# Ver qué proceso usa el puerto 3001
netstat -ano | findstr :3001

# Matar el proceso (reemplaza <PID> con el número)
Stop-Process -Id <PID> -Force
```

---

### 7. Error: "No response from Vertex AI"

**Síntoma:**
```
Error: No response from Vertex AI
```

**Causas posibles:**
- Modelo no disponible en la región
- Cuota excedida
- Permisos insuficientes

**Soluciones:**

1. **Verifica la región:**
   ```env
   GOOGLE_CLOUD_LOCATION=us-central1  # Intenta esta región
   ```

2. **Verifica los permisos:**
   - Tu cuenta necesita el rol "Vertex AI User"
   - Revisa en: Cloud Console → IAM & Admin → IAM

3. **Verifica la cuota:**
   - Ve a: Cloud Console → IAM & Admin → Quotas
   - Busca "Vertex AI"

---

### 8. TypeScript no compila

**Síntoma:**
```
error TS2307: Cannot find module 'express' or its corresponding type declarations
```

**Solución:**
```bash
npm install --save-dev @types/express @types/cors @types/node
```

---

### 9. ARASAAC no devuelve imágenes

**Síntoma:**
Todos los pictogramas tienen `imageUrl: null`

**Causas posibles:**
- La palabra no existe en ARASAAC
- Error de red
- API de ARASAAC caída

**Soluciones:**

1. **Verifica manualmente en ARASAAC:**
   - Ve a: https://arasaac.org/
   - Busca la palabra

2. **Verifica la conectividad:**
   ```bash
   curl https://api.arasaac.org/v1/pictograms/es/search/casa
   ```

3. **Es normal:**
   - No todas las palabras tienen pictogramas
   - El backend devuelve `null` en lugar de fallar

---

### 10. Hot-reload no funciona en desarrollo

**Síntoma:**
Cambios en el código no se reflejan automáticamente

**Solución:**
1. Asegúrate de usar `npm run dev` (no `npm start`)
2. Si persiste, reinicia el servidor manualmente

---

## ❓ Preguntas Frecuentes (FAQ)

### ¿Qué modelo de IA se usa?

**Gemini 1.5 Flash** (`gemini-1.5-flash-002`) via Vertex AI.

Es rápido, económico y excelente para tareas de extracción de información.

---

### ¿Por qué no usa GPT-4?

Vertex AI está integrado en Google Cloud, lo que facilita:
- Autenticación unificada
- Facturación centralizada
- Mejor integración con otros servicios GCP

Puedes adaptarlo a OpenAI si lo prefieres.

---

### ¿Cuánto cuesta usar Vertex AI?

Precios aproximados (consulta documentación oficial):
- **Gemini 1.5 Flash:** ~$0.000125 por 1K tokens de entrada
- **Ejemplo:** 100 traducciones/día ≈ $0.50/mes

Vertex AI tiene un **tier gratuito** para comenzar.

---

### ¿Puedo usar otro modelo?

Sí. Edita `src/config/index.ts`:
```typescript
vertexAI: {
  projectId: process.env.GOOGLE_CLOUD_PROJECT || '',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  model: 'gemini-1.5-pro-002',  // Cambia aquí
}
```

Modelos disponibles:
- `gemini-1.5-flash-002` (rápido, barato)
- `gemini-1.5-pro-002` (más potente, más caro)

---

### ¿Cómo agrego autenticación?

Ejemplo básico con JWT:

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Usar en la ruta:
router.post('/translate', authenticate, translateTextToPictograms);
```

---

### ¿Cómo agrego rate limiting?

```bash
npm install express-rate-limit
```

```typescript
// src/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: 'Too many requests from this IP',
});

// En server.ts:
app.use('/api/', limiter);
```

---

### ¿Cómo agrego cache?

```typescript
// src/services/cache.service.ts
const cache = new Map<string, LLMResponse>();

export class CachedVertexAIService {
  async extractLemmas(text: string): Promise<LLMResponse> {
    const cacheKey = text.toLowerCase().trim();
    
    if (cache.has(cacheKey)) {
      console.log('✅ Cache hit');
      return cache.get(cacheKey)!;
    }
    
    const result = await vertexAIService.extractLemmas(text);
    cache.set(cacheKey, result);
    return result;
  }
}
```

---

### ¿Cómo despliego en producción?

#### Opción A: Cloud Run (Google Cloud)
```bash
# Crear Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]

# Desplegar
gcloud run deploy rumi-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

#### Opción B: Render, Railway, Fly.io
1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático

---

### ¿Cómo pruebo sin frontend?

Usa los scripts incluidos:

```bash
# Health check
node check-health.js

# Test completo
node test-endpoint.js "texto de prueba"
```

O usa curl:
```bash
curl -X POST http://localhost:3001/api/pictograms/translate \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"yo quiero comer\"}"
```

---

### ¿Por qué algunos pictogramas son null?

Es **comportamiento esperado**. No todas las palabras tienen pictogramas en ARASAAC.

El backend devuelve `null` en lugar de fallar para que el frontend pueda:
- Mostrar los pictogramas disponibles
- Mostrar texto plano para palabras sin pictograma
- Ofrecer alternativas

---

### ¿Puedo usar otra API de pictogramas?

Sí. Edita `src/services/arasaac.service.ts` o crea un nuevo servicio:

```typescript
// src/services/custom-pictogram.service.ts
export class CustomPictogramService {
  async searchPictogram(lemma: string): Promise<string | null> {
    // Tu lógica aquí
    const response = await fetch(`https://mi-api.com/search/${lemma}`);
    // ...
  }
}
```

---

### ¿Cómo monitoreo el backend?

1. **Logs básicos:**
   ```typescript
   console.log('📝 Received text:', text);
   console.log('🧠 Extracted concepts:', concepts.length);
   ```

2. **Winston para logs estructurados:**
   ```bash
   npm install winston
   ```

3. **Google Cloud Logging:**
   - Los logs se envían automáticamente en Cloud Run

---

### ¿Hay tests unitarios?

Actualmente no, pero puedes agregarlos:

```bash
npm install --save-dev jest @types/jest ts-jest
```

```typescript
// src/__tests__/arasaac.service.test.ts
describe('ArasaacService', () => {
  test('should search pictogram', async () => {
    const service = new ArasaacService();
    const url = await service.searchPictogram('casa');
    expect(url).toContain('arasaac.org');
  });
});
```

---

## 🆘 Aún necesito ayuda

Si ninguna solución funcionó:

1. **Revisa los logs del servidor** - suelen indicar el problema exacto
2. **Verifica las variables de entorno** - asegúrate de que `.env` está correcto
3. **Prueba el health check** - `node check-health.js`
4. **Revisa la documentación oficial:**
   - [Vertex AI](https://cloud.google.com/vertex-ai/docs)
   - [ARASAAC API](https://arasaac.org/developers/api)

---

## 📝 Checklist de Diagnóstico

Usa esto para diagnosticar problemas:

- [ ] Node.js >= 18 instalado (`node --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` existe y tiene valores correctos
- [ ] Google Cloud CLI instalado (`gcloud --version`)
- [ ] Autenticado con Google Cloud (`gcloud auth list`)
- [ ] Vertex AI API habilitada
- [ ] Proyecto correcto configurado (`gcloud config get-value project`)
- [ ] Código compila sin errores (`npm run build`)
- [ ] Puerto 3001 disponible
- [ ] Health check funciona (`node check-health.js`)

Si todos los checks pasan pero sigue fallando, revisa los logs del servidor para más detalles.
