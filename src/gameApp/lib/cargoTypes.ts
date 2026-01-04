import { CargoType } from './types';

export const cargoTypes: CargoType[] = ['DB', 'NEXT', 'TEMPORAL', 'GATEWAY', 'REDIS'];

export function randomCargoType(types: CargoType[] = cargoTypes): CargoType {
  return types[Math.floor(Math.random() * types.length)];
}
