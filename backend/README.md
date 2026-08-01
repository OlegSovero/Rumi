# Rumi Backend Orchestrator

Backend orquestador para Rumi que actúa como puente entre el frontend en React, Vertex AI (Gemini) y la API de ARASAAC.

## 🚀 Stack Tecnológico

- **Node.js** con **TypeScript**
- **Express.js** (servidor web)
- **Zod** (validación de esquemas)
- **@google-cloud/vertexai** (integración con Gemini)
- **CORS** (habilitado para el frontend)

## 📋 Requisitos Previos

1. Node.js >= 18
2. Cuenta de Google Cloud con Vertex AI habilitado
3. Credenciales de Google Cloud configuradas

## 🔧 Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
PORT=3001
GOOGLE_CLOUD_PROJECT=tu-proyecto-id
GOOGLE_CLOUD_LOCATION=us-central1
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Google Cloud

#### Opción A: Usar Application Default Credentials (Recomendado para desarrollo)

```bash
gcloud auth application-default login
gcloud config set project TU_PROJECT_ID
```

#### Opción B: Usar Service Account Key

1. Crea una service account en Google Cloud Console
2. Descarga el archivo JSON de credenciales
3. Configura la variable de entorno:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

## 🏃 Ejecutar el Servidor

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

### Modo producción

```bash
npm run build
npm start
```

## 📡 API Endpoints

### `POST /api/pictograms/translate`

Traduce un texto a pictogramas de ARASAAC usando IA.

**Request:**
```json
{
  "text": "quiero comer manzana"
}
```

**Response:**
```json
[
  {
    "originalWord": "quiero",
    "lemma": "querer",
    "imageUrl": "https://static.arasaac.org/pictograms/1234/1234_300.png"
  },
  {
    "originalWord": "comer",
    "lemma": "comer",
    "imageUrl": "https://static.arasaac.org/pictograms/5678/5678_300.png"
  },
  {
    "originalWord": "manzana",
    "lemma": "manzana",
    "imageUrl": null
  }
]
```

### `GET /health`

Verifica que el servidor está funcionando.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-08-01T12:00:00.000Z",
  "service": "Rumi Backend Orchestrator"
}
```

## 🏗️ Arquitectura

```
┌─────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Frontend  │──────▶│     Backend      │──────▶│  Vertex AI   │
│   (React)   │       │  (Express + TS)  │       │   (Gemini)   │
└─────────────┘       └──────────────────┘       └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │  ARASAAC API │
                      └──────────────┘
```

### Flujo de ejecución:

1. **Recepción**: El endpoint recibe el texto del usuario
2. **Validación**: Zod valida el formato del request
3. **Extracción de lemas**: Vertex AI (Gemini) extrae los conceptos y los normaliza
4. **Búsqueda de pictogramas**: Para cada lema, consulta la API de ARASAAC
5. **Consolidación**: Combina los resultados y los devuelve al frontend

## 🛡️ Manejo de Errores

- **400 Bad Request**: Errores de validación (Zod)
- **404 Not Found**: Ruta no encontrada
- **500 Internal Server Error**: Errores del servidor, Vertex AI o ARASAAC

Los errores de ARASAAC (pictogramas no encontrados) se manejan gracefully devolviendo `imageUrl: null`.

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuración centralizada
│   ├── controllers/
│   │   └── pictogram.controller.ts  # Lógica del controlador
│   ├── middleware/
│   │   └── error.middleware.ts    # Manejo de errores
│   ├── routes/
│   │   └── pictogram.routes.ts    # Definición de rutas
│   ├── services/
│   │   ├── vertexai.service.ts    # Integración con Vertex AI
│   │   └── arasaac.service.ts     # Integración con ARASAAC
│   ├── types/
│   │   ├── schemas.ts             # Esquemas Zod
│   │   └── interfaces.ts          # Interfaces TypeScript
│   └── server.ts                  # Punto de entrada
├── package.json
├── tsconfig.json
└── .env.example
```

## 🧪 Testing

Para probar el endpoint desde la terminal:

```bash
curl -X POST http://localhost:3001/api/pictograms/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "yo quiero comer una manzana"}'
```

## 📝 Notas Importantes

- El modelo de Vertex AI está configurado con `temperature: 0.2` para obtener resultados más determinísticos
- La respuesta del LLM se fuerza a formato JSON con `responseMimeType: 'application/json'`
- Las búsquedas en ARASAAC se realizan en paralelo usando `Promise.all()` para minimizar latencia
- Si un pictograma no se encuentra, se devuelve `null` en lugar de fallar toda la petición

## 🔐 Seguridad

- CORS configurado para aceptar solo el frontend especificado
- Validación de entrada con Zod
- Límites de tamaño en el texto de entrada (max 1000 caracteres)
- No se exponen stack traces en producción

## 📄 Licencia

MIT
