import { useState } from 'react';
import StationsRenderer from './StationsRenderer';
import RailwaysRenderer from './RailwaysRenderer';
import LineEditor from './LineEditor';
import { Point, Line, Station } from './types';

export default function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [stations] = useState<Station[]>(() => {
    const stations: Station[] = [];
    for (let i = 0; i < 10; i++) {
      stations.push({
        id: Date.now(),
        position: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) }
      });
    }
    return stations;
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
        <StationsRenderer stations={stations} />
        <RailwaysRenderer lines={lines} />
        {isEditing && <LineEditor stations={stations} onLineCreated={onLineCreated} />}
      </svg>
    </main>
  );
}

