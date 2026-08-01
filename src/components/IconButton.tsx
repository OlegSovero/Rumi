import type { ReactNode } from 'react';

type Variante = 'soft' | 'tint' | 'outline' | 'solid';
type Tamano = 'sm' | 'md';

type Props = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: Variante;
  size?: Tamano;
  active?: boolean;
};

export function IconButton({ icon, label, onClick, variant = 'soft', size = 'sm', active = false }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`icon-btn icon-btn-${size} ${active ? 'icon-btn-active' : `icon-btn-${variant}`}`}
    >
      {icon}
    </button>
  );
}
