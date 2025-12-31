import type { CSSProperties } from 'react';
import { Line, Point } from '../../../lib/types';
import { pointToBoardPoint } from '../../../lib/board';
import styles from './RailwaysRenderer.module.css';

const typesToStyle = {
  red: {
    color: 'red',
    dashed: false,
  },
  blue: {
    color: 'blue',
    dashed: false,
  },
  green: {
    color: 'green',
    dashed: false,
  },
  dashed: {
    color: 'black',
    dashed: true,
  },
} as const;
type TYPES = keyof typeof typesToStyle;

type LineSegment = { start: Point; end: Point };

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
  const isDiagonal =
    segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;

  if (isDiagonal) {
    const pivot = { x: segment.end.x, y: segment.start.y };
    return (
      <>
        {renderSegment(segment.start, pivot, type)}
        {renderSegment(pivot, segment.end, type)}
      </>
    );
  }

  return renderSegment(segment.start, segment.end, type);
}

export function LineRenderer({ line, type }: LineRendererProps) {
  if (line.stations.length < 2) return null;

  const segments: LineSegment[] = [];
  for (let i = 0; i < line.stations.length - 1; i++) {
    segments.push({
      start: line.stations[i].position,
      end: line.stations[i + 1].position,
    });
  }

  return segments.map((segment, index) => (
    <SegmentRenderer
      key={`line-${line.id}-segment-${index}`}
      segment={segment}
      type={type}
    />
  ));
}

export default function RailwaysRenderer({
  lines,
  type = 'green',
}: RailwaysRendererProps) {
  return lines.map((line) => (
    <LineRenderer key={`line-${line.id}`} line={line} type={type} />
  ));
}

// supporting functions
function renderSegment(start: Point, end: Point, type: TYPES) {
  const thickness = 2;
  const { color, dashed } = typesToStyle[type];

  const bStart = pointToBoardPoint(start);
  const bEnd = pointToBoardPoint(end);

  const dx = bEnd.x - bStart.x;
  const dy = bEnd.y - bStart.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const style: CSSProperties = {
    transform: `translate(${bStart.x}px, ${bStart.y - thickness / 2}px) rotate(${angle}rad)`,
    transformOrigin: '0 50%',
    width: length,
    height: thickness,
    backgroundColor: dashed ? 'transparent' : color,
  };

  if (dashed) {
    style.backgroundImage = `repeating-linear-gradient(to right, ${color} 0 5px, transparent 5px 10px)`;
  }

  return <div className={styles.railSegment} style={style} />;
}
