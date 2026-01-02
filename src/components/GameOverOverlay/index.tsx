import { useEffect, useState } from 'react';
import { GameState } from '../GameController';
import styles from './GameOverOverlay.module.css';

interface GameOverOverlayProps {
  gameState: GameState;
  onRestartGameClick: () => void;
}

export default function GameOverOverlay({
  gameState: g,
  onRestartGameClick,
}: GameOverOverlayProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`${styles.wrapper} ${fadeIn ? styles.show : ''}`}>
      <div className={styles.overlay} />

      <div className={styles.modal}>
        <strong>Game Over!</strong>
        <p>
          Your last until round {g.round} and scored {g.points} points!
        </p>

        <button
          className={styles.btn}
          disabled={g.perkAvailableLines <= 0}
          onClick={onRestartGameClick}
        >
          Restart the Game!
        </button>
      </div>
    </div>
  );
}
