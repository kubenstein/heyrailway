import { useState, useEffect, useRef } from "react";
import { Point, Station, Cart, Line } from "../lib/types";
import CartsActivityEngine from "../lib/cartsActivityEngine/cartsActivityEngine";

interface CartsActivityProps {
  enabled: boolean;
  carts: Cart[];
  lines: Line[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (cart: Cart, station: Station) => void;
}

export default function CartsActivity(props: CartsActivityProps) {
  const [activityEngine] = useState(() => new CartsActivityEngine(props));
  const lines = useRef(props.lines);
  const carts = useRef(props.carts);

  useEffect(() => activityEngine.setEnabled(props.enabled), [props.enabled, activityEngine]);

  useEffect(() => {
    const newLines = props.lines.filter(line => !lines.current.some(prevLine => prevLine.id === line.id));
    newLines.forEach(line => activityEngine.addLine(line));
    lines.current = props.lines;
  }, [props.lines, activityEngine]);

  useEffect(() => {
    const newCarts = props.carts.filter(cart => !carts.current.some(prevCart => prevCart.id === cart.id));
    newCarts.forEach(cart => activityEngine.addCart(cart));
    carts.current = props.carts;
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
  cartEl.setAttribute("cx", (position.x *20).toString());
  cartEl.setAttribute("cy", (position.y *20).toString());
}
