export type Point = { x: number; y: number };

export type CargoType = "TRIANGLE" | "CIRCLE" | "SQUARE";
export type Cargo = { id: number; cargoType: CargoType; stationId: number | null, cartId: number | null; stationIdsRoute: number[] };
export type Station = { id: number; position: Point; cargoType: CargoType };
export type Line = { id: number; stations: Station[] };
export type Cart = { id: number; line: Line; capacity: number };
