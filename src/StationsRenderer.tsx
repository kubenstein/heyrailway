import { Point } from './types';

interface StationsRendererProps {
  stations: Point[];
}

export default function StationsRenderer({ stations }: StationsRendererProps) {
  return (
    <>
      {stations.map((point, index) => (
        <circle
          key={`point-${index}`}
          cx={point.x * 20 + 10}
          cy={point.y * 20 + 10}
          r={8}
          fill="yellow"
        />
      ))}
    </>
  );
};
