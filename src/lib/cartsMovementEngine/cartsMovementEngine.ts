import { Cart, Line, Point, Station } from '../types';
import { createCmeLine, createCmeCart, pointOnLineAtProgress, resetCache } from './geometryHelpers';

export type cmeCart = {
  cartId: Cart['id'];
  line: cmeLine;
  nextStation: cmeStation;
  progress: number;
  direction: 1 | -1;
};

export type cmeStation = {
  line: Line;
  station: Station;
  progress: number;
};

export type cmeLine = {
  line: Line;
  stations: cmeStation[];
  speed: number;
};

interface CartsMovementEngineProps {
  enabled: boolean;
  speedPxPerSec: number;
  onCartPositionUpdate: (cartId: Cart['id'], position: Point) => void;
  onArriveToStation: (cartId: Cart['id'], station: Station, cartNextStation: Station) => void;
}

export default class CartsMovementEngine {
  private enabled: boolean = false;
  private cmeLines: cmeLine[] = [];
  private cmeCarts: cmeCart[] = [];
  private speedPxPerSec: number;
  private onCartPositionUpdate: (cartId: Cart['id'], position: Point) => void;
  private onArriveToStation: (cartId: Cart['id'], station: Station, cartNextStation: Station) => void;
  private gameLoopLastTime: number = 0;

  constructor(props: CartsMovementEngineProps) {
    this.onCartPositionUpdate = props.onCartPositionUpdate;
    this.onArriveToStation = props.onArriveToStation;
    this.speedPxPerSec = props.speedPxPerSec;
    resetCache();
    this.setEnabled(props.enabled);
  }

  addLine(line: Line) {
    this.cmeLines.push(createCmeLine(line, this.speedPxPerSec));
  }

  removeLine(lineId: Line['id']) {
    this.cmeLines = this.cmeLines.filter((cmeLine) => cmeLine.line.id !== lineId);
  }

  addCart(cart: Cart) {
    this.cmeCarts.push(createCmeCart(cart, this.cmeLines));
  }

  removeCart(cartId: Cart['id']) {
    this.cmeCarts = this.cmeCarts.filter((cmeCart) => cmeCart.cartId !== cartId);
  }

  setSpeed(speedPxPerSec: number) {
    this.speedPxPerSec = speedPxPerSec;
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
    this.cmeCarts.forEach((cmeCart) => this.gameLoopCart(deltaTime, cmeCart));
  }

  private gameLoopCart(deltaTime: number, cart: cmeCart) {
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

      if (nextStation) {
        cart.nextStation = nextStation;
      } else {
        // reverse direction
        cart.direction = cart.direction === 1 ? -1 : 1;
        cart.nextStation = stations[stationIndex + cart.direction];
      }

      this.onArriveToStation(cart.cartId, arivedAtStation.station, cart.nextStation.station);
    }

    const newCartPosition = pointOnLineAtProgress(cart.progress, cart.line);
    this.onCartPositionUpdate(cart.cartId, newCartPosition);
  }

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
