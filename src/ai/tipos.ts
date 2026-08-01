export type PasoGenerado = { instruccion: string; pictogramaId: number };

export type TareaGenerada = { etiqueta: string; pasos: PasoGenerado[] };

// Las 4 operaciones del servicio de IA. Toda pantalla habla contra esta
// interfaz, nunca contra Gemma directamente (mismo contrato que la app
// móvil, ver mini-proyectos/rumi-demo/CLAUDE.md).
export interface ServicioIA {
  pictogramasAFrase(secuencia: { id: number; etiqueta: string }[]): Promise<string>;
  fraseAPictogramas(texto: string): Promise<number[]>;
  descomponerTarea(texto: string): Promise<TareaGenerada>;
  reformularPaso(instruccion: string): Promise<string>;
}
