import { ArrowLeft, ArrowRight, Smiley } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Pictogram } from '../../components/Pictogram';
import type { Tarea } from '../../lib/db';
import { hablar } from '../../lib/voz';
import { TintesCategoria } from '../../theme';

type Props = {
  tarea: Tarea;
  readAloud: boolean;
  onSalir: () => void;
  onCompletar: () => void;
};

export function EjecutorTarea({ tarea, readAloud, onSalir, onCompletar }: Props) {
  const [pasoIdx, setPasoIdx] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  const paso = tarea.pasos[pasoIdx];
  const esUltimo = pasoIdx >= tarea.pasos.length - 1;

  useEffect(() => {
    if (readAloud && paso) hablar(paso.etiqueta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasoIdx]);

  const onListo = () => {
    if (esUltimo) {
      onCompletar();
      return;
    }
    setHint(null);
    setPasoIdx((i) => i + 1);
  };

  const onNoEntiendo = () => {
    setHint(paso.ayuda);
    if (readAloud) hablar(paso.ayuda);
  };

  return (
    <div className="ejecutor">
      <div className="ejecutor-cabecera">
        <button onClick={onSalir} aria-label="Volver a las tareas" className="ejecutor-boton-atras">
          <ArrowLeft size={20} color="#4A4539" weight="bold" />
        </button>
        <span className="ejecutor-contador">
          Paso {pasoIdx + 1} de {tarea.pasos.length}
        </span>
      </div>

      <div className="ejecutor-barra">
        <div className="ejecutor-relleno" style={{ width: `${((pasoIdx + 1) / tarea.pasos.length) * 100}%` }} />
      </div>

      <div className="ejecutor-centro">
        <div className="ejecutor-panel-picto" style={{ background: TintesCategoria[tarea.tinte] }}>
          <Pictogram id={paso.pictogramaId} label={paso.etiqueta} size={200} />
        </div>
        <span className="ejecutor-etiqueta-paso">{paso.etiqueta}</span>
      </div>

      <div className="ejecutor-acciones">
        {hint && (
          <div className="ejecutor-burbuja-gemma">
            <div className="avatar-gemma">
              <Smiley size={24} color="#FFFFFF" weight="fill" />
            </div>
            <div>
              <div className="ejecutor-nombre-gemma">Gemma</div>
              <p className="ejecutor-texto-gemma">{hint}</p>
            </div>
          </div>
        )}

        <button onClick={onListo} className="ejecutor-boton-listo">
          {esUltimo ? '¡Terminé!' : 'Ya lo hice'}
          <ArrowRight size={20} color="#FFFFFF" weight="bold" />
        </button>

        <button onClick={onNoEntiendo} className="ejecutor-boton-ayuda">
          <Smiley size={24} color="#4A8981" weight="fill" />
          No entiendo
        </button>
      </div>
    </div>
  );
}
