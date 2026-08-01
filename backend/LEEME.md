# 🎯 Backend Orquestador Rumi - Resumen Ejecutivo

## ✨ ¿Qué es esto?

Un **backend completo en Node.js + TypeScript** que conecta:
- ✅ Frontend React (recibe peticiones)
- ✅ Vertex AI / Gemini (extrae lemas con IA)
- ✅ API ARASAAC (obtiene pictogramas)

## 🚀 Inicio Rápido (3 pasos)

### 1️⃣ Configurar Google Cloud
```bash
gcloud auth application-default login
gcloud config set project TU_PROJECT_ID
gcloud services enable aiplatform.googleapis.com
```

### 2️⃣ Crear archivo .env
```bash
cp .env.example .env
```

Edita el archivo `.env` y pon tu proyecto:
```env
GOOGLE_CLOUD_PROJECT=tu-proyecto-id-aqui
```

### 3️⃣ Ejecutar
```bash
npm run dev
```

¡Listo! El servidor está en `http://localhost:3001`

## 🧪 Probar que Funciona

```bash
# Test rápido
node check-health.js

# Test completo
node test-endpoint.js "yo quiero comer una manzana"
```

## 📡 Endpoint Principal

```http
POST http://localhost:3001/api/pictograms/translate
Content-Type: application/json

{
  "text": "yo quiero comer una manzana"
}
```

**Respuesta:**
```json
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

## 🔌 Integración desde React

```typescript
// En tu componente React
async function traducirAPictogramas(texto: string) {
  const response = await fetch('http://localhost:3001/api/pictograms/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto })
  });
  
  const pictogramas = await response.json();
  return pictogramas;
}

// Uso
const resultado = await traducirAPictogramas("yo quiero comer");
console.log(resultado);
```

## 📚 Documentación Completa

| Archivo | Descripción |
|---------|-------------|
| `README.md` | Documentación técnica completa |
| `QUICKSTART.md` | Guía de inicio paso a paso |
| `EXAMPLES.md` | Ejemplos de uso y casos de prueba |
| `ARCHITECTURE.md` | Arquitectura técnica detallada |
| `TROUBLESHOOTING.md` | Solución de problemas y FAQ |
| `PROJECT_SUMMARY.md` | Resumen del proyecto |

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js 18+
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Validación:** Zod
- **IA:** Google Vertex AI (Gemini 1.5 Flash)
- **Pictogramas:** ARASAAC API

## 📂 Estructura del Código

```
backend/
├── src/
│   ├── server.ts              # Punto de entrada
│   ├── config/                # Configuración
│   ├── types/                 # Esquemas Zod + Interfaces
│   ├── services/              # Vertex AI + ARASAAC
│   ├── controllers/           # Lógica de negocio
│   ├── routes/                # Endpoints
│   └── middleware/            # Error handlers
├── dist/                      # Código compilado
└── docs/                      # Documentación
```

## ⚡ Características Principales

✅ **Validación con Zod** - Entrada segura y tipada
✅ **Extracción de lemas con IA** - Vertex AI normaliza el texto
✅ **Búsqueda paralela** - Promise.all() minimiza latencia
✅ **Manejo robusto de errores** - No falla si un pictograma no existe
✅ **CORS configurado** - Listo para frontend React
✅ **TypeScript completo** - Type safety total
✅ **Código compilado** - Listo para producción

## 🎨 Flujo de Ejecución

```
1. Frontend envía texto → "yo quiero comer"
2. Backend valida con Zod
3. Vertex AI extrae lemas → ["querer", "comer"]
4. ARASAAC busca pictogramas (en paralelo)
5. Backend consolida y responde
6. Frontend muestra los pictogramas
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Compilar TypeScript
npm start        # Producción (después de build)
```

## 🆘 Problemas Comunes

### "GOOGLE_CLOUD_PROJECT not set"
👉 Crea el archivo `.env` con tu proyecto ID

### "Could not load credentials"
👉 Ejecuta: `gcloud auth application-default login`

### "API not enabled"
👉 Ejecuta: `gcloud services enable aiplatform.googleapis.com`

### Error CORS
👉 Verifica `FRONTEND_URL` en `.env`

**Más soluciones:** Consulta `TROUBLESHOOTING.md`

## 💰 Costos

Vertex AI tiene **tier gratuito**.
Uso normal: ~$0.50/mes para 100 traducciones/día.

## 🚢 Producción

### Deploy en Cloud Run
```bash
gcloud run deploy rumi-backend \
  --source . \
  --region us-central1
```

### Deploy en otras plataformas
Compatible con: Render, Railway, Fly.io, Heroku

## ✅ Checklist de Verificación

- [ ] Node.js 18+ instalado
- [ ] Google Cloud CLI instalado
- [ ] Autenticado con `gcloud auth application-default login`
- [ ] Vertex AI API habilitada
- [ ] Archivo `.env` creado con proyecto correcto
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Health check funciona (`node check-health.js`)

## 🎯 Resultado Final

✅ **Backend 100% funcional** listo para conectar con tu frontend React
✅ **Código de producción** con manejo robusto de errores
✅ **Documentación completa** con ejemplos y troubleshooting
✅ **Scripts de prueba** para verificar funcionamiento

## 📞 Siguiente Paso

1. **Configura Google Cloud** (3 minutos)
2. **Ejecuta `npm run dev`** (1 comando)
3. **Prueba con `node test-endpoint.js`** (verificación)
4. **Conecta tu frontend React** (código en EXAMPLES.md)

¡Listo para usar! 🚀
