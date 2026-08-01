// Capa de datos local-first. En la app móvil esto es SQLite (expo-sqlite);
// en la web usamos localStorage como el mismo tipo de almacenamiento
// "vive entero en el dispositivo, sin backend" (ver mini-proyectos/rumi-demo/CLAUDE.md).
// Misma forma de repositorio (una función por operación) que la app móvil,
// solo que síncrona: no hay driver de base de datos que esperar.

import type { Tinte } from '../theme';
import { NUCLEO, PALABRAS_POR_TABLERO, POOL, TABLEROS, TAREAS_SEMILLA } from '../rumi-data';

const CLAVE_ALMACEN = 'rumi.db.v1';

export type FilaPictograma = {
  id: number;
  etiqueta: string;
  categoria: string;
  disponible: number;
  orden: number;
};

export type Paso = {
  id: number;
  orden: number;
  etiqueta: string;
  pictogramaId: number;
  ayuda: string;
};

export type Tarea = {
  id: string;
  etiqueta: string;
  tinte: Tinte;
  iconoId: number;
  orden: number;
  pasos: Paso[];
};

type Estado = {
  pictogramas: FilaPictograma[];
  tareas: Tarea[];
  tareasCompletadas: { tareaId: string; fecha: string }[];
  frases: { id: number; texto: string; fecha: string }[];
  usoPictogramaLog: { id: number; pictogramaId: number; fecha: string }[];
  preferencias: Record<string, string>;
};

function sembrar(): Estado {
  const pictogramas: FilaPictograma[] = [];
  let orden = 0;
  for (const palabra of NUCLEO) {
    pictogramas.push({ id: palabra.id, etiqueta: palabra.etiqueta, categoria: 'nucleo', disponible: 1, orden: orden++ });
  }
  for (const tablero of TABLEROS) {
    let ordenTablero = 0;
    for (const palabra of PALABRAS_POR_TABLERO[tablero.id]) {
      pictogramas.push({ id: palabra.id, etiqueta: palabra.etiqueta, categoria: tablero.id, disponible: 1, orden: ordenTablero++ });
    }
  }
  let ordenPool = 0;
  for (const palabra of POOL) {
    pictogramas.push({ id: palabra.id, etiqueta: palabra.etiqueta, categoria: 'pool', disponible: 1, orden: ordenPool++ });
  }

  const tareas: Tarea[] = TAREAS_SEMILLA.map((tarea, i) => ({
    id: tarea.id,
    etiqueta: tarea.etiqueta,
    tinte: tarea.tint,
    iconoId: tarea.iconoId,
    orden: i,
    pasos: tarea.pasos.map((p, j) => ({ id: j, orden: j, etiqueta: p.etiqueta, pictogramaId: p.pictogramaId, ayuda: p.ayuda })),
  }));

  return { pictogramas, tareas, tareasCompletadas: [], frases: [], usoPictogramaLog: [], preferencias: {} };
}

let cache: Estado | null = null;

function cargar(): Estado {
  if (cache) return cache;
  const crudo = localStorage.getItem(CLAVE_ALMACEN);
  if (!crudo) {
    cache = sembrar();
    guardar();
    return cache;
  }
  try {
    cache = JSON.parse(crudo) as Estado;
  } catch {
    cache = sembrar();
  }
  return cache;
}

function guardar(): void {
  if (!cache) return;
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(cache));
}

export function reiniciarDatos(): void {
  cache = sembrar();
  guardar();
}

// --- pictogramas ---

export function obtenerPictogramasPorCategoria(categoria: string): FilaPictograma[] {
  return cargar()
    .pictogramas.filter((p) => p.categoria === categoria)
    .sort((a, b) => a.orden - b.orden);
}

export function obtenerConteoTableros(): Record<string, number> {
  const conteo: Record<string, number> = {};
  for (const p of cargar().pictogramas) {
    if (p.categoria === 'nucleo' || p.categoria === 'pool') continue;
    conteo[p.categoria] = (conteo[p.categoria] ?? 0) + 1;
  }
  return conteo;
}

export function quitarDeTablero(pictogramaId: number): void {
  const estado = cargar();
  const p = estado.pictogramas.find((x) => x.id === pictogramaId);
  if (p) p.categoria = 'pool';
  guardar();
}

export function anadirATablero(categoria: string, pictogramaId: number): void {
  const estado = cargar();
  const p = estado.pictogramas.find((x) => x.id === pictogramaId);
  if (p) p.categoria = categoria;
  guardar();
}

export function marcarNoDisponible(pictogramaId: number, disponible: boolean): void {
  const estado = cargar();
  const p = estado.pictogramas.find((x) => x.id === pictogramaId);
  if (p) p.disponible = disponible ? 1 : 0;
  guardar();
}

export function registrarUsoPictograma(pictogramaId: number): void {
  const estado = cargar();
  estado.usoPictogramaLog.push({ id: estado.usoPictogramaLog.length, pictogramaId, fecha: new Date().toISOString() });
  guardar();
}

export type PictogramaMasUsado = { pictogramaId: number; etiqueta: string; total: number };

export function obtenerMasUsados(limite = 3, diasAtras = 7): PictogramaMasUsado[] {
  const estado = cargar();
  const desde = Date.now() - diasAtras * 24 * 60 * 60 * 1000;
  const conteos = new Map<number, number>();
  for (const registro of estado.usoPictogramaLog) {
    if (new Date(registro.fecha).getTime() < desde) continue;
    conteos.set(registro.pictogramaId, (conteos.get(registro.pictogramaId) ?? 0) + 1);
  }
  return [...conteos.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([pictogramaId, total]) => ({
      pictogramaId,
      etiqueta: estado.pictogramas.find((p) => p.id === pictogramaId)?.etiqueta ?? '',
      total,
    }));
}

function esHoy(fechaIso: string): boolean {
  const fecha = new Date(fechaIso);
  const hoy = new Date();
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  );
}

export function contarPalabrasHoy(): number {
  return cargar().usoPictogramaLog.filter((r) => esHoy(r.fecha)).length;
}

// --- tareas ---

export function obtenerTareas(): Tarea[] {
  return [...cargar().tareas].sort((a, b) => a.orden - b.orden);
}

export type TareaBorrador = {
  id: string;
  etiqueta: string;
  tinte: Tinte;
  iconoId: number;
  pasos: { etiqueta: string; pictogramaId: number; ayuda: string }[];
};

export function crearTareaConPasos(tarea: TareaBorrador): void {
  const estado = cargar();
  estado.tareas.push({
    id: tarea.id,
    etiqueta: tarea.etiqueta,
    tinte: tarea.tinte,
    iconoId: tarea.iconoId,
    orden: estado.tareas.length,
    pasos: tarea.pasos.map((p, i) => ({ id: i, orden: i, etiqueta: p.etiqueta, pictogramaId: p.pictogramaId, ayuda: p.ayuda })),
  });
  guardar();
}

export function actualizarTareaConPasos(tarea: TareaBorrador): void {
  const estado = cargar();
  const t = estado.tareas.find((x) => x.id === tarea.id);
  if (!t) return;
  t.etiqueta = tarea.etiqueta;
  t.tinte = tarea.tinte;
  t.iconoId = tarea.iconoId;
  t.pasos = tarea.pasos.map((p, i) => ({ id: i, orden: i, etiqueta: p.etiqueta, pictogramaId: p.pictogramaId, ayuda: p.ayuda }));
  guardar();
}

export function eliminarTarea(id: string): void {
  const estado = cargar();
  estado.tareas = estado.tareas.filter((t) => t.id !== id);
  guardar();
}

export function reordenarTareas(idsEnOrden: string[]): void {
  const estado = cargar();
  idsEnOrden.forEach((id, i) => {
    const t = estado.tareas.find((x) => x.id === id);
    if (t) t.orden = i;
  });
  guardar();
}

export function marcarTareaCompletada(tareaId: string): void {
  const estado = cargar();
  estado.tareasCompletadas.push({ tareaId, fecha: new Date().toISOString() });
  guardar();
}

// --- frases ---

export function registrarFrase(texto: string): void {
  const estado = cargar();
  estado.frases.push({ id: estado.frases.length, texto, fecha: new Date().toISOString() });
  guardar();
}

export function contarFrasesHoy(): number {
  return cargar().frases.filter((f) => esHoy(f.fecha)).length;
}

// --- preferencias ---

export type Preferencias = {
  childName: string;
  readAloud: boolean;
  reduceMotion: boolean;
  showText: boolean;
  lockBoards: boolean;
  onboardingCompleto: boolean;
};

export const PREFERENCIAS_POR_DEFECTO: Preferencias = {
  childName: '',
  readAloud: true,
  reduceMotion: false,
  showText: true,
  lockBoards: false,
  onboardingCompleto: false,
};

const CLAVES_BOOLEANAS: (keyof Preferencias)[] = ['readAloud', 'reduceMotion', 'showText', 'lockBoards', 'onboardingCompleto'];

export function obtenerPreferencias(): Preferencias {
  const mapa = cargar().preferencias;
  const resultado: Preferencias = { ...PREFERENCIAS_POR_DEFECTO };
  for (const clave of Object.keys(resultado) as (keyof Preferencias)[]) {
    if (!(clave in mapa)) continue;
    if (CLAVES_BOOLEANAS.includes(clave)) {
      (resultado[clave] as boolean) = mapa[clave] === '1';
    } else {
      (resultado[clave] as string) = mapa[clave];
    }
  }
  return resultado;
}

export function guardarPreferencia<K extends keyof Preferencias>(clave: K, valor: Preferencias[K]): void {
  const estado = cargar();
  estado.preferencias[clave] = typeof valor === 'boolean' ? (valor ? '1' : '0') : String(valor);
  guardar();
}
