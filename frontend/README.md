# Rumi — frontend (Next.js)

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Construido en **Next.js** (App Router + TypeScript) en vez de Vite/CRA para poder tener un mini backend propio (API routes, carpeta `src/app/api/`) dentro del mismo proyecto.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000, con Turbopack
```

```bash
npm run build    # build de producción
npm run start    # sirve el build de producción
npm run lint     # ESLint
```

## Stack

- **Next.js 16** (App Router), React 19, TypeScript.
- **Enrutamiento**: archivos en `src/app/*/page.tsx` (`/`, `/onboarding`, `/gate`, `/nino`, `/familia`). `src/app/page.tsx` decide a dónde redirigir según si el onboarding ya se completó (leído de `localStorage` vía Zustand).
- **Fuentes**: Fredoka + Nunito cargadas con `next/font/google` en `src/app/layout.tsx` — se auto-hospedan en el build, sin request a Google en runtime.
- **Estado de pantallas**: cada pantalla en `src/screens/` es un Client Component (`'use client'`); las páginas de `src/app/` son Server Components delgados que solo la renderizan.
- **Datos**: `localStorage` (`src/lib/db.ts`), mismo shape de repositorio que tenía SQLite en la app móvil original.
- **Voz**: Web Speech API (`src/lib/voz.ts`).
- **IA**: interfaz de 4 operaciones (`src/ai/tipos.ts`) con una implementación simulada (`src/ai/servicioIAMock.ts`) — reglas/heurísticas, sin modelo real, para no acoplar la UI a que el backend esté listo.
- **Reordenar tareas**: drag-and-drop con `@dnd-kit` (mouse, touch y teclado).

## Qué incluye

- **Modo niño**: tablero de comunicación (núcleo de palabras + categorías por tinte Fitzgerald), y tareas paso a paso con refuerzo positivo y botón "no entiendo" (hint de "Gemma").
- **Modo familia**: editor de tableros, creación de tareas con IA simulada (se pueden reordenar arrastrándolas), progreso (mensajes/palabras del día, más usados), y ajustes.
- Gesto "mantén pulsado" para entrar a modo familia desde la pantalla de selección.

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
- Diseño y contenido portados del handoff en `mini-proyectos/rumi-demo/design_handoff_rumi_app/`.
