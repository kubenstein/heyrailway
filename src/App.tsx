import { useState } from 'react';
import GameApp from './gameApp';
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
        <div className={styles.story}>
          <div className={styles.avatar}>
            <i className={styles.me} />
            <span>Tokyo-based Sr. Fullstack Software Engineer</span>
            <strong>Jakub Niewczas</strong>
            <p>
              13+ years of industrial experience in building
              <br />
              and growing multi-million dollar tech projects.
            </p>
          </div>
          <p>
            Hey Railway!
            <br />
            Welcome to Hey Railway! a game where you build and manage a railway system to transport various types of
            cargo between stations. Your goal is to optimize your railway network, upgrade your stations and carts, and
            ensure timely deliveries while handling increasing demand.
          </p>
        </div>

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
          <div className={styles.gamePreview}>
            <img className={styles.gamePreviewImg} src="/assets/preview.png" />
            <div className={styles.content}>
              <strong>Join the Adventure!</strong>
              <p>
                Connect services, add carts, use perks, and make sure the infrastructure operates without any
                congestion!
              </p>

              <ul>
                <li>
                  <em>5 unique</em> types of services!
                </li>
                <li>Cart and station upgrades!</li>
                <li>
                  <em>Amazing infrastructure editor!</em>
                </li>
                <li>
                  Hover over cargos to <em>examinate detailed routing!</em>
                </li>
                <li>Handle dangerous network congestion situations! Oh no!</li>
              </ul>
              <ul>
                <li>
                  Smooth (and clever) <em>RAF-based animations!</em>
                </li>
                <li>
                  Advanced <em>graph-based pathfinding!</em>
                </li>
                <li>
                  And simply <em>lots of FUN!</em> <small>(for sure building it!)</small>
                </li>
              </ul>
              <div className={styles.stations}>
                <img src="/assets/postgres.png" title={`Route:\n● → Jakub → Railway team`} />
                <img src="/assets/redis.png" title={`Route:\n● → Jakub → Railway team`} />
                <img src="/assets/gateway.png" title={`Route:\n● → Jakub → Railway team`} />
                <img src="/assets/temporal.png" title={`Route:\n● → Jakub → Railway team`} />
                <img src="/assets/next.png" title={`Route:\n● → Jakub → Railway team`} />
              </div>
            </div>
          </div>
        )}

        <div id="documentationScrollAnchor" className={styles.documentation}>
          <strong>Technical Documentation</strong>
          <div style={{ height: '30rem' }} />
        </div>

        <div className={styles.cta}>
          <strong>Would you like to have a quick chat?</strong>
          <a target="_blank" href="https://www.jakubniewczas.pl/" rel="noreferrer">
            https://jakubniewczas.pl
          </a>
          <div className={styles.board}>
            <i className={styles.me} />
            <i className={styles.railway} />
          </div>
        </div>

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
