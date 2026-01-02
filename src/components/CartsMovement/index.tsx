import { useState, useEffect, useRef } from 'react';
import { Point, Station, Cart, Line } from '../../lib/types';
import CartsMovementEngine from '../../lib/cartsMovementEngine/cartsMovementEngine';
import { pointToBoardPoint } from '../../lib/board';

interface CartsMovementProps {
  enabled: boolean;
  speedPxPerSec: number;
  carts: Cart[];
  lines: Line[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (
    cart: Cart,
    station: Station,
    nextStation: Station
  ) => void;
}

export default function CartsMovement(props: CartsMovementProps) {
  const [movementEngine] = useState(() => new CartsMovementEngine(props));
  const lineIds = useRef<Line['id'][]>([]);
  const cartIds = useRef<Cart['id'][]>([]);

  useEffect(() => {
    movementEngine.setEnabled(props.enabled);
    return () => movementEngine.setEnabled(false);
  }, [props.enabled, movementEngine]);

  useEffect(
    () => movementEngine.setSpeed(props.speedPxPerSec),
    [props.speedPxPerSec, movementEngine]
  );

  useEffect(() => {
    // add new lines
    props.lines
      .filter((line) => !lineIds.current.includes(line.id))
      .forEach((line) => movementEngine.addLine(line));

    // remove removed lines
    lineIds.current
      .filter((lineId) => !props.lines.find(({ id }) => id === lineId))
      .forEach((lineId) => movementEngine.removeLine(lineId));

    lineIds.current = props.lines.map(({ id }) => id);
  }, [props.lines, movementEngine]);

  useEffect(() => {
    // add new carts
    props.carts
      .filter((cart) => !cartIds.current.includes(cart.id))
      .forEach((cart) => movementEngine.addCart(cart));

    // remove removed carts
    cartIds.current
      .filter((cartId) => !props.carts.find(({ id }) => id === cartId))
      .forEach((cartId) => movementEngine.removeCart(cartId));

    cartIds.current = props.carts.map(({ id }) => id);
  }, [props.carts, movementEngine]);

  return null;
}

export function nonReactCartPositionUpdater(
  boardEl: HTMLElement,
  cart: Cart,
  position: Point
) {
  const cartEl = boardEl.querySelector<HTMLElement>(`#cart-${cart.id}`);
  if (!cartEl) return;
  const { x, y } = pointToBoardPoint(position);
  cartEl.style.transform = `translate(${x}px, ${y}px)`;
}
