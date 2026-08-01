type Props = {
  checked: boolean;
  onChange: (valor: boolean) => void;
  label: string;
};

export function Switch({ checked, onChange, label }: Props) {
  return (
    <label className="switch-row">
      <span className="switch-label">{label}</span>
      <input
        type="checkbox"
        className="switch-toggle"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
