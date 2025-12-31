import Graph from 'graphology';
import { bidirectional } from 'graphology-shortest-path';
import { Cargo, Line, Station } from '../types';
import randomId from '../randomId';
import randomCargoType from '../randomCargoType';

interface CargoSpawnerEngineProps {
  enabled: boolean;
  frequencyMs: number;
  onCargoSpawn: (cargo: Cargo) => void;
  onCargoReroute: (cargo: Cargo) => void;
}

export default class CargoSpawnerEngine {
  private enabled: boolean = false;
  private frequencyMs: number;
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
    for (let i = 0; i < line.stations.length - 1; i++) {
      const segmentStartStation = line.stations[i];
      const segmentEndStation = line.stations[i + 1];
      if (
        this.graph.hasUndirectedEdge(
          segmentStartStation.id,
          segmentEndStation.id
        )
      )
        continue;

      this.graph.addUndirectedEdge(
        segmentStartStation.id,
        segmentEndStation.id
      );
    }

    // Reroute cargos that might be affected by new line
    this.rerouteStuckCargos(allCargos);
  }

  addStation(station: Station) {
    const { id, cargoType } = station;
    if (this.graph.hasNode(id)) return;
    this.graph.addNode(id, { cargoType });
  }

  setFrequency(frequencyMs: number) {
    this.frequencyMs = frequencyMs;

    clearInterval(this.timeIntervalId || 0);
    if (this.enabled) {
      this.timeIntervalId = setInterval(
        this.spawnCargos.bind(this),
        this.frequencyMs
      );
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;

    clearInterval(this.timeIntervalId || 0);
    if (this.enabled) {
      this.timeIntervalId = setInterval(
        this.spawnCargos.bind(this),
        this.frequencyMs
      );
    }
  }

  private spawnCargos() {
    this.graph.nodes().forEach(() => this.spawnCargo());
  }

  private spawnCargo() {
    const cargoType = randomCargoType();

    // pick random station with different cargo type from destination
    const connectedStations = this.graph.filterNodes(
      (_node, attrs) => attrs.cargoType !== cargoType
    );
    const startStationId =
      connectedStations[Math.floor(Math.random() * connectedStations.length)];

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

  private rerouteStuckCargos(allCargos: Cargo[]) {
    allCargos
      .filter((cargo) => cargo.stationIdsRoute[0] === 'NO_PATH')
      .forEach((cargo) => {
        const stationIdsRoute = this.findRoute(
          cargo.stationId,
          cargo.cargoType
        );
        if (!stationIdsRoute) return;

        const updatedCargo: Cargo = {
          ...cargo,
          stationIdsRoute,
        };
        this.onCargoReroute(updatedCargo);
      });
  }

  // support
  private findRoute(startStationId: string | null, cargoType: string) {
    if (!startStationId) return null;

    const tmpGraph = this.graph.copy();

    // find path to any station that accepts this cargo type
    tmpGraph.addNode('fakeDestination');
    tmpGraph
      .filterNodes((_node, attrs) => attrs.cargoType === cargoType)
      .forEach((node) => tmpGraph.addUndirectedEdge(node, 'fakeDestination'));
    const fullStationIdsRoute = bidirectional(
      tmpGraph,
      startStationId,
      'fakeDestination'
    );

    if (fullStationIdsRoute) {
      // remove start and fake destination stations
      return fullStationIdsRoute.slice(1, -1);
    }

    // no path found this happens if there is no line connected to start station
    return null;
  }
}
