import Graph from "graphology";
import { bidirectional } from 'graphology-shortest-path';
import { Cargo, Line, Station } from "../types";
import randomId from "../randomId";
import randomCargoType from "../randomCargoType";

interface CargoSpawnerEngineProps {
  enabled: boolean;
  frequencyMs: number;
  stations: Station[];
  lines: Line[];
  onCargoSpawn: (cargo: Cargo) => void;
}

export default class CargoSpawnerEngine {
  private enabled: boolean = false;
  private frequencyMs: number;
  private graph: Graph = new Graph();
  private timeIntervalId: number | null = null;
  private onCargoSpawn: (cargo: Cargo) => void;

  constructor(props: CargoSpawnerEngineProps) {
    this.onCargoSpawn = props.onCargoSpawn;
    this.frequencyMs = props.frequencyMs;

    props.lines.forEach(line => this.addLine(line));
    props.stations.forEach(station => this.addStation(station));
    this.setEnabled(props.enabled);
  }

  addLine(line: Line) {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const segmentStartStation = line.stations[i];
      const segmentEndStation = line.stations[i + 1];
      this.graph.addUndirectedEdge(segmentStartStation.id, segmentEndStation.id);
    }
  }

  addStation(station: Station) {
    const { id, cargoType } = station;
    if (this.graph.hasNode(id)) return;
    this.graph.addNode(id, { cargoType });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;

    clearInterval(this.timeIntervalId || 0);
    if (this.enabled) {
      this.timeIntervalId = setInterval(this.spawn.bind(this), this.frequencyMs);
    }
  }

  private spawn() {
    if (this.graph.size === 0) return;

    const tmpGraph = this.graph.copy();

    // pick random destination cargo type
    const cargoType = randomCargoType();

    // pick random connected station with different cargo type from destination
    const connectedStations = tmpGraph.filterNodes((node, attrs) => tmpGraph.degree(node) > 0 && attrs.cargoType !== cargoType);
    const startStationId = connectedStations[Math.floor(Math.random() * connectedStations.length)];
    if (!startStationId) return;

    // find path to any station that accepts this cargo type
    tmpGraph.addNode('fakeDestination');
    tmpGraph
      .filterNodes((node, attrs) => tmpGraph.degree(node) > 0 && attrs.cargoType === cargoType)
      .forEach(node => tmpGraph.addUndirectedEdge(node, 'fakeDestination'));
    const fullStationIdsRoute = bidirectional(tmpGraph, startStationId, 'fakeDestination')
    // no path found - this may happen if there is no station with matching cargo type
    if (!fullStationIdsRoute) return;
    // remove start and fake destination
    const stationIdsRoute = fullStationIdsRoute.slice(1, -1);

    const newCargo: Cargo = {
      id: randomId(),
      cargoType,
      stationId: startStationId,
      stationIdsRoute,
      cartId: null,
    };
    this.onCargoSpawn(newCargo);
  };
}
