export type PasoGenerado = { instruccion: string; pictogramaId: number };

export type TareaGenerada = { etiqueta: string; pasos: PasoGenerado[] };

export type EstadoInterpretacion = 'complete' | 'ambiguous' | 'incomplete';

export type InterpretacionComunicacion = {
  literal: string;
  status: EstadoInterpretacion;
  interpretation: string | null;
  confidence: number;
  alternatives: string[];
  suggestions: string[];
};

export type PasoPlan = { action: string; text: string; queries: string[] };
export type PlanTarea = { taskName: string; steps: PasoPlan[] };

// Las 4 operaciones del servicio de IA. Toda pantalla habla contra esta
// interfaz, nunca contra Gemma directamente (mismo contrato que la app
// móvil, ver mini-proyectos/rumi-demo/CLAUDE.md).
export interface ServicioIA {
  pictogramasAFrase(secuencia: { id: number; etiqueta: string }[]): Promise<InterpretacionComunicacion>;
  fraseAPictogramas(texto: string): Promise<number[]>;
  descomponerTarea(texto: string): Promise<TareaGenerada>;
  reformularPaso(instruccion: string): Promise<string>;
}
