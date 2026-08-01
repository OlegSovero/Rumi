import { CircleNotch, CloudCheck, WifiSlash } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { comprobarOllama, type EstadoOllama } from '../../ai';
import { Checkbox } from '../../components/Checkbox';
import { EncouragementBanner } from '../../components/EncouragementBanner';
import { Switch } from '../../components/Switch';
import { useConfiguracionStore } from '../../store/configuracion';

export function AjustesFamilia() {
  const readAloud = useConfiguracionStore((s) => s.readAloud);
  const showText = useConfiguracionStore((s) => s.showText);
  const lockBoards = useConfiguracionStore((s) => s.lockBoards);
  const establecer = useConfiguracionStore((s) => s.establecer);
  const [estadoIA, setEstadoIA] = useState<EstadoOllama | null>(null);
  const [comprobando, setComprobando] = useState(true);

  useEffect(() => {
    let vivo = true;
    setComprobando(true);
    comprobarOllama().then((estado) => {
      if (vivo) {
        setEstadoIA(estado);
        setComprobando(false);
      }
    });
    return () => {
      vivo = false;
    };
  }, []);

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

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {comprobando ? (
          <EncouragementBanner tone="reward" icon={<CircleNotch size={22} color="#FFFFFF" weight="bold" />}>
            Comprobando Gemma en Ollama…
          </EncouragementBanner>
        ) : estadoIA?.ok ? (
          <EncouragementBanner tone="reward" icon={<CloudCheck size={22} color="#FFFFFF" weight="fill" />}>
            {estadoIA.mensaje}
          </EncouragementBanner>
        ) : (
          <EncouragementBanner tone="reward" icon={<WifiSlash size={22} color="#FFFFFF" weight="fill" />}>
            {estadoIA?.mensaje ?? 'Sin conexión a Ollama. Se usará el modo simulado.'}
          </EncouragementBanner>
        )}
      </div>
    </div>
  );
}
