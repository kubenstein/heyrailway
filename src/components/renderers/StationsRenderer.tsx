import { Cargo, Station } from '../../lib/types';
import { pointToBoardPoint } from '../../lib/board';

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
  const renderStation = (station: Station) => {
    const { x, y } = pointToBoardPoint(station.position);

    const cargoShapes = cargos
      .filter((cargo) => cargo.stationId === station.id)
      .map((cargo, index) => {
        const cargoOffsetX = (index % 5) * 10 - 20; // 5 per row, spaced 10px
        const cargoOffsetY = 20 + Math.floor(index / 5) * 10;

        return (
          <div
            key={`cargo-${cargo.id}`}
            className="board-anchor"
            style={{
              transform: `translate(${cargoOffsetX}px, ${cargoOffsetY}px)`,
            }}
          >
            <div
              className={`cargo-shape cargo-shape--station cargo-shape--${cargo.cargoType.toLowerCase()}`}
            />
          </div>
        );
      });

    return (
      <div
        key={`station-group-${station.id}`}
        className="board-anchor"
        style={{ transform: `translate(${x}px, ${y}px)` }}
        onClick={() => onStationClick(station)}
      >
        <div
          className={`station-shape station-shape--${station.cargoType.toLowerCase()}`}
        />
        {cargoShapes}
      </div>
    );
  };

  return <>{stations.map(renderStation)}</>;
}
