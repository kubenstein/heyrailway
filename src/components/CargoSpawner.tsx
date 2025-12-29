import { useState, useEffect, useRef } from "react";
import { Station, Line, Cargo } from "../lib/types";
import CargoSpawnerEngine from "../lib/cargoSpawnerEngine/cargoSpawnerEngine";

interface CargoSpawnerProps {
  enabled: boolean;
  frequencyMs: number;
  stations: Station[];
  lines: Line[];
  onCargoSpawn: (cargo: Cargo) => void;
}

export default function CargoSpawner(props: CargoSpawnerProps) {
  const [spawningEngine] = useState(() => new CargoSpawnerEngine(props));
  const lineIds = useRef<Line["id"][]>([]);
  const stationIds = useRef<Station["id"][]>([]);

  useEffect(() => spawningEngine.setEnabled(props.enabled), [props.enabled, spawningEngine]);

  useEffect(() => {
    props.lines
      .filter(line => !lineIds.current.includes(line.id))
      .forEach(line => spawningEngine.addLine(line));
    lineIds.current = props.lines.map(({ id }) => id);
  }, [props.lines, spawningEngine]);

  useEffect(() => {
    props.stations
      .filter(station => !stationIds.current.includes(station.id))
      .forEach(station => spawningEngine.addStation(station));
    stationIds.current = props.stations.map(({ id }) => id);
  }, [props.stations, spawningEngine]);

  return null;
}
