import { useEffect, useRef, useState } from 'react';
import { Station, Line, Cargo, Cart } from '../lib/types';

export type GameData = {
  round: number;
  running: boolean;
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
};

interface GameControllerProps {
  gameData: GameData;
  isEditing: boolean;
  stations: Station[];
  lines: Line[];
  cargos: Cargo[];
  carts: Cart[];
  onGameDataUpdate: (config: GameData) => void;
}

export default function GameController({
  gameData,
  isEditing,
  onGameDataUpdate,
}: GameControllerProps) {
  const [clock, setClock] = useState(1);
  const clockIntervalId = useRef(0);

  const startTime = () => {
    clearInterval(clockIntervalId.current);
    clockIntervalId.current = setInterval(() => {
      setClock((prevClock) => prevClock + 1);
    }, 1000);
  };

  const stopTime = () => {
    clearInterval(clockIntervalId.current);
  };

  useEffect(() => {
    if (isEditing) {
      stopTime();
    } else {
      startTime();
    }
    onGameDataUpdate({ ...gameData, running: !isEditing });

    return () => clearInterval(clockIntervalId.current);
  }, [isEditing]);

  useEffect(() => {
    let changed = false;
    const newGameData: GameData = { ...gameData };

    if (clock % 60 === 0) {
      changed = true;
      newGameData.round += 1;
    }

    if (clock % 130 === 0) {
      changed = true;
      newGameData.cargoSpawningFrequencyMs *= 0.9;
    }

    if (changed) onGameDataUpdate(newGameData);
  }, [clock]);

  return null;
}
