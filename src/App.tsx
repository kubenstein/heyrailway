import { useState } from 'react';

type Cell = { x: number; y: number };

type Pair = { start: Cell; end: Cell };

export default function App() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [editStart, setEditStart] = useState<Cell | null>(null);

  const handleClick = (y: number, x: number) => {
    if (editStart) {
      if (editStart.y === y && editStart.x === x) {
        setEditStart(null);
      } else {
        setPairs([...pairs, { start: editStart, end: { y, x } }]);
        setEditStart(null);
      }
    } else {
      setEditStart({ y, x });
    }
  };

  const isSelected = (y: number, x: number) => {
    return (
      (editStart && editStart.y === y && editStart.x === x) ||
      pairs.some(pair =>
        (pair.start.y === y && pair.start.x === x) ||
        (pair.end.y === y && pair.end.x === x)
      )
    );
  };

  return (
    <main className="app">
      <svg className="grid-svg" width={2000} height={2000}>
        {Array.from({ length: 100 * 100 }, (_, i) => {
          const y = Math.floor(i / 100);
          const x = i % 100;
          return (
            <rect
              key={i}
              x={x * 20}
              y={y * 20}
              width={20}
              height={20}
              stroke="#ccc"
              fill={isSelected(y, x) ? 'yellow' : 'white'}
              onClick={() => handleClick(y, x)}
            />
          );
        })}
        {pairs.map((pair, index) => (
          <line
            key={index}
            x1={pair.start.x * 20 + 10}
            y1={pair.start.y * 20 + 10}
            x2={pair.end.x * 20 + 10}
            y2={pair.end.y * 20 + 10}
            stroke="red"
            strokeWidth={2}
          />
        ))}
      </svg>
    </main>
  );
}

