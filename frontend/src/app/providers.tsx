'use client';

import { useEffect } from 'react';
import { useConfiguracionStore } from '../store/configuracion';

// Envuelve toda la app: carga preferencias desde localStorage antes de
// pintar cualquier pantalla (mismo gate que App.tsx tenía en la versión Vite),
// y aplica el contenedor .app-shell.
export function Providers({ children }: { children: React.ReactNode }) {
  const cargar = useConfiguracionStore((s) => s.cargar);
  const cargado = useConfiguracionStore((s) => s.cargado);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return <div className="app-shell">{cargado ? children : null}</div>;
}
