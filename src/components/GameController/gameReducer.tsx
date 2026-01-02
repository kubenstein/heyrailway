import { Station, Line, Cargo, Cart } from '../../lib/types';
import { dropDeliverLoadCargos } from '../CargoSpawner';
import deepCopy from '../../lib/deepCopy';
import { GameState, initialState } from '.';
import randomId from '../../lib/randomId';

export type GameAction =
  | { type: 'RESTART_GAME' }
  | { type: 'ADD_STATION'; station: Station }
  | { type: 'ADD_LINE'; line: Line }
  | { type: 'REMOVE_LINE'; line: Line }
  | { type: 'ADD_CARGO'; cargo: Cargo }
  | { type: 'REROUTE_CARGO'; cargo: Cargo }
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

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case 'RESTART_GAME':
      return deepCopy({ ...initialState, gameId: randomId() });

    case 'ADD_STATION':
      return { ...state, stations: [...state.stations, action.station] };

    case 'REMOVE_LINE': {
      const removedCartIds = state.carts
        .filter((cart) => cart.line.id === action.line.id)
        .map((cart) => cart.id);

      return {
        ...state,
        lines: state.lines.filter((line) => line.id !== action.line.id),
        carts: state.carts.filter((cart) => cart.line.id !== action.line.id),
        cargos: state.cargos.filter(
          (cargo) => !(cargo.cartId && removedCartIds.includes(cargo.cartId))
        ),
        perkAvailableLines: state.perkAvailableLines + removedCartIds.length,
      };
    }

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

    case 'REROUTE_CARGO': {
      return {
        ...state,
        cargos: state.cargos.map((cargo) =>
          cargo.id === action.cargo.id ? action.cargo : cargo
        ),
      };
    }

    case 'ADD_CART':
      return {
        ...state,
        carts: [...state.carts, action.cart],
        perkCartUpgrades: state.perkCartUpgrades - 1,
      };

    case 'ADD_LINE':
      return {
        ...state,
        lines: [...state.lines, action.line],
        perkAvailableLines: state.perkAvailableLines - 1,
        perkCartUpgrades: state.perkCartUpgrades + 1, // as we instantly add a cart when adding a line, we dont want to deplete the cart upgrade perk
      };

    case 'UPGRADE_STATION': {
      const upgradedStations = state.stations.map((station) =>
        station.id === action.station.id
          ? {
              ...station,
              capacity: Math.floor(
                station.capacity * state.perkStationUpgradeFactor
              ),
            }
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
          ? {
              ...cart,
              capacity: Math.floor(cart.capacity * state.perkCartUpgradeFactor),
            }
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
      const newCarts = state.carts.map((cart) =>
        cart.id === action.cart.id
          ? { ...cart, points: cart.points + deliveredCargosCount }
          : cart
      );
      return {
        ...state,
        cargos: newCargos,
        carts: newCarts,
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
          cargoSpawningFrequencyMs:
            nextState.cargoSpawningFrequencyMs *
            nextState.cargoSpawningFrequencyReductionFactor,
        };
      }

      return nextState;
    }
    default:
      return state;
  }
};
