import { Cart, Line, LineSegment, Point } from "../types";
import { aeCart, aeLine, aeStation } from "./cartsActivityEngine";


const pathCache: Map<number, SVGPathElement> = new Map();

export const createAeLine = (line: Line): aeLine => {
  const segments = line.segments;
  if (line.segments.length === 0) return { line, stations: [], speed: 0 };

  // calculate path length
  const path = pathFromPoints(pointsFromSegments(segments));
  const pathLength = path.getTotalLength();

  // store path in cache
  pathCache.set(line.id, path);

  // create aeStations
  const tmpSegments = [...segments];
  const aeStations: aeStation[] = [];
  while(tmpSegments.length > 0) {
    aeStations.push({
      line,
      station: tmpSegments[tmpSegments.length - 1].end,
      progress: pathFromPoints(pointsFromSegments(tmpSegments)).getTotalLength() / pathLength,
    });
    tmpSegments.pop();
  }
  aeStations.push({ line: line, station: segments[0].start, progress: 0 });
  aeStations.reverse();

  // calculate speed
  const constantSpeedPxPerSecond = 5;
  const speed = constantSpeedPxPerSecond / pathLength;

  return { line, stations: aeStations, speed };
}

export const createAeCart = (cart: Cart, aeLines: aeLine[]): aeCart => {
  const aeLine = aeLines.find(aeLine => aeLine.line.id === cart.line.id)!;

  return {
    cart,
    line: aeLine,
    nextStation: aeLine.stations[0],
    progress: 0,
    direction: 1,
  };
}

export const pointOnLineAtProgress = (progress: number, aeLine: aeLine) => {
  const path = pathCache.get(aeLine.line.id)!;
  const totalLength = path.getTotalLength();
  return path.getPointAtLength(progress * totalLength);
}

// support
const isDiagonal = (segment: LineSegment) => {
  return segment.start.position.x !== segment.end.position.x && segment.start.position.y !== segment.end.position.y;
};

export const pointsFromSegments = (segments: LineSegment[]) => {
  const points: Point[] = [segments[0].start.position];
  for (const segment of segments) {
    if (isDiagonal(segment)) {
      const pivot: Point = { x: segment.end.position.x, y: segment.start.position.y };
      points.push(pivot);
    }
    points.push(segment.end.position);
  }
  return points
}

export const pathFromPoints = (points: Point[]) => {
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  return path;
}
