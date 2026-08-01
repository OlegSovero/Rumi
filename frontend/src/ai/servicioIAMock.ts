import type { ServicioIA, TareaGenerada } from './tipos';
import { PICTOGRAMA_POR_DEFECTO, RECETAS_TAREA, quitarAcentos, sugerirPictograma } from './vocabulario';

// Implementaci├│n simulada: respuestas pre-generadas / por reglas, sin modelo.
// Portada 1:1 de mini-proyectos/rumi-demo/src/services/ia/servicioIAMock.ts.
// La demora artificial imita la latencia real de una inferencia on-device,
// as├¡ la UI se comporta igual que con la implementaci├│n real de Gemma.

const LATENCIA_MS = 800;

function esperar<T>(valor: T, ms = LATENCIA_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

function capitalizar(texto: string): string {
  const t = texto.trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

const SEPARADOR_PASOS = /\s*(?:,|;| y luego | y | luego | despu[e├⌐]s )\s*/i;
const PALABRAS_VACIAS = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'a', 'que', 'y', 'en', 'su']);

// Palabras sueltas que suenan m├ís naturales como exclamaci├│n corta que como
// oraci├│n plana con punto (p. ej. "┬íGracias!" en vez de "Gracias.").
const PALABRAS_EXCLAMATIVAS = new Set(['gracias', 'ayuda', 'no']);

// Simula lo que Gemma har├¡a con la secuencia de pictogramas: no es un simple
// join, arma una oraci├│n articulada (may├║scula inicial + puntuaci├│n).
function articularFrase(etiquetas: string[]): string {
  if (etiquetas.length === 0) return '';
  if (etiquetas.length === 1) {
    const palabra = capitalizar(etiquetas[0]);
    return PALABRAS_EXCLAMATIVAS.has(quitarAcentos(etiquetas[0])) ? `┬í${palabra}!` : `${palabra}.`;
  }
  const frase = capitalizar(etiquetas.join(' ').replace(/\s+/g, ' ').trim());
  return /[.!?]$/.test(frase) ? frase : `${frase}.`;
}

function generarPasos(texto: string): TareaGenerada {
  const t = quitarAcentos(texto);

  for (const receta of RECETAS_TAREA) {
    if (receta.coincidencias.some((c) => t.includes(quitarAcentos(c)))) {
      return {
        etiqueta: receta.etiqueta,
        pasos: receta.pasos.map((p) => ({ instruccion: p.etiqueta, pictogramaId: p.pictogramaId })),
      };
    }
  }

  const partes = texto
    .split(SEPARADOR_PASOS)
    .map((p) => p.trim())
    .filter(Boolean);

  if (partes.length >= 2) {
    return {
      etiqueta: capitalizar(texto),
      pasos: partes.map((p) => ({ instruccion: p, pictogramaId: sugerirPictograma(p) })),
    };
  }

  return {
    etiqueta: capitalizar(texto),
    pasos: [
      { instruccion: texto.trim(), pictogramaId: sugerirPictograma(texto) },
      { instruccion: 'guardar y terminar', pictogramaId: PICTOGRAMA_POR_DEFECTO },
    ],
  };
}

export const servicioIAMock: ServicioIA = {
  async pictogramasAFrase(secuencia) {
    const etiquetas = secuencia.map((it) => it.etiqueta.trim()).filter(Boolean);
    return esperar(articularFrase(etiquetas));
  },

  async fraseAPictogramas(texto) {
    const palabras = quitarAcentos(texto)
      .split(/\s+/)
      .map((p) => p.replace(/[.,;!┬í┬┐?]/g, ''))
      .filter((p) => p.length >= 3 && !PALABRAS_VACIAS.has(p));

    return esperar(palabras.map((p) => sugerirPictograma(p)));
  },

  async descomponerTarea(texto) {
    return esperar(generarPasos(texto));
  },

  async reformularPaso(instruccion) {
    return esperar(`Vamos a ${instruccion.trim().toLowerCase()}. T├║ puedes.`, 400);
  },
};

// El export can├│nico vive en ./index.ts (elige Ollama o mock).
