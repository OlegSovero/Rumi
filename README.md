# Rumi

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Presentado para LimaGDG — Grupo: Los caza bombitas.

## Versión web

Demo web para el hackathon: misma experiencia que la app móvil (`mini-proyectos/rumi-demo`), abierta en cualquier navegador.

### Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Rutas | react-router-dom (HashRouter) |
| Estado | Zustand |
| Persistencia | localStorage |
| Voz | Web Speech API |
| IA | Gemma 4 vía Ollama (local, offline) |

Arquitectura sin servidor de aplicación propio: el frontend habla con Ollama en `localhost:11434` a través del proxy de Vite. No requiere API key en la demo local.

| Móvil (rumi-demo) | Web |
|---|---|
| expo-sqlite | localStorage |
| expo-speech | Web Speech API |
| expo-router | react-router-dom |
| phosphor-react-native | @phosphor-icons/react |
| Assets RN | `public/pictograms` |

## IA: Gemma 4 (Ollama)

El servicio de IA implementa cuatro operaciones detrás de una interfaz compartida. Si Ollama no está disponible, se usa un fallback por reglas.

| Flujo | Qué hace Gemma |
|---|---|
| Familia → Generar / Guardar tarea | Descompone la tarea en pasos con pictogramas y escribe las ayudas de “No entiendo” |
| Niño → Hablar (altavoz) | Articula la secuencia de pictogramas en una frase natural y la lee en voz alta |

### Arranque

```bash
ollama pull gemma4:e2b   # o gemma4 / gemma4:e4b según hardware
npm install
npm run dev
```

Abre `http://localhost:5173`. En Familia → Ajustes se muestra el estado de conexión al modelo.

### Configuración (opcional)

Copia `.env.example` a `.env`:

| Variable | Default | Descripción |
|---|---|---|
| `VITE_IA_PROVIDER` | `ollama` | `ollama` o `mock` |
| `VITE_OLLAMA_MODEL` | `gemma4` | Tag preferido (`gemma4:e2b`, `gemma3:4b`, …) |

```bash
npm run build
npm run preview
```

Para demos con Gemma usa `npm run dev` (incluye el proxy a Ollama).

## Ollama local y Vertex AI

**Demo en vivo:** Ollama local — offline, sin facturación, privacidad del dispositivo.

**Escala / jurado Google Cloud:** Vertex AI Model Garden (Gemma 4). Misma interfaz `ServicioIA`; solo cambia el cliente HTTP. Pitch: *offline con Ollama hoy; listo para Vertex en producción*.

## Funcionalidades

- Modo niño: tablero CAA, articulación de frase con Gemma, tareas paso a paso con refuerzo y “No entiendo”.
- Modo familia: editor de tableros, tareas con IA, progreso y ajustes.
- Acceso a modo familia con gesto “mantén pulsado”.
- Datos por dispositivo en `localStorage`.

## Créditos y licencias

- **Pictogramas:** [ARASAAC](https://arasaac.org) (CC BY-NC-SA), Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
- Diseño portado del handoff en `mini-proyectos/rumi-demo/design_handoff_rumi_app/`.
