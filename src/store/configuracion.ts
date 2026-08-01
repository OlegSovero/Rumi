import { create } from 'zustand';
import { guardarPreferencia, obtenerPreferencias, PREFERENCIAS_POR_DEFECTO, type Preferencias } from '../lib/db';

// Único estado global compartido entre pantallas: ajustes de familia.
// Todo lo demás (frase en construcción, paso activo, tab de familia...)
// es efímero y vive como estado local de cada pantalla.
type EstadoConfiguracion = Preferencias & {
  cargado: boolean;
  cargar: () => void;
  establecer: <K extends keyof Preferencias>(clave: K, valor: Preferencias[K]) => void;
};

export const useConfiguracionStore = create<EstadoConfiguracion>((set) => ({
  ...PREFERENCIAS_POR_DEFECTO,
  cargado: false,

  cargar: () => {
    const preferencias = obtenerPreferencias();
    set({ ...preferencias, cargado: true });
  },

  establecer: (clave, valor) => {
    set({ [clave]: valor } as Partial<EstadoConfiguracion>);
    guardarPreferencia(clave, valor);
  },
}));
