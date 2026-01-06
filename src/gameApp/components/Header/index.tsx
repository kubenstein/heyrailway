import { GameState } from '../GameController';
import styles from './Header.module.css';
import { useEffect } from 'react';
import { EditMode } from '../../lib/types';

interface HeaderProps {
  gameState: GameState;
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
}

export default function Header({ gameState: g, editMode, onEditModeChange }: HeaderProps) {
  useEffect(() => {
    if (editMode === 'addLine' && g.perkAvailableLines <= 0) onEditModeChange('editLine');
  }, [g.perkAvailableLines, editMode, onEditModeChange]);

  return (
    <div className={styles.host}>
      <div className={styles.header}>
        <div className={styles.primary}>
          <div className={styles.logo} />
          <span>Round: {g.round}</span>
          <span>Points: {g.points}</span>
        </div>
        <div className={styles.actions}>
          <button
            disabled={g.lost}
            className={`${styles.btn} ${styles.active}`}
            onClick={() => onEditModeChange(editMode === 'idle' ? 'addLine' : 'idle')}
          >
            {editMode === 'idle' ? 'Edit Mode' : 'Exit Edit Mode'}
          </button>
        </div>
        <div className={styles.stats}>
          <span>
            Available Lines: <span className={styles.counter}>{g.perkAvailableLines}</span>
          </span>
          <span>
            Cart Adds/Upgrades: <span className={styles.counter}>{g.perkCartUpgrades}</span>
          </span>
          <span>
            Station Upgrades: <span className={styles.counter}>{g.perkStationUpgrades}</span>
          </span>
        </div>
      </div>
      <div className={`${styles.editModeMenu} ${editMode !== 'idle' ? styles.opened : ''}`}>
        <button
          className={`${styles.btn} ${editMode === 'addLine' ? styles.active : ''}`}
          disabled={g.perkAvailableLines <= 0}
          onClick={() => onEditModeChange('addLine')}
        >
          Add Line
        </button>

        <button
          className={`${styles.btn} ${editMode === 'editLine' ? styles.active : ''}`}
          onClick={() => onEditModeChange('editLine')}
        >
          Remove Lines
        </button>

        <button
          className={`${styles.btn} ${editMode === 'addCart' ? styles.active : ''}`}
          disabled={g.perkCartUpgrades <= 0}
          onClick={() => onEditModeChange('addCart')}
        >
          Add Cart
        </button>

        <button
          className={`${styles.btn} ${editMode === 'upgradeCart' ? styles.active : ''}`}
          disabled={g.perkCartUpgrades <= 0}
          onClick={() => onEditModeChange('upgradeCart')}
        >
          Upgrade Carts
        </button>

        <button
          className={`${styles.btn} ${editMode === 'upgrateStation' ? styles.active : ''}`}
          disabled={g.perkStationUpgrades <= 0}
          onClick={() => onEditModeChange('upgrateStation')}
        >
          Upgrade Stations
        </button>
      </div>
    </div>
  );
}
