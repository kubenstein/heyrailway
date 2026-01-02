import { Cargo, Cart } from '../../../lib/types';
import CargoRenderer from '../CargoRenderer';
import styles from './CartsRenderer.module.css';

interface CartsRendererProps {
  hoverable: boolean;
  highlightAll: boolean;
  cartToHighlight: Cart | null;
  carts: Cart[];
  cargos: Cargo[];
  onCartClick: (cart: Cart) => void;
}

export default function CartsRenderer({
  hoverable,
  highlightAll,
  cartToHighlight,
  carts,
  cargos,
  onCartClick,
}: CartsRendererProps) {
  return carts.map((cart) => {
    const cartCargos = cargos.filter((cargo) => cargo.cartId === cart.id);

    const cartWrapperClass = [
      styles.cartWrapper,
      hoverable ? styles.hoverable : '',
      highlightAll ? styles.highlighted : '',
      cartToHighlight && cartToHighlight.id === cart.id
        ? styles.highlighted
        : '',
    ].join(' ');

    return (
      <div
        key={`cart-group-${cart.id}`}
        id={`cart-${cart.id}`}
        className={styles.cartAnchor}
      >
        <div
          className={cartWrapperClass}
          onClick={() => onCartClick(cart)}
          style={
            {
              '--local-color': `var(--line-color-${cart.line.id})`,
            } as React.CSSProperties
          }
        >
          <div className={styles.cartBody} />
          {cartCargos.length > 0 && (
            <div className={styles.cargosWrapper}>
              {cartCargos.map((cargo) => (
                <CargoRenderer
                  key={`cart-cargo-${cargo.id}`}
                  type={cargo.cargoType}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  });
}
