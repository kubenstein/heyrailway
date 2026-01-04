import { Prism } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './Documentation.module.css';

export default function Documentation() {
  return (
    <div className={styles.host}>
      <strong className={styles.header}>Technical Documentation</strong>
      <br />
      <span>
        HeyRailway is a fun mini-metro like game I built over New Year&amp;s holiday inspired by the service
        infrastructure editor I saw at railway.com.
        <br />
        <br />
        The game is a purely React app, consisting of several logical, visual, and algorithmic components. Let me
        briefly discuss all of them one by one, highlighting challenges, solutions, and my takeaways from each of them.
        <strong>Types</strong>
        Heavily relying on TypeScript allows me to use POJOs for the majority of the data.
        <Prism language="typescript" style={vscDarkPlus}>
          {`export type EditMode = 'idle' | 'addLine' | 'editLine' | 'addCart' | 'upgrateStation' | 'upgradeCart';

export type CargoType = 'DB' | 'REACT' | 'GATEWAY' | 'REDIS';

export type LineId = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // -1 - edit mode line

export type Point = { x: number; y: number };

export type Station = {
  id: string;
  position: Point;
  cargoType: CargoType;
  capacity: number;
  createdAt: number;
};

export type Line = {
  id: LineId;
  stations: Station[];
};

export type Cart = {
  id: string;
  line: Line;
  capacity: number;
  createdAt: number;
  points: number;
};

export type Cargo = {
  id: string;
  cargoType: CargoType;
  stationId: Station['id'] | null;
  cartId: Cart['id'] | null;
  stationIdsRoute: Station['id'][];
};`}
        </Prism>
        Only <em>cargoSpawnerEngine</em> and <em>cartsMovementEngine</em> are JS classes because it&amp;s easier to
        store and clean internal data that way. The rest of the codebase consists of POJOs, pure functions, and React
        stuff.
        <strong>GameController</strong>
        stores and exposes the complete game state as a render function, as well as functions triggering events. State
        and state changes are handled by using <em>useReducer</em>. I didn&amp;t pull in whole Redux because
        <em>useReducer</em>
        was enough, but we could make a use of some caching solutions from Redux.
        <br />
        Event-driven architecture is the way to go as we can&amp;t rely on <em>useState</em>s in an async game
        environment.
        <Prism language="typescript" style={vscDarkPlus}>
          {`export type GameState = {
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
  cartCapacity: number;
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
  onArriveToStation: (cartId: Cart['id'], station: Station, cartNextStation: Station) => void;
};`}
        </Prism>
        <strong>Cart Movement System</strong>
        Cart movement is the core aspect of the game and presented itself with several challenges.
        <br />
        <br />
        First, React is too slow to render changes at 60fps, that&amp;s why the whole cart movement is implemented
        outside of React, in an RAF loop, updating the position of each cart by modifying the CSS <em>transform</em>
        property.
        <br />
        <br />
        Second, to properly follow curved paths (in our case, paths consisting of 90-degree segments), the Movement
        System builds an SVG path based on the line&amp;s station positions, then retrieves the exact position on the
        path using SVG&amp;s built-in <em>path.getPointAtLength</em> function. For this to work, each Movement System
        cart&amp;s internal object (different from the gameState cart object) stores position as a percentage progress -
        current progress against the path&amp;s total length.
        <Prism language="typescript" style={vscDarkPlus}>
          {`cart.progress += cart.direction * cart.line.speed * deltaTime;

const hasArivedAtNextStation =
  (cart.direction === 1 && cart.progress >= cart.nextStation.progress) ||
  (cart.direction === -1 && cart.progress <= cart.nextStation.progress);
`}
        </Prism>
        Third, notifying <em>GameController</em> about arriving at a station is done by comparing cart progress to
        station &quot;progress&quot;. When a line is added, the Movement System also builds an internal representation
        of that line with each station placed at a particular percentage distance along that line. For the Movement
        System, the line is actually a straight line with stations placed at adequate distances. The Movement System
        compares progresses and fire <em>onArriveToStation</em> callback:
        <Prism language="typescript" style={vscDarkPlus}>
          {`this.onArriveToStation(cartId, arivedAtStation, cart.nextStation);`}
        </Prism>
        <img src="/assets/docs-movement.gif" />
        <strong>Cargo spawning and routing</strong>
        Cargos are spawned randomly at random Station at accelerating intervals. Similar to the cart Movement System,
        the Cargo system also maintains its internal representation of lines and stations optimized for its
        functionalities. Each station and each line forms a graph: stations are nodes, and lines are bidirectional
        edges. I use the <em>graphology</em> library as the graph implementation. It comes with a handy API as well as
        out-of-the-box pathfinding.
        <br />
        Pathfinding is a bit unusual because we don&amp;t want to find a path between two nodes; we want to find a path
        between a starting node and the closest node with a matching <em>cargoType</em>. To do this, the system:
        <br />
        <br />
        1. clones the station/line graph
        <br />
        2. inserts a fake destination station
        <br />
        3. connects it with all real stations matching the cargo type
        <br />
        4. performs pathfinding
        <br />
        5. removes the last step, the fake destination station.
        <Prism language="typescript" style={vscDarkPlus}>
          {`const tmpGraph = this.graph.copy();
tmpGraph.addNode('fakeDestination');
tmpGraph
  .filterNodes((_node, attrs) => attrs.cargoType === cargoType)
  .forEach((node) => tmpGraph.addUndirectedEdge(node, 'fakeDestination'));
const fullStationIdsRoute = bidirectional(tmpGraph, startStationId, 'fakeDestination');
`}
        </Prism>
        While in this small game it&amp;s okay to construct temporary paths for each cargo, for bigger cargo sets it
        would be better to cache temporary graphs and modify them when a new station or line is created.
        <strong>Transferring cargo at stations</strong>
        Each cargo stores its full route as an array of station IDs. It also stores the current station ID and current
        cart ID. This information, combined with <em>cart.nextStationId</em>, allows unambiguously determining if a cart
        arriving at a station can take a cargo to its destination, or whether a cargo carried by a cart should get off
        at the arrived station.
        <Prism language="typescript" style={vscDarkPlus}>
          {`newCargos
  // drop cargos
  .map((cargo) => {
    if (cargo.cartId !== cart.id) return cargo; // not this cart
    if (cargo.stationIdsRoute[0] !== station.id) return cargo; // not this station

    cargo.stationId = station.id;
    cargo.cartId = null;
    cargo.stationIdsRoute.shift();
    return cargo;
  })
  // remove delivered cargos
  .filter((cargo) => cargo.stationIdsRoute.length !== 0)
  // load cargos
  .map((cargo) => {
    if (cargo.stationId !== station.id) return cargo; // not this station
    if (cargo.stationIdsRoute[0] !== cartNextStation.id) return cargo; // not going to cart next station
    if (cart.capacity <= newCargos.filter((c) => c.cartId === cart.id).length) return cargo; // cart full

    cargo.cartId = cart.id;
    cargo.stationId = null;
    return cargo;
  })
`}
        </Prism>
        <strong>Restarting the game</strong>
        Restarting the game is implemented by updating a key at the root React component, forcing all components to be
        remounted with a clear new internal state. Both UI and the gameState are reinitialized in that way.
        <br />
        <br />
        Non-React engines are JS classes that are kept in <em>useState</em> of corresponding React wrapper components,
        so they are reinitialized (and garbage collected) as well. The only tricky parts are cleaning the async spawning
        loops and game clock that are implemented as JS <em>setTimeouts</em>. Those are carefully cleaned during the
        previous game component&amp;s unmount process.
        <strong>UI</strong>
        The UI is inspired by railway.com&amp;s infrastructure editor, with a grid, lines, and a right-hand side details
        modal.
        <br />
        The UI is implemented in several special <em>Renderer</em> components: <em>CargoRenderer</em>,
        <em>CartsRenderer</em>,<em>RailwaysRenderer</em>, <em>StationsRenderer</em>. Each uses information from
        gameState to build the game UI. The only exception are carts, which, while rendered by
        <em>CartsRenderer</em>, have their position updated outside of React by targeting them using an HTML
        <em>id</em>.
        <br />
        <br />
        Lines are flashy, neon-like dashed lines. Stations show what type each station is, as well as signaling
        overcrowding by changing color and placing fire; there is also a small crown icon if a station has been
        upgraded, rising its capacity.
        <br />
        <br />
        <img src="/assets/docs-station-fire.png" />
        <br />
        <br />
        The main menu is designed by me: a multistep dropdown nicely communicating to users what the current state is or
        guiding them through the confirmation process.
        <br />
        <br />
        <img src="/assets/docs-menu.gif" />
        <br />
        <br />
        Initially, the game board was implemented as SVG for easier drawing of elements. But refactoring carts to use
        the <em>transform</em> property for position adjustments allowed me to fall back to HTML and CSS that we all
        know and love, to precisely control how each element looks, feels, and behaves.
        <strong>Early sketches</strong>
        <img src="/assets/docs-sketch.jpg" />
        <br />
        <br />
      </span>
    </div>
  );
}
