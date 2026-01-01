import { useEffect, useState } from 'react';
import { Station } from '../../lib/types';
import styles from './StationUpgradeConfirm.module.css';

interface StationUpgradeConfirmProps {
  stationToUpgrade: Station | null;
  onConfirmClick: (line: Station) => void;
}

export default function StationUpgradeConfirm({
  stationToUpgrade,
  onConfirmClick,
}: StationUpgradeConfirmProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!stationToUpgrade), 100);
    return () => clearTimeout(timeout);
  }, [stationToUpgrade]);

  return (
    <div className={`${styles.wrapper} ${slideIn ? styles.show : ''}`}>
      <div className={styles.modal}>
        <p>Do you want to upgrade this station?</p>

        <button
          className={styles.btn}
          onClick={() => stationToUpgrade && onConfirmClick(stationToUpgrade)}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}
