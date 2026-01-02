import { CargoType } from '../../../lib/types';
import styles from './CargoRenderer.module.css';

interface CargoRendererProps {
  type: CargoType;
}

export default function CargoRenderer({ type }: CargoRendererProps) {
  const className = [styles.cargo, getTypeClass(type)].join(' ');

  return <div className={className} />;
}

// support
const getTypeClass = (cargoType: CargoType) => {
  switch (cargoType) {
    case 'TRIANGLE':
      return styles.cargoTypeTriangle;
    case 'SQUARE':
      return styles.cargoTypeSquare;
    case 'CIRCLE':
      return styles.cargoTypeCircle;
    default:
      return '';
  }
};
