import { Station } from '../../lib/types';

interface StationsRendererProps {
  stations: Station[];
}

export default function StationsRenderer({ stations }: StationsRendererProps) {
  return stations.map((station) => (
    <circle
      key={`station-${station.id}`}
      cx={station.position.x * 20 + 10}
      cy={station.position.y * 20 + 10}
      r={8}
      fill="yellow"
    />
  ))
};
