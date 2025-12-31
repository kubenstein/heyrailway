import { Cargo, Cart, CargoType } from '../../../lib/types';
import styles from './CartsRenderer.module.css';

interface CartsRendererProps {
  carts: Cart[];
  cargos: Cargo[];
  onCartClick: (cart: Cart) => void;
}

export default function CartsRenderer({
  carts,
  cargos,
  onCartClick,
}: CartsRendererProps) {
  const typeToShapeClass = (cargoType: CargoType) => {
    switch (cargoType) {
      case 'CIRCLE':
        return styles.circle;
      case 'TRIANGLE':
        return styles.triangle;
      default:
        return undefined;
    }
  };

  return carts.map((cart) => {
    const cargoShapes = cargos
      .filter((cargo) => cargo.cartId === cart.id)
      .map((cargo, index) => {
        const cargoX = (index % 3) * 6 - 6;
        const cargoY = 12 + Math.floor(index / 3) * 6;

        const cargoClassName = [
          styles.cargoShapeCart,
          typeToShapeClass(cargo.cargoType),
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={`cart-cargo-${cargo.id}`}
            className={styles.boardAnchor}
            style={{ transform: `translate(${cargoX}px, ${cargoY}px)` }}
          >
            <div className={cargoClassName} />
          </div>
        );
      });

    return (
      <div
        key={`cart-group-${cart.id}`}
        id={`cart-${cart.id}`}
        className={styles.boardAnchor}
        style={{ transform: 'translate(0px, 0px)' }}
        onClick={() => onCartClick(cart)}
      >
        <div
          className={styles.cartShape}
          style={
            {
              '--local-color': `var(--line-color-${cart.line.id})`,
            } as React.CSSProperties
          }
        />
        {cargoShapes}
      </div>
    );
  });
}
