import { ArrowUUpLeft, CircleNotch, SpeakerHigh } from '@phosphor-icons/react';
import { Pictogram } from './Pictogram';

export type ItemFrase = { key: string; id: number; etiqueta: string };

type Props = {
  items: ItemFrase[];
  onDeleteLast: () => void;
  onSpeak: () => void;
  hablando?: boolean;
};

export function SentenceStrip({ items, onDeleteLast, onSpeak, hablando = false }: Props) {
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
        <button onClick={onDeleteLast} aria-label="Borrar la última palabra" className="sentence-undo" disabled={hablando}>
          <ArrowUUpLeft size={22} color="#6E675B" />
        </button>
      )}

      <button
        onClick={onSpeak}
        aria-label={hablando ? 'Gemma está armando la frase' : 'Decir en voz alta'}
        className="sentence-speak"
        disabled={!hayItems || hablando}
      >
        {hablando ? (
          <CircleNotch size={32} color="#FFFFFF" weight="bold" className="icono-girando" />
        ) : (
          <SpeakerHigh size={32} color="#FFFFFF" weight="fill" />
        )}
      </button>
    </div>
  );
}
