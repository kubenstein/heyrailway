import styles from './OnlyDesktopNotice.module.css';

export default function OnlyDesktopNotice() {
  return (
    <div className={styles.host}>
      <img className={styles.awkwardPngLol} src="/assets/awkward.png" />
      The game is only available on desktop devices.
      <br />
      Please visit the site on a desktop to play the game.
    </div>
  );
}
