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
import { Line } from '../lib/types';

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
        render={({
          gameData,
          stations,
          lines,
          carts,
          cargos,
          addStation,
          addLine,
          addCart,
          addCargo,
          onArriveToStation,
        }) => (
          <div>
            <CartsMovement
              enabled={gameData.running}
              speedPxPerSec={gameData.cartSpeedPxPerSec}
              carts={carts}
              lines={lines}
              onCartPositionUpdate={(cart, position) =>
                nonReactCartPositionUpdater(boardEl.current!, cart, position)
              }
              onArriveToStation={onArriveToStation}
            />
            <CargoSpawner
              enabled={gameData.running}
              frequencyMs={gameData.cargoSpawningFrequencyMs}
              stations={stations}
              lines={lines}
              onCargoSpawn={addCargo}
            />
            <StationSpawner
              enabled={gameData.running}
              initialStations={3}
              frequencyMs={gameData.stationSpawningFrequencyMs}
              onStationSpawn={addStation}
            />

            {lines.map((line) => (
              <button
                key={line.id}
                onClick={() => addCart({ id: randomId(), capacity: 6, line })}
              >
                Add Cart to Line {line.id}
              </button>
            ))}

            <div>
              perkAvailableLines: {gameData.perkAvailableLines}
              <br />
              perkCartUpgrades: {gameData.perkCartUpgrades}
              <br />
              perkStationUpgrades: {gameData.perkStationUpgrades}
              <br />
            </div>
            <div
              ref={boardEl}
              className="board"
              style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
            >
              <RailwaysRenderer lines={lines} />
              <StationsRenderer stations={stations} cargos={cargos} />
              <CartsRenderer carts={carts} cargos={cargos} />
              {isEditing && (
                <LineEditor
                  stations={stations}
                  availableLines={gameData.perkAvailableLines}
                  onLineCreate={(line: Line) => {
                    addLine(line);
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
