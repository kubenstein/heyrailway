import { useEffect, useRef, useState } from 'react';
import { Station, Line, Cargo, Cart } from '../lib/types';

export type GameConfig = {
  round: number;
  running: boolean;
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
};

interface GameControllerProps {
  gameConfig: GameConfig;
  isEditing: boolean;
  stations: Station[];
  lines: Line[];
  cargos: Cargo[];
  carts: Cart[];
  onConfigUpdate: (config: GameConfig) => void;
}

export default function GameController({
  gameConfig,
  isEditing,
  onConfigUpdate,
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
    onConfigUpdate({ ...gameConfig, running: !isEditing });

    return () => clearInterval(clockIntervalId.current);
  }, [isEditing]);

  useEffect(() => {
    let changed = false;
    const newGameConfig: GameConfig = { ...gameConfig };

    if (clock % 60 === 0) {
      changed = true;
      newGameConfig.round += 1;
    }

    if (clock % 130 === 0) {
      changed = true;
      newGameConfig.cargoSpawningFrequencyMs *= 0.9;
    }

    if (changed) onConfigUpdate(newGameConfig);
  }, [clock]);

  return null;
}
