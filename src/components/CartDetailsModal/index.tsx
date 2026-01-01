import { useEffect, useState } from 'react';
import { Cart } from '../../lib/types';
import styles from './CartDetailsModal.module.css';

interface CartDetailsModalProps {
  cart: Cart | null;
  onCloseClick: () => void;
}

export default function CartDetailsModal({
  cart,
  onCloseClick,
}: CartDetailsModalProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!cart), 100);
    return () => clearTimeout(timeout);
  }, [cart]);

  return (
    <div className={`${styles.wrapper} ${slideIn ? styles.show : ''}`}>
      <div className={styles.modal}>
        {cart && (
          <>
            <button className={styles.closeBtn} onClick={onCloseClick}>
              ×
            </button>
            <div className={styles.content}>
              <p>Cart id: {cart.id}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
