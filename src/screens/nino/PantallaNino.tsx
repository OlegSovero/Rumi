import { ChatCircleDots, House, ListChecks, Play } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryTile } from '../../components/CategoryTile';
import { IconButton } from '../../components/IconButton';
import { Pictogram } from '../../components/Pictogram';
import { PictoTile } from '../../components/PictoTile';
import { RewardBloom } from '../../components/RewardBloom';
import { SegmentedControl } from '../../components/SegmentedControl';
import { SentenceStrip, type ItemFrase } from '../../components/SentenceStrip';
import { NUCLEO, TABLEROS } from '../../rumi-data';
import {
  obtenerConteoTableros,
  obtenerPictogramasPorCategoria,
  registrarUsoPictograma,
  type FilaPictograma,
  type Tarea,
} from '../../lib/db';
import { registrarFrase, marcarTareaCompletada, obtenerTareas } from '../../lib/db';
import { servicioIA } from '../../ai/servicioIAMock';
import { hablar } from '../../lib/voz';
import { useConfiguracionStore } from '../../store/configuracion';
import { TintesCategoria } from '../../theme';
import { EjecutorTarea } from './EjecutorTarea';

let contadorClave = 0;

export function PantallaNino() {
  const navigate = useNavigate();
  const readAloud = useConfiguracionStore((s) => s.readAloud);

  const [vista, setVista] = useState<'hablar' | 'tareas'>('hablar');
  const [cat, setCat] = useState<string | null>(null);
  const [items, setItems] = useState<ItemFrase[]>([]);
  const [premio, setPremio] = useState(false);
  const [premioTarea, setPremioTarea] = useState(false);

  const [conteoTableros, setConteoTableros] = useState<Record<string, number>>({});
  const [palabrasCategoria, setPalabrasCategoria] = useState<FilaPictograma[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tareaActivaId, setTareaActivaId] = useState<string | null>(null);

  useEffect(() => {
    setConteoTableros(obtenerConteoTableros());
    setTareas(obtenerTareas());
  }, []);

  useEffect(() => {
    if (!cat) {
      setPalabrasCategoria([]);
      return;
    }
    setPalabrasCategoria(obtenerPictogramasPorCategoria(cat));
  }, [cat]);

  const agregarItem = useCallback(
    (id: number, label: string) => {
      contadorClave += 1;
      setItems((prev) => [...prev, { key: `k${contadorClave}`, id, etiqueta: label }]);
      if (readAloud) hablar(label);
      registrarUsoPictograma(id);
    },
    [readAloud]
  );

  const onBorrarUltimo = () => setItems((prev) => prev.slice(0, -1));

  const onHablar = async () => {
    if (items.length === 0) return;
    const texto = await servicioIA.pictogramasAFrase(items);
    hablar(texto);
    registrarFrase(texto);
    setPremio(true);
  };

  const tareaActiva = tareas.find((t) => t.id === tareaActivaId) ?? null;
  const categoriaAbierta = TABLEROS.find((t) => t.id === cat) ?? null;

  const titulo = tareaActiva
    ? tareaActiva.etiqueta
    : categoriaAbierta
      ? categoriaAbierta.etiqueta
      : vista === 'tareas'
        ? 'Mis tareas'
        : 'Mis palabras';

  return (
    <div className="nino-pantalla">
      <div className="nino-cabecera">
        <span className="nino-titulo">{titulo}</span>
        <IconButton
          icon={<House size={20} color="#4A4539" weight="fill" />}
          label="Cambiar de modo"
          variant="soft"
          size="sm"
          onClick={() => navigate('/gate', { replace: true })}
        />
      </div>

      {!cat && !tareaActivaId && (
        <div className="nino-seccion-toggle">
          <SegmentedControl
            value={vista}
            onChange={(v) => setVista(v as 'hablar' | 'tareas')}
            options={[
              { value: 'hablar', label: 'Hablar', icon: <ChatCircleDots size={19} color={vista === 'hablar' ? '#FFFFFF' : '#6E675B'} weight="fill" /> },
              { value: 'tareas', label: 'Tareas', icon: <ListChecks size={19} color={vista === 'tareas' ? '#FFFFFF' : '#6E675B'} weight="fill" /> },
            ]}
          />
        </div>
      )}

      {!tareaActivaId && vista === 'hablar' && (
        <div className="nino-seccion-tira">
          <SentenceStrip items={items} onDeleteLast={onBorrarUltimo} onSpeak={onHablar} />
        </div>
      )}

      <div className="nino-scroll">
        {tareaActivaId && tareaActiva ? (
          <EjecutorTarea
            tarea={tareaActiva}
            readAloud={readAloud}
            onSalir={() => setTareaActivaId(null)}
            onCompletar={() => {
              marcarTareaCompletada(tareaActiva.id);
              setPremioTarea(true);
            }}
          />
        ) : vista === 'tareas' ? (
          <div>
            {tareas.map((t) => (
              <button key={t.id} onClick={() => setTareaActivaId(t.id)} className="fila-tarea">
                <div className="icono-tarea" style={{ background: TintesCategoria[t.tinte] }}>
                  <Pictogram id={t.iconoId} label={t.etiqueta} size={58} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="nombre-tarea">{t.etiqueta}</div>
                  <div className="pasos-tarea">{t.pasos.length} pasos</div>
                </div>
                <div className="boton-jugar">
                  <Play size={20} color="#4A8981" weight="fill" />
                </div>
              </button>
            ))}
          </div>
        ) : cat && categoriaAbierta ? (
          <div>
            <button className="btn btn-ghost btn-md volver-btn" onClick={() => setCat(null)}>
              ← Volver
            </button>
            <div className="grid-3">
              {palabrasCategoria.map((p) => (
                <PictoTile
                  key={p.id}
                  id={p.id}
                  label={p.etiqueta}
                  tint={categoriaAbierta.tint}
                  onSelect={() => agregarItem(p.id, p.etiqueta)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="etiqueta-seccion">Palabras</div>
            <div className="grid-3">
              {NUCLEO.map((w) => (
                <PictoTile key={w.id} id={w.id} label={w.etiqueta} tint={w.tint} onSelect={() => agregarItem(w.id, w.etiqueta)} />
              ))}
            </div>

            <div className="etiqueta-seccion" style={{ marginTop: 18 }}>Categorías</div>
            <div className="grid-2">
              {TABLEROS.map((c) => (
                <CategoryTile
                  key={c.id}
                  label={c.etiqueta}
                  tint={c.tint}
                  count={conteoTableros[c.id] ?? 0}
                  iconId={c.iconoId}
                  onOpen={() => setCat(c.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {premio && (
        <RewardBloom
          title="¡Muy bien!"
          message="Lo dijiste tú."
          onContinue={() => {
            setPremio(false);
            setItems([]);
            setCat(null);
          }}
        />
      )}

      {premioTarea && (
        <RewardBloom
          title="¡Lo lograste!"
          message="Terminaste tu tarea, paso a paso."
          onContinue={() => {
            setPremioTarea(false);
            setTareaActivaId(null);
          }}
        />
      )}
    </div>
  );
}
