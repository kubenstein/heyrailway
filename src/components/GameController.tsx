import { Station, Line, Cargo, Cart } from '../lib/types';

type GameConfig = {
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
};

interface GameControllerProps {
  enabled: boolean;
  stations: Station[];
  lines: Line[];
  cargos: Cargo[];
  carts: Cart[];
  onConfigUpdate: (config: GameConfig) => void;
}

export default function GameController(_props: GameControllerProps) {
  // TODO...
  return null;
}
