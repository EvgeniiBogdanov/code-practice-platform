import React from 'react';

export type FullUserProfile = {
  id: number;
  internalId: string;
  name: string;
  email: string;
  passwordHash: string;
  status: 'active' | 'pending' | 'banned';
};

//  РЕШЕНИЕ:
// 1. Omit удаляет непубличные поля
export type UserCardProps = Omit<FullUserProfile, 'internalId' | 'passwordHash'>;

// 2. Record проверяет, что карта текстов содержит ключи ДЛЯ ВСЕХ вариантов статуса
const STATUS_LABELS: Record<FullUserProfile['status'], { label: string; color: string }> = {
  active: { label: 'Активен', color: 'green' },
  pending: { label: 'Ожидает подтвеждения', color: 'orange' },
  banned: { label: 'Заблокирован', color: 'red' }
};

export function UserCard(props: UserCardProps) {
  const statusInfo = STATUS_LABELS[props.status];

  return (
    <div style={{ border: '1px solid #333', padding: '12px', borderRadius: '6px' }}>
      <h4>{props.name} ({props.email})</h4>
      <p style={{ color: statusInfo.color }}>Статус: {statusInfo.label}</p>
    </div>
  );
}

export default function Demo() {
  const user: UserCardProps = { 
    id: 101, 
    name: 'Елена', 
    email: 'elena@test.com', 
    status: 'active' 
  };
  
  return <UserCard {...user} />;
}

/*
=== Разбор решения ===
Проблема: Дублирование полей в интерфейсах пропсов приводит к багам при проведении рефакторинга: если поле `status` сменит тип на объединение `'active' | 'inactive'`, старый вручную созданный `UserCardProps` не узнает об этом.

Как надо (React + TS):
1. `Omit<Type, Keys>` — идеальный инструмент для создания типов компонентов из бекэнд-моделей путем вырезания приватных служебных данных (`passwordHash`).
2. `Record<Keys, Value>` — гарантирует, что у вас описаны словарные карты (dictionary mapping) абсолютно для каждого варианта `status`. Если добавится новый статус, компилятор мгновенно подсветит незаполненное значение.
*/
