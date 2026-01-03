import { CargoType } from './types';

export default function randomCargoType(cargoTypes: CargoType[] = ['DB', 'REACT', 'GATEWAY', 'REDIS']): CargoType {
  return cargoTypes[Math.floor(Math.random() * cargoTypes.length)];
}
