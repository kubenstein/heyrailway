import { useEffect, useRef } from 'react';
import { BOARD_SIZE } from '../../../lib/board';
import { Point, Station } from '../../../lib/types';
import { cargoTypes, randomCargoType } from '../../../lib/cargoTypes';

interface StationSpawnerProps {
  round: number;
  enabled: boolean;
  stations: Station[];
  frequencyMs: number;
  initialStations: number;
  initialStationCapacity: number;
  onStationSpawn: (cargo: Station) => void;
}

export default function StationSpawner({
  round,
  enabled,
  stations,
  frequencyMs,
  initialStations,
  initialStationCapacity,
  onStationSpawn,
}: StationSpawnerProps) {
  const lastStationId = useRef(0);
  const timeoutId = useRef(0);
  const hasSpawnedInitial = useRef(false);
  const stationsRef = useRef(stations);

  useEffect(() => {
    stationsRef.current = stations;
  }, [stations]);

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
      setTimeout(() => spawnStation(cargoTypes[i % cargoTypes.length]), i * 100);
    }
  }, []);

  const spawnStation = (cargoType = randomCargoType()) => {
    lastStationId.current += 1;

    // spawn first stations within initial user viewport
    let range = lastStationId.current > 3 ? BOARD_SIZE : BOARD_SIZE / 2;

    // ensure stations are not too close to each other
    let position: Point;
    do {
      position = {
        x: Math.floor(Math.random() * (range - 2)) + 1,
        y: Math.floor(Math.random() * (range - 2)) + 1,
      };
    } while (
      stationsRef.current.some((s) => {
        return Math.sqrt((s.position.x - position.x) ** 2 + (s.position.y - position.y) ** 2) < 4;
      })
    );

    const newStation: Station = {
      id: `${lastStationId.current}`,
      cargoType,
      capacity: initialStationCapacity,
      createdAt: round,
      position,
    };
    onStationSpawn(newStation);
  };

  return null;
}
