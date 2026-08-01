import { WifiSlash } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Checkbox } from '../../components/Checkbox';
import { EncouragementBanner } from '../../components/EncouragementBanner';
import { Switch } from '../../components/Switch';
import { useConfiguracionStore } from '../../store/configuracion';

export function AjustesFamilia() {
  const readAloud = useConfiguracionStore((s) => s.readAloud);
  const showText = useConfiguracionStore((s) => s.showText);
  const lockBoards = useConfiguracionStore((s) => s.lockBoards);
  const establecer = useConfiguracionStore((s) => s.establecer);
  const [estadoIA, setEstadoIA] = useState<{
    provider: string;
    model: string;
    ready: boolean;
    detail: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/ai/status')
      .then((response) => response.json())
      .then(setEstadoIA)
      .catch(() => setEstadoIA({ provider: 'unknown', model: 'unknown', ready: false, detail: 'No se pudo consultar el estado' }));
  }, []);

  const comprobarIA = () => {
    setEstadoIA(null);
    fetch('/api/ai/status')
      .then((response) => response.json())
      .then(setEstadoIA)
      .catch(() => setEstadoIA({ provider: 'unknown', model: 'unknown', ready: false, detail: 'No se pudo consultar el estado' }));
  };

  return (
    <div>
      <div className="fila-ajuste">
        <Switch checked={readAloud} onChange={(v) => establecer('readAloud', v)} label="Leer en voz alta al tocar" />
      </div>
      <div className="fila-ajuste">
        <Checkbox checked={showText} onChange={(v) => establecer('showText', v)} label="Mostrar texto bajo el pictograma" />
      </div>
      <div className="fila-ajuste">
        <Checkbox checked={lockBoards} onChange={(v) => establecer('lockBoards', v)} label="Bloquear cambios de tablero" />
      </div>

      <div style={{ marginTop: 16 }}>
        <EncouragementBanner tone="reward" icon={<WifiSlash size={22} color="#FFFFFF" weight="fill" />}>
          Todo funciona sin conexión a un servidor propio.
        </EncouragementBanner>
      </div>

      <div className="fila-ajuste" style={{ display: 'block', marginTop: 16 }}>
        <strong>Asistente IA</strong>
        <div style={{ marginTop: 6, fontSize: 14 }}>
          {estadoIA ? `${estadoIA.provider} · ${estadoIA.model}` : 'Comprobando...'}
        </div>
        <div style={{ marginTop: 4, color: estadoIA?.ready ? '#287A4B' : '#8A5A00', fontSize: 13 }}>
          {estadoIA?.detail || 'Consultando disponibilidad'}
        </div>
        <button type="button" onClick={comprobarIA} style={{ marginTop: 8 }}>
          Actualizar estado
        </button>
      </div>
    </div>
  );
}
