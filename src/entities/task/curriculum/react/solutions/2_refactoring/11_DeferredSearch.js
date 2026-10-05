import React, { memo, useDeferredValue, useState } from 'react';

const ITEMS = Array.from({ length: 5000 }, (_, i) => `Товар №${i + 1}`);

function SlowItem({ text }) {
  const start = performance.now();
  while (performance.now() - start < 0.1) {
    // Имитация тяжёлого рендера элемента
  }
  return <li>{text}</li>;
}

//  ПРАВИЛЬНО: memo обязателен — иначе список перерисуется вместе с инпутом
// в срочном рендере и выигрыша не будет
const ResultsList = memo(function ResultsList({ query }) {
  const filtered = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  return (
    <ul>
      {filtered.map((item) => (
        <SlowItem key={item} text={item} />
      ))}
    </ul>
  );
});

export default function SearchPage() {
  const [query, setQuery] = useState('');

  //  ПРАВИЛЬНО: инпут обновляется срочно, а список — с «отстающим» значением
  // в фоновом прерываемом рендере
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск товара..." />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <ResultsList query={deferredQuery} />
      </div>
    </div>
  );
}

// Альтернатива — useTransition, если у вас есть доступ к setState:
// const [isPending, startTransition] = useTransition();
// onChange: setInput(value); startTransition(() => setQuery(value));
