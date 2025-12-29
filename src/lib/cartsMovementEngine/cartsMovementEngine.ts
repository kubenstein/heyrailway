import { Cart, Line, Point, Station } from "../types";
import { createMeLine, createMeCart, pointOnLineAtProgress } from "./geometryHelpers";

export type meCart = {
  cart: Cart;
  line: meLine;
  nextStation: meStation;
  progress: number;
  direction: 1 | -1;
}

export type meStation = {
  line: Line;
  station: Station;
  progress: number;
}

export type meLine = {
  line: Line;
  stations: meStation[];
  speed: number;
}

interface CartsMovementEngineProps {
  enabled: boolean;
  carts: Cart[];
  lines: Line[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (cart: Cart, station: Station, cartNextStation: Station) => void;
}

export default class CartsMovementEngine {
  private enabled: boolean = false;
  private carts: Cart[] = [];
  private lines: Line[] = [];
  private meLines: meLine[] = [];
  private meCarts: meCart[] = [];
  private onCartPositionUpdate: (cart: Cart, position: Point) => void;
  private onArriveToStation: (cart: Cart, station: Station, cartNextStation: Station) => void;
  private gameLoopLastTime: number = 0;

  constructor(props: CartsMovementEngineProps) {
    this.onCartPositionUpdate = props.onCartPositionUpdate;
    this.onArriveToStation = props.onArriveToStation;
    props.lines.forEach(line => this.addLine(line));
    props.carts.forEach(cart => this.addCart(cart));
    this.setEnabled(props.enabled);
  }

  addLine(line: Line) {
    this.lines.push(line);
    this.meLines.push(createMeLine(line));
  }

  addCart(cart: Cart) {
    this.carts.push(cart);
    this.meCarts.push(createMeCart(cart, this.meLines));
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
    this.meCarts.forEach(meCart => {
      this.gameLoopCarts(deltaTime, meCart);
    })
  };

  private gameLoopCarts(deltaTime: number, cart: meCart) {
    cart.progress += cart.direction * cart.line.speed * deltaTime;

    const hasArivedAtNextStation =
      (cart.direction === 1 && cart.progress >= cart.nextStation.progress) ||
      (cart.direction === -1 && cart.progress <= cart.nextStation.progress);

    if (hasArivedAtNextStation) {
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

      this.onArriveToStation(cart.cart, arivedAtStation.station,  cart.nextStation.station);
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
