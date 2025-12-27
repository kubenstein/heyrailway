import { useState, useRef } from 'react';
import StationsRenderer from './StationsRenderer';
import RailwaysRenderer from './RailwaysRenderer';
import CartsRenderer from './CartsRenderer';
import LineEditor from './LineEditor';
import { Line, Station, Cart } from './types';
import CartsActivityEngine, { nonReactCartPositionUpdater } from './CartsActivityEngine';

export default function App() {
  const svgEl = useRef<SVGSVGElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
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

  const onLineCreate = (line: Line) => {
    setLines([...lines, line]);
    setIsEditing(false);
  };

  const onArriveToStation = (cart: Cart, station: Station) => {
    // TODO
  };

  const addCart = (line: Line) => {
    const newCart: Cart = {
      id: Date.now(),
      line,
    };
    setCarts([...carts, newCart]);
  };

  return (
    <main className="app">
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel Editing' : 'Start Editing'}
      </button>
      {lines.map((line) => (
        <button key={line.id} onClick={() => addCart(line)}>Add Cart to Line {line.id}</button>
      ))}

      <svg ref={svgEl} className="grid-svg" width={2000} height={2000}>
        <StationsRenderer stations={stations} />
        <RailwaysRenderer lines={lines} />
        <CartsRenderer carts={carts} />
        <CartsActivityEngine
          enabled={!isEditing}
          carts={carts}
          lines={lines}
          stations={stations}
          onCartPositionUpdate={(cart, position) => nonReactCartPositionUpdater(svgEl.current!, cart, position)}
          onArriveToStation={onArriveToStation}
        />
        {isEditing && <LineEditor stations={stations} onLineCreate={onLineCreate} />}
      </svg>
    </main>
  );
}

