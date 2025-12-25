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

  const handleClick = (y: number, x: number) => {
    if (!editingLine) {
      setEditingLine({ segments: [], currentStart: { y, x } });
    } else if (editingLine.currentStart) {
      const newSegment = { start: editingLine.currentStart, end: { y, x } };
      setEditingLine({
        segments: [...editingLine.segments, newSegment],
        currentStart: { y, x }
      });
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

  const getSelectedPoints = () => {
    const points = new Set<string>();
    lines.forEach(line => {
      line.segments.forEach(segment => {
        points.add(`${segment.start.x},${segment.start.y}`);
        points.add(`${segment.end.x},${segment.end.y}`);
      });
    });
    if (editingLine) {
      editingLine.segments.forEach(segment => {
        points.add(`${segment.start.x},${segment.start.y}`);
        points.add(`${segment.end.x},${segment.end.y}`);
      });
      if (editingLine.currentStart) {
        points.add(`${editingLine.currentStart.x},${editingLine.currentStart.y}`);
      }
    }
    return Array.from(points).map(str => {
      const [x, y] = str.split(',').map(Number);
      return { x, y };
    });
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
        <Railways lines={lines} />

        {editingLine && editingLine.segments.map((segment, index) => {
          const isDiagonal = segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;
          if (isDiagonal) {
            const pivot = { x: segment.end.x, y: segment.start.y };
            return [
              <line
                key={`edit-${index}-1`}
                x1={segment.start.x * 20 + 10}
                y1={segment.start.y * 20 + 10}
                x2={pivot.x * 20 + 10}
                y2={pivot.y * 20 + 10}
                stroke="orange"
                strokeWidth={2}
              />,
              <line
                key={`edit-${index}-2`}
                x1={pivot.x * 20 + 10}
                y1={pivot.y * 20 + 10}
                x2={segment.end.x * 20 + 10}
                y2={segment.end.y * 20 + 10}
                stroke="orange"
                strokeWidth={2}
              />
            ];
          } else {
            return (
              <line
                key={`edit-${index}`}
                x1={segment.start.x * 20 + 10}
                y1={segment.start.y * 20 + 10}
                x2={segment.end.x * 20 + 10}
                y2={segment.end.y * 20 + 10}
                stroke="orange"
                strokeWidth={2}
              />
            );
          }
        })}
        {editingLine && editingLine.currentStart && hovered && (editingLine.currentStart.y !== hovered.y || editingLine.currentStart.x !== hovered.x) && (() => {
          const tempSegment = { start: editingLine.currentStart!, end: hovered };
          const isDiagonal = tempSegment.start.x !== tempSegment.end.x && tempSegment.start.y !== tempSegment.end.y;
          if (isDiagonal) {
            const pivot = { x: tempSegment.end.x, y: tempSegment.start.y };
            return [
              <line
                key="temp-1"
                x1={tempSegment.start.x * 20 + 10}
                y1={tempSegment.start.y * 20 + 10}
                x2={pivot.x * 20 + 10}
                y2={pivot.y * 20 + 10}
                stroke="blue"
                strokeWidth={2}
                strokeDasharray="5,5"
              />,
              <line
                key="temp-2"
                x1={pivot.x * 20 + 10}
                y1={pivot.y * 20 + 10}
                x2={tempSegment.end.x * 20 + 10}
                y2={tempSegment.end.y * 20 + 10}
                stroke="blue"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            ];
          } else {
            return (
              <line
                key="temp"
                x1={tempSegment.start.x * 20 + 10}
                y1={tempSegment.start.y * 20 + 10}
                x2={tempSegment.end.x * 20 + 10}
                y2={tempSegment.end.y * 20 + 10}
                stroke="blue"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            );
          }
        })()}


        <Stations points={getSelectedPoints()} />
      </svg>
    </main>
  );
}

