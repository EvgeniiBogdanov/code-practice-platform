// 1. Ссылка на DOM-элемент: React запишет узел в current после монтирования
const inputRef = useRef(null);
// <input ref={inputRef} />  →  inputRef.current.focus()

// 2. Мутируемое значение между рендерами: запись в current НЕ вызывает рендер
const timerIdRef = useRef(null);
// timerIdRef.current = setInterval(tick, 1000);

// Правило: в ref храним то, что не влияет на разметку.
// Всё, что нужно показать на экране, — в useState.
// Читать и писать ref.current во время рендера нельзя — только в обработчиках и эффектах.
