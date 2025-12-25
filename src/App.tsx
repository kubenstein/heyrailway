import { useState } from 'react';
import Stations from './Stations';
import Railways from './Railways';

type Point = { x: number; y: number };

type LineSegment = { start: Point; end: Point };

type Line = { segments: LineSegment[] };

export default function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [editingLine, setEditingLine] = useState<{ segments: LineSegment[]; currentStart: Point | null } | null>(null);
  const [hovered, setHovered] = useState<Point | null>(null);
  const [stations, setStations] = useState<Point[]>(() => {
    const points: Point[] = [];
    for (let i = 0; i < 10; i++) {
      points.push({ x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) });
    }
    return points;
  });

  const isStation = (point: Point) => stations.some(s => s.x === point.x && s.y === point.y);

  const handleClick = (y: number, x: number) => {
    const point = { x, y };
    if (!editingLine) {
      if (isStation(point)) {
        setEditingLine({ segments: [], currentStart: point });
      }
    } else if (editingLine.currentStart) {
      if (isStation(point)) {
        const newSegment = { start: editingLine.currentStart, end: point };
        setEditingLine({
          segments: [...editingLine.segments, newSegment],
          currentStart: point
        });
      }
    }
  };

  const getGridPos = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20);
    const y = Math.floor((e.clientY - rect.top) / 20);
    return { x: Math.max(0, Math.min(99, x)), y: Math.max(0, Math.min(99, y)) };
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const { y, x } = getGridPos(e);
    handleClick(y, x);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const { y, x } = getGridPos(e);
    setHovered({ y, x });
  };

  const handleSvgMouseLeave = () => {
    setHovered(null);
  };

  const handleSvgDoubleClick = () => {
    if (editingLine) {
      setLines([...lines, { segments: editingLine.segments }]);
      setEditingLine(null);
    }
  };

  return (
    <main className="app">
      <svg
        className="grid-svg"
        width={2000}
        height={2000}
        onClick={handleSvgClick}
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={handleSvgMouseLeave}
        onDoubleClick={handleSvgDoubleClick}
      >
        <Stations stations={stations} />
        <Railways lines={lines} />

        {editingLine && <Railways lines={[{ segments: editingLine.segments }]} color="orange" />}
        {editingLine && editingLine.currentStart && hovered && (editingLine.currentStart.y !== hovered.y || editingLine.currentStart.x !== hovered.x) && <Railways lines={[{ segments: [{ start: editingLine.currentStart, end: hovered }] }]} color="blue" strokeDasharray="5,5" />}

      </svg>
    </main>
  );
}

