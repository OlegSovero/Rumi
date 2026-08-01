import { GearSix, HandHeart } from '@phosphor-icons/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { IconButton } from '../../components/IconButton';
import { SegmentedControl } from '../../components/SegmentedControl';
import { useConfiguracionStore } from '../../store/configuracion';
import { AjustesFamilia } from './AjustesFamilia';
import { ProgresoFamilia } from './ProgresoFamilia';
import { TableroEditor } from './TableroEditor';
import { TareasFamilia } from './TareasFamilia';

type Pestana = 'tableros' | 'tareas' | 'progreso' | 'ajustes';

export function PantallaFamilia() {
  const navigate = useNavigate();
  const childName = useConfiguracionStore((s) => s.childName);
  const [pestana, setPestana] = useState<Pestana>('tableros');

  return (
    <div className="familia-pantalla">
      <div className="familia-cabecera">
        <div className="familia-fila-titulo">
          <span className="familia-titulo">Familia</span>
          <Badge>Cuidador</Badge>
        </div>
        <div className="familia-fila-acciones">
          <IconButton
            icon={<GearSix size={22} color={pestana === 'ajustes' ? '#FFFFFF' : '#6E675B'} weight="fill" />}
            label="Ajustes"
            variant="outline"
            active={pestana === 'ajustes'}
            onClick={() => setPestana('ajustes')}
          />
          <IconButton
            icon={<HandHeart size={20} color="#4A4539" weight="fill" />}
            label="Volver al modo niño"
            variant="soft"
            onClick={() => navigate('/nino', { replace: true })}
          />
        </div>
      </div>

      <div className="familia-tabs">
        <SegmentedControl
          value={pestana === 'ajustes' ? '' : pestana}
          onChange={(v) => setPestana(v as Pestana)}
          options={[
            { value: 'tableros', label: 'Tableros' },
            { value: 'tareas', label: 'Tareas' },
            { value: 'progreso', label: 'Progreso' },
          ]}
        />
      </div>

      <div className="familia-scroll">
        {pestana === 'tableros' && <TableroEditor />}
        {pestana === 'tareas' && <TareasFamilia childName={childName} />}
        {pestana === 'progreso' && <ProgresoFamilia childName={childName} />}
        {pestana === 'ajustes' && <AjustesFamilia />}
      </div>
    </div>
  );
}
