import { useState } from 'react';

type Point = { x: number; y: number };

type LineSegment = { start: Point; end: Point };

export default function App() {
  const [lineSegments, setLineSegments] = useState<LineSegment[]>([]);
  const [editStart, setEditStart] = useState<Point | null>(null);
  const [hovered, setHovered] = useState<Point | null>(null);

  const handleClick = (y: number, x: number) => {
    if (editStart) {
      if (editStart.y === y && editStart.x === x) {
        setEditStart(null);
      } else {
        setLineSegments([...lineSegments, { start: editStart, end: { y, x } }]);
        setEditStart(null);
      }
    } else {
      setEditStart({ y, x });
    }
  };

  const isSelected = (y: number, x: number) => {
    return (
      (editStart && editStart.y === y && editStart.x === x) ||
      lineSegments.some(segment =>
        (segment.start.y === y && segment.start.x === x) ||
        (segment.end.y === y && segment.end.x === x)
      )
    );
  };

  return (
    <main className="app">
      <svg className="grid-svg" width={2000} height={2000}>
        {Array.from({ length: 100 * 100 }, (_, i) => {
          const y = Math.floor(i / 100);
          const x = i % 100;
          return (
            <rect
              key={i}
              x={x * 20}
              y={y * 20}
              width={20}
              height={20}
              stroke="#ccc"
              fill={isSelected(y, x) ? 'yellow' : 'white'}
              onClick={() => handleClick(y, x)}
              onMouseEnter={() => setHovered({ y, x })}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        {lineSegments.map((segment, index) => {
          const isDiagonal = segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;
          if (isDiagonal) {
            const pivot = { x: segment.end.x, y: segment.start.y };
            return [
              <line
                key={`${index}-1`}
                x1={segment.start.x * 20 + 10}
                y1={segment.start.y * 20 + 10}
                x2={pivot.x * 20 + 10}
                y2={pivot.y * 20 + 10}
                stroke="red"
                strokeWidth={2}
              />,
              <line
                key={`${index}-2`}
                x1={pivot.x * 20 + 10}
                y1={pivot.y * 20 + 10}
                x2={segment.end.x * 20 + 10}
                y2={segment.end.y * 20 + 10}
                stroke="red"
                strokeWidth={2}
              />
            ];
          } else {
            return (
              <line
                key={index}
                x1={segment.start.x * 20 + 10}
                y1={segment.start.y * 20 + 10}
                x2={segment.end.x * 20 + 10}
                y2={segment.end.y * 20 + 10}
                stroke="red"
                strokeWidth={2}
              />
            );
          }
        })}
        {editStart && hovered && (editStart.y !== hovered.y || editStart.x !== hovered.x) && (() => {
          const tempSegment = { start: editStart, end: hovered };
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
      </svg>
    </main>
  );
}

