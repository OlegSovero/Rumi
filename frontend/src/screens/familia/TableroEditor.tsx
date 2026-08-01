import { Minus, PencilSimple, Plus } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Pictogram } from '../../components/Pictogram';
import { POOL, TABLEROS } from '../../rumi-data';
import {
  anadirATablero,
  obtenerConteoTableros,
  obtenerPictogramasPorCategoria,
  quitarDeTablero,
  type FilaPictograma,
} from '../../lib/db';
import { TintesCategoria } from '../../theme';

export function TableroEditor() {
  const [conteo, setConteo] = useState<Record<string, number>>({});
  const [editando, setEditando] = useState<string | null>(null);
  const [palabras, setPalabras] = useState<FilaPictograma[]>([]);

  const cargarConteo = () => setConteo(obtenerConteoTableros());
  useEffect(() => {
    // localStorage solo existe en el cliente: se lee una vez montado, no durante el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarConteo();
  }, []);

  const cargarPalabras = (categoria: string) => setPalabras(obtenerPictogramasPorCategoria(categoria));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (editando) cargarPalabras(editando);
  }, [editando]);

  const tablero = TABLEROS.find((t) => t.id === editando) ?? null;

  if (tablero) {
    const idsEnTablero = new Set(palabras.map((p) => p.id));
    return (
      <div>
        <button className="btn btn-ghost btn-md volver-btn" onClick={() => setEditando(null)}>
          ← Tableros
        </button>
        <div className="tablero-editor-titulo">{tablero.etiqueta}</div>
        <p className="tablero-editor-ayuda">Toca un pictograma para quitarlo, o añade otros abajo.</p>

        <div className="grid-palabras">
          {palabras.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                quitarDeTablero(p.id);
                cargarPalabras(tablero.id);
                cargarConteo();
              }}
              className="celda-palabra"
            >
              <span className="insignia insignia-quitar">
                <Minus size={15} color="#FFFFFF" weight="bold" />
              </span>
              <Pictogram id={p.id} label={p.etiqueta} size={56} />
              <span className="celda-etiqueta">{p.etiqueta}</span>
            </button>
          ))}
        </div>

        <div className="etiqueta-seccion" style={{ marginTop: 22 }}>Añadir pictograma</div>
        <div className="grid-palabras">
          {POOL.map((p) => {
            const yaEsta = idsEnTablero.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => {
                  anadirATablero(tablero.id, p.id);
                  cargarPalabras(tablero.id);
                  cargarConteo();
                }}
                className="celda-palabra celda-punteada"
                style={{ opacity: yaEsta ? 0.45 : 1 }}
              >
                <span className="insignia insignia-anadir">
                  <Plus size={15} color="#FFFFFF" weight="bold" />
                </span>
                <Pictogram id={p.id} label={p.etiqueta} size={56} />
                <span className="celda-etiqueta">{p.etiqueta}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {TABLEROS.map((t) => (
        <div key={t.id} className="fila-tablero">
          <div className="icono-tablero" style={{ background: TintesCategoria[t.tint] }}>
            <Pictogram id={t.iconoId} label={t.etiqueta} size={46} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="nombre-tablero">{t.etiqueta}</div>
            <div className="contador-tablero">{conteo[t.id] ?? 0} pictogramas</div>
          </div>
          <IconButton
            icon={<PencilSimple size={20} color="#4A8981" />}
            label="Editar tablero"
            variant="tint"
            size="sm"
            onClick={() => setEditando(t.id)}
          />
        </div>
      ))}
      <Button variant="secondary" fullWidth onClick={() => {}}>
        + Añadir tablero
      </Button>
    </div>
  );
}
