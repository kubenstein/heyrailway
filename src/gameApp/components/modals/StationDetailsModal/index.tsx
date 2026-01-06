import { useEffect, useState } from 'react';
import { Station } from '../../../lib/types';
import { GameState } from '../../GameController';
import styles from './StationDetailsModal.module.css';
import CargoRenderer from '../../renderers/CargoRenderer';

interface StationDetailsModalProps {
  gameState: GameState;
  stationId: Station['id'] | null;
  onClose: () => void;
}

export default function StationDetailsModal({ gameState, stationId, onClose }: StationDetailsModalProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!stationId), 100);
    return () => clearTimeout(timeout);
  }, [stationId]);

  const station = stationId && gameState.stations.find((s) => s.id === stationId);
  const cargos = stationId ? gameState.cargos.filter((c) => c.stationId === stationId) : [];

  const emergency = station ? cargos.length / station.capacity > 0.75 : false;

  const headerClass = [styles.header, emergency ? styles.emergency : ''].join(' ');

  return (
    <div className={`${styles.host} ${slideIn ? styles.show : ''}`}>
      {station && (
        <div className={styles.modalContent}>
          <div className={headerClass}>
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
            <strong>Station Details</strong>
            <div className={styles.typeExplanation}>
              Type:
              <CargoRenderer
                cargo={{ cargoType: station.cargoType, id: '', stationId: null, cartId: null, stationIdsRoute: [] }}
                size={32}
              />
              {
                {
                  DB: 'Postgres',
                  NEXT: 'Next.js',
                  TEMPORAL: 'Temporal',
                  GATEWAY: 'Gateway',
                  REDIS: 'Redis',
                }[station.cargoType]
              }
            </div>
          </div>
          <div className={styles.content}>
            Station id: <em>{station.id}</em>
            <br />
            capacity: <em>{station.capacity}</em>
            {station.capacity > gameState.stationCapacity && <i className={styles.crownIcon}></i>}
            <br />
            Age: <em>{gameState.round - station.createdAt} rounds</em>
            <br />
            <br />
            Cargos ({cargos.length}):
            <br />
            <div className={styles.cargosWrapper}>
              {cargos.map((cargo) => (
                <CargoRenderer key={cargo.id} cargo={cargo} size={32} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
