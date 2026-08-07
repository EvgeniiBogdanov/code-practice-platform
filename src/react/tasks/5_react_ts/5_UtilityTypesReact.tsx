import React from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Все типы дублируются вручную: FullUserProfile, UserCardProps, StatusMap.
// При изменении структуры FullUserProfile приходится правиять типы во всех файлах проекта.
// 
// Требования:
// 1. Для UserCardProps сформируйте тип на основе FullUserProfile, исключив (Omit) passwordHash и internalId
// 2. Для StatusMap используйте утилитарный тип Record<Status, string>

export type FullUserProfile = {
  id: number;
  internalId: string;
  name: string;
  email: string;
  passwordHash: string;
  status: 'active' | 'pending' | 'banned';
};

// ❌ Ручной дублирующий тип
type UserCardProps = {
  name: string;
  email: string;
  status: 'active' | 'pending' | 'banned';
};

export function UserCard(props: UserCardProps) {
  return (
    <div>
      <h4>{props.name} ({props.email})</h4>
      <p>Статус: {props.status}</p>
    </div>
  );
}

export default function Demo() {
  const user: UserCardProps = { name: 'Елена', email: 'elena@test.com', status: 'active' };
  return <UserCard {...user} />;
}
