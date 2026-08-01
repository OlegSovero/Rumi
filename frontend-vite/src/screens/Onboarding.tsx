import { Check } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useConfiguracionStore } from '../store/configuracion';

export function Onboarding() {
  const navigate = useNavigate();
  const establecer = useConfiguracionStore((s) => s.establecer);
  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState('');

  const siguiente = () => {
    if (paso >= 2) {
      establecer('childName', nombre.trim() || 'tu niño');
      establecer('onboardingCompleto', true);
      navigate('/gate', { replace: true });
      return;
    }
    setPaso((p) => p + 1);
  };

  return (
    <div className="onboarding-pantalla">
      <div className="onboarding-contenido">
        {paso === 0 && (
          <div className="onboarding-centro">
            <span className="onboarding-marca">
              Rumi<span className="punto">.</span>
            </span>
            <p className="onboarding-tagline">
              Una forma tranquila de decir lo que quieres, tocando pictogramas.
            </p>
          </div>
        )}

        {paso === 1 && (
          <div className="onboarding-centro">
            <span className="onboarding-titulo">¿Cómo se llama?</span>
            <p className="onboarding-ayuda">Así Rumi puede saludarle con su nombre.</p>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="onboarding-input"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && siguiente()}
            />
          </div>
        )}

        {paso === 2 && (
          <div className="onboarding-centro">
            <div className="onboarding-circulo-exito">
              <Check size={48} color="#7BB177" weight="fill" />
            </div>
            <span className="onboarding-titulo">Todo listo</span>
            <p className="onboarding-parrafo">
              Todo funciona sin internet. Puedes empezar cuando quieras.
            </p>
          </div>
        )}

        <Button variant="primary" size="lg" fullWidth onClick={siguiente}>
          {paso === 0 ? 'Empezar' : paso === 1 ? 'Continuar' : 'Entrar'}
        </Button>
      </div>
    </div>
  );
}
