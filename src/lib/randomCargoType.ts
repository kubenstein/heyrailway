import { CargoType } from "./types";

export default function randomCargoType() {
  const types: CargoType[] = ["TRIANGLE", "CIRCLE", "SQUARE"];
  return types[Math.floor(Math.random() * types.length)];
}
