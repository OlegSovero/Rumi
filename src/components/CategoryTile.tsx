import { TintesCategoria, type Tinte } from '../theme';
import { Pictogram } from './Pictogram';

type Props = {
  label: string;
  tint: Tinte;
  count: number;
  iconId: number;
  onOpen: () => void;
};

export function CategoryTile({ label, tint, count, iconId, onOpen }: Props) {
  return (
    <button className="category-tile" onClick={onOpen} aria-label={label}>
      <div className="picto-wrap" style={{ background: TintesCategoria[tint] }}>
        <Pictogram id={iconId} label={label} size={50} />
      </div>
      <span className="category-tile-label">{label}</span>
      <span className="category-tile-count">{count} pictogramas</span>
    </button>
  );
}
