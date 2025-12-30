import { Cargo, Cart } from '../../lib/types';

interface CartsRendererProps {
  carts: Cart[];
  cargos: Cargo[];
}

export default function CartsRenderer({ carts, cargos }: CartsRendererProps) {
  return carts.map((cart) => {
    const cargoShapes = cargos
      .filter((cargo) => cargo.cartId === cart.id)
      .map((cargo, index) => {
        const cargoX = (index % 3) * 6 - 6;
        const cargoY = 12 + Math.floor(index / 3) * 6;

        return (
          <div
            key={`cart-cargo-${cargo.id}`}
            className="board-anchor"
            style={{ transform: `translate(${cargoX}px, ${cargoY}px)` }}
          >
            <div
              className={`cargo-shape cargo-shape--cart cargo-shape--${cargo.cargoType.toLowerCase()}`}
            />
          </div>
        );
      });

    return (
      <div
        key={`cart-group-${cart.id}`}
        id={`cart-${cart.id}`}
        className="board-anchor"
        style={{ transform: 'translate(0px, 0px)' }}
      >
        <div className="cart-shape" />
        {cargoShapes}
      </div>
    );
  });
}
