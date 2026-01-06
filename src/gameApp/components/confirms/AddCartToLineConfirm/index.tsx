import { useEffect, useState } from 'react';
import { Line } from '../../../lib/types';
import styles from './AddCartToLineConfirm.module.css';

interface AddCartToLineConfirmProps {
  line: Line | null;
  onConfirmClick: (line: Line) => void;
}

export default function AddCartToLineConfirm({ line, onConfirmClick }: AddCartToLineConfirmProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!line), 100);
    return () => clearTimeout(timeout);
  }, [line]);

  return (
    <div className={`${styles.host} ${slideIn ? styles.show : ''}`}>
      <p>Do you want to add cart to this line?</p>

      <button className={styles.btn} onClick={() => line && onConfirmClick(line)}>
        Add
      </button>
    </div>
  );
}
