import { useState } from 'react';
import GameApp from './gameApp';
import Story from './components/Story/Story';
import Documentation from './components/Documentation/Documentation';
import GamePreview from './components/GamePreview/GamePreview';
import Cta from './components/Cta/Cta';
import styles from './App.module.css';

export default function App() {
  const [showGame, setShowGame] = useState(false);

  const startGame = () => {
    setShowGame(true);
    setTimeout(() => {
      const scrollToEl = document.getElementById('gameScrollAnchor');
      scrollToEl?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToDocumentation = () => {
    const scrollToEl = document.getElementById('documentationScrollAnchor');
    scrollToEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={styles.host}>
      <div className={styles.main}>
        <Story />

        <div className={styles.actions}>
          <button className={styles.game} onClick={startGame} disabled={showGame}>
            Start Game
          </button>
          <button className={styles.docs} onClick={scrollToDocumentation}>
            Scroll to Documentation
          </button>
        </div>

        {showGame ? (
          <div id="game" className={styles.gameWrapper}>
            <div id="gameScrollAnchor" className={styles.gameScrollAnchor} />
            <GameApp />
          </div>
        ) : (
          <GamePreview />
        )}

        <Documentation />

        <Cta />

        <div className={styles.footer}>
          Made with ♥ by{' '}
          <a target="_blank" href="https://jakubniewczas.pl" rel="noreferrer">
            Jakub Niewczas
          </a>
          <br />
          during the 2025/2026 New Year&apos;s holidays
        </div>
      </div>
    </main>
  );
}
