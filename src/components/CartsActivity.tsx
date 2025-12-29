import { useState, useEffect, useRef } from "react";
import { Point, Station, Cart, Line } from "../lib/types";
import CartsActivityEngine from "../lib/cartsActivityEngine/cartsActivityEngine";

interface CartsActivityProps {
  enabled: boolean;
  carts: Cart[];
  lines: Line[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (cart: Cart, station: Station, nextStation: Station) => void;
}

export default function CartsActivity(props: CartsActivityProps) {
  const [activityEngine] = useState(() => new CartsActivityEngine(props));
  const lineIds = useRef<Line["id"][]>([]);
  const cartIds = useRef<Cart["id"][]>([]);

  useEffect(() => activityEngine.setEnabled(props.enabled), [props.enabled, activityEngine]);

  useEffect(() => {
    props.lines
      .filter(line => !lineIds.current.includes(line.id))
      .forEach(line => activityEngine.addLine(line));
    lineIds.current = props.lines.map(({ id }) => id);
  }, [props.lines, activityEngine]);

  useEffect(() => {
    props.carts
      .filter(cart => !cartIds.current.includes(cart.id))
      .forEach(cart => activityEngine.addCart(cart));
    cartIds.current = props.carts.map(({ id }) => id);
  }, [props.carts, activityEngine]);

  return null;
}

export function nonReactCartPositionUpdater(
  svgEl: SVGSVGElement,
  cart: Cart,
  position: Point
) {
  const cartEl = svgEl.getElementById(`cart-${cart.id}`);
  if (!cartEl) return;
  cartEl.setAttribute("transform", `translate(${position.x * 20}, ${position.y * 20})`);
}
