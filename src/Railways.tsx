import { Line } from './types';

interface RailwaysProps {
  lines: Line[];
  color?: string;
  strokeDasharray?: string;
}

export default function Railways({ lines, color = "red", strokeDasharray }: RailwaysProps) {
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
              stroke={color}
              strokeWidth={2}
              strokeDasharray={strokeDasharray}
            />,
            <line
              key={`line-${index}-2`}
              x1={pivot.x * 20 + 10}
              y1={pivot.y * 20 + 10}
              x2={segment.end.x * 20 + 10}
              y2={segment.end.y * 20 + 10}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={strokeDasharray}
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
              stroke={color}
              strokeWidth={2}
              strokeDasharray={strokeDasharray}
            />
          );
        }
      })}
    </>
  );
};
