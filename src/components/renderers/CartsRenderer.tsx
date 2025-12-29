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
        const cargoSize = 4;

        switch (cargo.cargoType) {
          case 'CIRCLE':
            return (
              <circle
                key={`cart-cargo-${cargo.id}`}
                cx={cargoX}
                cy={cargoY}
                r={2}
                fill="green"
              />
            );
          case 'SQUARE':
            return (
              <rect
                key={`cart-cargo-${cargo.id}`}
                x={cargoX - cargoSize / 2}
                y={cargoY - cargoSize / 2}
                width={cargoSize}
                height={cargoSize}
                fill="green"
              />
            );
          case 'TRIANGLE':
            return (
              <polygon
                key={`cart-cargo-${cargo.id}`}
                points={`${cargoX},${cargoY - cargoSize / 2} ${cargoX - cargoSize / 2},${cargoY + cargoSize / 2} ${cargoX + cargoSize / 2},${cargoY + cargoSize / 2}`}
                fill="green"
              />
            );
          default:
            return null;
        }
      });

    return (
      <g key={`cart-group-${cart.id}`} id={`cart-${cart.id}`}>
        <circle cx={0} cy={0} r={8} fill="orange" />
        {cargoShapes}
      </g>
    );
  });
}
