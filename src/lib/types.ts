export type Point = { x: number; y: number };

export type CargoType = "TRIANGLE" | "CIRCLE" | "SQUARE";
export type Cargo = { id: number; cargoType: CargoType };
export type Station = { id: number; position: Point, cargoType: CargoType, cargos: Cargo[] };
export type LineSegment = { start: Station; end: Station };
export type Line = { id: number; segments: LineSegment[] };
export type Cart = { id: number; line: Line, cargos: Cargo[] };
