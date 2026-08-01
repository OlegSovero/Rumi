import { IMAGENES_PICTOGRAMAS } from '../pictogramImages';

type Props = {
  id: number;
  label: string;
  size?: number;
  rounded?: boolean;
};

// Rumi es local-first: el pictograma vive empaquetado en public/pictograms
// o no se muestra. Nunca se pide a una red en tiempo de ejecución.
export function Pictogram({ id, label, size = 56, rounded = false }: Props) {
  const src = IMAGENES_PICTOGRAMAS[id];

  if (!src) {
    return (
      <div
        className="pictogram-missing"
        style={{ width: size, height: size, borderRadius: rounded ? size / 2 : undefined }}
        aria-label={label}
      />
    );
  }

  return (
    <img
      src={src}
      alt={label}
      className="pictogram"
      draggable={false}
      style={{ width: size, height: size, borderRadius: rounded ? size / 2 : undefined }}
    />
  );
}
