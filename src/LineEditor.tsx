import { useState } from 'react';
import { LineRenderer, SegmentRenderer } from './RailwaysRenderer';
import { Point, LineSegment, Line, Station } from './types';

type MouseEvent = React.MouseEvent<SVGGElement>;

interface LineEditorProps {
  stations: Station[];
  onLineCreated: (line: Line) => void;
}

export default function LineEditor({ stations, onLineCreated }: LineEditorProps) {
  const [segments, setSegments] = useState<LineSegment[]>([]);
  const [startingPoint, setStartingPoint] = useState<Point | null>(null);
  const [hoveringPoint, setHoveringPoint] = useState<Point | null>(null);

  const onClick = (e: MouseEvent) => {
    const point = eToPoint(e);
    if (!isStation(point)) return;

    if (startingPoint) {
      const newSegment = { start: startingPoint, end: point };
      setSegments([...segments, newSegment]);
    }
    setStartingPoint(point);
  };

  const onMouseMove = (e: MouseEvent) => {
    const point = eToPoint(e);
    setHoveringPoint(point);
  };

  const onDoubleClick = () => {
    onLineCreated({ id: Date.now(), segments });
    setSegments([]);
    setStartingPoint(null);
  };


  // support
  const isStation = (point: Point) => stations.some(s => s.position.x === point.x && s.position.y === point.y);

  const eToPoint = (e: MouseEvent) => {
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20);
    const y = Math.floor((e.clientY - rect.top) / 20);
    const point: Point = { x, y };
    return point;
  }

  const hoveringSegment: LineSegment | null = startingPoint && hoveringPoint && { start: startingPoint, end: hoveringPoint };
  const appliedLine: Line = { id: 0, segments };

  return (
    <g
      onClick={onClick}
      onMouseMove={onMouseMove}
      onDoubleClick={onDoubleClick}
    >
      <rect x="0" y="0" width="2000" height="2000" fill="transparent" />
      <LineRenderer line={appliedLine} color="orange" />
      {hoveringSegment && <SegmentRenderer segment={hoveringSegment} color="blue" strokeDasharray="5,5" />}
    </g>
  );
}
