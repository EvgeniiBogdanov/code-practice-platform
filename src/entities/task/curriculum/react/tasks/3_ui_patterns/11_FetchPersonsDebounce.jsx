import { useState, useEffect } from "react";

/**
 * Задача: Оптимизация поиска персонажей (Debounce)
 *
 * Требования:
 * - Реализуйте задержку отправки запросов при вводе текста (Debounce), чтобы предотвратить частые сетевые вызовы.
 * - Сохраните фильтрацию по статусу, обработку ошибок и отмену неактуальных запросов.
 */

const fetchPeople = async (name, status, signal) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (status) params.append("status", status);

  try {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character?${params.toString()}`,
      { signal }
    );

    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const data = await res.json();
    return data.results || [];
  } catch (e) {
    throw e;
  }
};

const CharactersList = () => {
  const [name, setName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [characters, setCharacters] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadCharacters = async () => {
      try {
        setStatus("loading");
        setError("");

        const data = await fetchPeople(name, statusFilter, signal);

        setCharacters(data);
        setStatus("success");
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
        setStatus("error");
      }
    };

    loadCharacters();

    return () => controller.abort();
  }, [name, statusFilter]);

  return (
    <div>
      <div>
        <label htmlFor="char-name">Имя:</label>
        <input
          id="char-name"
          type="text"
          placeholder="Поиск по имени..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="char-status">Статус:</label>
        <select
          id="char-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {status === "loading" && <p>Загрузка...</p>}
      {status === "error" && <p>Ошибка: {error}</p>}
      {status === "success" && !characters.length && <p>Персонажи не найдены</p>}

      <ul>
        {!!characters.length &&
          characters.map((char) => (
            <li key={char.id}>
              <img
                src={char.image}
                alt={char.name}
                width="50"
                height="50"
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
              />
              <span>
                <strong>{char.name}</strong> ({char.status})
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CharactersList;