import styles from './Cta.module.css';

export default function Cta() {
  return (
    <div className={styles.host}>
      <strong>Would you like to have a quick chat?</strong>
      <a target="_blank" href="https://www.jakubniewczas.pl/" rel="noreferrer">
        https://jakubniewczas.pl
      </a>
      <div className={styles.board}>
        <i className={styles.me} />
        <i className={styles.railway} />
      </div>
    </div>
  );
}
