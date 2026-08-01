// Contenido y vocabulario de Rumi, portado 1:1 del handoff de diseño
// (mini-proyectos/rumi-demo/src/constants/rumi-data.ts). Ids ARASAAC verificados.

import type { Tinte } from './theme';

export type PalabraSemilla = { id: number; etiqueta: string };

export const NUCLEO: (PalabraSemilla & { tint: Tinte })[] = [
  { id: 6632, etiqueta: 'yo', tint: 'people' },
  { id: 11538, etiqueta: 'quiero', tint: 'actions' },
  { id: 3220, etiqueta: 'más', tint: 'things' },
  { id: 19524, etiqueta: 'ayuda', tint: 'actions' },
  { id: 5526, etiqueta: 'no', tint: 'things' },
  { id: 8129, etiqueta: 'gracias', tint: 'people' },
];

export type TableroMeta = { id: string; etiqueta: string; tint: Tinte; iconoId: number };

export const TABLEROS: TableroMeta[] = [
  { id: 'comida', etiqueta: 'Comida', tint: 'food', iconoId: 2259 },
  { id: 'jugar', etiqueta: 'Jugar', tint: 'actions', iconoId: 2269 },
  { id: 'animales', etiqueta: 'Animales', tint: 'places', iconoId: 2517 },
  { id: 'rutina', etiqueta: 'Rutina', tint: 'things', iconoId: 2522 },
];

export const PALABRAS_POR_TABLERO: Record<string, PalabraSemilla[]> = {
  comida: [
    { id: 2248, etiqueta: 'agua' },
    { id: 2259, etiqueta: 'comida' },
    { id: 2281, etiqueta: 'bocadillo' },
    { id: 2502, etiqueta: 'tarta' },
    { id: 2503, etiqueta: 'patata' },
    { id: 2505, etiqueta: 'pasta' },
  ],
  jugar: [
    { id: 2269, etiqueta: 'pelota' },
    { id: 2514, etiqueta: 'tenis' },
    { id: 2506, etiqueta: 'patines' },
    { id: 2507, etiqueta: 'monopatín' },
    { id: 2521, etiqueta: 'piano' },
    { id: 2283, etiqueta: 'bolos' },
  ],
  animales: [
    { id: 2517, etiqueta: 'perro' },
    { id: 2294, etiqueta: 'caballo' },
    { id: 2295, etiqueta: 'cabra' },
    { id: 2291, etiqueta: 'burro' },
    { id: 2268, etiqueta: 'ballena' },
    { id: 2257, etiqueta: 'ardilla' },
  ],
  rutina: [
    { id: 2271, etiqueta: 'bañarse' },
    { id: 2522, etiqueta: 'dormir' },
    { id: 2256, etiqueta: 'parque' },
    { id: 2255, etiqueta: 'familia' },
  ],
};

// Sugerencias que la familia puede añadir a cualquier tablero desde el editor.
export const POOL: PalabraSemilla[] = [
  { id: 2253, etiqueta: 'gato' },
  { id: 2270, etiqueta: 'muñeca' },
  { id: 2277, etiqueta: 'libro' },
  { id: 2288, etiqueta: 'coche' },
  { id: 2296, etiqueta: 'casa' },
  { id: 2523, etiqueta: 'leche' },
];

export type PasoSemilla = { etiqueta: string; pictogramaId: number; ayuda: string };
export type TareaSemilla = {
  id: string;
  etiqueta: string;
  tint: Tinte;
  iconoId: number;
  pasos: PasoSemilla[];
};

export const TAREAS_SEMILLA: TareaSemilla[] = [
  {
    id: 'cama',
    etiqueta: 'Tender la cama',
    tint: 'things',
    iconoId: 5481,
    pasos: [
      { etiqueta: 'estirar la sábana', pictogramaId: 8367, ayuda: 'Primero estira la sábana con las manos hasta que quede plana sobre la cama.' },
      { etiqueta: 'poner la almohada', pictogramaId: 2250, ayuda: 'Ahora coloca la almohada arriba, donde apoyas la cabeza.' },
      { etiqueta: 'poner la manta', pictogramaId: 2459, ayuda: 'Por último cubre toda la cama con la manta. ¡Ya casi!' },
    ],
  },
  {
    id: 'dientes',
    etiqueta: 'Lavarse los dientes',
    tint: 'places',
    iconoId: 2694,
    pasos: [
      { etiqueta: 'coger el cepillo', pictogramaId: 2694, ayuda: 'Coge tu cepillo de dientes con la mano.' },
      { etiqueta: 'cepillar los dientes', pictogramaId: 2737, ayuda: 'Cepilla despacio, arriba y abajo, sin prisa.' },
      { etiqueta: 'enjuagar la boca', pictogramaId: 8560, ayuda: 'Enjuaga la boca con un poco de agua y escupe.' },
    ],
  },
  {
    id: 'juguetes',
    etiqueta: 'Guardar los juguetes',
    tint: 'feelings',
    iconoId: 9813,
    pasos: [
      { etiqueta: 'recoger los juguetes', pictogramaId: 9813, ayuda: 'Recoge los juguetes del suelo, uno a uno, sin apurarte.' },
      { etiqueta: 'ponerlos en la caja', pictogramaId: 5935, ayuda: 'Pon cada juguete dentro de la caja.' },
      { etiqueta: 'guardar la caja', pictogramaId: 5514, ayuda: 'Deja la caja en su sitio. ¡Muy bien!' },
    ],
  },
];

export const TINTES_TAREA: Tinte[] = ['things', 'places', 'feelings', 'food', 'actions', 'people'];
