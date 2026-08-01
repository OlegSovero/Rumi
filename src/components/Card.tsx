import type { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  elevation?: 'sm' | 'none';
  padding?: number;
  tint?: 'teal' | 'apricot';
  style?: CSSProperties;
  className?: string;
};

export function Card({ children, elevation = 'sm', padding = 16, tint, style, className = '' }: Props) {
  const tintClass = tint ? `card-tint-${tint}` : '';
  const elevationClass = elevation === 'sm' ? 'card-elevated' : '';
  return (
    <div className={`card ${tintClass} ${elevationClass} ${className}`} style={{ padding, ...style }}>
      {children}
    </div>
  );
}
