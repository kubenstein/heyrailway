import { Cart, Line, Point, Station } from "../types";

interface ActivityEngineProps {
  enabled: boolean;
  carts: Cart[];
  lines: Line[];
  stations: Station[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (cart: Cart, station: Station) => void;
}

export default class ActivityEngine {
  constructor(props: ActivityEngineProps) {
    this.enabled = props.enabled;
    this.carts = props.carts;
    this.lines = props.lines;
    this.stations = props.stations;
    this.onCartPositionUpdate = props.onCartPositionUpdate;
    this.onArriveToStation = props.onArriveToStation;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setCarts(carts: Cart[]) {
    this.carts = carts;
  }

  setLines(lines: Line[]) {
    this.lines = lines;
  }

  setStations(stations: Station[]) {
    this.stations = stations;
  }
}
