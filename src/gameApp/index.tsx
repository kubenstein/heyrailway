import Game from './components/Game';
import styles from './index.module.css';

export default function App() {
  return (
    <div className={styles.gameVars}>
      <Game />
    </div>
  );
}
