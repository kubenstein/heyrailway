import { Station } from '../../lib/types';

interface StationsRendererProps {
  stations: Station[];
}

export default function StationsRenderer({ stations }: StationsRendererProps) {
  const renderShape = (station: Station) => {
    const x = station.position.x * 20 + 10;
    const y = station.position.y * 20 + 10;
    const size = 16;

    switch (station.cargoType) {
      case 'CIRCLE':
        return (
          <circle
            key={`station-${station.id}`}
            cx={x}
            cy={y}
            r={8}
            fill="blue"
          />
        );
      case 'SQUARE':
        return (
          <rect
            key={`station-${station.id}`}
            x={x - size / 2}
            y={y - size / 2}
            width={size}
            height={size}
            fill="blue"
          />
        );
      case 'TRIANGLE':
        return (
          <polygon
            key={`station-${station.id}`}
            points={`${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}`}
            fill="blue"
          />
        );
      default:
        return (
          <circle
            key={`station-${station.id}`}
            cx={x}
            cy={y}
            r={8}
            fill="blue"
          />
        );
    }
  };

  return <>{stations.map(renderShape)}</>;
}
