import React from 'react';

// ❌ ОШИБКА / ЗАДАЧА:
// Объект пользователя user содержит необязательные (optional) поля, из-за чего приходится 
// везде писать опасные операторы user.permissions?.map(...) или кастовать типы через as.
// 
// Требования:
// 1. Перепишите тип User на Размеченное Объединение (Discriminated Union) с общим полем role.
// 2. Напишите кастомный Type Guard function isAdmin(user: User): user is AdminUser.

type User = {
  id: number;
  name: string;
  role: 'admin' | 'employee' | 'guest';
  permissions?: string[];
  department?: string;
};

export function UserBadge({ user }: { user: User }) {
  return (
    <div>
      <h3>{user.name} ({user.role})</h3>
      {/* ❌ Каст типы или опасные опциональные цепочки */}
      {user.role === 'admin' && (
        <p>Права: {(user.permissions as string[]).join(', ')}</p>
      )}
      {user.role === 'employee' && (
        <p>Отдел: {user.department}</p>
      )}
    </div>
  );
}

export default function Demo() {
  const admin: User = { id: 1, name: 'Анна', role: 'admin', permissions: ['CREATE', 'DELETE'] };
  return <UserBadge user={admin} />;
}
