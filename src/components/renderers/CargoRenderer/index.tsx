import { CSSProperties } from 'react';
import { CargoType } from '../../../lib/types';
import styles from './CargoRenderer.module.css';

interface CargoRendererProps {
  size?: number;
  type: CargoType;
}

export default function CargoRenderer({ type, size = 12 }: CargoRendererProps) {
  const className = [styles.cargo, getTypeClass(type)].join(' ');

  return (
    <div
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
    case 'REACT':
      return styles.cargoTypeReact;
    case 'REDIS':
      return styles.cargoTypeRedis;
    default:
      return '';
  }
};
