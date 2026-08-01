import { WifiSlash } from '@phosphor-icons/react';
import { Checkbox } from '../../components/Checkbox';
import { EncouragementBanner } from '../../components/EncouragementBanner';
import { Switch } from '../../components/Switch';
import { useConfiguracionStore } from '../../store/configuracion';

export function AjustesFamilia() {
  const readAloud = useConfiguracionStore((s) => s.readAloud);
  const showText = useConfiguracionStore((s) => s.showText);
  const lockBoards = useConfiguracionStore((s) => s.lockBoards);
  const establecer = useConfiguracionStore((s) => s.establecer);

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
    </div>
  );
}
