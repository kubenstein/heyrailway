import { useState, MouseEvent } from 'react';
import { LineRenderer, SegmentRenderer } from './renderers/RailwaysRenderer';
import { Point, Line, Station } from '../lib/types';
import randomId from '../lib/randomId';
import { eToBoardPoint } from '../lib/board';

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

  // actions
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const station = stationAtPoint(eToBoardPoint(e));
    if (!station) return;
    if (lastStation?.id === station.id) return;

    setLineStations([...lineStations, station]);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const point = eToBoardPoint(e);
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
    <div
      className="line-editor"
      onClick={onClick}
      onMouseMove={onMouseMove}
      onDoubleClick={onDoubleClick}
    >
      <LineRenderer line={appliedLine} type="blue" />
      {hoveringSegment && (
        <SegmentRenderer segment={hoveringSegment} type="dashed" />
      )}
    </div>
  );
}
