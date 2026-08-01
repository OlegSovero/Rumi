import { TintesCategoria, type Tinte } from '../theme';
import { Pictogram } from './Pictogram';

type Props = {
  id: number;
  label: string;
  tint: Tinte;
  onSelect: () => void;
};

export function PictoTile({ id, label, tint, onSelect }: Props) {
  return (
    <button className="picto-tile" onClick={onSelect} aria-label={label}>
      <div className="picto-wrap" style={{ background: TintesCategoria[tint] }}>
        <Pictogram id={id} label={label} size={56} />
      </div>
      <span className="picto-tile-label">{label}</span>
    </button>
  );
}
