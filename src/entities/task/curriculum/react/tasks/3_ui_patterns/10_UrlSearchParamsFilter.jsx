import React, { useState, useEffect, useMemo } from 'react';

/**
 * Задача: Каталог товаров с синхронизацией фильтров в URL
 *
 * Требования:
 * 1. Реализуйте фильтрацию и сортировку списка товаров PRODUCTS:
 *    - Поиск по названию (текстовое поле, поиск без учета регистра)
 *    - Категория (select: Все категории / Ноутбуки / Смартфоны / Аксессуары)
 *    - Наличие (чекбокс «Только в наличии»)
 *    - Сортировка по цене (select: Без сортировки / Сначала дешевле / Сначала дороже)
 *    - Кнопка «Сбросить фильтры»
 *
 * 2. Синхронизация состояния со строкой URL:
 *    - При загрузке страницы фильтры должны инициализироваться из параметров адресной строки.
 *    - При изменении любого фильтра URL должен обновляться без перезагрузки страницы.
 *    - Параметры со значениями по умолчанию и пустые поля не должны засорять строку URL.
 *    - При переходе по истории браузера (кнопки «Назад» / «Вперёд») фильтры и список товаров должны оставаться актуальными.
 *
 * 3. Отображение:
 *    - Текущая строка параметров URL (или «—», если фильтры не применены)
 *    - Количество найденных товаров
 *    - Список карточек товаров с названием, категорией, наличием и ценой
 */

export const PRODUCTS = [
  { id: 1, name: 'MacBook Pro 16', category: 'laptops', price: 240000, inStock: true },
  { id: 2, name: 'iPhone 15 Pro', category: 'phones', price: 120000, inStock: true },
  { id: 3, name: 'AirPods Pro 2', category: 'accessories', price: 25000, inStock: false },
  { id: 4, name: 'Asus ROG Zephyrus', category: 'laptops', price: 180000, inStock: false },
  { id: 5, name: 'Samsung Galaxy S24', category: 'phones', price: 95000, inStock: true },
  { id: 6, name: 'Apple Magic Mouse', category: 'accessories', price: 9000, inStock: true },
  { id: 7, name: 'Lenovo ThinkPad X1', category: 'laptops', price: 160000, inStock: true },
  { id: 8, name: 'Чехол Leather Case', category: 'accessories', price: 4500, inStock: false },
];

export default function ProductCatalogUrlSync() {
  // Напишите ваш код здесь

  return (
    <div>
      <h2>Каталог товаров</h2>
      {/* Элементы управления: поиск, категория, в наличии, сортировка */}
      {/* Индикатор URL и кнопка сброса */}
      {/* Список отфильтрованных товаров */}
    </div>
  );
}
