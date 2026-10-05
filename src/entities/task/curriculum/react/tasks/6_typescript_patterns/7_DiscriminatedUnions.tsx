import React from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * В системе авторизации определены 3 роли пользователей:
 * - Администраторы (обязательно имеют список прав `permissions`)
 * - Сотрудники (обязательно имеют наименование отдела `department`)
 * - Гости (не имеют прав и отдела)
 *
 * ПРОБЛЕМА:
 * Модель описана единым объектом с опциональными полями. Из-за этого при отображении бейджа
 * приходится использовать небезопасные приведения типов (`as string[]`) и опциональные цепочки (`?.`),
 * а компилятор не может гарантировать наличие прав у администратора или отдела у сотрудника.
 *
 * ТРЕБОВАНИЯ:
 * 1. Перепроектируйте систему типов пользователя так, чтобы некорректные состояния были невозможны на уровне компиляции.
 * 2. Обеспечьте автоматическое сужение типов в условных конструкциях по роли пользователя без использования `as`.
 * 3. Реализуйте функцию проверки на администратора (`isAdmin`), которая будет служить предикатом типа (Type Guard) для TypeScript.
 */

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
