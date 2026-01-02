import { useEffect, useRef } from 'react';
import { BOARD_SIZE } from '../../lib/board';
import { CargoType, Station } from '../../lib/types';
import randomId from '../../lib/randomId';
import randomCargoType from '../../lib/randomCargoType';

const cargoTypes: CargoType[] = ['DB', 'REACT', 'GATEWAY', 'REDIS'];

interface StationSpawnerProps {
  round: number;
  enabled: boolean;
  frequencyMs: number;
  initialStations: number;
  onStationSpawn: (cargo: Station) => void;
}

export default function StationSpawner({
  round,
  enabled,
  frequencyMs,
  initialStations,
  onStationSpawn,
}: StationSpawnerProps) {
  const timeoutId = useRef(0);
  const hasSpawnedInitial = useRef(false);

  const spawnStation = (cargoType = randomCargoType()) => {
    const newStation = {
      id: randomId(),
      cargoType,
      capacity: 20,
      createdAt: round,
      position: {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
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
