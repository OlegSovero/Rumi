import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowClockwise, Check, DotsSixVertical, Sparkle, Smiley, Trash, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { EncouragementBanner } from '../../components/EncouragementBanner';
import { Pictogram } from '../../components/Pictogram';
import { TINTES_TAREA } from '../../rumi-data';
import {
  actualizarTareaConPasos,
  crearTareaConPasos,
  eliminarTarea,
  obtenerTareas,
  reordenarTareas,
  type Tarea,
} from '../../lib/db';
import { servicioIA } from '../../ai/servicioIA';
import { TintesCategoria, type Tinte } from '../../theme';

type PasoBorrador = { etiqueta: string; pictogramaId: number };
type Borrador = {
  id: string;
  esEdicion: boolean;
  texto: string;
  etiqueta: string;
  tinte: Tinte;
  pasos: PasoBorrador[];
  pensando: boolean;
  generado: boolean;
};

type Props = { childName: string };

export function TareasFamilia({ childName }: Props) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [borrador, setBorrador] = useState<Borrador | null>(null);

  const cargar = () => setTareas(obtenerTareas());
  useEffect(() => {
    // localStorage solo existe en el cliente: se lee una vez montado, no durante el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const i = tareas.findIndex((t) => t.id === active.id);
    const j = tareas.findIndex((t) => t.id === over.id);
    if (i < 0 || j < 0) return;
    const copia = arrayMove(tareas, i, j);
    setTareas(copia);
    reordenarTareas(copia.map((t) => t.id));
  };

  const eliminar = (id: string) => {
    eliminarTarea(id);
    cargar();
  };

  const empezarNueva = () =>
    setBorrador({
      id: `t${Date.now()}`,
      esEdicion: false,
      texto: '',
      etiqueta: '',
      tinte: TINTES_TAREA[tareas.length % TINTES_TAREA.length],
      pasos: [],
      pensando: false,
      generado: false,
    });

  const editar = (tarea: Tarea) =>
    setBorrador({
      id: tarea.id,
      esEdicion: true,
      texto: tarea.etiqueta,
      etiqueta: tarea.etiqueta,
      tinte: tarea.tinte,
      pasos: tarea.pasos.map((p) => ({ etiqueta: p.etiqueta, pictogramaId: p.pictogramaId })),
      pensando: false,
      generado: true,
    });

  const generar = async () => {
    if (!borrador || !borrador.texto.trim()) return;
    setBorrador({ ...borrador, pensando: true, generado: false });
    const resultado = await servicioIA.descomponerTarea(borrador.texto);
    setBorrador((actual) =>
      actual
        ? {
            ...actual,
            pensando: false,
            generado: true,
            etiqueta: resultado.etiqueta,
            pasos: resultado.pasos.map((p) => ({ etiqueta: p.instruccion, pictogramaId: p.pictogramaId })),
          }
        : actual
    );
  };

  const quitarPaso = (indice: number) =>
    setBorrador((actual) => (actual ? { ...actual, pasos: actual.pasos.filter((_, i) => i !== indice) } : actual));

  const guardar = async () => {
    if (!borrador || !borrador.etiqueta.trim() || borrador.pasos.length === 0) return;
    const pasosConAyuda = await Promise.all(
      borrador.pasos.map(async (p) => ({
        etiqueta: p.etiqueta,
        pictogramaId: p.pictogramaId,
        ayuda: await servicioIA.reformularPaso(p.etiqueta),
      }))
    );
    const tareaCompleta = {
      id: borrador.id,
      etiqueta: borrador.etiqueta.trim(),
      tinte: borrador.tinte,
      iconoId: pasosConAyuda[0].pictogramaId,
      pasos: pasosConAyuda,
    };
    if (borrador.esEdicion) {
      actualizarTareaConPasos(tareaCompleta);
    } else {
      crearTareaConPasos(tareaCompleta);
    }
    setBorrador(null);
    cargar();
  };

  if (borrador) {
    return (
      <BorradorTarea
        borrador={borrador}
        onCambiarTexto={(texto) => setBorrador({ ...borrador, texto })}
        onCambiarEtiqueta={(etiqueta) => setBorrador({ ...borrador, etiqueta })}
        onGenerar={generar}
        onQuitarPaso={quitarPaso}
        onCancelar={() => setBorrador(null)}
        onGuardar={guardar}
      />
    );
  }

  return (
    <div>
      <EncouragementBanner tone="calm" icon={<Sparkle size={22} color="#FFFFFF" weight="fill" />}>
        {`Crea las rutinas de ${childName}: describe lo que quieres conseguir y Gemma lo convierte en acciones visuales con pictogramas.`}
      </EncouragementBanner>

      <div style={{ marginTop: 12 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={tareas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tareas.map((t) => (
              <FilaTareaOrdenable key={t.id} tarea={t} onEditar={() => editar(t)} onEliminar={() => eliminar(t.id)} />
            ))}
          </SortableContext>
        </DndContext>

        <Button variant="secondary" fullWidth onClick={empezarNueva}>
          + Añadir tarea
        </Button>
      </div>
    </div>
  );
}

function FilaTareaOrdenable({ tarea, onEditar, onEliminar }: { tarea: Tarea; onEditar: () => void; onEliminar: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tarea.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`fila-familia-tarea ${isDragging ? 'arrastrando' : ''}`}
    >
      <button className="handle-arrastrar" aria-label="Arrastrar para reordenar" {...attributes} {...listeners}>
        <DotsSixVertical size={20} color="#B4AB99" weight="bold" />
      </button>
      <button className="icono-fila" style={{ background: TintesCategoria[tarea.tinte], flex: 'none' }} onClick={onEditar}>
        <Pictogram id={tarea.iconoId} label={tarea.etiqueta} size={42} />
      </button>
      <button style={{ flex: 1, textAlign: 'left' }} onClick={onEditar}>
        <div className="nombre-fila">{tarea.etiqueta}</div>
        <div className="pasos-fila">{tarea.pasos.length} pasos</div>
      </button>
      <button onClick={onEliminar} aria-label="Eliminar tarea" className="boton-eliminar">
        <Trash size={18} color="#E3B355" />
      </button>
    </div>
  );
}

function BorradorTarea({
  borrador,
  onCambiarTexto,
  onCambiarEtiqueta,
  onGenerar,
  onQuitarPaso,
  onCancelar,
  onGuardar,
}: {
  borrador: Borrador;
  onCambiarTexto: (v: string) => void;
  onCambiarEtiqueta: (v: string) => void;
  onGenerar: () => void;
  onQuitarPaso: (i: number) => void;
  onCancelar: () => void;
  onGuardar: () => void;
}) {
  return (
    <div>
      <button className="btn btn-ghost btn-md volver-btn" onClick={onCancelar}>
        ← Tareas
      </button>
      <div className="borrador-titulo">{borrador.esEdicion ? 'Editar tarea' : 'Nueva tarea'}</div>
      <p className="borrador-ayuda">Escribe la tarea con tus palabras. Gemma la divide en pasos con pictogramas.</p>

      <div className="campo-etiqueta">LA TAREA</div>
      <input
        value={borrador.texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
        placeholder="Ej. Recoger los juguetes"
        className="campo-input"
        onKeyDown={(e) => e.key === 'Enter' && onGenerar()}
      />

      {!borrador.generado && !borrador.pensando && (
        <button onClick={onGenerar} className="boton-generar">
          <Sparkle size={22} color="#FFFFFF" weight="fill" />
          Crear pasos con Gemma
        </button>
      )}

      {borrador.pensando && (
        <div className="burbuja-pensando">
          <div className="avatar-gemma">
            <Smiley size={24} color="#FFFFFF" weight="fill" />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="texto-pensando">Dividiendo la tarea en pasos</span>
            <span className="puntos-pensando">· · ·</span>
          </div>
        </div>
      )}

      {borrador.generado && (
        <>
          <div className="burbuja-generado">
            <div className="avatar-gemma">
              <Smiley size={23} color="#FFFFFF" weight="fill" />
            </div>
            <p className="texto-generado">
              Dividí la tarea en {borrador.pasos.length} pasos. Revísalos y guarda.
            </p>
          </div>

          <div className="campo-etiqueta">NOMBRE DE LA TAREA</div>
          <input
            value={borrador.etiqueta}
            onChange={(e) => onCambiarEtiqueta(e.target.value)}
            className="campo-input campo-input-chico"
          />

          <div className="campo-etiqueta">PASOS</div>
          <div>
            {borrador.pasos.map((p, i) => (
              <div key={`${p.pictogramaId}-${i}`} className="fila-paso">
                <div className="icono-paso">
                  <Pictogram id={p.pictogramaId} label={p.etiqueta} size={42} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="numero-paso">Paso {i + 1}</div>
                  <div className="etiqueta-paso-fila">{p.etiqueta}</div>
                </div>
                <button onClick={() => onQuitarPaso(i)} aria-label="Quitar paso" className="boton-quitar-paso">
                  <X size={15} color="#E3B355" weight="bold" />
                </button>
              </div>
            ))}
          </div>

          <div className="acciones-borrador">
            <button onClick={onGenerar} className="boton-otra-vez">
              <ArrowClockwise size={17} color="#5A9E95" weight="bold" />
              Otra vez
            </button>
            <button onClick={onGuardar} className="boton-guardar">
              <Check size={19} color="#FFFFFF" weight="bold" />
              Guardar tarea
            </button>
          </div>
        </>
      )}
    </div>
  );
}
