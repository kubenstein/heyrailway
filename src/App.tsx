import { useState } from 'react';
import GameApp from './gameApp';
import './index.css';
const styles = {};

export default function App() {
  const [showGame, setShowGame] = useState(false);

  const scrollToDocumentation = () => {
    const el = document.getElementById('documentation');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className={styles.story}>
        <h1>Hey Railway!</h1>
        <p>
          Welcome to Hey Railway!, a game where you build and manage a railway system to transport various types of
          cargo between stations. Your goal is to optimize your railway network, upgrade your stations and carts, and
          ensure timely deliveries while handling increasing demand.
        </p>
      </div>
      <div className={styles.actions}>
        <button onClick={() => setShowGame((v) => !v)}>Start Game</button>
        <button onClick={scrollToDocumentation}>Scroll to Documentation</button>
      </div>
      {showGame ? (
        <div className={styles.gameWrapper}>
          <GameApp />
        </div>
      ) : (
        <div>game preview</div>
      )}

      <div className={styles.documentation} id="documentation">
        <h2>Documentation</h2>
      </div>
      <div className={styles.footer}>
        Made with ♥ during 2025/2026 new year holiday by <a href="https://jakubniewczas.pl">Jakub Niewczas</a>
      </div>
    </div>
  );
}
