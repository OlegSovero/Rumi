import type { ReactNode } from 'react';

type Tono = 'calm' | 'reward';

type Props = {
  children: string;
  icon: ReactNode;
  tone?: Tono;
};

export function EncouragementBanner({ children, icon, tone = 'calm' }: Props) {
  return (
    <div className={`banner banner-${tone}`}>
      <div className="banner-icon">{icon}</div>
      <span className="banner-text">{children}</span>
    </div>
  );
}
