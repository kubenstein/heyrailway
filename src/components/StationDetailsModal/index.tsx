import { useEffect, useState } from 'react';
import { Station } from '../../lib/types';
import { GameState } from '../GameController';
import styles from './StationDetailsModal.module.css';

interface StationDetailsModalProps {
  gameState: GameState;
  stationId: Station['id'] | null;
  onClose: () => void;
}

export default function StationDetailsModal({
  gameState,
  stationId,
  onClose,
}: StationDetailsModalProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!stationId), 100);
    return () => clearTimeout(timeout);
  }, [stationId]);

  const station =
    stationId && gameState.stations.find((s) => s.id === stationId);
  const cargos = stationId
    ? gameState.cargos.filter((c) => c.stationId === stationId)
    : [];

  return (
    <div className={`${styles.modal} ${slideIn ? styles.show : ''}`}>
      {station && (
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
            <strong>Station Details</strong>
          </div>
          <div className={styles.content}>
            Station id: <em>{station.id}</em>
            <br />
            capacity: <em>{station.capacity}</em>
            <br />
            Age: <em>{gameState.round - station.createdAt} rounds</em>
            <br />
            <br />
            Cargo:
            <br />
            {cargos.map((cargo) => (
              <div key={cargo.id}>{cargo.cargoType}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
