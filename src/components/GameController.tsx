import { useEffect, useRef, useReducer, JSX } from 'react';
import { Station, Line, Cargo, Cart } from '../lib/types';
import { dropDeliverLoadCargos } from './CargoSpawner';

type GameState = {
  lines: Line[];
  carts: Cart[];
  cargos: Cargo[];
  stations: Station[];
  clock: number;
  points: number;
  round: number;
  running: boolean;
  perkCartUpgrades: number;
  perkStationUpgrades: number;
  perkAvailableLines: number;
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
};

type GameAction =
  | { type: 'ADD_STATION'; station: Station }
  | { type: 'ADD_LINE'; line: Line }
  | { type: 'ADD_CARGO'; cargo: Cargo }
  | { type: 'ADD_CART'; cart: Cart }
  | {
      type: 'ARRIVE_AT_STATION';
      cart: Cart;
      station: Station;
      cartNextStation: Station;
    }
  | { type: 'SET_RUNNING'; isRunning: boolean }
  | { type: 'TICK_CLOCK' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_STATION':
      return { ...state, stations: [...state.stations, action.station] };

    case 'ADD_LINE':
      return {
        ...state,
        lines: [...state.lines, action.line],
        perkAvailableLines: state.perkAvailableLines - 1,
      };

    case 'ADD_CARGO':
      return { ...state, cargos: [...state.cargos, action.cargo] };

    case 'ADD_CART':
      return { ...state, carts: [...state.carts, action.cart] };

    case 'ARRIVE_AT_STATION': {
      const newCargos = dropDeliverLoadCargos(
        state.cargos,
        action.cart,
        action.station,
        action.cartNextStation
      );
      const deliveredCargosCount = state.cargos.length - newCargos.length;
      return {
        ...state,
        cargos: newCargos,
        points: state.points + deliveredCargosCount,
      };
    }

    case 'SET_RUNNING':
      return {
        ...state,
        running: action.isRunning,
      };

    case 'TICK_CLOCK': {
      const newClock = state.clock + 1;
      let nextState: GameState = { ...state, clock: newClock };

      if (newClock % 60 === 0) {
        nextState = {
          ...nextState,
          round: nextState.round + 1,
          perkCartUpgrades: nextState.perkCartUpgrades + 1,
          perkStationUpgrades: nextState.perkStationUpgrades + 1,
          perkAvailableLines: nextState.perkAvailableLines + 1,
        };
      }

      if (newClock % 130 === 0) {
        nextState = {
          ...nextState,
          cargoSpawningFrequencyMs: nextState.cargoSpawningFrequencyMs * 0.9,
        };
      }

      return nextState;
    }
    default:
      return state;
  }
};

const initialState: GameState = {
  lines: [],
  carts: [],
  cargos: [],
  stations: [],
  clock: 1,
  points: 0,
  round: 1,
  running: true,
  perkCartUpgrades: 0,
  perkStationUpgrades: 0,
  perkAvailableLines: 2,
  cartSpeedPxPerSec: 5,
  cargoSpawningFrequencyMs: 10000,
  stationSpawningFrequencyMs: 35000,
};

export type RenderProps = {
  lines: Line[];
  carts: Cart[];
  cargos: Cargo[];
  stations: Station[];
  points: number;
  round: number;
  running: boolean;
  perkCartUpgrades: number;
  perkStationUpgrades: number;
  perkAvailableLines: number;
  cartSpeedPxPerSec: number;
  cargoSpawningFrequencyMs: number;
  stationSpawningFrequencyMs: number;
  addStation: (station: Station) => void;
  addLine: (line: Line) => void;
  addCart: (cart: Cart) => void;
  addCargo: (cargo: Cargo) => void;
  onArriveToStation: (
    cart: Cart,
    station: Station,
    cartNextStation: Station
  ) => void;
};

interface GameControllerProps {
  isEditing: boolean;
  render?: (renderProps: RenderProps) => JSX.Element;
}

export default function GameController({
  isEditing,
  render,
}: GameControllerProps) {
  const clockIntervalId = useRef(0);

  const [state, dispatch] = useReducer(gameReducer, initialState);

  // clock actions
  const startTime = () => {
    clearInterval(clockIntervalId.current);
    clockIntervalId.current = setInterval(() => {
      dispatch({ type: 'TICK_CLOCK' });
    }, 1000);
  };

  const stopTime = () => {
    clearInterval(clockIntervalId.current);
  };

  // effects
  // handle isEditing changes
  useEffect(() => {
    isEditing ? stopTime() : startTime();
    dispatch({ type: 'SET_RUNNING', isRunning: !isEditing });
    return () => clearInterval(clockIntervalId.current);
  }, [isEditing]);

  // render
  if (!render) return null;
  return (
    <>
      {render({
        ...state,
        addStation: (station: Station) => {
          dispatch({ type: 'ADD_STATION', station });
        },
        addLine: (line: Line) => {
          dispatch({ type: 'ADD_LINE', line });
        },
        addCart: (cart: Cart) => {
          dispatch({ type: 'ADD_CART', cart });
        },
        addCargo: (cargo: Cargo) => {
          dispatch({ type: 'ADD_CARGO', cargo });
        },
        onArriveToStation: (
          cart: Cart,
          station: Station,
          cartNextStation: Station
        ) => {
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
