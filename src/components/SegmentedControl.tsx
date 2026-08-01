import type { ReactNode } from 'react';

export type SegmentoOpcion = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type Props = {
  options: SegmentoOpcion[];
  value: string;
  onChange: (valor: string) => void;
};

export function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <div className="segmented">
      {options.map((opcion) => {
        const activo = opcion.value === value;
        return (
          <button
            key={opcion.value}
            onClick={() => onChange(opcion.value)}
            className={`segment ${activo ? 'active' : ''}`}
          >
            {opcion.icon}
            {opcion.label}
          </button>
        );
      })}
    </div>
  );
}
