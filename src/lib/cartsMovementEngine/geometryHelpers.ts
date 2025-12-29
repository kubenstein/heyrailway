import { Cart, Line, Point, Station } from "../types";
import { meCart, meLine, meStation } from "./cartsMovementEngine";

type LineSegment = {
  start: Station;
  end: Station;
};

const pathCache: Map<Line["id"], SVGPathElement> = new Map();

export const createMeLine = (line: Line): meLine => {

  if (line.stations.length < 2) return { line, stations: [], speed: 0 };

  // create segments
  const segments: LineSegment[] = [];
  for (let i = 0; i < line.stations.length - 1; i++) {
    segments.push({ start: line.stations[i], end: line.stations[i + 1] });
  }

  // calculate path length
  const path = pathFromPoints(pointsFromSegments(segments));
  const pathLength = path.getTotalLength();

  // store path in cache
  pathCache.set(line.id, path);

  // create meStations
  const tmpSegments = [...segments];
  const meStations: meStation[] = [];
  while(tmpSegments.length > 0) {
    meStations.push({
      line,
      station: tmpSegments[tmpSegments.length - 1].end,
      progress: pathFromPoints(pointsFromSegments(tmpSegments)).getTotalLength() / pathLength,
    });
    tmpSegments.pop();
  }
  meStations.push({ line: line, station: segments[0].start, progress: 0 });
  meStations.reverse();

  // calculate speed
  const constantSpeedPxPerSecond = 5;
  const speed = constantSpeedPxPerSecond / pathLength;

  return { line, stations: meStations, speed };
}

export const createMeCart = (cart: Cart, meLines: meLine[]): meCart => {
  const meLine = meLines.find(meLine => meLine.line.id === cart.line.id)!;

  return {
    cart,
    line: meLine,
    nextStation: meLine.stations[0],
    progress: 0,
    direction: 1,
  };
}

export const pointOnLineAtProgress = (progress: number, meLine: meLine) => {
  const path = pathCache.get(meLine.line.id)!;
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
