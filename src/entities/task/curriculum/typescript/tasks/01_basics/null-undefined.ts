// В strict-режиме find может вернуть undefined, у пользователя может
// не быть адреса, а ник может быть равен null.
// Исправьте функции так, чтобы они компилировались без оператора «!»
// и без приведения типов, а для отсутствующих данных возвращали
// понятное значение по умолчанию.

interface Address {
  city: string;
}

interface User {
  id: number;
  name: string;
  address?: Address;
  nickname: string | null;
}

const users: User[] = [
  { id: 1, name: "Alice", address: { city: "Berlin" }, nickname: null },
  { id: 2, name: "Bob", nickname: "bobby" },
];

const getUserName = (id: number): string => {
  const user = users.find((u) => u.id === id);
  return user.name;
};

const getCity = (user: User): string => {
  return user.address.city;
};

const getDisplayName = (user: User): string => {
  return user.nickname.toUpperCase();
};
