import { useState, MouseEvent } from 'react';
import { LineRenderer, SegmentRenderer } from '../renderers/RailwaysRenderer';
import { Point, Line, Station } from '../../lib/types';
import randomId from '../../lib/randomId';
import { eToBoardPoint } from '../../lib/board';
import styles from './LineEditor.module.css';

interface LineEditorProps {
  stations: Station[];
  availableLines: number;
  onLineCreate: (line: Line) => void;
}

export default function LineEditor({
  stations,
  availableLines,
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

  return availableLines <= 0 ? (
    <div className={styles.info}>
      No available lines left. Please upgrade to add more lines.
    </div>
  ) : (
    <div
      className={styles.lineEditor}
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
