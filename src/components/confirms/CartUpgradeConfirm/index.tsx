import { useEffect, useState } from 'react';
import { Cart } from '../../../lib/types';
import styles from './CartUpgradeConfirm.module.css';

interface CartUpgradeConfirmProps {
  cartToUpgrade: Cart | null;
  onConfirmClick: (line: Cart) => void;
}

export default function CartUpgradeConfirm({ cartToUpgrade, onConfirmClick }: CartUpgradeConfirmProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!cartToUpgrade), 100);
    return () => clearTimeout(timeout);
  }, [cartToUpgrade]);

  return (
    <div className={`${styles.modal} ${slideIn ? styles.show : ''}`}>
      <p>Do you want to upgrade this cart?</p>

      <button className={styles.btn} onClick={() => cartToUpgrade && onConfirmClick(cartToUpgrade)}>
        Upgrade
      </button>
    </div>
  );
}
