import { Point } from './types';

interface StationsProps {
  stations: Point[];
}

export default function Stations({ stations }: StationsProps) {
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
