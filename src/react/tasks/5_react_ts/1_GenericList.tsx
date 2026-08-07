import React from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Компонент List сейчас использует тип any и не умеет автоматически 
// выводить типы элементов списка.
// 
// Требования к рефакторингу:
// 1. Сделайте компонент List дженериком <T,>
// 2. Добавьте обязательный проп getKey: (item: T) => React.Key для безопасных key в списке
// 3. Замените renderItem: (item: any) => React.ReactNode на строго типизированную функцию

type ListProps = {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
};

export function List(props: ListProps) {
  return (
    <ul>
      {props.items.map((item, index) => (
        <li key={index}>{props.renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Пример использования:
export default function Demo() {
  const users = [
    { id: 1, name: 'Алексей' },
    { id: 2, name: 'Мария' }
  ];

  return (
    <List 
      items={users} 
      renderItem={(user) => <span>{user.name}</span>} 
    />
  );
}
