import { useEffect, useRef, useState, JSX } from 'react';
import { Station, Line, Cargo, Cart } from '../lib/types';
import { dropRemoveLoadCargos } from './CargoSpawner';

export type GameData = {
  round: number;
  running: boolean;
  perkCartUpgrades: number;
  perkStationUpgrades: number;
  perkAvailableLines: number;
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
};

export type RenderProps = {
  lines: Line[];
  carts: Cart[];
  cargos: Cargo[];
  stations: Station[];
  gameData: GameData;
  addStation: (station: Station) => void;
  addLine: (line: Line) => void;
  addCart: (cart: Cart) => void;
  addCargo: (cargo: Cargo) => void;
  onArriveToStation: (
    cart: Cart,
    station: Station,
    cartNextStation: Station
  ) => void;
};

interface GameControllerProps {
  isEditing: boolean;
  render?: (renderProps: RenderProps) => JSX.Element;
}

export default function GameController({
  isEditing,
  render,
}: GameControllerProps) {
  const [clock, setClock] = useState(1);
  const clockIntervalId = useRef(0);

  const [lines, setLines] = useState<Line[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [gameData, setGameData] = useState<GameData>({
    round: 1,
    running: true,
    perkCartUpgrades: 0,
    perkStationUpgrades: 0,
    perkAvailableLines: 2,
    cartSpeedPxPerSec: 5,
    cargoSpawningFrequencyMs: 10000,
    stationSpawningFrequencyMs: 35000,
  });

  // render prop actions
  const addStation = (station: Station) => {
    setStations((prevStations) => [...prevStations, station]);
  };

  const addLine = (line: Line) => {
    setGameData((prevGameData) => ({
      ...prevGameData,
      perkAvailableLines: prevGameData.perkAvailableLines - 1,
    }));
    setLines((prevLines) => [...prevLines, line]);
  };

  const addCargo = (cargo: Cargo) => {
    setCargos((prevCargos) => [...prevCargos, cargo]);
  };

  const addCart = (cart: Cart) => {
    setCarts([...carts, cart]);
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

  // clock actions
  const startTime = () => {
    clearInterval(clockIntervalId.current);
    clockIntervalId.current = setInterval(() => {
      setClock((prevClock) => prevClock + 1);
    }, 1000);
  };

  const stopTime = () => {
    clearInterval(clockIntervalId.current);
  };

  // effects
  // handle isEditing changes
  useEffect(() => {
    isEditing ? stopTime() : startTime();
    setGameData((prevGameData) => ({ ...prevGameData, running: !isEditing }));
    return () => clearInterval(clockIntervalId.current);
  }, [isEditing]);

  // handle clock changes
  useEffect(() => {
    let changed = false;
    const newGameData: GameData = { ...gameData };

    if (clock % 60 === 0) {
      changed = true;
      newGameData.round += 1;
      newGameData.perkCartUpgrades += 1;
      newGameData.perkStationUpgrades += 1;
      newGameData.perkAvailableLines += 1;
    }

    if (clock % 130 === 0) {
      changed = true;
      newGameData.cargoSpawningFrequencyMs *= 0.9;
    }

    if (changed) setGameData(newGameData);
  }, [clock]);

  // render
  if (!render) return null;
  return (
    <>
      {render({
        lines,
        carts,
        cargos,
        stations,
        gameData,
        addStation,
        addLine,
        addCart,
        addCargo,
        onArriveToStation,
      })}
    </>
  );
}
