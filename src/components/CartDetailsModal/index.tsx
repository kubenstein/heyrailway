import { useEffect, useState } from 'react';
import { Cart } from '../../lib/types';
import { GameState } from '../GameController';
import styles from './CartDetailsModal.module.css';

interface CartDetailsModalProps {
  gameState: GameState;
  cartId: Cart['id'] | null;
  onCloseClick: () => void;
}

export default function CartDetailsModal({
  gameState,
  cartId,
  onCloseClick,
}: CartDetailsModalProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!cartId), 100);
    return () => clearTimeout(timeout);
  }, [cartId]);

  const cart = cartId && gameState.carts.find((c) => c.id === cartId);
  const cargos = cartId
    ? gameState.cargos.filter((c) => c.cartId === cartId)
    : [];

  return (
    <div className={`${styles.modal} ${slideIn ? styles.show : ''}`}>
      {cart && (
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <button className={styles.closeBtn} onClick={onCloseClick}>
              ×
            </button>
            <strong>Cart Details</strong>
          </div>
          <div className={styles.content}>
            Cart id: <em>{cart.id}</em>
            <br />
            Age: <em>{gameState.round - cart.createdAt} rounds</em>
            <br />
            Points gained: <em>{cart.points}</em>
            <br />
            <br />
            Cargo:
            <br />
            {cargos.map((cargo) => (
              <div key={cargo.id}>{cargo.cargoType}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
