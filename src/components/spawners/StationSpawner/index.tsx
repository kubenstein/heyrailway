import { useEffect, useRef } from 'react';
import { BOARD_SIZE } from '../../../lib/board';
import { Station } from '../../../lib/types';
import randomId from '../../../lib/randomId';
import { cargoTypes, randomCargoType } from '../../../lib/cargoTypes';

interface StationSpawnerProps {
  round: number;
  enabled: boolean;
  frequencyMs: number;
  initialStations: number;
  initialStationCapacity: number;
  onStationSpawn: (cargo: Station) => void;
}

export default function StationSpawner({
  round,
  enabled,
  frequencyMs,
  initialStations,
  initialStationCapacity,
  onStationSpawn,
}: StationSpawnerProps) {
  const timeoutId = useRef(0);
  const hasSpawnedInitial = useRef(false);

  const spawnStation = (cargoType = randomCargoType()) => {
    const newStation = {
      id: randomId(),
      cargoType,
      capacity: initialStationCapacity,
      createdAt: round,
      position: {
        x: Math.floor(Math.random() * (BOARD_SIZE - 2)) + 1,
        y: Math.floor(Math.random() * (BOARD_SIZE - 2)) + 1,
      },
    };
    onStationSpawn(newStation);
  };

  useEffect(() => {
    clearInterval(timeoutId.current);
    if (enabled) {
      timeoutId.current = setInterval(spawnStation, frequencyMs);
    }
    return () => clearInterval(timeoutId.current);
  }, [enabled, frequencyMs]);

  useEffect(() => {
    if (!enabled || hasSpawnedInitial.current) return;

    hasSpawnedInitial.current = true;
    for (let i = 0; i < initialStations; i++) {
      spawnStation(cargoTypes[i % cargoTypes.length]);
    }
  }, []);

  return null;
}
