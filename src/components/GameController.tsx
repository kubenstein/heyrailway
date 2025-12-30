import { useEffect, useRef, useState } from 'react';
import { Station, Line, Cargo, Cart } from '../lib/types';

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

interface GameControllerProps {
  isEditing: boolean;
  stations: Station[];
  lines: Line[];
  cargos: Cargo[];
  carts: Cart[];
  onGameDataUpdate: (config: GameData) => void;
}

export default function GameController({
  isEditing,
  lines,
  onGameDataUpdate,
}: GameControllerProps) {
  const [clock, setClock] = useState(1);
  const clockIntervalId = useRef(0);
  const prevLineCount = useRef(lines.length);
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
  // make sure to clear interval on unmount
  useEffect(() => {
    return () => clearInterval(clockIntervalId.current);
  }, []);

  // propagate gameData change
  useEffect(() => {
    onGameDataUpdate(gameData);
  }, [gameData]);

  // handle isEditing changes
  useEffect(() => {
    isEditing ? stopTime() : startTime();
    setGameData((prevGameData) => ({ ...prevGameData, running: !isEditing }));
  }, [isEditing]);

  // handle adding new line
  useEffect(() => {
    if (lines.length > prevLineCount.current) {
      setGameData((prevGameData) => ({
        ...prevGameData,
        perkAvailableLines: prevGameData.perkAvailableLines - 1,
      }));
    }
    prevLineCount.current = lines.length;
  }, [lines]);

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

  return null;
}
