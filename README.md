# Rumi

Comunicador aumentativo y alternativo (CAA) con pictogramas para niños autistas no verbales. Digitaliza el método PECS y le da al niño una forma de comunicarse y de seguir sus rutinas con autonomía.

Presentado para LimaGDG — Grupo: Los caza bombitas.

## Estructura del repo

- [`frontend/`](frontend) — la app web, en **Next.js** (App Router + TypeScript). Es el frontend vigente; incluye su propio README con cómo correrla.
- [`frontend-vite/`](frontend-vite) — implementación original (Vite + React + `react-router-dom`), conservada como referencia. Mismo diseño y lógica, framework distinto.
- [`backend/`](backend) — orquestador (Express + TypeScript) que hace de puente hacia Vertex AI (Gemini) y la API de ARASAAC. Ver [`backend/README.md`](backend/README.md).

Se migró de Vite a Next.js para poder tener un mini backend propio (API routes) dentro del mismo proyecto de frontend, sin depender de un segundo servidor para eso. Hoy el frontend sigue corriendo con un servicio de IA simulado (`servicioIAMock`), sin llamar a ningún backend en tiempo de ejecución.

## Cómo correrlo

```bash
cd frontend
npm install
npm run dev
```

Ver [`frontend/README.md`](frontend/README.md) para más detalle.

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
