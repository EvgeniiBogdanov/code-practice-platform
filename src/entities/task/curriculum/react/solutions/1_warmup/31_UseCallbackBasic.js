// Возвращает ту же функцию между рендерами, пока не изменились зависимости
const handleSelect = useCallback(
  (id) => {
    onSelect(id, filter);
  },
  [onSelect, filter]
);

// useCallback(fn, deps) — то же самое, что useMemo(() => fn, deps).
// Имеет смысл, когда функция уходит в memo-компонент или в зависимости эффекта.
// Без этих потребителей useCallback только добавляет работы.
