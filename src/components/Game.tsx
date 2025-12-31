import { useState, useRef } from 'react';
import StationsRenderer from './renderers/StationsRenderer';
import RailwaysRenderer from './renderers/RailwaysRenderer';
import CartsRenderer from './renderers/CartsRenderer';
import LineEditor from './LineEditor';
import CartsMovement, { nonReactCartPositionUpdater } from './CartsMovement';
import CargoSpawner from './CargoSpawner';
import StationSpawner from './StationSpawner';
import randomId from '../lib/randomId';
import { BOARD_SIZE } from '../lib/board';
import GameController from './GameController';
import { Cart, Line, Station } from '../lib/types';

export default function Game() {
  const boardEl = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className="app">
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel Editing' : 'Start Editing'}
      </button>

      <GameController
        isEditing={isEditing}
        render={(g) => (
          <div>
            <CartsMovement
              enabled={g.running}
              speedPxPerSec={g.cartSpeedPxPerSec}
              carts={g.carts}
              lines={g.lines}
              onCartPositionUpdate={(cart, position) =>
                nonReactCartPositionUpdater(boardEl.current!, cart, position)
              }
              onArriveToStation={g.onArriveToStation}
            />
            <CargoSpawner
              enabled={g.running}
              frequencyMs={g.cargoSpawningFrequencyMs}
              stations={g.stations}
              lines={g.lines}
              cargos={g.cargos}
              onCargoSpawn={g.addCargo}
              onCargoReroute={g.rerouteCargo}
            />
            <StationSpawner
              enabled={g.running}
              initialStations={3}
              frequencyMs={g.stationSpawningFrequencyMs}
              onStationSpawn={g.addStation}
            />

            {g.lines.map((line) => (
              <button
                key={line.id}
                onClick={() => g.addCart({ id: randomId(), capacity: 6, line })}
              >
                Add Cart to Line {line.id}
              </button>
            ))}

            <div>
              points: {g.points}
              <br />
              round: {g.round}
              <br />
              perkAvailableLines: {g.perkAvailableLines}
              <br />
              perkCartUpgrades: {g.perkCartUpgrades}
              <br />
              perkStationUpgrades: {g.perkStationUpgrades}
              <br />
              {g.lost && <strong>GAME OVER</strong>}
            </div>
            <div
              ref={boardEl}
              className="board"
              style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
            >
              <RailwaysRenderer lines={g.lines} />
              <StationsRenderer
                stations={g.stations}
                cargos={g.cargos}
                onStationClick={(station: Station) => {
                  if (isEditing) return;
                  if (g.perkStationUpgrades <= 0) return;

                  setIsEditing(true);
                  if (!confirm('do you want to upgrade this station?')) {
                    g.upgradeStation(station);
                  }
                  setIsEditing(false);
                }}
              />
              <CartsRenderer
                carts={g.carts}
                cargos={g.cargos}
                onCartClick={(cart: Cart) => {
                  if (isEditing) return;
                  if (g.perkCartUpgrades <= 0) return;

                  setIsEditing(true);
                  if (confirm('do you want to upgrade this cart?')) {
                    g.upgradeCart(cart);
                  }
                  setIsEditing(false);
                }}
              />
              {isEditing && (
                <LineEditor
                  stations={g.stations}
                  availableLines={g.perkAvailableLines}
                  onLineCreate={(line: Line) => {
                    g.addLine(line);
                    setIsEditing(false);
                  }}
                />
              )}
            </div>
          </div>
        )}
      />
    </main>
  );
}
