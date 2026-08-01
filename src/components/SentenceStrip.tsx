import { ArrowUUpLeft, CheckCircle, CircleNotch, SpeakerHigh } from '@phosphor-icons/react';
import { buscarPictograma } from '../ai/comunicacion';
import type { InterpretacionComunicacion } from '../ai/tipos';
import { Pictogram } from './Pictogram';

export type ItemFrase = { key: string; id: number; etiqueta: string };

type Props = {
  items: ItemFrase[];
  onDeleteLast: () => void;
  onSpeak: () => void;
  interpretation: InterpretacionComunicacion | null;
  interpreting: boolean;
  onSelectAlternative: (alternative: string) => void;
  onSelectSuggestion: (id: number, label: string) => void;
};

export function SentenceStrip({ items, onDeleteLast, onSpeak, interpretation, interpreting, onSelectAlternative, onSelectSuggestion }: Props) {
  const hayItems = items.length > 0;

  return (
    <div className="sentence-strip">
      <div className="sentence-main">
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
        {(interpretation || interpreting) && (
          <div className={`sentence-interpretation ${interpretation ? `sentence-interpretation-${interpretation.status}` : 'sentence-interpretation-loading'}`}>
            {interpretation ? (
              <>
                <div className="sentence-literal">{interpretation.literal}</div>
                {interpretation.status === 'complete' && interpretation.interpretation ? (
                  <div className="sentence-result">{interpretation.interpretation}</div>
                ) : (
                  <div className="sentence-status">
                    {interpretation.status === 'ambiguous' ? '¿Cuál quieres decir?' : 'Elige una palabra para continuar'}
                  </div>
                )}
                {interpretation.alternatives.length > 0 && (
                  <div className="sentence-alternatives">
                    {interpretation.alternatives.map((alternative) => (
                      <button key={alternative} type="button" onClick={() => onSelectAlternative(alternative)}>
                        {alternative}
                      </button>
                    ))}
                  </div>
                )}
                {interpretation.suggestions.length > 0 && (
                  <div className="sentence-suggestions">
                    <span>Sugerencias</span>
                    <div className="sentence-suggestion-list">
                      {interpretation.suggestions.map((suggestion) => {
                        const pictogram = buscarPictograma(suggestion);
                        if (!pictogram) return null;
                        return (
                          <button
                            key={pictogram.id}
                            type="button"
                            className="sentence-suggestion"
                            onClick={() => onSelectSuggestion(pictogram.id, pictogram.etiqueta)}
                            aria-label={`Añadir ${pictogram.etiqueta}`}
                          >
                            <Pictogram id={pictogram.id} label={pictogram.etiqueta} size={38} rounded />
                            <span>{pictogram.etiqueta}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="sentence-status sentence-analysis-status">
                  <CircleNotch className="sentence-loading-icon" size={16} weight="bold" />
                  Relacionando tus pictogramas...
                </div>
                <div className="sentence-analysis-track" aria-label="Pictogramas en análisis">
                  {items.map((item, index) => (
                    <div key={`analysis-${item.key}`} className="sentence-analysis-item" style={{ animationDelay: `${index * 140}ms` }}>
                      <Pictogram id={item.id} label={item.etiqueta} size={34} rounded />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {hayItems && (
        <button onClick={onDeleteLast} aria-label="Borrar la última palabra" className="sentence-undo">
          <ArrowUUpLeft size={22} color="#6E675B" />
        </button>
      )}

      <button
        onClick={onSpeak}
        disabled={!hayItems || interpreting}
        aria-label={interpreting ? 'Gemma está pensando' : interpretation?.status === 'complete' ? 'Escuchar mensaje' : 'Escuchar selección'}
        title={interpreting ? 'Gemma está pensando' : interpretation?.status === 'complete' ? 'Escuchar mensaje' : 'Escuchar selección'}
        className="sentence-speak"
      >
        {interpreting ? (
          <CircleNotch className="sentence-loading-icon" size={30} color="#FFFFFF" weight="bold" />
        ) : interpretation?.status === 'complete' ? (
          <SpeakerHigh size={32} color="#FFFFFF" weight="fill" />
        ) : (
          <CheckCircle size={32} color="#FFFFFF" weight="fill" />
        )}
        <span className="sentence-speak-label">{interpreting ? 'Pensando...' : interpretation?.status === 'complete' ? 'Escuchar' : 'Listo'}</span>
      </button>
    </div>
  );
}
