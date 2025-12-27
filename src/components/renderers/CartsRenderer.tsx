import { Cart } from '../../lib/types';

interface CartsRendererProps {
  carts: Cart[];
}

export default function CartsRenderer({ carts }: CartsRendererProps) {
  return carts.map((cart) => (
    <circle
      key={`cart-${cart.id}`}
      data-cart-id={cart.id}
      cx={0 /* Cart position will be adjusted dynamically outside React for performance reasons */}
      cy={0 /* Cart position will be adjusted dynamically outside React for performance reasons */}
      r={8}
      fill="orange"
    />
  ))
};
