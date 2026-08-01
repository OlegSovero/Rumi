# Rumi

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Presentado para LimaGDG — Grupo: Los caza bombitas.

## Esta versión: web

Esta es una versión **web** de Rumi, pensada para que la demo del hackathon sea rápida de mostrar y explicar (se abre en cualquier navegador, sin instalar un development build en un teléfono). Es un puerto 1:1 de la app móvil construida en `mini-proyectos/rumi-demo` (Expo + React Native): mismo diseño, mismo vocabulario, misma lógica del servicio de IA.

Diferencias frente a la app móvil, todas por ser una demo web:

| Móvil (rumi-demo) | Web (este repo) |
|---|---|
| `expo-sqlite` | `localStorage` |
| `expo-speech` | Web Speech API (`speechSynthesis`) |
| `expo-router` (stacks nativos) | `react-router-dom` (`HashRouter`) |
| `phosphor-react-native` | `@phosphor-icons/react` |
| Pictogramas empaquetados como assets RN | Pictogramas servidos desde `public/pictograms` |

## IA: Gemma 4 vía Ollama (local / offline)

En la rama `feature/gemma4-ollama` el servicio de IA habla con **Ollama en tu máquina** (`localhost:11434`) detrás de la misma interfaz de 4 operaciones. Si Ollama no responde, cae al mock automáticamente.

### Requisitos rápidos (hackathon)

1. Tener [Ollama](https://ollama.com) abierto.
2. Modelo Gemma (recomendado para el evento):

```bash
ollama pull gemma4
# o, si tu PC es más limitado:
ollama pull gemma4:e2b
```

Si ya tienes otro Gemma local (p. ej. `gemma3:4b`), la app lo detecta y lo usa hasta que descargues `gemma4`.

3. Arrancar la web:

```bash
npm install
npm run dev
```

Abre la URL de Vite (`http://localhost:5173`). En **Familia → Ajustes** verás el estado de conexión a Ollama.

### Variables opcionales

Copia `.env.example` a `.env` si quieres forzar modelo o el mock:

| Variable | Default | Uso |
|---|---|---|
| `VITE_IA_PROVIDER` | `ollama` | `ollama` o `mock` |
| `VITE_OLLAMA_MODEL` | `gemma4` | Tag preferido (`gemma4`, `gemma4:e4b`, `gemma3:4b`, …) |

Vite hace proxy de `/api/ollama` → `http://127.0.0.1:11434` para evitar CORS.

```bash
npm run build   # build de producción a dist/
npm run preview # sirve el build de producción localmente
```

> `npm run preview` no incluye el proxy de Vite: para demo con Gemma usa siempre `npm run dev`.

## Hackathon Google: ¿Ollama o Google Cloud?

**Recomendación para demo en vivo (esta rama):** Ollama local.

- Funciona **offline** (ideal si el Wi‑Fi del venue falla).
- Cero facturación / sin keys.
- Encaja con el mensaje de privacidad de Rumi (datos del niño no salen del dispositivo).
- Setup en minutos si ya tienes Ollama.

**Cuándo subir a Google Cloud / Vertex AI (rama futura opcional):**

- Quieres un modelo **más grande** (`gemma-4` 26B/31B) sin GPU local potente.
- Demo con jurado que valore “stack Google” (Vertex AI Model Garden + Gemma).
- Necesitas latencia estable en laptops débiles.

En Vertex AI: Model Garden → Gemma 4 → endpoint → misma interfaz `ServicioIA` cambiando solo el cliente HTTP (API key / ADC). Para el pitch: *“hoy offline con Ollama; listo para Vertex en producción”*.

## Qué incluye

- **Modo niño**: tablero de comunicación (núcleo de palabras + categorías por tinte Fitzgerald), y tareas paso a paso con refuerzo positivo y botón "no entiendo" (hint de Gemma).
- **Modo familia**: editor de tableros, creación de tareas con IA (escribes la tarea, Gemma genera pasos + pictogramas), progreso, y ajustes con estado Ollama.
- Gesto "mantén pulsado" para entrar a modo familia desde la pantalla de selección.
- Datos persistidos en `localStorage` del navegador (por dispositivo, sin sincronización).

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
- Diseño y contenido portados del handoff en `mini-proyectos/rumi-demo/design_handoff_rumi_app/`.
