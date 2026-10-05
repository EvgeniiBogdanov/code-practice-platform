// Проведите рефакторинг: при вводе в поиск поле заметно «залипает» —
// каждое нажатие клавиши синхронно перерисовывает тяжёлый список.
// Сделайте ввод мгновенным с помощью конкурентных возможностей React,
// не откладывая обновление через setTimeout или debounce.

import React, { useState } from 'react';

const ITEMS = Array.from({ length: 5000 }, (_, i) => `Товар №${i + 1}`);

function SlowItem({ text }) {
  const start = performance.now();
  while (performance.now() - start < 0.1) {
    // Имитация тяжёлого рендера элемента
  }
  return <li>{text}</li>;
}

function ResultsList({ query }) {
  const filtered = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  return (
    <ul>
      {filtered.map((item) => (
        <SlowItem key={item} text={item} />
      ))}
    </ul>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск товара..." />
      <ResultsList query={query} />
    </div>
  );
}
