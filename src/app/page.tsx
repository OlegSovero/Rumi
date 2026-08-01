'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useConfiguracionStore } from '../store/configuracion';

// Equivalente al "Inicio" de la versión Vite (App.tsx): decide a dónde
// mandar según si el onboarding ya se completó. La decisión depende de
// localStorage, así que tiene que resolverse en el cliente, no en el server.
export default function Home() {
  const router = useRouter();
  const cargado = useConfiguracionStore((s) => s.cargado);
  const onboardingCompleto = useConfiguracionStore((s) => s.onboardingCompleto);

  useEffect(() => {
    if (!cargado) return;
    router.replace(onboardingCompleto ? '/gate' : '/onboarding');
  }, [cargado, onboardingCompleto, router]);

  return null;
}
