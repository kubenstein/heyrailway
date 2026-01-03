import { Cargo, CargoType, Station } from '../../../lib/types';
import { pointToBoardPoint } from '../../../lib/board';
import CargoRenderer from '../CargoRenderer';
import styles from './StationsRenderer.module.css';

interface StationsRendererProps {
  hoverable: boolean;
  highlightAll: boolean;
  stationToHighlight: Station | null;
  stations: Station[];
  cargos: Cargo[];
  initialStationCapacity: number;
  onStationClick: (station: Station) => void;
}

export default function StationsRenderer({
  hoverable,
  highlightAll,
  stationToHighlight,
  stations,
  cargos,
  initialStationCapacity,
  onStationClick,
}: StationsRendererProps) {
  return stations.map((station) => {
    const { x, y } = pointToBoardPoint(station.position);

    const stationCargos = cargos.filter((cargo) => cargo.stationId === station.id);

    const emergency = stationCargos.length / station.capacity > 0.75;

    const stationWrapperClass = [
      styles.stationWrapper,
      getTypeClass(station.cargoType),
      emergency ? styles.emergency : '',
      hoverable ? styles.hoverable : '',
      highlightAll ? styles.highlighted : '',
      station.capacity > initialStationCapacity ? styles.upgraded : '',
      stationToHighlight && stationToHighlight.id === station.id ? styles.highlighted : '',
    ].join(' ');

    return (
      <div
        key={`station-group-${station.id}`}
        id={`station-${station.id}`}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        className={styles.stationAnchor}
      >
        <div className={stationWrapperClass} onClick={() => onStationClick(station)}>
          <div className={styles.stationBody} />
          {stationCargos.length > 0 && (
            <div className={styles.cargosWrapper}>
              {stationCargos.map((cargo) => (
                <CargoRenderer key={`station-cargo-${cargo.id}`} type={cargo.cargoType} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  });
}

// support
const getTypeClass = (cargoType: CargoType) => {
  switch (cargoType) {
    case 'DB':
      return styles.cargoTypeDB;
    case 'GATEWAY':
      return styles.cargoTypeGateway;
    case 'REACT':
      return styles.cargoTypeReact;
    case 'REDIS':
      return styles.cargoTypeRedis;
    default:
      return '';
  }
};
