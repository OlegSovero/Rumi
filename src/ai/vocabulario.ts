// Vocabulario y recetas para la implementación simulada del servicio de IA.
// Portado 1:1 de mini-proyectos/rumi-demo/src/services/ia/vocabulario.ts.

export type EntradaVocabulario = { id: number; palabrasClave: string[] };

export const VOCABULARIO: EntradaVocabulario[] = [
  { id: 8367, palabrasClave: ['sabana', 'cama'] },
  { id: 2250, palabrasClave: ['almohada'] },
  { id: 2459, palabrasClave: ['manta', 'edredon'] },
  { id: 5481, palabrasClave: ['hacer la cama', 'tender'] },
  { id: 2694, palabrasClave: ['cepillo'] },
  { id: 2737, palabrasClave: ['dientes', 'diente', 'cepillar'] },
  { id: 8560, palabrasClave: ['enjuagar', 'boca'] },
  { id: 9813, palabrasClave: ['juguete', 'juguetes'] },
  { id: 5935, palabrasClave: ['caja', 'cajon'] },
  { id: 5514, palabrasClave: ['guardar', 'ordenar', 'recoger'] },
  { id: 2248, palabrasClave: ['agua', 'beber'] },
  { id: 2259, palabrasClave: ['comida', 'comer', 'desayuno', 'cena', 'almuerzo'] },
  { id: 2517, palabrasClave: ['perro', 'mascota'] },
  { id: 2522, palabrasClave: ['dormir', 'siesta', 'acostarse'] },
  { id: 2271, palabrasClave: ['bañarse', 'baño', 'ducha', 'ducharse', 'lavarse'] },
  { id: 2256, palabrasClave: ['parque', 'salir'] },
  { id: 2255, palabrasClave: ['familia'] },
  { id: 2523, palabrasClave: ['leche'] },
  { id: 2277, palabrasClave: ['libro', 'leer', 'cuento'] },
  { id: 2296, palabrasClave: ['casa'] },
  { id: 2622, palabrasClave: ['zapatos', 'zapato', 'zapatillas'] },
  { id: 2309, palabrasClave: ['camiseta', 'camisa', 'ropa', 'vestirse'] },
  { id: 2565, palabrasClave: ['pantalon', 'pantalones'] },
  { id: 2298, palabrasClave: ['calcetines', 'calcetin', 'medias'] },
  { id: 2475, palabrasClave: ['mochila'] },
  { id: 2610, palabrasClave: ['vaso'] },
  { id: 2593, palabrasClave: ['toalla', 'secar', 'secarse'] },
  { id: 2964, palabrasClave: ['jabon', 'manos'] },
  { id: 2414, palabrasClave: ['grifo', 'lavar'] },
  { id: 11538, palabrasClave: ['querer', 'quiero'] },
  { id: 19524, palabrasClave: ['ayuda', 'ayudar'] },
  { id: 2269, palabrasClave: ['pelota', 'jugar'] },
  { id: 2745, palabrasClave: ['escoba', 'barrer', 'limpiar'] },
];

export type PasoReceta = { etiqueta: string; pictogramaId: number };
export type RecetaTarea = { coincidencias: string[]; etiqueta: string; pasos: PasoReceta[] };

export const RECETAS_TAREA: RecetaTarea[] = [
  {
    coincidencias: ['recoger', 'juguetes', 'recoger los juguetes', 'ordenar los juguetes'],
    etiqueta: 'Recoger los juguetes',
    pasos: [
      { etiqueta: 'recoger los juguetes', pictogramaId: 9813 },
      { etiqueta: 'ponerlos en la caja', pictogramaId: 5935 },
      { etiqueta: 'guardar la caja', pictogramaId: 5514 },
    ],
  },
  {
    coincidencias: ['tender la cama', 'hacer la cama', 'cama'],
    etiqueta: 'Tender la cama',
    pasos: [
      { etiqueta: 'estirar la sábana', pictogramaId: 8367 },
      { etiqueta: 'poner la almohada', pictogramaId: 2250 },
      { etiqueta: 'poner la manta', pictogramaId: 2459 },
    ],
  },
  {
    coincidencias: ['lavarse los dientes', 'cepillar los dientes', 'dientes', 'cepillar'],
    etiqueta: 'Lavarse los dientes',
    pasos: [
      { etiqueta: 'coger el cepillo', pictogramaId: 2694 },
      { etiqueta: 'cepillar los dientes', pictogramaId: 2737 },
      { etiqueta: 'enjuagar la boca', pictogramaId: 8560 },
    ],
  },
  {
    coincidencias: ['vestirse', 'ponerse la ropa', 'vestir'],
    etiqueta: 'Vestirse solo',
    pasos: [
      { etiqueta: 'ponerse la camiseta', pictogramaId: 2309 },
      { etiqueta: 'ponerse el pantalón', pictogramaId: 2565 },
      { etiqueta: 'ponerse los calcetines', pictogramaId: 2298 },
      { etiqueta: 'ponerse los zapatos', pictogramaId: 2622 },
    ],
  },
  {
    coincidencias: ['lavarse las manos', 'lavar las manos', 'manos'],
    etiqueta: 'Lavarse las manos',
    pasos: [
      { etiqueta: 'abrir el grifo', pictogramaId: 2414 },
      { etiqueta: 'usar jabón', pictogramaId: 2964 },
      { etiqueta: 'secarse las manos', pictogramaId: 2593 },
    ],
  },
  {
    coincidencias: ['preparar la mochila', 'mochila'],
    etiqueta: 'Preparar la mochila',
    pasos: [
      { etiqueta: 'guardar el libro', pictogramaId: 2277 },
      { etiqueta: 'cerrar la mochila', pictogramaId: 2475 },
    ],
  },
  {
    coincidencias: ['prepararse para dormir', 'ir a dormir', 'acostarse', 'dormir'],
    etiqueta: 'Prepararse para dormir',
    pasos: [
      { etiqueta: 'bañarse', pictogramaId: 2271 },
      { etiqueta: 'cepillar los dientes', pictogramaId: 2737 },
      { etiqueta: 'ir a la cama', pictogramaId: 2522 },
    ],
  },
  {
    coincidencias: ['bañarse', 'ducharse', 'baño', 'ducha'],
    etiqueta: 'Bañarse',
    pasos: [
      { etiqueta: 'abrir el grifo', pictogramaId: 2414 },
      { etiqueta: 'usar jabón', pictogramaId: 2964 },
      { etiqueta: 'secarse con la toalla', pictogramaId: 2593 },
    ],
  },
];

export const PICTOGRAMA_POR_DEFECTO = 5514;

export function quitarAcentos(texto: string): string {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function sugerirPictograma(texto: string): number {
  const t = quitarAcentos(texto);
  let mejor = PICTOGRAMA_POR_DEFECTO;
  let mejorLargo = 0;
  for (const entrada of VOCABULARIO) {
    for (const clave of entrada.palabrasClave) {
      const k = quitarAcentos(clave);
      if (t.includes(k) && k.length > mejorLargo) {
        mejor = entrada.id;
        mejorLargo = k.length;
      }
    }
  }
  return mejor;
}
