import { useState } from 'react';
import { LineRenderer, SegmentRenderer } from './renderers/RailwaysRenderer';
import { Point, Line, Station } from '../lib/types';
import randomId from '../lib/randomId';

type MouseEvent = React.MouseEvent<SVGGElement>;

interface LineEditorProps {
  stations: Station[];
  onLineCreate: (line: Line) => void;
}

export default function LineEditor({
  stations,
  onLineCreate,
}: LineEditorProps) {
  const [lineStations, setLineStations] = useState<Station[]>([]);
  const [hoveringPoint, setHoveringPoint] = useState<Point | null>(null);

  const lastStation = lineStations[lineStations.length - 1];

  // support
  const stationAtPoint = (point: Point) =>
    stations.find((s) => s.position.x === point.x && s.position.y === point.y);

  const eToPoint = (e: MouseEvent) => {
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20);
    const y = Math.floor((e.clientY - rect.top) / 20);
    const point: Point = { x, y };
    return point;
  };

  // actions
  const onClick = (e: MouseEvent) => {
    const station = stationAtPoint(eToPoint(e));
    if (!station) return;
    if (lastStation?.id === station.id) return;

    setLineStations([...lineStations, station]);
  };

  const onMouseMove = (e: MouseEvent) => {
    const point = eToPoint(e);
    setHoveringPoint(point);
  };

  const onDoubleClick = () => {
    if (lineStations.length >= 2) {
      onLineCreate({ id: randomId(), stations: lineStations });
    }
    setLineStations([]);
  };

  // render
  const hoveringSegment =
    lastStation && hoveringPoint
      ? { start: lastStation.position, end: hoveringPoint }
      : null;
  const appliedLine: Line = { id: 'editor', stations: lineStations };

  return (
    <g
      onClick={onClick}
      onMouseMove={onMouseMove}
      onDoubleClick={onDoubleClick}
    >
      <rect x="0" y="0" width="2000" height="2000" fill="transparent" />
      <LineRenderer line={appliedLine} type="blue" />
      {hoveringSegment && (
        <SegmentRenderer segment={hoveringSegment} type="dashed" />
      )}
    </g>
  );
}
