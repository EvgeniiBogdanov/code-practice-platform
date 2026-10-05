import { useState, useEffect } from "react";

// **Напишите GET-запрос к API с отменой через AbortController**

// **Требования:**
// - Выполнить GET-запрос к https://jsonplaceholder.typicode.com/users
// - Передать signal от AbortController в fetch
// - В функции очистки useEffect отменять запрос (controller.abort())
// - Игнорировать ошибку с e.name === "AbortError" (не устанавливать статус "error")
// - Отобразить статусы загрузки/ошибки и список имён пользователей

const fetchUsers = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`HTTP: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (e) {
    throw new Error(`Error: ${e.message}`);
  }
};

const UsersListWithAbort = () => {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
  
    useEffect(() => {
      const loadUsers = async () => {
        try {
          setStatus("load");
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
        {status === "load" && "Загрузка"}
        {status === "error" && `Ошибка: ${error}`}
        <ul>
          {!!users.length &&
            users.map((user) => <li key={user.id}>{user.name}</li>)}
        </ul>
      </div>
    );
};

export default UsersListWithAbort;