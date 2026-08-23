import { useState, useEffect } from "react";

const fetchUsers = async (signal) => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", { signal });
    if (!res.ok) throw new Error(`HTTP: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
};

const UsersListWithAbort = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadUsers = async () => {
      try {
        setStatus("loading");
        setError("");
        const data = await fetchUsers(signal);
        setUsers(data);
        setStatus("success");
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
        setStatus("error");
      }
    };

    loadUsers();

    return () => controller.abort();
  }, []);

  return (
    <div>
      {status === "loading" && <p>Загрузка...</p>}
      {status === "error" && <p>Ошибка: {error}</p>}
      <ul>
        {!!users.length &&
          users.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};

export default UsersListWithAbort;
