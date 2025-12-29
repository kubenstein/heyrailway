import deepCopy from "../deepCopy";
import { Cart, Line, Point, Station } from "../types";
import { cmeCart, cmeLine, cmeStation } from "./cartsMovementEngine";

type LineSegment = {
  start: Station;
  end: Station;
};

const pathCache: Map<Line["id"], SVGPathElement> = new Map();

export const pointOnLineAtProgress = (progress: number, cmeLine: cmeLine) => {
  const path = pathCache.get(cmeLine.line.id)!;
  const totalLength = path.getTotalLength();
  return path.getPointAtLength(progress * totalLength);
}

export const createCmeLine = (line: Line, speedPxPerSec: number): cmeLine => {
  if (line.stations.length < 2) return { line, stations: [], speed: 0 };

  // create segments
  const segments: LineSegment[] = [];
  for (let i = 0; i < line.stations.length - 1; i++) {
    segments.push({ start: line.stations[i], end: line.stations[i + 1] });
  }

  // calculate path length
  const path = pathFromPoints(pointsFromSegments(segments));
  const pathLength = path.getTotalLength();

  // store path in cache for later pointOnLineAtProgress use
  pathCache.set(line.id, path);

  // create cmeStations with progress (where on the path they are as %)
  // for each segment, starting from the full line (all segments):
  //   - we take end station as paths end
  //   - create the path
  //   - and calculate length.
  // then compare with actual full path length to get progress %.
  // then we remove last segment and repeat.
  // finally we add first station at progress 0
  // we reverse as we started from the end
  const tmpSegments = deepCopy(segments);
  const cmeStations: cmeStation[] = [];
  while(tmpSegments.length > 0) {
    cmeStations.push({
      line,
      station: tmpSegments[tmpSegments.length - 1].end,
      progress: pathFromPoints(pointsFromSegments(tmpSegments)).getTotalLength() / pathLength,
    });
    tmpSegments.pop();
  }
  cmeStations.push({ line: line, station: segments[0].start, progress: 0 });
  cmeStations.reverse();

  // calculate speed
  const speed = speedPxPerSec / pathLength;

  const newCmeLine: cmeLine = {
    line,
    stations: cmeStations,
    speed
  };
  return newCmeLine;
}

export const createCmeCart = (cart: Cart, cmeLines: cmeLine[]): cmeCart => {
  const cmeLine = cmeLines.find(cmeLine => cmeLine.line.id === cart.line.id)!;
  return {
    cart,
    line: cmeLine,
    nextStation: cmeLine.stations[0],
    progress: 0,
    direction: 1,
  };
}

// support
const isDiagonal = (segment: LineSegment) => {
  return segment.start.position.x !== segment.end.position.x && segment.start.position.y !== segment.end.position.y;
};

const pointsFromSegments = (segments: LineSegment[]) => {
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

const pathFromPoints = (points: Point[]) => {
  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  return path;
}
