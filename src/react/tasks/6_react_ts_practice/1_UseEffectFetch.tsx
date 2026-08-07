import { useState, useEffect } from "react";

// Данная задача на чистом JSX
// Переделай ее в TSX, используя TypeScript

const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error(`HTTP: ${res.status}`);
  }
  return res.json();
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      setStatus("loading");
      try {
        const data = await fetchUsers();
        setUsers(data);
        setStatus("success");
      } catch (e) {
        setError(e.message);
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
        {!!users.length &&
          users.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};

export default UsersList;
