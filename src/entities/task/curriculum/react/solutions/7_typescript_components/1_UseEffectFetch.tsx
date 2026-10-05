import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  // остальные поля API опущены, добавляй по необходимости
}

type Status = "loading" | "success" | "error";

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error(`HTTP: ${res.status}`);
  }
  return res.json();
};

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  // Запрос стартует при монтировании, поэтому начальный статус — loading
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setStatus("success");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Неизвестная ошибка");
        setStatus("error");
      }
    };
    loadUsers();
  }, []);

  if (status === "loading") return <p>Загрузка...</p>;
  if (status === "error") return <p>Ошибка: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UsersList;
