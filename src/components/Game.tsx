import { useState, useRef } from 'react';
import StationsRenderer from './renderers/StationsRenderer';
import RailwaysRenderer from './renderers/RailwaysRenderer';
import CartsRenderer from './renderers/CartsRenderer';
import LineEditor from './LineEditor';
import CartsMovement, { nonReactCartPositionUpdater } from './CartsMovement';
import CargoSpawner from './CargoSpawner';
import StationSpawner from './StationSpawner';
import { Line, Station, Cart, Cargo } from '../lib/types';
import randomId from '../lib/randomId';
import deepCopy from '../lib/deepCopy';

export default function Game() {
  const svgEl = useRef<SVGSVGElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  // callbacks
  const onStationCreate = (station: Station) => {
    setStations((prevStations) => [...prevStations, station]);
  };

  const onCargoCreate = (cargo: Cargo) => {
    setCargos((prevCargos) => [...prevCargos, cargo]);
  };

  const onLineCreate = (line: Line) => {
    setLines([...lines, line]);
    setIsEditing(false);
  };

  const onArriveToStation = (
    cart: Cart,
    station: Station,
    cartNextStation: Station
  ) => {
    setCargos((prevCargos) =>
      dropRemoveLoadCargos(prevCargos, cart, station, cartNextStation)
    );
  };

  // actions
  const addCart = (line: Line) => {
    const newCart: Cart = {
      id: randomId(),
      line,
    };
    setCarts([...carts, newCart]);
  };

  // support
  const dropRemoveLoadCargos = (
    prevCargos: Cargo[],
    cart: Cart,
    station: Station,
    cartNextStation: Station
  ) => {
    const newCargos = deepCopy(prevCargos);
    return (
      newCargos
        // drop cargos
        .map((cargo) => {
          if (cargo.cartId !== cart.id) return cargo; // not this cart
          if (cargo.stationIdsRoute[0] !== station.id) return cargo; // not this station

          cargo.stationId = station.id;
          cargo.cartId = null;
          cargo.stationIdsRoute.shift();
          return cargo;
        })
        // remove cargos that reached destination
        .filter((cargo) => cargo.stationIdsRoute.length !== 0)
        // load cargos
        .map((cargo) => {
          if (cargo.stationId !== station.id) return cargo; // not this station
          if (cargo.stationIdsRoute[0] !== cartNextStation.id) return cargo; // not going to cart next station

          cargo.cartId = cart.id;
          cargo.stationId = null;
          return cargo;
        })
    );
  };

  // render
  return (
    <main className="app">
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel Editing' : 'Start Editing'}
      </button>
      {lines.map((line) => (
        <button key={line.id} onClick={() => addCart(line)}>
          Add Cart to Line {line.id}
        </button>
      ))}

      <svg ref={svgEl} className="grid-svg" width={2000} height={2000}>
        <RailwaysRenderer lines={lines} />
        <StationsRenderer stations={stations} cargos={cargos} />
        <CartsRenderer carts={carts} cargos={cargos} />
        <CartsMovement
          enabled={!isEditing}
          speedPxPerSec={5}
          carts={carts}
          lines={lines}
          onCartPositionUpdate={(cart, position) =>
            nonReactCartPositionUpdater(svgEl.current!, cart, position)
          }
          onArriveToStation={onArriveToStation}
        />
        <CargoSpawner
          frequencyMs={1000}
          enabled={!isEditing}
          stations={stations}
          lines={lines}
          onCargoSpawn={onCargoCreate}
        />
        <StationSpawner
          initialStations={3}
          frequencyMs={60000}
          enabled={!isEditing}
          onStationSpawn={onStationCreate}
        />
        {isEditing && (
          <LineEditor stations={stations} onLineCreate={onLineCreate} />
        )}
      </svg>
    </main>
  );
}
