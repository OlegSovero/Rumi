# 📚 Ejemplos de Uso y Casos de Prueba

## Casos de Prueba

### ✅ Caso 1: Texto simple

**Request:**
```json
{
  "text": "yo quiero comer"
}
```

**Respuesta esperada:**
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
  }
]
```

### ✅ Caso 2: Texto con verbos conjugados

**Request:**
```json
{
  "text": "ella comió manzanas rojas"
}
```

**Respuesta esperada:**
```json
[
  {
    "originalWord": "comió",
    "lemma": "comer",
    "imageUrl": "https://static.arasaac.org/pictograms/4086/4086_300.png"
  },
  {
    "originalWord": "manzanas",
    "lemma": "manzana",
    "imageUrl": "https://static.arasaac.org/pictograms/3923/3923_300.png"
  },
  {
    "originalWord": "rojas",
    "lemma": "rojo",
    "imageUrl": "https://static.arasaac.org/pictograms/8260/8260_300.png"
  }
]
```

### ✅ Caso 3: Texto con artículos y preposiciones (se filtran)

**Request:**
```json
{
  "text": "la niña va a la escuela"
}
```

**Respuesta esperada:**
```json
[
  {
    "originalWord": "niña",
    "lemma": "niña",
    "imageUrl": "https://static.arasaac.org/pictograms/8417/8417_300.png"
  },
  {
    "originalWord": "va",
    "lemma": "ir",
    "imageUrl": "https://static.arasaac.org/pictograms/2239/2239_300.png"
  },
  {
    "originalWord": "escuela",
    "lemma": "escuela",
    "imageUrl": "https://static.arasaac.org/pictograms/2141/2141_300.png"
  }
]
```

### ⚠️ Caso 4: Palabra sin pictograma disponible

**Request:**
```json
{
  "text": "quiero un xilófono"
}
```

**Respuesta esperada:**
```json
[
  {
    "originalWord": "quiero",
    "lemma": "querer",
    "imageUrl": "https://static.arasaac.org/pictograms/2448/2448_300.png"
  },
  {
    "originalWord": "xilófono",
    "lemma": "xilófono",
    "imageUrl": null
  }
]
```

### ❌ Caso 5: Texto vacío (error de validación)

**Request:**
```json
{
  "text": ""
}
```

**Respuesta esperada (400):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Text cannot be empty",
      "path": ["text"]
    }
  ]
}
```

### ❌ Caso 6: Sin campo "text" (error de validación)

**Request:**
```json
{
  "message": "esto no funciona"
}
```

**Respuesta esperada (400):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["text"],
      "message": "Required"
    }
  ]
}
```

## 🧪 Scripts de Prueba en PowerShell

### Test básico
```powershell
$body = @{
    text = "yo quiero comer una manzana"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/pictograms/translate" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Test con error (texto vacío)
```powershell
$body = @{
    text = ""
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:3001/api/pictograms/translate" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
} catch {
    Write-Host "Error capturado (esperado):"
    $_.ErrorDetails.Message | ConvertFrom-Json
}
```

### Health check
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

## 🔧 Usando los scripts de Node.js

### Test del endpoint principal
```bash
# Test con texto por defecto
node test-endpoint.js

# Test con texto personalizado
node test-endpoint.js "el perro corre rápido"
```

### Health check
```bash
node check-health.js
```

## 📊 Respuestas del Servidor

### 200 OK - Éxito
```json
[
  {
    "originalWord": "string",
    "lemma": "string",
    "imageUrl": "string | null"
  }
]
```

### 400 Bad Request - Error de validación
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "string",
      "message": "string",
      "path": ["string"]
    }
  ]
}
```

### 500 Internal Server Error - Error del servidor
```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```

### 404 Not Found - Ruta no encontrada
```json
{
  "error": "Not found",
  "message": "Route POST /api/wrong not found"
}
```

## 🎯 Integración desde Frontend React

### Ejemplo con Fetch API
```typescript
async function translateText(text: string) {
  try {
    const response = await fetch('http://localhost:3001/api/pictograms/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Translation failed');
    }

    const pictograms = await response.json();
    return pictograms;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
}

// Uso
const result = await translateText('yo quiero comer');
console.log(result);
```

### Ejemplo con Axios
```typescript
import axios from 'axios';

async function translateText(text: string) {
  try {
    const { data } = await axios.post(
      'http://localhost:3001/api/pictograms/translate',
      { text }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
    }
    throw error;
  }
}
```

## 🚀 Performance

El backend utiliza `Promise.all()` para hacer las peticiones a ARASAAC en paralelo:

- **Secuencial** (malo): 5 palabras × 200ms = 1000ms
- **Paralelo** (bueno): max(200ms) = 200ms

Esto significa que el tiempo de respuesta no aumenta linealmente con el número de palabras.

## 🛡️ Manejo de Errores

El backend maneja estos casos gracefully:

1. **Pictograma no encontrado**: Devuelve `imageUrl: null` (no falla)
2. **Error de Vertex AI**: Devuelve 500 con mensaje descriptivo
3. **Validación fallida**: Devuelve 400 con detalles del error
4. **Ruta no encontrada**: Devuelve 404 con ruta intentada
