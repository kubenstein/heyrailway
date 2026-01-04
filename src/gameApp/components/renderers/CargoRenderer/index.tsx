import { CSSProperties } from 'react';
import { Cargo, CargoType } from '../../../lib/types';
import styles from './CargoRenderer.module.css';

interface CargoRendererProps {
  size?: number;
  cargo: Cargo;
}

export default function CargoRenderer({ cargo, size = 12 }: CargoRendererProps) {
  const className = [styles.host, getTypeClass(cargo.cargoType)].join(' ');
  let routeString: string;
  if (cargo.stationIdsRoute[0] == 'NO_PATH') {
    routeString = 'No route available';
  } else {
    routeString = '● → ' + cargo.stationIdsRoute.join(' → ');
  }

  return (
    <div
      title={`Route:\n${routeString}`}
      className={className}
      style={{ '--local-size': `${size}px` } as CSSProperties}
    />
  );
}

// support
const getTypeClass = (cargoType: CargoType) => {
  switch (cargoType) {
    case 'DB':
      return styles.cargoTypeDB;
    case 'GATEWAY':
      return styles.cargoTypeGateway;
    case 'NEXT':
      return styles.cargoTypeNext;
    case 'TEMPORAL':
      return styles.cargoTypeTemporal;
    case 'REDIS':
      return styles.cargoTypeRedis;
    default:
      return '';
  }
};
