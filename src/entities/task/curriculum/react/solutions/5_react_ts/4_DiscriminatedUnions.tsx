import React from 'react';

//  РЕШЕНИЕ:
// 1. Создаем отдельные типы с единым дискриминантом role
export type BaseUser = { id: number; name: string };

export type AdminUser = BaseUser & {
  role: 'admin';
  permissions: string[];
};

export type EmployeeUser = BaseUser & {
  role: 'employee';
  department: string;
};

export type GuestUser = BaseUser & {
  role: 'guest';
};

export type User = AdminUser | EmployeeUser | GuestUser;

// 2. Кастомный Type Guard для сужения типов
export function isAdmin(user: User): user is AdminUser {
  return user.role === 'admin';
}

export function UserBadge({ user }: { user: User }) {
  // Благодаря Discriminated Union, внутри switch/if TypeScript сам точно сужает тип!
  if (isAdmin(user)) {
    // Здесь TypeScript точно знает, что user — это AdminUser и permissions существует!
    return (
      <div>
        <h3> Администратор: {user.name}</h3>
        <p>Права доступа: {user.permissions.join(', ')}</p>
      </div>
    );
  }

  if (user.role === 'employee') {
    // Здесь TypeScript знает, что user — это EmployeeUser и department существует!
    return (
      <div>
        <h3> Сотрудник: {user.name}</h3>
        <p>Отдел: {user.department}</p>
      </div>
    );
  }

  return <div> Гость: {user.name}</div>;
}

export default function Demo() {
  const admin: User = { id: 1, name: 'Анна', role: 'admin', permissions: ['CREATE', 'DELETE'] };
  const employee: User = { id: 2, name: 'Игорь', role: 'employee', department: 'Разработка' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <UserBadge user={admin} />
      <UserBadge user={employee} />
    </div>
  );
}
