import { GameState } from '../GameController';
import styles from './Header.module.css';
import logoImage from '../../assets/logo.png';

interface HeaderProps {
  gameState: GameState;
  isEditing: boolean;
  onEditClick: () => void;
}

export default function Header({
  gameState: g,
  isEditing,
  onEditClick,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.primary}>
        <img src={logoImage} className={styles.logoImg} />
        <span>Round: {g.round}</span>
        <span>Points: {g.points}</span>
      </div>
      <div className="actions">
        <button
          className={styles.btn}
          disabled={g.perkAvailableLines <= 0}
          onClick={onEditClick}
        >
          {isEditing ? 'Exit Edit Mode' : 'Add Line'}
        </button>
      </div>
      <div className={styles.stats}>
        <span>
          Available Lines:{' '}
          <span className={styles.counter}>{g.perkAvailableLines}</span>
        </span>
        <span>
          Cart Upgrades:{' '}
          <span className={styles.counter}>{g.perkCartUpgrades}</span>
        </span>
        <span>
          Station Upgrades:{' '}
          <span className={styles.counter}>{g.perkStationUpgrades}</span>
        </span>
      </div>
    </div>
  );
}
