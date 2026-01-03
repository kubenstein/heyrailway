import { useEffect, useRef, useReducer, JSX } from 'react';
import { Station, Line, Cargo, Cart, EditMode } from '../../lib/types';
import { gameReducer } from './gameReducer';

export type GameState = {
  gameId: string;
  lost: boolean;
  lines: Line[];
  carts: Cart[];
  cargos: Cargo[];
  stations: Station[];
  clock: number;
  points: number;
  round: number;
  running: boolean;
  stationCapacity: number;
  perkCartUpgrades: number;
  perkCartUpgradeFactor: number;
  perkStationUpgrades: number;
  perkStationUpgradeFactor: number;
  perkAvailableLines: number;
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
  cargoSpawningFrequencyReductionFactor: number;
};

export const initialState: GameState = {
  gameId: 'would-love-to-join-your-team',
  lost: false,
  running: true,
  lines: [],
  carts: [],
  cargos: [],
  stations: [],
  clock: 1,
  points: 0,
  round: 1,
  stationCapacity: 20,
  perkCartUpgrades: 2,
  perkCartUpgradeFactor: 2,
  perkStationUpgrades: 2,
  perkStationUpgradeFactor: 1.2,
  perkAvailableLines: 2,
  cartSpeedPxPerSec: 5,
  cargoSpawningFrequencyMs: 10000,
  stationSpawningFrequencyMs: 35000,
  cargoSpawningFrequencyReductionFactor: 0.9,
};

export type RenderProps = GameState & {
  restartGame: () => void;
  addStation: (station: Station) => void;
  addLine: (line: Line) => void;
  removeLine: (line: Line) => void;
  addCart: (cart: Cart) => void;
  addCargo: (cargo: Cargo) => void;
  rerouteCargo: (cargo: Cargo) => void;
  upgradeStation: (station: Station) => void;
  upgradeCart: (cart: Cart) => void;
  onArriveToStation: (cart: Cart, station: Station, cartNextStation: Station) => void;
};

interface GameControllerProps {
  editMode: EditMode;
  render?: (renderProps: RenderProps) => JSX.Element;
}

export default function GameController({ editMode, render }: GameControllerProps) {
  const clockIntervalId = useRef(0);

  const stateRef = useRef<GameState>(initialState);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  stateRef.current = state;

  // clock actions
  const startTime = () => {
    clearInterval(clockIntervalId.current);
    clockIntervalId.current = setInterval(() => timeTick(), 1000);
  };

  const timeTick = () => {
    if (stateRef.current.lost) return stopTime();
    dispatch({ type: 'TICK_CLOCK' });
  };

  const stopTime = () => {
    clearInterval(clockIntervalId.current);
  };

  // effects
  // handle isEditing changes
  useEffect(() => {
    const isRunning = editMode === 'idle';
    isRunning ? startTime() : stopTime();
    dispatch({ type: 'SET_RUNNING', isRunning });
    return () => clearInterval(clockIntervalId.current);
  }, [editMode]);

  // render
  if (!render) return null;
  return (
    <>
      {render({
        ...state,
        restartGame: () => dispatch({ type: 'RESTART_GAME' }),
        addStation: (station: Station) => dispatch({ type: 'ADD_STATION', station }),
        addLine: (line: Line) => dispatch({ type: 'ADD_LINE', line }),
        removeLine: (line: Line) => dispatch({ type: 'REMOVE_LINE', line }),
        addCart: (cart: Cart) => dispatch({ type: 'ADD_CART', cart }),
        addCargo: (cargo: Cargo) => dispatch({ type: 'ADD_CARGO', cargo }),
        rerouteCargo: (cargo: Cargo) => dispatch({ type: 'REROUTE_CARGO', cargo }),
        upgradeStation: (station: Station) => dispatch({ type: 'UPGRADE_STATION', station }),
        upgradeCart: (cart: Cart) => dispatch({ type: 'UPGRADE_CART', cart }),
        onArriveToStation: (cart: Cart, station: Station, cartNextStation: Station) => {
          dispatch({
            type: 'ARRIVE_AT_STATION',
            cart,
            station,
            cartNextStation,
          });
        },
      })}
    </>
  );
}
