import React from 'react';

//  РЕШЕНИЕ:
type CardHeaderProps = {
  title: string;
  // 1. React.ReactElement гарантирует, что передан валидный JSX-элемент (например <Icon />),
  // а не просто строка, число или null.
  icon: React.ReactElement;
};

export function CardHeader({ title, icon }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
      {icon}
      <h3 style={{ margin: 0 }}>{title}</h3>
    </div>
  );
}

// 2. React.PropsWithChildren<T> автоматически добавляет optional children: React.ReactNode
type CardProps = React.PropsWithChildren<{
  className?: string;
}>;

export function Card({ children }: CardProps) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      {children}
    </div>
  );
}

export default function Demo() {
  return (
    <Card>
      <CardHeader title="Уведомления" icon={<span style={{ fontSize: '20px' }}></span>} />
      <p>Какое-то произвольное содержимое карточки (ReactNode)...</p>
    </Card>
  );
}

/*
=== Разбор решения ===
Проблема: Частая путаница между типом `React.ReactNode` и `React.ReactElement`.

Как надо (React + TS):
1. **`React.ReactNode`** — базовый супертип для всего, что React может отрендерить: строки, числа, JSX-элементы, массивы, порталы, `null`, `undefined`, `boolean`. Используется в 95% случаев для `children`.
2. **`React.ReactElement`** — строго один экземпляр React-компонента/JSX-тега (объект `{ type, props, key }`). Не включает строки, числа или `null`.
3. **`React.PropsWithChildren<P>`** — удобный служебный тип, избавляющий от дублирования `children?: React.ReactNode` в типах каждого контейнера.
*/
