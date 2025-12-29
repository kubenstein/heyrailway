import { useState, useRef } from 'react';
import { Line, Station, Cart, Cargo } from './lib/types';
import StationsRenderer from './components/renderers/StationsRenderer';
import RailwaysRenderer from './components/renderers/RailwaysRenderer';
import CartsRenderer from './components/renderers/CartsRenderer';
import LineEditor from './components/LineEditor';
import CartsMovement, { nonReactCartPositionUpdater } from './components/CartsMovement';
import CargoSpawner from './components/CargoSpawner';
import randomId from './lib/randomId';
import randomCargoType from './lib/randomCargoType';
import deepCopy from './lib/deepCopy';

export default function App() {
  const svgEl = useRef<SVGSVGElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [stations, setStations] = useState<Station[]>(() => {
    const stations: Station[] = [];
    for (let i = 0; i < 10; i++) {
      stations.push({
        id: randomId(),
        position: { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) },
        cargoType: randomCargoType()
      });
    }
    return stations;
  });

  const onCargoCreate = (cargo: Cargo) => {
    setCargos(prevCargos => [...prevCargos, cargo]);
  };

  const onLineCreate = (line: Line) => {
    setLines([...lines, line]);
    setIsEditing(false);
  };

  const onArriveToStation = (cart: Cart, station: Station, cartNextStation: Station) => {
    setCargos(prevCargos => {
      let newCargos = deepCopy(prevCargos);
      newCargos = newCargos
        // drop cargos
        .map(cargo => {
          if (cargo.cartId !== cart.id) return cargo; // not this cart
          if (cargo.stationIdsRoute[0] !== station.id) return cargo; // not this station

          cargo.stationId = station.id;
          cargo.cartId = null;
          cargo.stationIdsRoute.shift();
          return cargo;
        })
        // remove cargos that reached destination
        .filter(cargo => cargo.stationIdsRoute.length !== 0)
        // load cargos
        .map(cargo => {
          if (cargo.stationId !== station.id) return cargo; // not this station
          if (cargo.stationIdsRoute[0] !== cartNextStation.id) return cargo; // not going to cart next station

          cargo.cartId = cart.id;
          cargo.stationId = null;
          return cargo;
        });

      return newCargos;
    });
  };

  const addCart = (line: Line) => {
    const newCart: Cart = {
      id: randomId(),
      line,
      capacity: 6
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
        <StationsRenderer stations={stations} cargos={cargos} />
        <RailwaysRenderer lines={lines} />
        <CartsRenderer carts={carts} cargos={cargos} />
        <CartsMovement
          enabled={!isEditing}
          carts={carts}
          lines={lines}
          onCartPositionUpdate={(cart, position) => nonReactCartPositionUpdater(svgEl.current!, cart, position)}
          onArriveToStation={onArriveToStation}
        />
        <CargoSpawner
          frequencyMs={1000}
          enabled={!isEditing}
          stations={stations}
          lines={lines}
          onCargoSpawn={onCargoCreate}
        />
        {isEditing && <LineEditor stations={stations} onLineCreate={onLineCreate} />}
      </svg>
    </main>
  );
}
