import { Check } from '@phosphor-icons/react';

type Props = {
  checked: boolean;
  onChange: (valor: boolean) => void;
  label: string;
};

export function Checkbox({ checked, onChange, label }: Props) {
  return (
    <button className="checkbox-row" onClick={() => onChange(!checked)}>
      <span className={`checkbox-box ${checked ? 'checked' : ''}`}>
        {checked && <Check size={16} color="#FFFFFF" weight="bold" />}
      </span>
      <span className="checkbox-label">{label}</span>
    </button>
  );
}
