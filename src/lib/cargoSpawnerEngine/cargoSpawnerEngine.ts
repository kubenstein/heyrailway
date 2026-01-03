import Graph from 'graphology';
import { bidirectional } from 'graphology-shortest-path';
import { Cargo, Line, Station } from '../types';
import randomId from '../randomId';
import { randomCargoType } from '../cargoTypes';

interface CargoSpawnerEngineProps {
  enabled: boolean;
  frequencyMs: number;
  onCargoSpawn: (cargo: Cargo) => void;
  onCargoReroute: (cargo: Cargo) => void;
}

export default class CargoSpawnerEngine {
  private enabled: boolean = false;
  private frequencyMs: number;
  private stations: Station[] = [];
  private lines: Line[] = [];
  private graph: Graph = new Graph();
  private timeIntervalId: number | null = null;
  private onCargoSpawn: (cargo: Cargo) => void;
  private onCargoReroute: (cargo: Cargo) => void;

  constructor(props: CargoSpawnerEngineProps) {
    this.onCargoSpawn = props.onCargoSpawn;
    this.onCargoReroute = props.onCargoReroute;
    this.frequencyMs = props.frequencyMs;

    this.setEnabled(props.enabled);
  }

  addLine(line: Line, allCargos: Cargo[]) {
    this.lines.push(line);
    this.addLineToGraph(this.graph, line);

    // Reroute cargos that were stuck, maybe they can be routed now
    this.rerouteCargos(allCargos);
  }

  removeLine(lineId: Line['id'] | null, allCargos: Cargo[]) {
    if (!lineId) return;

    this.lines = this.lines.filter(({ id }) => id !== lineId);

    // rebuild whole graph from exisitng lines
    this.graph = new Graph();
    this.stations.forEach(({ id, cargoType }) => this.graph.addNode(id, { cargoType }));
    this.lines.forEach((line) => this.addLineToGraph(this.graph, line));

    // Reroute all cargos
    this.rerouteCargos(allCargos);
  }

  addStation(station: Station) {
    this.stations.push(station);
    const { id, cargoType } = station;
    this.graph.addNode(id, { cargoType });
  }

  setFrequency(frequencyMs: number) {
    this.frequencyMs = frequencyMs;

    clearInterval(this.timeIntervalId || 0);
    if (this.enabled) {
      this.timeIntervalId = setInterval(this.spawnCargos.bind(this), this.frequencyMs);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;

    clearInterval(this.timeIntervalId || 0);
    if (this.enabled) {
      this.timeIntervalId = setInterval(this.spawnCargos.bind(this), this.frequencyMs);
    }
  }

  // spawning
  private spawnCargos() {
    this.graph.nodes().forEach(() => this.spawnCargo());
  }

  private spawnCargo() {
    const availableCargoTypes = [...new Set(this.stations.map((s) => s.cargoType))];
    const cargoType = randomCargoType(availableCargoTypes);

    // pick random station with different cargo type from destination
    const connectedStations = this.graph.filterNodes((_node, attrs) => attrs.cargoType !== cargoType);
    const startStationId = connectedStations[Math.floor(Math.random() * connectedStations.length)];

    const stationIdsRoute = this.findRoute(startStationId, cargoType);

    const newCargo: Cargo = {
      id: randomId(),
      cargoType,
      stationId: startStationId,
      stationIdsRoute: stationIdsRoute || ['NO_PATH'],
      cartId: null,
    };
    this.onCargoSpawn(newCargo);
  }

  // rerouting
  private rerouteCargos(allCargos: Cargo[]) {
    allCargos.forEach((cargo) => {
      const stationIdsRoute = this.findRoute(cargo.stationId, cargo.cargoType) || ['NO_PATH'];
      const updatedCargo: Cargo = {
        ...cargo,
        stationIdsRoute,
      };
      this.onCargoReroute(updatedCargo);
    });
  }

  // support
  private addLineToGraph(graph: Graph, line: Line) {
    for (let i = 0; i < line.stations.length - 1; i++) {
      const segStartStation = line.stations[i];
      const segEndStation = line.stations[i + 1];
      if (!graph.hasUndirectedEdge(segStartStation.id, segEndStation.id)) {
        graph.addUndirectedEdge(segStartStation.id, segEndStation.id);
      }
    }
  }

  // pathfinding
  private findRoute(startStationId: string | null, cargoType: string) {
    if (!startStationId) return null;

    const tmpGraph = this.graph.copy();

    // find path to any station that accepts this cargo type
    tmpGraph.addNode('fakeDestination');
    tmpGraph
      .filterNodes((_node, attrs) => attrs.cargoType === cargoType)
      .forEach((node) => tmpGraph.addUndirectedEdge(node, 'fakeDestination'));
    const fullStationIdsRoute = bidirectional(tmpGraph, startStationId, 'fakeDestination');

    if (fullStationIdsRoute) {
      // remove start and fake destination stations
      return fullStationIdsRoute.slice(1, -1);
    }

    // no path found this happens if there is no line connected to start station
    return null;
  }
}
