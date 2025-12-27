import { Line, LineSegment } from '../../lib/types';

const typesToProps = {
  red: {
    stroke: 'red',
    strokeDasharray: "",
  },
  blue: {
    stroke: 'blue',
    strokeDasharray: "",
  },
  green: {
    stroke: 'green',
    strokeDasharray: "",
  },
  dashed: {
    stroke: 'black',
    strokeDasharray: "5,5",
  },
} as const;
type TYPES = keyof typeof typesToProps;

interface RailwaysRendererProps {
  lines: Line[];
  type?: TYPES;
}

interface LineRendererProps {
  line: Line;
  type: TYPES;
}

interface SegmentRendererProps {
  segment: LineSegment;
  type: TYPES;
}

export function SegmentRenderer({ segment, type }: SegmentRendererProps) {
  const isDiagonal = segment.start.position.x !== segment.end.position.x && segment.start.position.y !== segment.end.position.y;
  if (isDiagonal) {
    const pivot = { x: segment.end.position.x, y: segment.start.position.y };
    return (
      <>
        <line
          x1={segment.start.position.x * 20 + 10}
          y1={segment.start.position.y * 20 + 10}
          x2={pivot.x * 20 + 10}
          y2={pivot.y * 20 + 10}
          strokeWidth={2}
          {...typesToProps[type]}
        />
        <line
          x1={pivot.x * 20 + 10}
          y1={pivot.y * 20 + 10}
          x2={segment.end.position.x * 20 + 10}
          y2={segment.end.position.y * 20 + 10}
          strokeWidth={2}
          {...typesToProps[type]}
        />
      </>
    );
  } else {
    return (
      <line
        x1={segment.start.position.x * 20 + 10}
        y1={segment.start.position.y * 20 + 10}
        x2={segment.end.position.x * 20 + 10}
        y2={segment.end.position.y * 20 + 10}
        strokeWidth={2}
        {...typesToProps[type]}
      />
    );
  }
}

export function LineRenderer({ line, type }: LineRendererProps) {
  return line.segments.map((segment, index) => (
    <SegmentRenderer
      key={`line-${index}`}
      segment={segment}
      type={type}
    />
  ));
}

export default function RailwaysRenderer({ lines, type = "green" }: RailwaysRendererProps) {
  return lines.map((line, index) => (
    <LineRenderer
      key={`line-${index}`}
      line={line}
      type={type}
    />
  ));
}
