import styles from './GamePreview.module.css';

export default function GamePreview() {
  return (
    <div className={styles.gamePreview}>
      <img className={styles.gamePreviewImg} src="/assets/preview.png" />
      <div className={styles.content}>
        <strong>Join the Adventure!</strong>
        <p>Connect services, add carts, use perks, and make sure the infrastructure operates without any congestion!</p>

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
  );
}
