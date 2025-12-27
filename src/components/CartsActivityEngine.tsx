import { useEffect, useState } from "react";
import { Point, Station, Cart, Line } from "../lib/types";
import ActivityEngine from "../lib/activityEngine/activityEngine";

interface CartsActivityEngineProps {
  enabled: boolean;
  carts: Cart[];
  lines: Line[];
  stations: Station[];
  onCartPositionUpdate: (cart: Cart, position: Point) => void;
  onArriveToStation: (cart: Cart, station: Station) => void;
}

export default function CartsActivityEngine(props: CartsActivityEngineProps) {
  const [activityEngine] = useState<ActivityEngine>(new ActivityEngine(props));

  useEffect(() => activityEngine.setEnabled(props.enabled), [props.enabled]);
  useEffect(() => activityEngine.setCarts(props.carts), [props.carts]);
  useEffect(() => activityEngine.setLines(props.lines), [props.lines]);
  useEffect(() => activityEngine.setStations(props.stations), [props.stations]);

  return null;
}

export function nonReactCartPositionUpdater(
  svgEl: SVGSVGElement,
  cart: Cart,
  position: Point
) {
  const cartEl = svgEl.querySelector(`[data-cart-id='${cart.id}']`);
  if (!cartEl) return;
  cartEl.setAttribute("cx", position.x.toString());
  cartEl.setAttribute("cy", position.y.toString());
}
