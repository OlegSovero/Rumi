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

Para activar Vertex AI, usa `NEXT_PUBLIC_IA_PROVIDER=vertex` junto con `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION` y `VERTEX_AI_MODEL`.

## Créditos y licencias

- **Pictogramas**: [ARASAAC](https://arasaac.org) (CC BY-NC-SA), propiedad del Gobierno de Aragón, autor Sergio Palao. Uso no comercial.
