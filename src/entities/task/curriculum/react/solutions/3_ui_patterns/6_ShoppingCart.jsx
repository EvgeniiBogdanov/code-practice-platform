import React, { useState } from 'react';

export const INITIAL_CART_ITEMS = [
  { id: 1, name: 'Беспроводная клавиатура', price: 4500, quantity: 1, maxStock: 4 },
  { id: 2, name: 'Эргономичная мышь', price: 2800, quantity: 2, maxStock: 5 },
  { id: 3, name: 'USB-C хаб', price: 1900, quantity: 1, maxStock: 3 },
];

const FREE_DELIVERY_FROM = 3000;
const DELIVERY_PRICE = 300;

// Правила промокодов — данные, а не цепочка if: новый код добавляется одной записью
const PROMO_CODES = {
  SAVE10: { minSubtotal: 0, getDiscount: (subtotal) => Math.round(subtotal * 0.1) },
  SALE500: { minSubtotal: 2000, getDiscount: (subtotal) => Math.min(500, subtotal) },
};

export default function ShoppingCart({ initialItems = INITIAL_CART_ITEMS }) {
  // Минимальный state: товары, ввод промокода, применённый код и ошибка ввода
  const [items, setItems] = useState(initialItems);
  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Всё остальное — производные значения, вычисляемые при рендере
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promo = appliedCode ? PROMO_CODES[appliedCode] : null;
  const isPromoActive = promo !== null && subtotal >= promo.minSubtotal;
  const discount = isPromoActive ? promo.getDiscount(subtotal) : 0;
  const amountAfterDiscount = subtotal - discount;
  const delivery = items.length === 0 || amountAfterDiscount >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
  const total = amountAfterDiscount + delivery;

  const changeQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const quantity = Math.min(item.maxStock, Math.max(1, item.quantity + delta));
        return { ...item, quantity };
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    const candidate = PROMO_CODES[code];

    const error = !code
      ? 'Введите промокод'
      : !candidate
        ? 'Неверный промокод'
        : subtotal < candidate.minSubtotal
          ? `Минимальная сумма для промокода ${candidate.minSubtotal} ₽`
          : '';

    if (error) {
      setPromoError(error);
      return;
    }

    setAppliedCode(code);
    setPromoError('');
    setPromoInput('');
  };

  return (
    <div>
      <h2>Корзина заказов</h2>

      {items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — {item.price} ₽/шт.{' '}
              <button
                type="button"
                onClick={() => changeQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
                aria-label={`Уменьшить количество: ${item.name}`}
              >
                −
              </button>
              <span> {item.quantity} шт. </span>
              <button
                type="button"
                onClick={() => changeQuantity(item.id, 1)}
                disabled={item.quantity >= item.maxStock}
                aria-label={`Увеличить количество: ${item.name}`}
              >
                +
              </button>
              <span> (остаток: {item.maxStock}) </span>
              <button type="button" onClick={() => removeItem(item.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Промокод</h3>
      <form onSubmit={handleApplyPromo}>
        <input
          value={promoInput}
          onChange={(e) => {
            setPromoInput(e.target.value);
            setPromoError('');
          }}
          placeholder="Промокод (SAVE10, SALE500)"
        />
        <button type="submit">Применить</button>
      </form>

      {appliedCode && (
        <p>
          Промокод <strong>{appliedCode}</strong>
          {/* Сумма могла упасть ниже порога уже после применения кода */}
          {isPromoActive ? ' применён' : ` не действует: нужна сумма от ${promo.minSubtotal} ₽`}{' '}
          <button type="button" onClick={() => setAppliedCode(null)}>
            Отменить промокод
          </button>
        </p>
      )}
      {promoError && <p role="alert">{promoError}</p>}

      <h3>Итого</h3>
      <p>Товары: {subtotal} ₽</p>
      <p>Скидка: {discount > 0 ? `−${discount} ₽` : '0 ₽'}</p>
      <p>
        Доставка: {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
        {delivery > 0 && <small> (до бесплатной не хватает {FREE_DELIVERY_FROM - amountAfterDiscount} ₽)</small>}
      </p>
      <p>
        <strong>К оплате: {total} ₽</strong>
      </p>
    </div>
  );
}
