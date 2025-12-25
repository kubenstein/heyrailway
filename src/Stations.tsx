import React from 'react';

type Point = { x: number; y: number };

interface StationsProps {
  points: Point[];
}

const Stations: React.FC<StationsProps> = ({ points }) => {
  return (
    <>
      {points.map((point, index) => (
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

export default Stations;
