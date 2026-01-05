import { useState, lazy, Suspense, useEffect } from 'react';
import Story from './components/Story/Story';
import GamePreview from './components/GamePreview/GamePreview';
import Cta from './components/Cta/Cta';
import DelayedSuspense from './components/DelayedSuspense/DelayedSuspense';
import styles from './App.module.css';
import OnlyDesktopNotice from './components/OnlyDesktopNotice/OnlyDesktopNotice';

const Documentation = lazy(() => import('./components/Documentation/Documentation'));
const GameApp = lazy(() => import('./gameApp'));

export default function App() {
  const [showGame, setShowGame] = useState(false);
  const [isDesktop] = useState(() => window?.matchMedia('(min-width: 880px)').matches);

  useEffect(() => {
    // preloading
    import('./gameApp');
  }, []);

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
          <>
            {isDesktop ? (
              <div id="game" className={styles.gameWrapper}>
                <div id="gameScrollAnchor" className={styles.gameScrollAnchor} />
                <DelayedSuspense fallback={<div>Loading game...</div>} delay={1000}>
                  <GameApp />
                </DelayedSuspense>
              </div>
            ) : (
              <OnlyDesktopNotice />
            )}
          </>
        ) : (
          <GamePreview />
        )}

        <div id="documentationScrollAnchor" />
        <Suspense fallback={<div>Loading documentation...</div>}>
          <Documentation />
        </Suspense>

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
