import { useState, useEffect, useRef } from 'react';
import { Station, Line, Cargo, Cart } from '../../lib/types';
import CargoSpawnerEngine from '../../lib/cargoSpawnerEngine/cargoSpawnerEngine';
import deepCopy from '../../lib/deepCopy';

interface CargoSpawnerProps {
  enabled: boolean;
  frequencyMs: number;
  stations: Station[];
  lines: Line[];
  cargos: Cargo[];
  onCargoSpawn: (cargo: Cargo) => void;
  onCargoReroute: (cargo: Cargo) => void;
}

export default function CargoSpawner(props: CargoSpawnerProps) {
  const [spawningEngine] = useState(() => new CargoSpawnerEngine(props));
  const lineIds = useRef<Line['id'][]>([]);
  const stationIds = useRef<Station['id'][]>([]);

  useEffect(() => {
    spawningEngine.setEnabled(props.enabled);
    return () => spawningEngine.setEnabled(false);
  }, [props.enabled, spawningEngine]);

  useEffect(
    () => spawningEngine.setFrequency(props.frequencyMs),
    [props.frequencyMs, spawningEngine]
  );

  useEffect(() => {
    // add new lines
    props.lines
      .filter((line) => !lineIds.current.includes(line.id))
      .forEach((line) => spawningEngine.addLine(line, props.cargos));

    // remove removed lines
    lineIds.current
      .filter((lineId) => !props.lines.find(({ id }) => id === lineId))
      .forEach((lineId) => spawningEngine.removeLine(lineId, props.cargos));

    lineIds.current = props.lines.map(({ id }) => id);
  }, [props.lines, spawningEngine]);

  useEffect(() => {
    // add new station
    props.stations
      .filter((station) => !stationIds.current.includes(station.id))
      .forEach((station) => spawningEngine.addStation(station));

    stationIds.current = props.stations.map(({ id }) => id);
  }, [props.stations, spawningEngine]);

  return null;
}

export const dropDeliverLoadCargos = (
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
      // remove delivered cargos
      .filter((cargo) => cargo.stationIdsRoute.length !== 0)
      // load cargos
      .map((cargo) => {
        if (cargo.stationId !== station.id) return cargo; // not this station
        if (cargo.stationIdsRoute[0] !== cartNextStation.id) return cargo; // not going to cart next station
        if (
          cart.capacity <= newCargos.filter((c) => c.cartId === cart.id).length
        )
          return cargo; // cart full

        cargo.cartId = cart.id;
        cargo.stationId = null;
        return cargo;
      })
  );
};
