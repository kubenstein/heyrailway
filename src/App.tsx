import { useState, useRef, useEffect } from 'react';
import { Line, Station, Cart, CargoType } from './lib/types';
import StationsRenderer from './components/renderers/StationsRenderer';
import RailwaysRenderer from './components/renderers/RailwaysRenderer';
import CartsRenderer from './components/renderers/CartsRenderer';
import LineEditor from './components/LineEditor';
import CartsActivity, { nonReactCartPositionUpdater } from './components/CartsActivity';
import generateId from './lib/id';

const randomCargoType = () => {
  const types: CargoType[] = ["TRIANGLE", "CIRCLE", "SQUARE"];
  return types[Math.floor(Math.random() * types.length)];
}

export default function App() {
  const svgEl = useRef<SVGSVGElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [stations, setStations] = useState<Station[]>(() => {
    const stations: Station[] = [];
    for (let i = 0; i < 10; i++) {
      stations.push({
        id: generateId(),
        position: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
        cargoType: randomCargoType(),
        cargos: [],
      });
    }
    return stations;
  });



  useEffect(() => {
    const interval = setInterval(() => {
      setStations(prevStations => {
        const newStations = [...prevStations];
        const randomStationIndex = Math.floor(Math.random() * newStations.length);
        const newCargo = { id: generateId(), cargoType: randomCargoType() };
        newStations[randomStationIndex].cargos.push(newCargo);
        return newStations;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onLineCreate = (line: Line) => {
    setLines([...lines, line]);
    setIsEditing(false);
  };

  const onArriveToStation = (cart: Cart, station: Station) => {
    const remainingCartCargos = cart.cargos.filter(
      (cargo) => cargo.cargoType !== station.cargoType
    );

    const availableCartSlots = Math.max(0, cart.capacity - remainingCartCargos.length);
    const pickedCargos = station.cargos.slice(0, availableCartSlots);
    station.cargos = station.cargos.slice(availableCartSlots);

    cart.cargos = [...remainingCartCargos, ...pickedCargos].slice(0, cart.capacity);

    setCarts((prevCarts) => [...prevCarts]);
    setStations((prevStations) => [...prevStations]);
  };

  const addCart = (line: Line) => {
    const newCart: Cart = {
      id: generateId(),
      line,
      capacity: 6,
      cargos: [],
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
        <CartsActivity
          enabled={!isEditing}
          carts={carts}
          lines={lines}
          onCartPositionUpdate={(cart, position) => nonReactCartPositionUpdater(svgEl.current!, cart, position)}
          onArriveToStation={onArriveToStation}
        />
        {isEditing && <LineEditor stations={stations} onLineCreate={onLineCreate} />}
      </svg>
    </main>
  );
}
