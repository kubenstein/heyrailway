import React, { useState, useRef } from 'react';
import StationsRenderer from '../renderers/StationsRenderer';
import RailwaysRenderer from '../renderers/RailwaysRenderer';
import CartsRenderer from '../renderers/CartsRenderer';
import LineEditor from '../LineEditor';
import CartsMovement, { nonReactCartPositionUpdater } from '../CartsMovement';
import CargoSpawner from '../CargoSpawner';
import StationSpawner from '../StationSpawner';
import Header from '../Header';
import GameController from '../GameController';
import GameOverOverlay from '../GameOverOverlay';
import randomId from '../../lib/randomId';
import { BOARD_CELL_SIZE, BOARD_SIZE } from '../../lib/board';
import { Cart, Line, Station, EditMode } from '../../lib/types';
import styles from './Game.module.css';
import LineToRemoveConfirm from '../LineToRemoveConfirm';

export default function Game() {
  const boardEl = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<EditMode>('idle');
  const [lineToRemove, setLineToRemove] = useState<Line | null>(null);

  return (
    <div className={styles.game}>
      <GameController
        editMode={editMode}
        render={(g) => (
          <React.Fragment key={g.gameId}>
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

            <Header
              gameState={g}
              editMode={editMode}
              onEditModeChange={(newEditMode: EditMode) => {
                setEditMode(newEditMode);
                setLineToRemove(null);
              }}
            />
            <div className={styles.boardWrapper}>
              <div
                ref={boardEl}
                className={styles.board}
                style={{
                  backgroundSize: `${BOARD_CELL_SIZE}px ${BOARD_CELL_SIZE}px`,
                  width: BOARD_SIZE * BOARD_CELL_SIZE,
                  height: BOARD_SIZE * BOARD_CELL_SIZE,
                }}
              >
                <RailwaysRenderer
                  editMode={editMode}
                  lines={g.lines}
                  onLineClick={(line: Line) => {
                    if (editMode !== 'editLine') return;
                    setLineToRemove(line);
                  }}
                />
                <StationsRenderer
                  editMode={editMode}
                  stations={g.stations}
                  cargos={g.cargos}
                  onStationClick={(station: Station) => {
                    if (editMode !== 'upgrateStation') return;
                    if (g.perkStationUpgrades <= 0) return;

                    if (confirm('Do you want to upgrade this station?')) {
                      g.upgradeStation(station);
                    }
                  }}
                />
                <CartsRenderer
                  editMode={editMode}
                  carts={g.carts}
                  cargos={g.cargos}
                  onCartClick={(cart: Cart) => {
                    if (editMode !== 'upgradeCart') return;
                    if (g.perkCartUpgrades <= 0) return;

                    if (confirm('Do you want to upgrade this cart?')) {
                      g.upgradeCart(cart);
                    }
                  }}
                />
                {editMode === 'addLine' && (
                  <LineEditor
                    lines={g.lines}
                    stations={g.stations}
                    onLineCreate={(line: Line) => {
                      g.addLine(line);
                      g.addCart({ id: randomId(), capacity: 6, line });
                    }}
                  />
                )}
              </div>

              {g.lost && (
                <GameOverOverlay
                  gameState={g}
                  onRestartGameClick={() => g.restartGame()}
                />
              )}

              <LineToRemoveConfirm
                lineToRemove={lineToRemove}
                onConfirmClick={(line: Line) => {
                  g.removeLine(line);
                  setLineToRemove(null);
                }}
              />
            </div>
          </React.Fragment>
        )}
      />
    </div>
  );
}
