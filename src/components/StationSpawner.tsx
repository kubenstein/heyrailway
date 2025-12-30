import { useEffect, useRef } from 'react';
import { CargoType, Station } from '../lib/types';
import randomId from '../lib/randomId';
import randomCargoType from '../lib/randomCargoType';

const cargoTypes: CargoType[] = ['TRIANGLE', 'CIRCLE', 'SQUARE'];

interface StationSpawnerProps {
  enabled: boolean;
  frequencyMs: number;
  initialStations: number;
  onStationSpawn: (cargo: Station) => void;
}

export default function StationSpawner(props: StationSpawnerProps) {
  const timeoutId = useRef(0);
  const hasSpawnedInitial = useRef(false);

  const spawnStation = (cargoType = randomCargoType()) => {
    const newStation = {
      id: randomId(),
      position: {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
      },
      cargoType,
    };
    props.onStationSpawn(newStation);
  };

  useEffect(() => {
    clearInterval(timeoutId.current);
    if (!props.enabled) return;
    timeoutId.current = setInterval(spawnStation, props.frequencyMs);
  }, [props.enabled, props.frequencyMs]);

  useEffect(() => {
    if (!props.enabled || hasSpawnedInitial.current) return;

    hasSpawnedInitial.current = true;
    for (let i = 0; i < props.initialStations; i++)
      spawnStation(cargoTypes[i % 3]);

    return () => clearInterval(timeoutId.current);
  }, []);

  return null;
}
