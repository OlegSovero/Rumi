# Rumi

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Presentado para LimaGDG — Grupo: Los caza bombitas.

## Estructura del repo

- `src/` — aplicación Next.js con App Router y TypeScript.
- `src/app/api/ai/route.ts` — API route server-side para Vertex AI y ARASAAC.
- `public/` — pictogramas y recursos estáticos.

Next.js contiene tanto la interfaz como el endpoint server-side de IA. No hay un backend Express separado.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build
npm run start
npm run lint
```

Por defecto la IA usa un mock local. Para usar Ollama con Gemma local durante el desarrollo, configura `.env.local` así:

```env
NEXT_PUBLIC_IA_PROVIDER=ollama
NEXT_PUBLIC_OLLAMA_MODEL=gemma4:e2b
```

Ollama debe estar ejecutándose en `localhost:11434`. El proxy `src/app/api/ollama/` evita problemas de CORS y usa mock automáticamente si Ollama no responde.

### Probar Gemma localmente

En macOS instala Ollama:

```bash
brew install --cask ollama
```

Abre Ollama y descarga el modelo configurado:

```bash
ollama pull gemma4:e2b
curl http://localhost:11434/api/tags
```

Después ejecuta Rumi con `npm run dev` y abre `http://localhost:3000`. En `Familia > Ajustes`, el panel `Asistente IA` muestra el proveedor, modelo y disponibilidad.

Si Ollama no está disponible, las operaciones de IA vuelven automáticamente al mock local.

Para activar Vertex AI, usa `NEXT_PUBLIC_IA_PROVIDER=vertex` junto con `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION` y `VERTEX_AI_MODEL`.

## Proveedores de IA

Rumi puede cambiar entre los proveedores implementados mediante `NEXT_PUBLIC_IA_PROVIDER`. La selección se hace en tiempo de build; no se cambian credenciales desde el navegador.

| Proveedor | Uso principal | Modelo de ejemplo | Runtime / endpoint | Requiere internet | Costo de inferencia | Configuración |
| --- | --- | --- | --- | --- | --- | --- |
| `mock` | Demo, CI y producción segura por defecto | Respuestas simuladas | Reglas locales | No | Sin costo de IA | `NEXT_PUBLIC_IA_PROVIDER=mock` |
| `ollama` | Desarrollo local multiplataforma | `gemma4:e2b` | Ollama en `localhost:11434` | Solo para descargar el modelo | Sin costo de API; usa CPU/GPU local | `NEXT_PUBLIC_IA_PROVIDER=ollama` y `NEXT_PUBLIC_OLLAMA_MODEL=gemma4:e2b` |
| `mlx` | Desarrollo local en Mac Apple Silicon | `mlx-community/gemma-4-e4b-it-4bit` | `mlx-vlm.server` en `localhost:11435` | Solo para descargar el modelo | Sin costo de API; consume recursos de tu Mac | `NEXT_PUBLIC_IA_PROVIDER=mlx` |
| `vertex` | Cloud Run y producción | Model ID aprobado por Google, por ejemplo Gemma o Gemini | Vertex AI mediante `/api/ai` | Sí | Consume créditos o billing de GCP | `NEXT_PUBLIC_IA_PROVIDER=vertex` + variables server-side |

### Recomendación

- Usa `mock` para demos y despliegues mientras no quieras consumir IA.
- Usa `mlx` en tu Mac si quieres probar Gemma 4 aprovechando Apple Silicon.
- Usa `ollama` si necesitas una opción local más portable.
- Usa `vertex` únicamente cuando tengas acceso aprobado al modelo y controles de billing configurados.

MLX y Ollama son proveedores locales: no funcionan dentro de Cloud Run porque dependen de procesos que viven en tu computadora. Cloud Run usa `mock` o Vertex AI.

### Probar con MLX desde `rumi-gemma-desktop-app`

La aplicación desktop prepara Python, instala `mlx-vlm`, descarga Gemma y levanta un servidor compatible con OpenAI en `localhost:11435`. Rumi web se conecta a ese servidor mediante su proxy Next.js.

Requisitos: macOS con Apple Silicon, Node.js 20 o superior y Python 3.10, 3.11, 3.12 o 3.13.

1. Instala y valida la aplicación desktop:

```bash
cd /Users/milumon/Documents/Github/rumi-gemma-desktop-app
npm install
npm run typecheck
npm run dev
```

2. En la ventana desktop pulsa `Preparar Gemma`. La aplicación crea un entorno Python local, instala `mlx-vlm`, descarga `mlx-community/gemma-4-e4b-it-4bit` y arranca MLX en el puerto `11435`.
3. Comprueba que el servidor MLX responde:

```bash
curl http://127.0.0.1:11435/v1/models
```

4. En la raíz de Rumi crea `.env.local`:

```env
NEXT_PUBLIC_IA_PROVIDER=mlx
NEXT_PUBLIC_MLX_MODEL=mlx-community/gemma-4-e4b-it-4bit
```

5. En otra terminal, ejecuta Rumi desde la raíz:

```bash
cd /Users/milumon/Documents/Github/Rumi
npm install
npm run dev
```

6. Abre `http://localhost:3000` y revisa `Familia > Ajustes > Asistente IA`.

El panel debe mostrar `mlx` y `Servidor MLX local disponible`. Si cierras la aplicación desktop, Rumi vuelve al mock automáticamente.

### Vertex AI Y Costos

Las llamadas a Vertex AI ocurren únicamente en las API routes server-side de Next.js. Nunca se exponen credenciales al navegador.

El despliegue de Cloud Run se construye en modo `mock` para evitar llamadas accidentales a Gemini. Para activar Vertex en un entorno controlado, configura el proveedor como `vertex`, el proyecto, la región y el model ID aprobado.

El proyecto GCP tiene billing habilitado, por lo que Cloud Run y Vertex AI pueden generar cargos cuando superen créditos o cuotas gratuitas. Antes de activar Vertex, configura un presupuesto y alertas en Cloud Billing. El panel de Rumi permite confirmar el proveedor activo, pero no reemplaza las alertas de facturación de Google Cloud.

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
