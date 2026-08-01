# 🚀 Guía de Inicio Rápido

## Pasos para ejecutar el backend

### 1. Configurar credenciales de Google Cloud

```bash
# Opción A: Login con tu cuenta (recomendado para desarrollo)
gcloud auth application-default login
gcloud config set project TU_PROJECT_ID

# Opción B: Variable de entorno (producción)
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account-key.json
```

### 2. Configurar variables de entorno

Crea el archivo `.env` en la carpeta `backend/`:

```env
PORT=3001
GOOGLE_CLOUD_PROJECT=tu-proyecto-id-aqui
GOOGLE_CLOUD_LOCATION=us-central1
FRONTEND_URL=http://localhost:5173
```

### 3. Instalar dependencias (ya hecho)

```bash
npm install
```

### 4. Ejecutar el servidor

```bash
npm run dev
```

Deberías ver:

```
🚀 Rumi Backend Orchestrator started successfully!
📡 Server running on http://localhost:3001
🌍 Frontend URL: http://localhost:5173
🤖 Vertex AI Project: tu-proyecto-id
📍 Vertex AI Location: us-central1
🎨 ARASAAC API: https://api.arasaac.org/v1

✅ Available endpoints:
   GET  /health - Health check
   POST /api/pictograms/translate - Translate text to pictograms
```

### 5. Verificar que funciona

En otra terminal:

```bash
# Verificar salud del servidor
node check-health.js

# Probar el endpoint principal
node test-endpoint.js "yo quiero comer una manzana"
```

## 🔍 Solución de problemas

### Error: "GOOGLE_CLOUD_PROJECT not set"
- Verifica que el archivo `.env` existe
- Asegúrate de que `GOOGLE_CLOUD_PROJECT` tiene tu ID de proyecto

### Error: "No response from Vertex AI"
- Verifica que las credenciales están configuradas
- Asegúrate de que Vertex AI está habilitado en tu proyecto:
  ```bash
  gcloud services enable aiplatform.googleapis.com
  ```

### Error: CORS
- Verifica que `FRONTEND_URL` en `.env` coincide con tu frontend
- Por defecto es `http://localhost:5173` (Vite default)

## 📝 Ejemplo de uso desde curl

```bash
curl -X POST http://localhost:3001/api/pictograms/translate ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"yo quiero comer una manzana\"}"
```

## 🎯 Endpoints disponibles

- `GET /health` - Verifica que el servidor está funcionando
- `POST /api/pictograms/translate` - Traduce texto a pictogramas

## 🔗 Integración con Frontend

En tu frontend React, puedes hacer:

```typescript
const response = await fetch('http://localhost:3001/api/pictograms/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: 'yo quiero comer' }),
});

const pictograms = await response.json();
console.log(pictograms);
```
