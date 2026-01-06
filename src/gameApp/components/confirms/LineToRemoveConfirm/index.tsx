import { useEffect, useState } from 'react';
import { Line } from '../../../lib/types';
import styles from './LineToRemoveConfirm.module.css';

interface LineToRemoveConfirmProps {
  lineToRemove: Line | null;
  onConfirmClick: (line: Line) => void;
}

export default function LineToRemoveConfirm({ lineToRemove, onConfirmClick }: LineToRemoveConfirmProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!lineToRemove), 100);
    return () => clearTimeout(timeout);
  }, [lineToRemove]);

  return (
    <div className={`${styles.host} ${slideIn ? styles.show : ''}`}>
      <p>Do you want to remove this line?</p>

      <button className={styles.btn} onClick={() => lineToRemove && onConfirmClick(lineToRemove)}>
        Remove
      </button>
    </div>
  );
}
