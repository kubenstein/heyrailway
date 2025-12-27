export type Point = { x: number; y: number };

export type Station = { id: number; position: Point };
export type LineSegment = { start: Station; end: Station };
export type Line = { id: number; segments: LineSegment[] };
export type Cart = { id: number; line: Line };
