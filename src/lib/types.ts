export type Point = { x: number; y: number };

export type LineSegment = { start: Point; end: Point };
export type Line = { id: number; segments: LineSegment[] };
export type Station = { id: number; position: Point };
export type Cart = { id: number; line: Line };
