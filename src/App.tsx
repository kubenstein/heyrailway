import { useState } from 'react';
import Stations from './Stations';
import Railways from './Railways';
import LineEditor from './LineEditor';
import { Point, Line } from './types';

export default function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [stations, setStations] = useState<Point[]>(() => {
    const points: Point[] = [];
    for (let i = 0; i < 10; i++) {
      points.push({ x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) });
    }
    return points;
  });

  const onLineCreated = (line: Line) => {
    setLines([...lines, line]);
    setIsEditing(false);
  };

  return (
    <main className="app">
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel Editing' : 'Start Editing'}
      </button>
      <svg className="grid-svg" width={2000} height={2000}>
        <Stations stations={stations} />
        <Railways lines={lines} />
        {isEditing && <LineEditor stations={stations} onLineCreated={onLineCreated} />}
      </svg>
    </main>
  );
}

