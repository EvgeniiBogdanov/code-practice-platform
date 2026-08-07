import React from 'react';

//  РЕШЕНИЕ:
// 1. Описываем дженерик-тип пропсов ListProps<T>
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => React.Key;
};

// 2. Объявляем компонент как дженерик-функцию
export function List<T>({ items, renderItem, getKey }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Пример использования с автовыводом типов:
export default function Demo() {
  const users = [
    { id: 1, name: 'Алексей', role: 'admin' },
    { id: 2, name: 'Мария', role: 'developer' }
  ];

  return (
    <List 
      items={users} 
      getKey={(user) => user.id}
      // user автоматически выводится как { id: number; name: string; role: string; }
      renderItem={(user) => <span>{user.name} ({user.role})</span>} 
    />
  );
}

/*
=== Разбор решения ===
Проблема: Использование типа `any` лишает код автодополнения типов и автопроверки свойства `user.name`. Использование индекса массива в качестве `key` приводит к багам при сортировке или удалении элементов.

Как надо (React + TS):
1. Объявляем компонент как дженерик-функцию `function List<T>(...)`.
2. Если используется стрелочная функция в TSX файле, нужно писать `<T,>` (с запятой): `const List = <T,>({ ... }: ListProps<T>) => ...`, иначе компилятор перепутает `<T>` с незакрытым JSX тегом.
3. Проп `getKey: (item: T) => React.Key` обеспечивает строгую уникальность ключей для любого типа элемента `T`.
*/
