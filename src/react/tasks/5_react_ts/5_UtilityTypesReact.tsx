import React from 'react';

/**
 * Собеседование: React + TypeScript
 * 
 * КОНТЕКСТ:
 * Из бэкенда приходит полная модель профиля пользователя `FullUserProfile`, содержащая как публичные
 * данные, так и служебные приватные поля (`internalId`, `passwordHash`).
 *
 * ПРОБЛЕМА:
 * Разработчики вручную продублировали интерфейс для карточки `UserCardProps`. При любом изменении
 * базовой модели (например, добавление нового статуса) типы в компонентах рассинхронизируются.
 * Кроме того, словарь текстовых меток статусов не гарантирует обработку всех возможных значений.
 *
 * ТРЕБОВАНИЯ:
 * 1. Сформируйте тип `UserCardProps` на основе `FullUserProfile`, исключив из него приватные поля (`internalId`, `passwordHash`) без ручного дублирования полей.
 * 2. Создайте структуру данных для отображения статусов (`active`, `pending`, `banned`), гарантирующую на уровне типов, что для каждого возможного статуса задано описание.
 */

export type FullUserProfile = {
  id: number;
  internalId: string;
  name: string;
  email: string;
  passwordHash: string;
  status: 'active' | 'pending' | 'banned';
};

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
