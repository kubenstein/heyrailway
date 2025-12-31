import { Cargo, CargoType, Station } from '../../../lib/types';
import { pointToBoardPoint } from '../../../lib/board';
import styles from './StationsRenderer.module.css';

interface StationsRendererProps {
  stations: Station[];
  cargos: Cargo[];
  onStationClick: (station: Station) => void;
}

export default function StationsRenderer({
  stations,
  cargos,
  onStationClick,
}: StationsRendererProps) {
  const typeToShapeClass = (cargoType: CargoType) => {
    switch (cargoType) {
      case 'CIRCLE':
        return styles.circle;
      case 'TRIANGLE':
        return styles.triangle;
      default:
        return undefined;
    }
  };

  const renderStation = (station: Station) => {
    const { x, y } = pointToBoardPoint(station.position);
    const cargoShapes = cargos
      .filter((cargo) => cargo.stationId === station.id)
      .map((cargo, index) => {
        const cargoOffsetX = (index % 5) * 10 - 20; // 5 per row, spaced 10px
        const cargoOffsetY = 20 + Math.floor(index / 5) * 10;

        const cargoClassName = [
          styles.cargoShapeStation,
          typeToShapeClass(cargo.cargoType),
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={`cargo-${cargo.id}`}
            className={styles.boardAnchor}
            style={{
              transform: `translate(${cargoOffsetX}px, ${cargoOffsetY}px)`,
            }}
          >
            <div className={cargoClassName} />
          </div>
        );
      });

    const stationClassName = [
      styles.stationShape,
      typeToShapeClass(station.cargoType),
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        key={`station-group-${station.id}`}
        className={styles.boardAnchor}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        onClick={() => onStationClick(station)}
      >
        <div className={stationClassName} />
        {cargoShapes}
      </div>
    );
  };

  return <>{stations.map(renderStation)}</>;
}
