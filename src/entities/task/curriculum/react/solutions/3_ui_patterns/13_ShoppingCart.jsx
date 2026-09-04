import React, { useState } from 'react';

export const INITIAL_CART_ITEMS = [
  { id: 1, name: 'Беспроводная клавиатура', price: 4500, quantity: 1, maxStock: 4 },
  { id: 2, name: 'Эргономичная мышь', price: 2800, quantity: 2, maxStock: 5 },
  { id: 3, name: 'USB-C хаб', price: 1900, quantity: 1, maxStock: 3 },
];

export default function ShoppingCart({ initialItems = INITIAL_CART_ITEMS }) {
  const [items, setItems] = useState(initialItems);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const handleIncrease = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < item.maxStock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      setPromoError('Введите промокод');
      return;
    }

    if (code === 'SAVE10') {
      setAppliedPromo('SAVE10');
      setPromoError('');
      setPromoInput('');
    } else if (code === 'SALE500') {
      if (subtotal < 2000) {
        setPromoError('Минимальная сумма для промокода 2000 ₽');
      } else {
        setAppliedPromo('SALE500');
        setPromoError('');
        setPromoInput('');
      }
    } else {
      setPromoError('Неверный промокод');
    }
  };

  const handleResetPromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Вычисляемые значения во время рендера (без избыточных useEffect)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedPromo === 'SAVE10') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedPromo === 'SALE500') {
    discount = subtotal >= 2000 ? Math.min(500, subtotal) : 0;
  }

  const amountAfterDiscount = Math.max(0, subtotal - discount);
  const delivery = items.length === 0 ? 0 : amountAfterDiscount >= 3000 ? 0 : 300;
  const total = amountAfterDiscount + delivery;

  return (
    <div>
      <h2>Корзина заказов</h2>

      {items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong> — {item.price} ₽/шт.
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleDecrease(item.id)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span> {item.quantity} шт. </span>
                <button
                  type="button"
                  onClick={() => handleIncrease(item.id)}
                  disabled={item.quantity >= item.maxStock}
                >
                  +
                </button>
                <span> (остаток: {item.maxStock}) </span>
                <button type="button" onClick={() => handleRemove(item.id)}>
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div>
        <h3>Промокод</h3>
        <form onSubmit={handleApplyPromo}>
          <input
            type="text"
            value={promoInput}
            onChange={(e) => {
              setPromoInput(e.target.value);
              if (promoError) setPromoError('');
            }}
            placeholder="Промокод (SAVE10, SALE500)"
          />
          <button type="submit">Применить</button>
        </form>

        {appliedPromo && (
          <p>
            Активен промокод: <strong>{appliedPromo}</strong>{' '}
            <button type="button" onClick={handleResetPromo}>
              Отменить промокод
            </button>
          </p>
        )}

        {promoError && <p role="alert">⚠️ {promoError}</p>}
      </div>

      <div>
        <h3>Итого</h3>
        <p>Товары ({items.length}): {subtotal} ₽</p>
        <p>Скидка: {discount > 0 ? `-${discount} ₽` : '0 ₽'}</p>
        <p>
          Доставка: {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
          {delivery > 0 && amountAfterDiscount < 3000 && (
            <small> (до бесплатной доставки не хватает {3000 - amountAfterDiscount} ₽)</small>
          )}
        </p>
        <p>
          <strong>К оплате: {total} ₽</strong>
        </p>
      </div>
    </div>
  );
}
