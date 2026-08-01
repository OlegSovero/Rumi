# Rumi

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Presentado para LimaGDG — Grupo: Los caza bombitas.

## Estructura del repo

- `src/` — aplicación Next.js con App Router y TypeScript.
- `src/app/api/ai/route.ts` — API route server-side para Google AI y ARASAAC.
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

Por defecto la IA usa un mock local. La selección del proveedor es local a cada instalación y se hace al iniciar o compilar Next.js; no se comparte entre compañeros.

Para usar Ollama con Gemma local durante el desarrollo, crea `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_IA_PROVIDER=ollama
NEXT_PUBLIC_OLLAMA_MODEL=gemma4:e2b
```

Usa una sola variable para elegir proveedor. `NEXT_PUBLIC_IA_PROVIDER` tiene prioridad sobre `NEXT_PUBLIC_AI_MODE`; si ambas existen con valores distintos, gana `NEXT_PUBLIC_IA_PROVIDER`. Después de modificar `.env.local`, reinicia `npm run dev`.

Ollama debe estar ejecutándose en `127.0.0.1:11434`. El proxy `src/app/api/ollama/` evita problemas de CORS y conecta Rumi con Ollama en la misma computadora.

### Configurar Ollama en Windows

1. Instala Ollama desde [ollama.com/download/windows](https://ollama.com/download/windows). La aplicación de Ollama normalmente queda ejecutándose en segundo plano.
2. Abre PowerShell y descarga el modelo configurado:

```powershell
ollama pull gemma4:e2b
```

3. Comprueba que el modelo está instalado y que la API responde:

```powershell
ollama list
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

La respuesta de `/api/tags` debe incluir un modelo cuyo nombre sea `gemma4:e2b` o comience por `gemma4`. Si Ollama no está ejecutándose, inicia la aplicación Ollama o ejecuta `ollama serve` en PowerShell.

4. En la raíz de Rumi, crea `.env.local` con:

```env
NEXT_PUBLIC_IA_PROVIDER=ollama
NEXT_PUBLIC_OLLAMA_MODEL=gemma4:e2b
```

5. Reinicia Rumi:

```powershell
npm install
npm run dev
```

6. Abre `http://localhost:3000/familia`, entra en `Ajustes` y revisa el panel `Asistente IA`.

También se puede comprobar directamente en el navegador:

```text
http://localhost:3000/api/ai/status
```

La respuesta esperada incluye `"provider":"ollama"`, `"model":"gemma4:e2b"` y `"ready":true`.

Si el panel indica `mock`, Next.js no cargó la variable: revisa que `.env.local` esté en la raíz y reinicia el servidor. Si indica `Ollama no responde`, revisa que `http://127.0.0.1:11434/api/tags` funcione en la misma máquina donde ejecutas Rumi. Si el modelo tiene otro nombre, cambia `NEXT_PUBLIC_OLLAMA_MODEL` por el nombre mostrado por `ollama list`.

Importante: si Ollama falla, Rumi usa automáticamente el mock local. Esto evita que la interfaz se rompa, pero puede ocultar el problema. Revisa siempre `Familia > Ajustes > Asistente IA` antes de probar generación real.

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

Si Ollama no está disponible, las operaciones de IA vuelven automáticamente al mock local. En la consola aparece una advertencia similar a `[Rumi IA] Ollama no disponible; usando mock.`

Para activar Gemma mediante Google AI Studio, usa `NEXT_PUBLIC_IA_PROVIDER=google` junto con `GOOGLE_API_KEY`. Opcionalmente puedes cambiar el modelo con `GOOGLE_AI_MODEL`.

## Proveedores de IA

Rumi puede cambiar entre los proveedores implementados mediante `NEXT_PUBLIC_IA_PROVIDER`. La selección se hace en tiempo de build; no se cambian credenciales desde el navegador.

| Proveedor | Uso principal | Modelo de ejemplo | Runtime / endpoint | Requiere internet | Costo de inferencia | Configuración |
| --- | --- | --- | --- | --- | --- | --- |
| `mock` | Demo, CI y producción segura por defecto | Respuestas simuladas | Reglas locales | No | Sin costo de IA | `NEXT_PUBLIC_IA_PROVIDER=mock` |
| `ollama` | Desarrollo local multiplataforma | `gemma4:e2b` | Ollama en `localhost:11434` | Solo para descargar el modelo | Sin costo de API; usa CPU/GPU local | `NEXT_PUBLIC_IA_PROVIDER=ollama` y `NEXT_PUBLIC_OLLAMA_MODEL=gemma4:e2b` |
| `mlx` | Desarrollo local en Mac Apple Silicon | `mlx-community/gemma-4-e4b-it-4bit` | `mlx-vlm.server` en `localhost:11435` | Solo para descargar el modelo | Sin costo de API; consume recursos de tu Mac | `NEXT_PUBLIC_IA_PROVIDER=mlx` |
| `google` | Cloud Run y producción | `gemma-4-26b-a4b-it` por defecto | Google AI Studio mediante `/api/ai` | Sí | Según cuotas y facturación de Google AI | `NEXT_PUBLIC_IA_PROVIDER=google` + `GOOGLE_API_KEY` |

### Recomendación

- Usa `mock` para demos y despliegues mientras no quieras consumir IA.
- Usa `mlx` en tu Mac si quieres probar Gemma 4 aprovechando Apple Silicon.
- Usa `ollama` si necesitas una opción local más portable.
- Usa `google` en Cloud Run cuando tengas una API key de Google AI Studio y controles de cuota/facturación configurados.

MLX y Ollama son proveedores locales: no funcionan dentro de Cloud Run porque dependen de procesos que viven en tu computadora. Cloud Run usa `mock` o Google AI.

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

### Google AI En Cloud Run Y Costos

Las llamadas a Google AI ocurren únicamente en las API routes server-side de Next.js. Nunca se expone `GOOGLE_API_KEY` al navegador. No uses el prefijo `NEXT_PUBLIC_` para esta variable.

Para activar Gemma en Cloud Run, configura estas variables de entorno:

```env
NEXT_PUBLIC_IA_PROVIDER=google
GOOGLE_API_KEY=tu-api-key-de-google-ai-studio
GOOGLE_AI_MODEL=gemma-4-26b-a4b-it
```

La API key debe configurarse como secreto en Cloud Run, no dentro de la imagen Docker ni del repositorio. Comprueba antes que el modelo elegido aparece disponible en Google AI Studio para esa key.

El workflow de GitHub no crea ni modifica secretos. `GOOGLE_API_KEY` debe configurarse una sola vez por un administrador del proyecto antes del primer deploy. Ejecuta estos comandos con una cuenta que tenga permisos para habilitar APIs, crear secretos y administrar IAM, no con `github-deployer`:

```bash
gcloud services enable secretmanager.googleapis.com \
  --project TU_PROYECTO

printf '%s' 'tu-api-key-de-google-ai-studio' | gcloud secrets create GOOGLE_API_KEY \
  --data-file=- \
  --project TU_PROYECTO
gcloud secrets add-iam-policy-binding GOOGLE_API_KEY \
  --project TU_PROYECTO \
  --member="serviceAccount:rumi-runtime@TU_PROYECTO.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Comprueba que el secreto existe antes de hacer push a `dev`:

```bash
gcloud secrets describe GOOGLE_API_KEY --project TU_PROYECTO
```

Si necesitas cambiar la API key, añade manualmente una nueva versión:

```bash
printf '%s' 'nueva-api-key' | gcloud secrets versions add GOOGLE_API_KEY \
  --data-file=- \
  --project TU_PROYECTO
```

El deploy solo referencia `GOOGLE_API_KEY:latest` desde Cloud Run; la key nunca se introduce en la imagen Docker ni en los logs de GitHub.

Google AI puede aplicar cuotas o cargos según el proyecto y el modelo. Configura límites y alertas en Google AI Studio/Google Cloud antes de activar producción. El panel de Rumi permite confirmar el proveedor y el modelo configurados, pero no reemplaza las alertas de facturación.

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
