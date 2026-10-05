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

// 2. Проверка полноты: если в union появится новая роль, а switch её не обработает,
// TypeScript покажет ошибку здесь — вместо тихого бага в рантайме
function assertNever(value: never): never {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
}

export function UserBadge({ user }: { user: User }) {
  // Дискриминант role сужает тип в каждой ветке без приведений
  switch (user.role) {
    case 'admin':
      return (
        <div>
          <h3>Администратор: {user.name}</h3>
          <p>Права доступа: {user.permissions.join(', ')}</p>
        </div>
      );
    case 'employee':
      return (
        <div>
          <h3>Сотрудник: {user.name}</h3>
          <p>Отдел: {user.department}</p>
        </div>
      );
    case 'guest':
      return <div>Гость: {user.name}</div>;
    default:
      return assertNever(user);
  }
}

// 3. Type guard нужен там, где сужение не выводится само: например, в filter.
// Без него users.filter(u => u.role === 'admin') вернул бы User[], а не AdminUser[]
export function isAdmin(user: User): user is AdminUser {
  return user.role === 'admin';
}

export function getAdminPermissions(users: User[]): string[] {
  return users.filter(isAdmin).flatMap((admin) => admin.permissions);
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
