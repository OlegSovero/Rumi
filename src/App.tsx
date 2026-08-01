import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Gate } from './screens/Gate';
import { Onboarding } from './screens/Onboarding';
import { PantallaFamilia } from './screens/familia/PantallaFamilia';
import { PantallaNino } from './screens/nino/PantallaNino';
import { useConfiguracionStore } from './store/configuracion';

function Inicio() {
  const onboardingCompleto = useConfiguracionStore((s) => s.onboardingCompleto);
  return <Navigate to={onboardingCompleto ? '/gate' : '/onboarding'} replace />;
}

function App() {
  const cargar = useConfiguracionStore((s) => s.cargar);
  const cargado = useConfiguracionStore((s) => s.cargado);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (!cargado) return null;

  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/gate" element={<Gate />} />
          <Route path="/nino" element={<PantallaNino />} />
          <Route path="/familia" element={<PantallaFamilia />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
