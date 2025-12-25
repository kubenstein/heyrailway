export type Point = { x: number; y: number };

export type LineSegment = { start: Point; end: Point };

export type Line = { segments: LineSegment[] };

export type Station = { position: Point };
