import type { CSSProperties } from 'react';
import { Line, Point } from '../../../lib/types';
import { pointToBoardPoint } from '../../../lib/board';
import styles from './RailwaysRenderer.module.css';

type LineSegment = { start: Point; end: Point };

interface RailwaysRendererProps {
  lines: Line[];
  lineToHighlight: Line | null;
  hoverable: boolean;
  onMouseEnterLine: (line: Line) => void;
  onMouseLeaveLine: (line: Line) => void;
  onLineClick: (line: Line) => void;
}

export default function RailwaysRenderer({
  lines,
  hoverable,
  lineToHighlight,
  onMouseEnterLine,
  onMouseLeaveLine,
  onLineClick,
}: RailwaysRendererProps) {
  return lines.map((line) => (
    <LineRenderer
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
  line: Line;
  hoverable?: boolean;
  highLight?: boolean;
  onMouseEnterLine?: (line: Line) => void;
  onMouseLeaveLine?: (line: Line) => void;
  onLineClick?: (line: Line) => void;
}

export function LineRenderer({
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

  return (
    <div
      onClick={() => onLineClick?.(line)}
      onMouseEnter={() => onMouseEnterLine?.(line)}
      onMouseLeave={() => onMouseLeaveLine?.(line)}
      className={`
        ${styles.line}
        ${highLight ? styles.highLight : ''}
        ${hoverable ? styles.hoverable : ''}
      `}
      style={
        { '--local-color': `var(--line-color-${line.id})` } as CSSProperties
      }
    >
      {segments.map((segment, index) => (
        <SegmentRenderer
          key={`line-${line.id}-segment-${index}`}
          segment={segment}
        />
      ))}
    </div>
  );
}

interface SegmentRendererProps {
  segment: LineSegment;
}

export function SegmentRenderer({ segment }: SegmentRendererProps) {
  const isDiagonal =
    segment.start.x !== segment.end.x && segment.start.y !== segment.end.y;

  if (isDiagonal) {
    const pivot = { x: segment.end.x, y: segment.start.y };
    return (
      <>
        {renderSegment(segment.start, pivot)}
        {renderSegment(pivot, segment.end)}
      </>
    );
  }

  return renderSegment(segment.start, segment.end);
}

// support
function renderSegment(start: Point, end: Point) {
  const bStart = pointToBoardPoint(start);
  const bEnd = pointToBoardPoint(end);

  const dx = bEnd.x - bStart.x;
  const dy = bEnd.y - bStart.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const thickness = 1;
  const style: CSSProperties = {
    transform: `translate(${bStart.x}px, ${bStart.y - thickness / 2}px) rotate(${angle}rad)`,
    width: length,
    height: thickness,
  };

  return <div className={styles.railSegment} style={style} />;
}
