import type { CSSProperties } from 'react';
import { Line, Point } from '../../../lib/types';
import { pointToBoardPoint } from '../../../lib/board';
import styles from './RailwaysRenderer.module.css';

type LineSegment = { start: Point; end: Point };

interface RailwaysRendererProps {
  scale: number;
  lines: Line[];
  lineToHighlight: Line | null;
  hoverable: boolean;
  onMouseEnterLine: (line: Line) => void;
  onMouseLeaveLine: (line: Line) => void;
  onLineClick: (line: Line) => void;
}

export default function RailwaysRenderer({
  scale,
  lines,
  hoverable,
  lineToHighlight,
  onMouseEnterLine,
  onMouseLeaveLine,
  onLineClick,
}: RailwaysRendererProps) {
  return lines.map((line) => (
    <LineRenderer
      scale={scale}
      hoverable={hoverable}
      highLight={line.id === lineToHighlight?.id}
      onMouseEnterLine={onMouseEnterLine}
      onMouseLeaveLine={onMouseLeaveLine}
      key={`line-${line.id}`}
      line={line}
      onLineClick={onLineClick}
    />
  ));
}

interface LineRendererProps {
  scale: number;
  line: Line;
  hoverable?: boolean;
  highLight?: boolean;
  onMouseEnterLine?: (line: Line) => void;
  onMouseLeaveLine?: (line: Line) => void;
  onLineClick?: (line: Line) => void;
}

export function LineRenderer({
  scale,
  line,
  hoverable,
  highLight,
  onMouseEnterLine,
  onMouseLeaveLine,
  onLineClick,
}: LineRendererProps) {
  if (line.stations.length < 2) return null;

  const segments: LineSegment[] = [];
  for (let i = 0; i < line.stations.length - 1; i++) {
    segments.push({
      start: line.stations[i].position,
      end: line.stations[i + 1].position,
    });
  }

  const lineClassNames = [styles.line, highLight ? styles.highLight : '', hoverable ? styles.hoverable : ''].join(' ');

  return (
    <div
      onClick={() => onLineClick?.(line)}
      onMouseEnter={() => onMouseEnterLine?.(line)}
      onMouseLeave={() => onMouseLeaveLine?.(line)}
      className={lineClassNames}
      style={{ '--local-color': `var(--line-color-${line.id})` } as CSSProperties}
    >
      {segments.map((segment, index) => (
        <SegmentRenderer key={`line-${line.id}-segment-${index}`} segment={segment} scale={scale} />
      ))}
    </div>
  );
}

interface SegmentRendererProps {
  scale?: number;
  segment: LineSegment;
}

export function SegmentRenderer({ scale = 1, segment }: SegmentRendererProps) {
  const isDiagonal = segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;

  if (isDiagonal) {
    const pivot = { x: segment.end.x, y: segment.start.y };
    return (
      <>
        {renderSegment(segment.start, pivot, scale)}
        {renderSegment(pivot, segment.end, scale)}
      </>
    );
  }

  return renderSegment(segment.start, segment.end, scale);
}

// support
function renderSegment(start: Point, end: Point, scale: number) {
  const bStart = pointToBoardPoint(start);
  const bEnd = pointToBoardPoint(end);

  const dx = bEnd.x - bStart.x;
  const dy = bEnd.y - bStart.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const thickness = 1 + 1 / scale;
  const style: CSSProperties = {
    transform: `translate(${bStart.x}px, ${bStart.y - thickness / 2}px) rotate(${angle}rad)`,
    width: length,
    height: thickness,
  };

  return <div className={styles.railSegment} style={style} />;
}
