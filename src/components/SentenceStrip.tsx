import { ArrowUUpLeft, SpeakerHigh } from '@phosphor-icons/react';
import { Pictogram } from './Pictogram';

export type ItemFrase = { key: string; id: number; etiqueta: string };

type Props = {
  items: ItemFrase[];
  onDeleteLast: () => void;
  onSpeak: () => void;
};

export function SentenceStrip({ items, onDeleteLast, onSpeak }: Props) {
  const hayItems = items.length > 0;

  return (
    <div className="sentence-strip">
      <div className="sentence-scroll">
        {hayItems ? (
          items.map((it) => (
            <div key={it.key} className="sentence-item">
              <Pictogram id={it.id} label={it.etiqueta} size={58} rounded />
              <span className="sentence-item-label">{it.etiqueta}</span>
            </div>
          ))
        ) : (
          <span className="sentence-empty">Toca una palabra para empezar</span>
        )}
      </div>

      {hayItems && (
        <button onClick={onDeleteLast} aria-label="Borrar la última palabra" className="sentence-undo">
          <ArrowUUpLeft size={22} color="#6E675B" />
        </button>
      )}

      <button onClick={onSpeak} aria-label="Decir en voz alta" className="sentence-speak">
        <SpeakerHigh size={32} color="#FFFFFF" weight="fill" />
      </button>
    </div>
  );
}
