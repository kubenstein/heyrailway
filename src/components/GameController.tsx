import { useEffect, useRef, useReducer, JSX } from 'react';
import { Station, Line, Cargo, Cart } from '../lib/types';
import { dropDeliverLoadCargos } from './CargoSpawner';

type GameState = {
  lost: boolean;
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
  | { type: 'UPGRADE_STATION'; station: Station }
  | { type: 'UPGRADE_CART'; cart: Cart }
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

    case 'ADD_CARGO': {
      const newState = { ...state, cargos: [...state.cargos, action.cargo] };

      const stationOcupation = state.cargos.filter(
        (c) => c.stationId === action.cargo.stationId
      ).length;
      const stationCapacity = state.stations.find(
        (s) => s.id === action.cargo.stationId
      )!.capacity;

      if (stationOcupation > stationCapacity) {
        newState.lost = true;
        newState.running = false;
      }

      return newState;
    }

    case 'ADD_CART':
      return { ...state, carts: [...state.carts, action.cart] };

    case 'UPGRADE_STATION': {
      const upgradedStations = state.stations.map((station) =>
        station.id === action.station.id
          ? { ...station, capacity: Math.floor(station.capacity * 1.2) }
          : station
      );
      return {
        ...state,
        stations: upgradedStations,
        perkStationUpgrades: state.perkStationUpgrades - 1,
      };
    }

    case 'UPGRADE_CART': {
      const upgradedCarts = state.carts.map((cart) =>
        cart.id === action.cart.id
          ? { ...cart, capacity: Math.floor(cart.capacity * 2) }
          : cart
      );
      return {
        ...state,
        carts: upgradedCarts,
        perkCartUpgrades: state.perkCartUpgrades - 1,
      };
    }

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
  lost: false,
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

export type RenderProps = GameState & {
  addStation: (station: Station) => void;
  addLine: (line: Line) => void;
  addCart: (cart: Cart) => void;
  addCargo: (cargo: Cargo) => void;
  upgradeStation: (station: Station) => void;
  upgradeCart: (cart: Cart) => void;
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
        upgradeStation: (station: Station) => {
          dispatch({ type: 'UPGRADE_STATION', station });
        },
        upgradeCart: (cart: Cart) => {
          dispatch({ type: 'UPGRADE_CART', cart });
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
