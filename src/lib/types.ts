export type CargoType = "TRIANGLE" | "CIRCLE" | "SQUARE";
export type Point = { x: number; y: number };
export type Cargo = { id: string; cargoType: CargoType; stationId: Station["id"] | null, cartId: Cart["id"] | null; stationIdsRoute: Station["id"][] };
export type Station = { id: string; position: Point; cargoType: CargoType };
export type Line = { id: string; stations: Station[] };
export type Cart = { id: string; line: Line };
