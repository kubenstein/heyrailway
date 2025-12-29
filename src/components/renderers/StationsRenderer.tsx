import { Cargo, Station } from '../../lib/types';

interface StationsRendererProps {
  stations: Station[];
  cargos: Cargo[];
}

export default function StationsRenderer({ stations, cargos }: StationsRendererProps) {
  const renderStation = (station: Station) => {
    const x = station.position.x * 20 + 10;
    const y = station.position.y * 20 + 10;
    const size = 16;

    let stationShape;
    switch (station.cargoType) {
      case 'CIRCLE':
        stationShape = (
          <circle
            key={`station-${station.id}`}
            cx={x}
            cy={y}
            r={8}
            fill="blue"
          />
        );
        break;
      case 'SQUARE':
        stationShape = (
          <rect
            key={`station-${station.id}`}
            x={x - size / 2}
            y={y - size / 2}
            width={size}
            height={size}
            fill="blue"
          />
        );
        break;
      case 'TRIANGLE':
        stationShape = (
          <polygon
            key={`station-${station.id}`}
            points={`${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}`}
            fill="blue"
          />
        );
        break;
      default:
        stationShape = (
          <circle
            key={`station-${station.id}`}
            cx={x}
            cy={y}
            r={8}
            fill="blue"
          />
        );
    }

    const cargoShapes = cargos
      .filter(cargo => cargo.stationId === station.id)
      .map((cargo, index) => {
        const cargoX = x + (index % 5) * 10 - 20; // 5 per row, spaced 10px
        const cargoY = y + 20 + Math.floor(index / 5) * 10;
        const cargoSize = 6;

        switch (cargo.cargoType) {
          case 'CIRCLE':
            return (
              <circle
                key={`cargo-${cargo.id}`}
                cx={cargoX}
                cy={cargoY}
                r={3}
                fill="red"
              />
            );
          case 'SQUARE':
            return (
              <rect
                key={`cargo-${cargo.id}`}
                x={cargoX - cargoSize / 2}
                y={cargoY - cargoSize / 2}
                width={cargoSize}
                height={cargoSize}
                fill="red"
              />
            );
          case 'TRIANGLE':
            return (
              <polygon
                key={`cargo-${cargo.id}`}
                points={`${cargoX},${cargoY - cargoSize / 2} ${cargoX - cargoSize / 2},${cargoY + cargoSize / 2} ${cargoX + cargoSize / 2},${cargoY + cargoSize / 2}`}
                fill="red"
              />
            );
          default:
            return null;
        }
      });

    return (
      <g key={`station-group-${station.id}`}>
        {stationShape}
        {cargoShapes}
      </g>
    );
  };

  return <>{stations.map(renderStation)}</>;
}
