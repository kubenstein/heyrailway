import { useEffect, useState } from 'react';
import { Cart } from '../../lib/types';
import { GameState } from '../GameController';
import styles from './CartDetailsModal.module.css';
import CargoRenderer from '../renderers/CargoRenderer';

interface CartDetailsModalProps {
  gameState: GameState;
  cartId: Cart['id'] | null;
  onClose: () => void;
}

export default function CartDetailsModal({ gameState, cartId, onClose }: CartDetailsModalProps) {
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSlideIn(!!cartId), 100);
    return () => clearTimeout(timeout);
  }, [cartId]);

  const cart = cartId && gameState.carts.find((c) => c.id === cartId);
  const cargos = cartId ? gameState.cargos.filter((c) => c.cartId === cartId) : [];

  return (
    <div className={`${styles.modal} ${slideIn ? styles.show : ''}`}>
      {cart && (
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
            <strong>Cart Details</strong>
          </div>
          <div className={styles.content}>
            Cart id: <em>{cart.id}</em>
            <br />
            capacity: <em>{cart.capacity}</em>
            <br />
            Age: <em>{gameState.round - cart.createdAt} rounds</em>
            <br />
            Points gained: <em>{cart.points}</em>
            <br />
            <br />
            Cargos ({cargos.length}):
            <br />
            <div className={styles.cargosWrapper}>
              {cargos.map((cargo) => (
                <CargoRenderer key={cargo.id} type={cargo.cargoType} size={32} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
