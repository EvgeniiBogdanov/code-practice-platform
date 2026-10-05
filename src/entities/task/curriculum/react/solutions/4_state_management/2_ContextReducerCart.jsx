import React, { createContext, useContext, useReducer } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Клавиатура', price: 100 },
  { id: 2, name: 'Мышь', price: 50 },
];

const cartReducer = (items, action) => {
  switch (action.type) {
    case 'add': {
      const existing = items.find((i) => i.id === action.product.id);
      if (existing) {
        return items.map((i) => (i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...items, { ...action.product, quantity: 1 }];
    }
    case 'remove':
      return items.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      throw new Error(`Неизвестное действие: ${action.type}`);
  }
};

// Два контекста: dispatch стабилен, поэтому его потребители не зависят от изменений данных
const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);

const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);

  return (
    <CartDispatchContext value={dispatch}>
      <CartStateContext value={items}>{children}</CartStateContext>
    </CartDispatchContext>
  );
};

const useCart = () => {
  const items = useContext(CartStateContext);
  if (items === null) throw new Error('useCart должен вызываться внутри CartProvider');
  return items;
};

const useCartDispatch = () => {
  const dispatch = useContext(CartDispatchContext);
  if (dispatch === null) throw new Error('useCartDispatch должен вызываться внутри CartProvider');
  return dispatch;
};

// Только отправляет действия — не перерисовывается при изменении корзины
const ProductList = () => {
  const dispatch = useCartDispatch();
  return (
    <ul>
      {PRODUCTS.map((p) => (
        <li key={p.id}>
          {p.name} — {p.price}$ <button onClick={() => dispatch({ type: 'add', product: p })}>В корзину</button>
        </li>
      ))}
    </ul>
  );
};

const CartBadge = () => {
  const items = useCart();
  return <p>🛒 {items.reduce((sum, i) => sum + i.quantity, 0)}</p>;
};

const CartSummary = () => {
  const items = useCart();
  const dispatch = useCartDispatch();
  return (
    <div>
      {items.map((i) => (
        <p key={i.id}>
          {i.name} × {i.quantity} <button onClick={() => dispatch({ type: 'remove', id: i.id })}>✕</button>
        </p>
      ))}
      <button onClick={() => dispatch({ type: 'clear' })}>Очистить</button>
    </div>
  );
};

// Shop больше не знает о корзине и не пробрасывает пропсы
const Shop = () => (
  <div>
    <CartBadge />
    <ProductList />
    <CartSummary />
  </div>
);

const App = () => (
  <CartProvider>
    <Shop />
  </CartProvider>
);

export default App;
