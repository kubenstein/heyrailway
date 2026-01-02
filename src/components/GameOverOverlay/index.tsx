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
          Oh no! One of the stations is overcrowded!
          <br />
          You lasted until round <em>{g.round}</em> and scored{' '}
          <em>{g.points}</em> points!
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
