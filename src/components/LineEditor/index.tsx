import { useState, MouseEvent } from 'react';
import { LineRenderer } from '../renderers/RailwaysRenderer';
import { Point, Line, Station, CargoType, LineId } from '../../lib/types';
import { eToBoardPoint } from '../../lib/board';
import styles from './LineEditor.module.css';

interface LineEditorProps {
  lines: Line[];
  stations: Station[];
  availableLines: number;
  onLineCreate: (line: Line) => void;
}

export default function LineEditor({
  stations,
  lines,
  availableLines,
  onLineCreate,
}: LineEditorProps) {
  const [lineStations, setLineStations] = useState<Station[]>([]);
  const [hoveringPoint, setHoveringPoint] = useState<Point | null>(null);

  const lastStation = lineStations[lineStations.length - 1];

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
    if (lineStations.length >= 2) createLine();
    setLineStations([]);
  };

  // support
  const createLine = () => {
    const ids: LineId[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const availableIds = ids.filter(
      (id) => !lines.find((line) => line.id === id)
    );
    const id = availableIds[Math.floor(Math.random() * availableIds.length)];

    onLineCreate({
      id,
      stations: lineStations,
    });
  };

  const stationAtPoint = (point: Point) =>
    stations.find((s) => s.position.x === point.x && s.position.y === point.y);

  // render
  const editingLine: Line = {
    id: -1,
    stations: [
      ...lineStations,
      ...(hoveringPoint
        ? [
            {
              id: 'hovering',
              position: hoveringPoint,
              cargoType: 'fake' as CargoType,
              capacity: -1,
            },
          ]
        : []),
    ],
  };

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
      <LineRenderer line={editingLine} />
    </div>
  );
}
