import React from 'react';

type Point = { x: number; y: number };

type LineSegment = { start: Point; end: Point };

type Line = { segments: LineSegment[] };

interface RailwaysProps {
  lines: Line[];
}

const Railways: React.FC<RailwaysProps> = ({ lines }) => {
  return (
    <>
      {lines.flatMap(line => line.segments).map((segment, index) => {
        const isDiagonal = segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;
        if (isDiagonal) {
          const pivot = { x: segment.end.x, y: segment.start.y };
          return [
            <line
              key={`line-${index}-1`}
              x1={segment.start.x * 20 + 10}
              y1={segment.start.y * 20 + 10}
              x2={pivot.x * 20 + 10}
              y2={pivot.y * 20 + 10}
              stroke="red"
              strokeWidth={2}
            />,
            <line
              key={`line-${index}-2`}
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
              key={`line-${index}`}
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
    </>
  );
};

export default Railways;
