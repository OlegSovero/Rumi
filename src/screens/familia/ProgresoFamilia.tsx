import { ChatsCircle } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { EncouragementBanner } from '../../components/EncouragementBanner';
import { Pictogram } from '../../components/Pictogram';
import { contarFrasesHoy, contarPalabrasHoy, obtenerMasUsados, type PictogramaMasUsado } from '../../lib/db';

type Props = { childName: string };

export function ProgresoFamilia({ childName }: Props) {
  const [mensajesHoy, setMensajesHoy] = useState(0);
  const [palabrasHoy, setPalabrasHoy] = useState(0);
  const [masUsados, setMasUsados] = useState<PictogramaMasUsado[]>([]);

  useEffect(() => {
    setMensajesHoy(contarFrasesHoy());
    setPalabrasHoy(contarPalabrasHoy());
    setMasUsados(obtenerMasUsados(3, 7));
  }, []);

  return (
    <div>
      <EncouragementBanner tone="calm" icon={<ChatsCircle size={22} color="#FFFFFF" weight="fill" />}>
        {`Hoy ${childName} dijo ${mensajesHoy} mensaje${mensajesHoy === 1 ? '' : 's'}.`}
      </EncouragementBanner>

      <div className="stat-fila" style={{ marginTop: 14 }}>
        <Card tint="teal" elevation="none" className="stat-card">
          <div className="stat-numero">{mensajesHoy}</div>
          <div className="stat-etiqueta">mensajes hoy</div>
        </Card>
        <Card tint="apricot" elevation="none" className="stat-card">
          <div className="stat-numero">{palabrasHoy}</div>
          <div className="stat-etiqueta">palabras usadas</div>
        </Card>
      </div>

      <Card elevation="sm" padding={16}>
        <div className="progreso-card-titulo">Más usadas esta semana</div>
        {masUsados.length === 0 ? (
          <p className="progreso-pie">Todavía no hay uso registrado esta semana.</p>
        ) : (
          <div className="mas-usados-fila">
            {masUsados.map((p) => (
              <div key={p.pictogramaId} className="mas-usado-item">
                <Pictogram id={p.pictogramaId} label={p.etiqueta} size={54} />
                <span className="mas-usado-etiqueta">{p.etiqueta}</span>
              </div>
            ))}
          </div>
        )}
        <p className="progreso-pie">
          {`Sin puntuaciones ni rachas — solo lo que ayuda a ${childName}.`}
        </p>
      </Card>
    </div>
  );
}
