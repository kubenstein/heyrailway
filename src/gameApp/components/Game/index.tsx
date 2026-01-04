import React, { useState, useRef, useEffect } from 'react';
import StationsRenderer from '../renderers/StationsRenderer';
import RailwaysRenderer from '../renderers/RailwaysRenderer';
import CartsRenderer from '../renderers/CartsRenderer';
import LineEditor from '../LineEditor';
import CartsMovement, { nonReactCartPositionUpdater } from '../CartsMovement';
import CargoSpawner from '../spawners/CargoSpawner';
import StationSpawner from '../spawners/StationSpawner';
import Header from '../Header';
import GameController from '../GameController';
import GameOverOverlay from '../GameOverOverlay';
import LineToRemoveConfirm from '../confirms/LineToRemoveConfirm';
import StationUpgradeConfirm from '../confirms/StationUpgradeConfirm';
import CartUpgradeConfirm from '../confirms/CartUpgradeConfirm';
import AddCartToLineConfirm from '../confirms/AddCartToLineConfirm';
import CartDetailsModal from '../modals/CartDetailsModal';
import StationDetailsModal from '../modals/StationDetailsModal';
import BoardDragger from '../BoardDragger';
import randomId from '../../lib/randomId';
import { BOARD_CELL_SIZE, BOARD_SIZE } from '../../lib/board';
import { Cart, Line, Station, EditMode, Point } from '../../lib/types';
import styles from './Game.module.css';

export default function Game() {
  const boardEl = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<EditMode>('idle');
  const [lineToHighlight, setLineToHighlight] = useState<Line | null>(null);
  const [cartDetails, setCartDetails] = useState<Cart | null>(null);
  const [stationDetails, setStationDetails] = useState<Station | null>(null);
  const [lineToRemove, setLineToRemove] = useState<Line | null>(null);
  const [addCartToLine, setAddCartToLine] = useState<Line | null>(null);
  const [cartToUpgrade, setCartToUpgrade] = useState<Cart | null>(null);
  const [stationToUpgrade, setStationToUpgrade] = useState<Station | null>(null);
  const [boardPosition, setBoardPosition] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setLineToHighlight(null);
    setLineToRemove(null);
    setCartToUpgrade(null);
    setStationToUpgrade(null);
    setAddCartToLine(null);
    setCartDetails(null);
    setStationDetails(null);
  }, [editMode]);

  return (
    <div className={styles.host}>
      <GameController
        editMode={editMode}
        render={(g) => (
          <React.Fragment key={g.gameId}>
            <CartsMovement
              enabled={g.running}
              speedPxPerSec={g.cartSpeedPxPerSec}
              carts={g.carts}
              lines={g.lines}
              onCartPositionUpdate={(cartId, position) =>
                nonReactCartPositionUpdater(boardEl.current!, cartId, position)
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
              round={g.round}
              initialStations={g.initialStations}
              initialStationCapacity={g.stationCapacity}
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
                  transform: `translate(${boardPosition.x}px, ${boardPosition.y}px) scale(${scale})`,
                }}
              >
                <RailwaysRenderer
                  scale={scale}
                  lines={g.lines}
                  hoverable={['editLine', 'addCart'].includes(editMode)}
                  lineToHighlight={lineToHighlight}
                  onMouseEnterLine={(line: Line) => {
                    if (!['editLine', 'addCart'].includes(editMode)) return;
                    setLineToHighlight(line);
                  }}
                  onMouseLeaveLine={() => setLineToHighlight(null)}
                  onLineClick={(line: Line) => {
                    if (!['editLine', 'addCart'].includes(editMode)) return;
                    setLineToHighlight(line);
                    if (editMode === 'editLine') setLineToRemove(line);
                    if (editMode === 'addCart') setAddCartToLine(line);
                  }}
                />
                <StationsRenderer
                  hoverable={['idle', 'upgrateStation'].includes(editMode)}
                  stationToHighlight={stationDetails}
                  highlightAll={editMode === 'upgrateStation'}
                  stations={g.stations}
                  cargos={g.cargos}
                  initialStationCapacity={g.stationCapacity}
                  onStationClick={(station: Station) => {
                    if (editMode === 'upgrateStation' && g.perkStationUpgrades > 0) setStationToUpgrade(station);
                    if (editMode === 'idle') {
                      setCartDetails(null);
                      setStationDetails(station);
                    }
                  }}
                />
                <CartsRenderer
                  hoverable={['idle', 'upgradeCart'].includes(editMode)}
                  highlightAll={editMode === 'upgradeCart'}
                  cartToHighlight={cartDetails}
                  carts={g.carts}
                  cargos={g.cargos}
                  initialCartCapacity={g.cartCapacity}
                  onCartClick={(cart: Cart) => {
                    if (editMode === 'upgradeCart' && g.perkCartUpgrades > 0) setCartToUpgrade(cart);
                    if (editMode === 'idle') {
                      setStationDetails(null);
                      setCartDetails(cart);
                    }
                  }}
                />
                {editMode === 'addLine' && (
                  <LineEditor
                    lines={g.lines}
                    stations={g.stations}
                    scale={scale}
                    onLineCreate={(line: Line) => {
                      g.addLine(line);
                      g.addCart({
                        id: randomId(),
                        capacity: g.cartCapacity,
                        line,
                        points: 0,
                        createdAt: g.round,
                      });
                    }}
                  />
                )}
                <BoardDragger
                  boardEl={boardEl}
                  currentScale={scale}
                  onBoardMove={(delta) => setBoardPosition((prev) => ({ x: prev.x + delta.x, y: prev.y + delta.y }))}
                  onScaleChange={(newScale: number) => setScale(newScale)}
                />
              </div>

              {g.lost && <GameOverOverlay gameState={g} onRestartGameClick={() => g.restartGame()} />}

              <AddCartToLineConfirm
                line={addCartToLine}
                onConfirmClick={(line: Line) => {
                  g.addCart({
                    id: randomId(),
                    capacity: g.cartCapacity,
                    line,
                    points: 0,
                    createdAt: g.round,
                  });
                  setAddCartToLine(null);
                }}
              />
              <LineToRemoveConfirm
                lineToRemove={lineToRemove}
                onConfirmClick={(line: Line) => {
                  g.removeLine(line);
                  setLineToRemove(null);
                }}
              />
              <StationUpgradeConfirm
                stationToUpgrade={stationToUpgrade}
                onConfirmClick={(station: Station) => {
                  g.upgradeStation(station);
                  setStationToUpgrade(null);
                }}
              />
              <CartUpgradeConfirm
                cartToUpgrade={cartToUpgrade}
                onConfirmClick={(cart: Cart) => {
                  g.upgradeCart(cart);
                  setCartToUpgrade(null);
                }}
              />
              <CartDetailsModal gameState={g} cartId={cartDetails?.id || null} onClose={() => setCartDetails(null)} />
              <StationDetailsModal
                gameState={g}
                stationId={stationDetails?.id || null}
                onClose={() => setStationDetails(null)}
              />
            </div>
          </React.Fragment>
        )}
      />
    </div>
  );
}
