export type EditMode =
  | 'idle'
  | 'addLine'
  | 'editLine'
  | 'addCart'
  | 'upgrateStation'
  | 'upgradeCart';

export type CargoType = 'TRIANGLE' | 'CIRCLE' | 'SQUARE';
export type LineId = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Point = { x: number; y: number };
export type Station = {
  id: string;
  position: Point;
  cargoType: CargoType;
  capacity: number;
};
export type Line = {
  id: LineId;
  stations: Station[];
};
export type Cart = {
  id: string;
  line: Line;
  capacity: number;
  createdAt: number;
  points: number;
};
export type Cargo = {
  id: string;
  cargoType: CargoType;
  stationId: Station['id'] | null;
  cartId: Cart['id'] | null;
  stationIdsRoute: Station['id'][];
};
