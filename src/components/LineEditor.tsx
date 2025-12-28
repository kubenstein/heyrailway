import { useState } from 'react';
import { LineRenderer, SegmentRenderer } from './renderers/RailwaysRenderer';
import { Point, LineSegment, Line, Station } from '../lib/types';
import generateId from '../lib/id';

type MouseEvent = React.MouseEvent<SVGGElement>;

interface LineEditorProps {
  stations: Station[];
  onLineCreate: (line: Line) => void;
}

export default function LineEditor({ stations, onLineCreate }: LineEditorProps) {
  const [segments, setSegments] = useState<LineSegment[]>([]);
  const [startingStation, setStartingStation] = useState<Station | null>(null);
  const [hoveringPoint, setHoveringPoint] = useState<Point | null>(null);

  const onClick = (e: MouseEvent) => {
    const station = stationAtPoint(eToPoint(e));
    if (!station) return;

    if (startingStation) {
      const newSegment = { start: startingStation, end: station };
      setSegments([...segments, newSegment]);
    }
    setStartingStation(station);
  };

  const onMouseMove = (e: MouseEvent) => {
    const point = eToPoint(e);
    setHoveringPoint(point);
  };

  const onDoubleClick = () => {
    onLineCreate({ id: generateId(), segments });
    setSegments([]);
    setStartingStation(null);
  };


  // support
  const stationAtPoint = (point: Point) => stations.find(s => s.position.x === point.x && s.position.y === point.y);

  const eToPoint = (e: MouseEvent) => {
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20);
    const y = Math.floor((e.clientY - rect.top) / 20);
    const point: Point = { x, y };
    return point;
  }

  const hoveringSegment: LineSegment | null = startingStation && hoveringPoint && {
    start: startingStation,
    end: { position: hoveringPoint } as Station
  };
  const appliedLine: Line = { id: 0, segments };

  return (
    <g
      onClick={onClick}
      onMouseMove={onMouseMove}
      onDoubleClick={onDoubleClick}
    >
      <rect x="0" y="0" width="2000" height="2000" fill="transparent" />
      <LineRenderer line={appliedLine} type="blue" />
      {hoveringSegment && <SegmentRenderer segment={hoveringSegment} type="dashed" />}
    </g>
  );
}
