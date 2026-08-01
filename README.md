# Rumi

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Presentado para LimaGDG — Grupo: Los caza bombitas.

## Esta versión: web

Esta es una versión **web** de Rumi, pensada para que la demo del hackathon sea rápida de mostrar y explicar (se abre en cualquier navegador, sin instalar un development build en un teléfono). Es un puerto 1:1 de la app móvil construida en `mini-proyectos/rumi-demo` (Expo + React Native): mismo diseño, mismo vocabulario, misma lógica del servicio de IA simulado.

Diferencias frente a la app móvil, todas por ser una demo web:

| Móvil (rumi-demo) | Web (este repo) |
|---|---|
| `expo-sqlite` | `localStorage` |
| `expo-speech` | Web Speech API (`speechSynthesis`) |
| `expo-router` (stacks nativos) | `react-router-dom` (`HashRouter`) |
| `phosphor-react-native` | `@phosphor-icons/react` |
| Pictogramas empaquetados como assets RN | Pictogramas servidos desde `public/pictograms` |

El servicio de IA sigue siendo **simulado** (reglas/heurísticas, sin modelo real) detrás de la misma interfaz de 4 operaciones — igual que en la app móvil, para no acoplar la demo a que Gemma esté lista.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`). Todo corre en el navegador: no hay backend, no hay llamadas de red en tiempo de ejecución (los pictogramas y las fuentes se cargan una vez).

```bash
npm run build   # build de producción a dist/
npm run preview # sirve el build de producción localmente
```

## Qué incluye

- **Modo niño**: tablero de comunicación (núcleo de palabras + categorías por tinte Fitzgerald), y tareas paso a paso con refuerzo positivo y botón "no entiendo" (hint de "Gemma").
- **Modo familia**: editor de tableros, creación de tareas con IA simulada (escribes la tarea, se generan los pasos con pictogramas), progreso (mensajes/palabras del día, más usados), y ajustes.
- Gesto "mantén pulsado" para entrar a modo familia desde la pantalla de selección.
- Datos persistidos en `localStorage` del navegador (por dispositivo, sin sincronización).

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
- Diseño y contenido portados del handoff en `mini-proyectos/rumi-demo/design_handoff_rumi_app/`.
