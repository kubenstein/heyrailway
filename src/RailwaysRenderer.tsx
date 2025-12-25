import { Line, LineSegment } from './types';

interface RailwaysRendererProps {
  lines: Line[];
  color?: string;
  strokeDasharray?: string;
}

interface LineRendererProps {
  line: Line;
  color: string;
  strokeDasharray?: string;
}

interface SegmentRendererProps {
  segment: LineSegment;
  color: string;
  strokeDasharray?: string;
}

export function SegmentRenderer({ segment, color, strokeDasharray }: SegmentRendererProps) {
  const isDiagonal = segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;
  if (isDiagonal) {
    const pivot = { x: segment.end.x, y: segment.start.y };
    return (
      <>
        <line
          x1={segment.start.x * 20 + 10}
          y1={segment.start.y * 20 + 10}
          x2={pivot.x * 20 + 10}
          y2={pivot.y * 20 + 10}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={strokeDasharray}
        />
        <line
          x1={pivot.x * 20 + 10}
          y1={pivot.y * 20 + 10}
          x2={segment.end.x * 20 + 10}
          y2={segment.end.y * 20 + 10}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={strokeDasharray}
        />
      </>
    );
  } else {
    return (
      <line
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
}

export function LineRenderer({ line, color, strokeDasharray }: LineRendererProps) {
  return line.segments.map((segment, index) => (
    <SegmentRenderer
      key={`line-${index}`}
      segment={segment}
      color={color}
      strokeDasharray={strokeDasharray}
    />
  ));
}

export default function RailwaysRenderer({ lines, color = "red", strokeDasharray }: RailwaysRendererProps) {
  return lines.map((line, index) => (
    <LineRenderer
      key={`line-${index}`}
      line={line}
      color={color}
      strokeDasharray={strokeDasharray}
    />
  ));
}
