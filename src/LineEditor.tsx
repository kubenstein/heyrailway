import { useState } from 'react';
import Railways from './Railways';
import { Point, LineSegment, Line } from './types';

interface LineEditorProps {
  stations: Point[];
  onLineCreated: (line: Line) => void;
}

export default function LineEditor({ stations, onLineCreated }: LineEditorProps) {
  const [editingLine, setEditingLine] = useState<{ segments: LineSegment[]; currentStart: Point | null } | null>(null);
  const [hovered, setHovered] = useState<Point | null>(null);

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

  const handleSvgClick = (e: React.MouseEvent<SVGGElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20);
    const y = Math.floor((e.clientY - rect.top) / 20);
    const point = { x: Math.max(0, Math.min(99, x)), y: Math.max(0, Math.min(99, y)) };
    handleClick(point.y, point.x);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 20);
    const y = Math.floor((e.clientY - rect.top) / 20);
    setHovered({ y, x: Math.max(0, Math.min(99, x)) });
  };

  const handleSvgMouseLeave = () => {
    setHovered(null);
  };

  const handleSvgDoubleClick = () => {
    if (editingLine) {
      onLineCreated({ segments: editingLine.segments });
      setEditingLine(null);
    }
  };

  return (
    <g
      onClick={handleSvgClick}
      onMouseMove={handleSvgMouseMove}
      onMouseLeave={handleSvgMouseLeave}
      onDoubleClick={handleSvgDoubleClick}
    >
      <rect x="0" y="0" width="2000" height="2000" fill="transparent" />
      {editingLine && <Railways lines={[{ segments: editingLine.segments }]} color="orange" />}
      {editingLine && editingLine.currentStart && hovered && (editingLine.currentStart.y !== hovered.y || editingLine.currentStart.x !== hovered.x) && <Railways lines={[{ segments: [{ start: editingLine.currentStart, end: hovered }] }]} color="blue" strokeDasharray="5,5" />}
    </g>
  );
}
