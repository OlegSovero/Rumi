import { HandHeart, House } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DURACION_MANTENER_MS = 900;

export function Gate() {
  const navigate = useNavigate();
  const [ancho, setAncho] = useState(0);
  const [conTransicion, setConTransicion] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entrarComoNino = () => navigate('/nino', { replace: true });

  const empezarMantener = () => {
    setConTransicion(true);
    // fuerza reflow para que la transición de 0 -> 100 se anime siempre
    requestAnimationFrame(() => setAncho(100));
    temporizador.current = setTimeout(() => navigate('/familia', { replace: true }), DURACION_MANTENER_MS);
  };

  const terminarMantener = () => {
    if (temporizador.current) clearTimeout(temporizador.current);
    setConTransicion(true);
    setAncho(0);
  };

  return (
    <div className="gate-pantalla">
      <div className="gate-encabezado">
        <div className="gate-marca">
          Rumi<span className="punto">.</span>
        </div>
        <p className="gate-pregunta">¿Quién usa el teléfono?</p>
      </div>

      <button onClick={entrarComoNino} className="gate-boton gate-boton-nino">
        <div className="gate-icono-blanco">
          <HandHeart size={32} color="#5A9E95" weight="fill" />
        </div>
        <div>
          <div className="gate-titulo-boton">Niño</div>
          <div className="gate-subtitulo-boton">Hablar con pictogramas</div>
        </div>
      </button>

      <button
        onPointerDown={empezarMantener}
        onPointerUp={terminarMantener}
        onPointerLeave={terminarMantener}
        className="gate-boton gate-boton-familia"
      >
        <div
          className="gate-relleno"
          style={{ width: `${ancho}%`, transition: conTransicion ? `width ${ancho === 0 ? 150 : DURACION_MANTENER_MS}ms linear` : 'none' }}
        />
        <div className="gate-icono-blanco">
          <House size={30} color="#6892B7" weight="fill" />
        </div>
        <div>
          <div className="gate-titulo-boton">Familia</div>
          <div className="gate-subtitulo-boton">Mantén pulsado para entrar</div>
        </div>
      </button>
    </div>
  );
}
