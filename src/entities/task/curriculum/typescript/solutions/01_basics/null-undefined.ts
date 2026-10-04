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
  return user?.name ?? "Неизвестный пользователь";
};

const getCity = (user: User): string => {
  return user.address?.city ?? "Город не указан";
};

const getDisplayName = (user: User): string => {
  return user.nickname?.toUpperCase() ?? user.name;
};

getUserName(3); // "Неизвестный пользователь"
getCity(users[1]); // "Город не указан"
getDisplayName(users[0]); // "Alice"
