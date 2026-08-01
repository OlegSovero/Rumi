import { Check } from '@phosphor-icons/react';
import { useEffect } from 'react';

type Props = {
  title: string;
  message: string;
  onContinue: () => void;
};

const DURACION_AUTO = 2200;

export function RewardBloom({ title, message, onContinue }: Props) {
  useEffect(() => {
    const temporizador = setTimeout(onContinue, DURACION_AUTO);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="reward-overlay" onClick={onContinue} aria-label="Continuar">
      <div className="reward-card">
        <div className="reward-check">
          <Check size={56} color="#7BB177" weight="bold" />
        </div>
        <span className="reward-title">{title}</span>
        <span className="reward-message">{message}</span>
      </div>
    </div>
  );
}
