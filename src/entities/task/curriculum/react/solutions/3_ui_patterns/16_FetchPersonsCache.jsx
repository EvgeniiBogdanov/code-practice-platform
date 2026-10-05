import { useState, useEffect } from "react";

// Кеш живёт на уровне модуля: переживает перерендеры и повторные монтирования компонента.
// Ключ — нормализованная строка запроса, значение — список персонажей.
const cache = new Map();

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  return debouncedValue;
};

// Нормализация: «Rick», « rick » и «RICK» дают один ключ и один запрос
const buildQuery = (name, status) => {
  const params = new URLSearchParams();
  const normalizedName = name.trim().toLowerCase();
  if (normalizedName) params.set("name", normalizedName);
  if (status) params.set("status", status);
  return params.toString();
};

const fetchPeople = async (query, signal) => {
  const res = await fetch(`https://rickandmortyapi.com/api/character?${query}`, { signal });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
};

const CharactersList = () => {
  const [name, setName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [characters, setCharacters] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const debouncedName = useDebounce(name, 300);
  const query = buildQuery(debouncedName, statusFilter);

  useEffect(() => {
    // Попадание в кеш: данные показываются сразу, без состояния загрузки и без запроса
    const cached = cache.get(query);
    if (cached) {
      setCharacters(cached);
      setStatus("success");
      return;
    }

    const controller = new AbortController();

    const loadCharacters = async () => {
      setStatus("loading");
      setError(null);
      try {
        const data = await fetchPeople(query, controller.signal);
        // В кеш попадают только успешные ответы — ошибку можно повторить
        cache.set(query, data);
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
  }, [query]);

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
        <select id="char-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Все статусы</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {status === "loading" && <p>Загрузка...</p>}
      {status === "error" && <p>Ошибка: {error}</p>}
      {status === "success" && characters.length === 0 && <p>Персонажи не найдены</p>}

      <ul>
        {characters.map((char) => (
          <li key={char.id}>
            <img
              src={char.image}
              alt={char.name}
              width="50"
              height="50"
              style={{ objectFit: "cover", borderRadius: "4px" }}
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
