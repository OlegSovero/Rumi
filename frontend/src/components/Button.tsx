import type { ReactNode } from 'react';

type Variante = 'primary' | 'secondary' | 'ghost';
type Tamano = 'sm' | 'md' | 'lg';

type Props = {
  children: string;
  onClick: () => void;
  variant?: Variante;
  size?: Tamano;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};

export function Button({ children, onClick, variant = 'primary', size = 'md', fullWidth = false, disabled = false, icon }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
    >
      {icon}
      {children}
    </button>
  );
}
