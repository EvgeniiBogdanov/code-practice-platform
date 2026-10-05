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
