import React from 'react';
import { Point } from './types';

interface StationsProps {
  stations: Point[];
}

const Stations: React.FC<StationsProps> = ({ stations }) => {
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

export default Stations;
