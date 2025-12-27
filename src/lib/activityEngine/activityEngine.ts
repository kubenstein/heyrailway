import { Cart, Line, Point, Station } from "../types";
import { createAeLine, createAeCart, pointOnLineAtProgress } from "./geometryHelpers";

export type aeCart = {
  cart: Cart;
  line: aeLine;
  nextStation: aeStation;
  progress: number;
  direction: 1 | -1;
}

export type aeStation = {
  line: Line;
  station: Station;
  progress: number;
}

export type aeLine = {
  line: Line;
  stations: aeStation[];
  speed: number;
}

interface ActivityEngineProps {
  enabled: boolean;
  carts: Cart[];
  lines: Line[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (cart: Cart, station: Station) => void;
}

export default class ActivityEngine {
  private enabled: boolean = false;
  private carts: Cart[] = [];
  private lines: Line[] = [];
  private aeLines: aeLine[] = [];
  private aeCarts: aeCart[] = [];
  private onCartPositionUpdate: (cart: Cart, position: Point) => void;
  private onArriveToStation: (cart: Cart, station: Station) => void;
  private gameLoopLastTime: number = 0;

  constructor(props: ActivityEngineProps) {
    this.onCartPositionUpdate = props.onCartPositionUpdate;
    this.onArriveToStation = props.onArriveToStation;
    props.lines.forEach(line => this.addLine(line));
    props.carts.forEach(cart => this.addCart(cart));
    this.setEnabled(props.enabled);
  }

  addLine(line: Line) {
    this.lines.push(line);
    this.aeLines.push(createAeLine(line));
  }

  addCart(cart: Cart) {
    this.carts.push(cart);
    this.aeCarts.push(createAeCart(cart, this.aeLines));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      this.gameLoopLastTime = 0;
      requestAnimationFrame(this._gameLoop.bind(this));
    }
  }

  // main game loop
  private gameLoop(deltaTime: number) {
    this.aeCarts.forEach(aeCart => {
      this.gemeLoopCarts(deltaTime, aeCart);
    })
  };

  private gemeLoopCarts(deltaTime: number, cart: aeCart) {
    cart.progress += cart.direction * cart.line.speed * deltaTime;

    const hasArivedAtStation =
      (cart.direction === 1 && cart.progress >= cart.nextStation.progress) ||
      (cart.direction === -1 && cart.progress <= cart.nextStation.progress);

    if (hasArivedAtStation) {
      const arivedAtStation = cart.nextStation;
      const stations = cart.line.stations;
      const stationIndex = stations.indexOf(cart.nextStation);
      const nextStationIndex = stationIndex + cart.direction;
      const nextStation = stations[nextStationIndex];

      if(nextStation) {
        cart.nextStation = nextStation;
      } else {
        // reverse direction
        cart.direction = cart.direction === 1 ? -1 : 1;
        cart.nextStation = stations[stationIndex + cart.direction];
      }
      this.onArriveToStation(cart.cart, arivedAtStation.station);
    }

    // Update cart position
    const newPosition = pointOnLineAtProgress(cart.progress, cart.line);
    this.onCartPositionUpdate(cart.cart, newPosition);
  };

  // support
  private _gameLoop(currentTime: number) {
    if (!this.enabled) return;
    if (this.gameLoopLastTime === 0) this.gameLoopLastTime = currentTime;
    const deltaTime = (currentTime - this.gameLoopLastTime) / 1000;
    this.gameLoopLastTime = currentTime;

    this.gameLoop(deltaTime);

    requestAnimationFrame(this._gameLoop.bind(this));
  }
}
