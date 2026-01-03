import { CargoType } from './types';

export const cargoTypes: CargoType[] = ['DB', 'REACT', 'GATEWAY', 'REDIS'];

export function randomCargoType(types: CargoType[] = cargoTypes): CargoType {
  return types[Math.floor(Math.random() * types.length)];
}
