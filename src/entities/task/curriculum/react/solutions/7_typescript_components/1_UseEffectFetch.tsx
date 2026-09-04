import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  // остальные поля API опущены, добавляй по необходимости
}

type Status = "idle" | "loading" | "success" | "error";

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error(`HTTP: ${res.status}`);
  }
  return res.json();
};

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadUsers = async () => {
      setStatus("loading");
      try {
        const data = await fetchUsers();
        setUsers(data);
        setStatus("success");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Неизвестная ошибка");
        setStatus("error");
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      {status === "loading" && <p>Загрузка</p>}
      {status === "error" && <p>Ошибка: {error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
