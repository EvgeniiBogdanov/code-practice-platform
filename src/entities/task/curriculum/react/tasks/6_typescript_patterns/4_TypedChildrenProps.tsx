import React from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * В UI-библиотеке проектируются компоненты карточки: контейнер `Card` и заголовок `CardHeader`.
 *
 * ПРОБЛЕМА:
 * Пропсы `children` и `icon` типизированы через `any`. В слот иконки можно случайно передать строку,
 * число или null, что нарушает верстку flex-контейнера, а для карточки не используются стандартные соглашения React.
 *
 * ТРЕБОВАНИЯ:
 * 1. Для компонента `Card` обеспечьте стандартную типизацию дочерних элементов (children) средствами React.
 * 2. Для свойства `icon` в `CardHeader` ограничьте тип строго до одного валидного React-элемента (запретив текст, числа и null).
 * 3. Обеспечьте возможность передачи любого валидного для React контента в тело карточки.
 */

type CardHeaderProps = {
  title: string;
  icon: any;
};

export function CardHeader({ title, icon }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon}
      <h3>{title}</h3>
    </div>
  );
}

type CardProps = {
  children: any;
};

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
      <CardHeader title="Уведомления" icon={<span>🔔</span>} />
      <p>Текст карточки...</p>
    </Card>
  );
}
