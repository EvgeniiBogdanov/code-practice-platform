import { enrichJavaScriptExplanations } from "./javascript/data/javascript-explanations";

const BASE_TASK_EXPLANATIONS = {
  5: `### Суть задачи
Реализовать поиск и фильтрацию персонажей Rick and Morty API с реактивным обновлением списка при изменении текста и/или статуса, корректно обрабатывая состояния загрузки, ошибок, отменённых запросов и пустой выдачи.

### 🛠 Пошаговые этапы решения:

1. **Структура состояний (\`useState\`)**:
   \`\`\`jsx
   const [name, setName] = useState("");
   const [statusFilter, setStatusFilter] = useState("");
   const [characters, setCharacters] = useState([]);
   const [status, setStatus] = useState("idle"); // idle | loading | success | error
   const [error, setError] = useState("");
   \`\`\`
**Разбор**: Используется state machine-подход через переменную \`status\` — это чище и менее error-prone, чем отдельные флаги \`isLoading\`, \`isError\`, \`isEmpty\`.

2. **Функция запроса с \`URLSearchParams\` — для API или для адресной строки браузера?**:
   \`\`\`jsx
   const fetchPeople = async (name, status, signal) => {
     const params = new URLSearchParams();
     if (name) params.append("name", name);
     if (status) params.append("status", status);

     const res = await fetch(
       \`https://rickandmortyapi.com/api/character?\${params.toString()}\`,
       { signal }
     );
     // ...
   };
   \`\`\`

   **Важнейшее разграничение**:
   В задачах «Рик и Морти» \`new URLSearchParams()\` используется **исключительно для формирования параметров сетевого запроса (\`fetch\`) к бэкенду**, а **НЕ** для изменения адресной строки браузера.

   **Почему сам по себе \`URLSearchParams\` НЕ меняет URL страницы в браузере:**
   \`URLSearchParams\` — это служебный объект JavaScript для парсинга и сериализации строк вида \`key=value&foo=bar\` в оперативной памяти JS. Сам по себе он никак не связан с навигацией браузера.
   \`\`\`javascript
   // 1. Создание параметров в памяти (адресная строка браузера НЕ меняется):
   const params = new URLSearchParams();
   params.append("name", "Rick");
   params.append("status", "alive");

   // 2. Использование для HTTP-запроса (как в этой задаче):
   fetch(\`https://rickandmortyapi.com/api/character?\${params.toString()}\`);

   // 3. И только явный вызов History API изменил бы URL страницы в браузере:
   // (это фокус отдельной задачи 10 «Синхронизация фильтров с URL»):
   window.history.replaceState(null, "", \`?\${params.toString()}\`);
   \`\`\`

   **3 причины использовать \`URLSearchParams\` для сетевых запросов вместо ручной склейки строк:**
   1. **Автоматическое кодирование (\`encodeURIComponent\`)**:
      Если пользователь введет имя с пробелом или спецсимволом (например, *"Rick & Morty"*), ручная конкатенация \`"?name=" + name\` сломает запрос, разделив параметры символом \`&\`. \`URLSearchParams\` автоматически превратит его в \`name=Rick+%26+Morty\`.
   2. **Условное добавление без «битых» параметров**:
      Не нужно писать громоздкие тернарные операторы для расстановки \`?\` и \`&\`. Если поле не заполнено, мы просто не вызываем \`.append()\`.
   3. **Детерминированный ключ для кэширования (\`cacheKey\`)**:
      В Senior-версии задачи (№3) строка \`params.toString()\` (\`"name=rick&status=alive"\`) служит идеальным уникальным ключом для сохранения ответов в \`new Map()\`.

   | Сценарий применения | Роль \`URLSearchParams\` | Влияние на адресную строку браузера |
   | :--- | :--- | :--- |
   | **Сетевой запрос (\`fetch\` в задачах «Рик и Морти»)** | Конструирует безопасную строку для \`fetch(apiUrl + "?" + params)\` | ❌ Не затрагивается |
   | **Роутинг и навигация (Задача 10 «Фильтры с URL»)** | Читает \`window.location.search\` и обновляет \`history.replaceState\` | ✅ Обновляется в реальном времени |

3. **AbortController — отмена устаревших запросов**:
   \`\`\`jsx
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
   \`\`\`

   **Что такое \`AbortController\` и зачем он здесь**:
   \`AbortController\` — это Web API, позволяющий отменять асинхронные операции (чаще всего fetch-запросы).

   **Почему это критически важно в этой задаче**:
   - Пользователь быстро вводит буквы в поисковой строке → отправляются запросы для *"R"*, *"Ri"*, *"Ric"*, *"Rick"*.
   - Запросы приходят в произвольном порядке (медленный запрос *"R"* может вернуться позже быстрого *"Rick"*).
   - Без \`AbortController\` вы получите race condition: на экране появятся результаты для *"R"*, хотя пользователь уже ищет *"Rick"*.
   - cleanup-функция \`useEffect\` делает \`controller.abort()\` — предыдущий запрос при следующем рендере принудительно отменяется.
   - Также в catch проверяется \`e.name === "AbortError"\` — это нормальное поведение, его не надо логировать как ошибку.

4. **Обработчики onChange — три подхода**:
   В текущем решении используется inline-вариант:
   \`\`\`jsx
   <input value={name} onChange={(e) => setName(e.target.value)} />
   \`\`\`

   На собеседовании можно обсудить три подхода:

   | Подход | Когда уместен |
   | --- | --- |
   | **Inline** \`(e) => setName(e.target.value)\` | 1–2 поля, простая логика |
   | **Отдельные функции** \`handleNameChange\`, \`handleStatusChange\` | Есть валидация, сложная логика |
   | **Общий** \`handleChange\` с \`name\`-атрибутом | Формы с 3+ полями, единый formData |

   Пример общего обработчика:
   \`\`\`jsx
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
   \`\`\`

   **Совет для собеседования**: если полей мало (как здесь — 2) — inline или отдельные функции это правильно и читаемо. DRY не стоит применять там, где это снижает читабельность. Если интервьюер спрашивает *«а как бы ты масштабировал?»* — покажите \`handleChange\` с \`name\`, это покажет вашу гибкость.

5. **Рендер состояний (state machine в JSX)**:
   \`\`\`jsx
   {status === "loading" && <p>Загрузка...</p>}
   {status === "error" && <p>Ошибка: {error}</p>}
   {status === "success" && !characters.length && <p>Персонажи не найдены</p>}
   \`\`\`
   Каждое состояние рендерится исключительно, что исключает баги типа «показал и загрузку и список одновременно».

### 💡 Ключевые выводы:
- **State machine** для async-состояний (\`idle\`/\`loading\`/\`success\`/\`error\`) — лучше, чем пачка независимых boolean флагов.
- **\`URLSearchParams\` для сетевых запросов** — собирает безопасную query-строку для \`fetch\` с автоматическим экранированием спецсимволов. Не путать с изменением адреса страницы в браузере (для этого требуется отдельный вызов \`window.history.replaceState\`).
- **\`AbortController\`** обязателен в любом \`useEffect\`, который делает fetch с зависимостями, меняющимися чаще, чем отвечает сервер.
- **Inline обработчики** — нормально для 1–2 полей. Не бойтесь их использовать.
- **Отдельный status для HTTP-кодов** (404 = пустой массив, не ошибка) — правильное понимание API. Rick & Morty API возвращает 404 при отсутствии результатов, а не пустой results.

### 🚀 Что добавить, чтобы решение стало уровня Senior:

| Улучшение | Зачем |
| --- | --- |
| **1. Debounce поиска** (\`useDebouncedCallback\` на 300–500 мс) | Без него на каждый чих идёт запрос к API. Это главная проблема текущего решения. |
| **2. Вынесение логики в custom hook** (\`useCharacterSearch(name, status)\`) | Разделить презентационную и бизнес-логику, переиспользуемость, тестируемость. |
| **3. Кэширование результатов** (\`Map\` / \`react-query\` / \`swr\`) | Пользователь вводит «Rick», стирает, снова вводит «Rick» — не надо ходить в API заново. |
| **4. Пагинация / infinite scroll** | API возвращает \`info.pages\`, но код игнорирует это — при популярном имени придёт только первая страница. |
| **5. Error Boundary** | Если компонент упадёт, упадёт всё приложение. Senior заворачивает в Error Boundary. |
| **6. Accessibility (a11y)** | \`aria-live\` для сообщений о загрузке/ошибке, \`aria-busy\`, роли для списка, фокус-менеджмент. |
| **7. \`useMemo\` для производных данных** | Если появится фильтрация на клиенте — мемоизировать \`filteredCharacters\`. |
| **8. Типизация через TypeScript** | Интерфейсы \`Character\`, \`Status\`, enum для состояний загрузки — защита от регрессий. |
| **9. Тесты** (React Testing Library + MSW) | Юнит-тесты на хук, интеграционные на компонент с моком API через Mock Service Worker. |
| **10. Обработка оффлайна** | \`navigator.onLine\` + очередь запросов — приложение должно работать при нестабильной сети. |

**Топ-3 must-have для Senior-ревью в этой задаче**:
1. **Debounce на инпуте** — иначе это просто спам-машина для API.
2. **Custom hook для изоляции логики** — признак зрелого кода.
3. **Пагинация** — текущий код молча теряет 90% результатов для популярных имён (Rick, Morty).

*Реализация этих трёх пунктов превращает «работает на демо» в «готово к продакшену».`,

  6: `### Суть задачи
Список задач: добавление без пустых строк, удаление и переключение статуса «выполнено».

### 🛠 Решение
**Состояние** — массив задач и текст поля:
\`\`\`jsx
const [todos, setTodos] = useState(INITIAL_TODOS);
const [text, setText] = useState('');
\`\`\`

**Добавление через форму** — работает и по кнопке, и по Enter:
\`\`\`jsx
const handleSubmit = (e) => {
  e.preventDefault();
  const trimmed = text.trim();
  if (!trimmed) return;
  setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }]);
  setText('');
};
\`\`\`

**Переключение и удаление** — иммутабельно, по id:
\`\`\`jsx
const toggleTodo = (id) =>
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
  );

const deleteTodo = (id) => setTodos((prev) => prev.filter((todo) => todo.id !== id));
\`\`\`

**Разметка** — интерактивные элементы доступны с клавиатуры:
\`\`\`jsx
<button
  type="button"
  aria-pressed={todo.completed}
  onClick={() => toggleTodo(todo.id)}
  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
>
  {todo.text}
</button>
\`\`\`

### ⚠️ Частые ошибки
- \`onClick\` на \`<span>\` — элемент недоступен с клавиатуры и непонятен скринридеру.
- Отдельная кнопка без \`<form>\` — Enter не добавляет задачу.
- \`setTodos([...todos, item])\` — работает, но опирается на значение из замыкания. Функциональная форма надёжнее.
- \`key={index}\` или \`id: Date.now()\`.

### 💡 Ключевые выводы
- CRUD над массивом в state: добавление — spread, изменение — \`map\`, удаление — \`filter\`.
- Доступность — часть правильного решения: кнопки для действий, формы для ввода.`,

  9: `### Суть задачи
Два списка задач («Сегодня» и «Завтра») в одном объекте состояния. У каждого — своё поле ввода, добавление и удаление.

### 🔍 Главная ловушка — дублирование
Прямолинейное решение заводит \`addToday\`, \`addTomorrow\`, \`deleteToday\`, \`deleteTomorrow\` и два одинаковых блока разметки. Любая правка вносится дважды, а третий список потребует копировать всё ещё раз. На собеседовании это сразу заметят.

### 🛠 Решение
**1. Единый state и обработчики, параметризованные ключом списка**
\`\`\`jsx
const [todos, setTodos] = useState(initialData);

const addTask = (listKey, text) => {
  setTodos((prev) => ({
    ...prev,
    [listKey]: [...prev[listKey], { id: crypto.randomUUID(), text }],
  }));
};

const deleteTask = (listKey, id) => {
  setTodos((prev) => ({
    ...prev,
    [listKey]: prev[listKey].filter((item) => item.id !== id),
  }));
};
\`\`\`
Копируется внешний объект и изменяемый массив; второй список остаётся той же ссылкой.

**2. Повторяющаяся разметка — в компоненте секции**
\`\`\`jsx
const TodoSection = ({ title, items, onAdd, onDelete }) => {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    setDraft('');
  };
  // список + форма
};
\`\`\`
Черновик нужен только своей секции — он хранится в ней, а не в общем state.

**3. Секции из конфига**
\`\`\`jsx
const SECTIONS = [
  { key: 'today', title: 'Сегодня' },
  { key: 'tomorrow', title: 'Завтра' },
];

{SECTIONS.map(({ key, title }) => (
  <TodoSection
    key={key}
    title={title}
    items={todos[key]}
    onAdd={(text) => addTask(key, text)}
    onDelete={(id) => deleteTask(key, id)}
  />
))}
\`\`\`

### ⚠️ Частые ошибки
- Мутация вложенного массива: \`prev.today.push(item)\`.
- Копирование только внешнего объекта без нового массива.
- \`id: Date.now()\` — совпадёт при быстром добавлении.

### 💡 Ключевые выводы
- Вычисляемый ключ \`[listKey]\` убирает дублирование обработчиков.
- Состояние храните там, где оно используется: общие данные — наверху, черновик поля — в секции.`,

  10: `### Суть задачи
Перезагружать картинку по кнопке через \`fetch\`, показывать её из Blob и не допускать утечек памяти.

### 🛠 Решение
**1. Технические ресурсы — в ref**
\`\`\`jsx
const objectUrlRef = useRef(null);   // текущий blob-URL
const controllerRef = useRef(null);  // текущий запрос
\`\`\`
Они не влияют на разметку и нужны только для очистки.

**2. Загрузка с отменой предыдущего запроса**
\`\`\`jsx
const handleRefetch = async () => {
  controllerRef.current?.abort();
  const controller = new AbortController();
  controllerRef.current = controller;
  setStatus('loading');

  try {
    const response = await fetch(src, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const blob = await response.blob();
    if (controller.signal.aborted) return;

    const nextUrl = URL.createObjectURL(blob);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = nextUrl;

    setImageSrc(nextUrl);
    setStatus('success');
  } catch (err) {
    if (controller.signal.aborted) return;
    setStatus('error');
  }
};
\`\`\`
- \`cache: 'no-store'\` — браузер не вернёт картинку из HTTP-кеша.
- Старый blob-URL освобождается только после того, как готов новый.

**3. Очистка при размонтировании**
\`\`\`jsx
useEffect(() => {
  return () => {
    controllerRef.current?.abort();
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  };
}, []);
\`\`\`

### 🔍 Неочевидная утечка
Если компонент размонтировали **во время** загрузки, cleanup уже выполнился, а \`fetch\` завершится позже и создаст blob-URL, который никто не освободит. Поэтому запрос отменяется в cleanup, а URL не создаётся, если \`signal.aborted\`.

### ⚠️ Частые ошибки
- Нет \`revokeObjectURL\` — каждая перезагрузка оставляет изображение в памяти.
- Освобождать текущий URL до того, как новый готов, — картинка «пропадает».
- Ошибка только в \`console.log\` — пользователь не понимает, что произошло.

### 💡 Ключевые выводы
- Всё, что создаётся вручную (blob-URL, таймеры, подписки, запросы), нужно освобождать: при замене и при размонтировании.
- Асинхронный код должен учитывать, что компонент может исчезнуть до его завершения.`,

  11: `### Суть задачи
Загрузить первые 5 постов по \`url\`, показать загрузку и ошибку, добавлять посты локально в начало списка и удалять их.

### 🛠 Решение
**1. Загрузка с отменой**
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  const loadPosts = async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      const data = await response.json();
      setPosts(data.slice(0, POSTS_LIMIT));
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setStatus('error');
    }
  };

  loadPosts();
  return () => controller.abort();
}, [url]);
\`\`\`
- \`url\` в зависимостях — при его смене запрос перезапускается.
- Отмена в cleanup защищает от гонки: поздний ответ для старого \`url\` не перезапишет список.
- Статус \`'loading'\` с самого начала — запрос стартует при монтировании.

**2. Локальное добавление в начало**
\`\`\`jsx
const addPost = (e) => {
  e.preventDefault();
  const title = newTitle.trim();
  if (!title) return;
  setPosts((prev) => [{ id: crypto.randomUUID(), title, isLocal: true }, ...prev]);
  setNewTitle('');
};
\`\`\`
UUID не пересечётся с числовыми id сервера, а флаг \`isLocal\` позволяет показать пометку «(локальный)».

**3. Удаление** — \`filter\` по id.

**4. Рендер по статусу**: загрузка, ошибка, пустой список или посты.

### ⚠️ Частые ошибки
- Нет проверки \`response.ok\`.
- Начальный статус \`''\` — первый рендер ничего не показывает.
- \`id: Date.now()\` для локальных постов.

### 💡 Ключевые выводы
- Серверные данные в state после загрузки меняются так же иммутабельно, как любые другие.
- Эффект, зависящий от параметра, должен отменять устаревшие запросы.`,

  12: `### Суть задачи
Поле пароля с кнопкой «Показать». Показанный пароль скрывается через \`hideTimeoutMs\`, ввод перезапускает отсчёт, а при размонтировании таймер очищается.

### 🛠 Решение
Таймер — это синхронизация с внешней системой, поэтому он живёт в эффекте:
\`\`\`jsx
useEffect(() => {
  if (!isVisible) return;

  const timeoutId = setTimeout(() => setIsVisible(false), hideTimeoutMs);
  return () => clearTimeout(timeoutId);
}, [isVisible, password, hideTimeoutMs]);
\`\`\`
Один эффект покрывает все требования:
| Событие | Что происходит |
|---|---|
| Пользователь показал пароль | эффект ставит таймер |
| Ввод символа | меняется \`password\` → cleanup отменяет таймер → ставится новый |
| Скрыл вручную | \`isVisible = false\` → cleanup отменяет таймер, новый не ставится |
| Размонтирование | cleanup отменяет таймер |

\`useRef\` для id не нужен: таймер принадлежит одному запуску эффекта, и cleanup видит его через замыкание.

### ⚠️ Частые ошибки
- Таймер в обработчике клика без отмены — после ручного скрытия и повторного показа срабатывает старый таймер и скрывает пароль раньше.
- Нет cleanup — \`setIsVisible\` вызывается после размонтирования.
- Кнопка без \`type="button"\` внутри формы отправляет форму.

### 💡 Ключевые выводы
- Зависимость эффекта — удобный способ «перезапустить» таймер при изменении значения.
- Cleanup эффекта — единая точка отмены для всех сценариев.`,

  13: `### Суть задачи
Каталог с поиском, категорией, наличием и сортировкой, где состояние фильтров синхронизировано с адресной строкой: ссылкой можно поделиться, а «Назад» и «Вперёд» работают.

### 🛠 Решение
**1. Сериализация через URLSearchParams**
\`\`\`jsx
const parseFiltersFromUrl = (search) => {
  const params = new URLSearchParams(search);
  return {
    query: params.get('query') ?? '',
    category: params.get('category') ?? 'all',
    inStock: params.get('inStock') === 'true',
    sort: params.get('sort') ?? 'none',
  };
};

const serializeFiltersToQuery = (filters) => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('query', filters.query.trim());
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.sort !== 'none') params.set('sort', filters.sort);
  return params.toString();
};
\`\`\`
- \`URLSearchParams\` сам экранирует значения.
- Значения по умолчанию в URL не попадают.
- Все значения из URL — строки. \`Boolean("false")\` вернёт \`true\`, поэтому boolean разбирается сравнением со строкой \`'true'\`.

**2. Инициализация из URL — один раз**
\`\`\`jsx
const [filters, setFilters] = useState(() => parseFiltersFromUrl(window.location.search));
\`\`\`

**3. Обновление state и URL — в обработчике**
\`\`\`jsx
const applyFilters = (nextFilters, { replace = false } = {}) => {
  setFilters(nextFilters);
  const query = serializeFiltersToQuery(nextFilters);
  const url = query ? \`?\${query}\` : window.location.pathname;
  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
};
\`\`\`
- Категория, сортировка, наличие и сброс → \`pushState\`: «Назад» отменит изменение.
- Ввод текста → \`replaceState\`: иначе история заполнится записями на каждый символ.
- Запись в историю — побочный эффект, поэтому она **не** живёт внутри \`setFilters(prev => ...)\`: функция-обновление должна быть чистой, а в StrictMode React вызывает её дважды.

**4. «Назад» и «Вперёд»**
\`\`\`jsx
useEffect(() => {
  const handlePopState = () => setFilters(parseFiltersFromUrl(window.location.search));
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
\`\`\`

**5. Список — производные данные**
Фильтрация и сортировка (\`toSorted\`, без мутации) вычисляются при рендере. Для восьми товаров \`useMemo\` не нужен.

### ⚠️ Частые ошибки
- \`Boolean(params.get('inStock'))\` — строка \`"false"\` превращается в \`true\`.
- Только \`replaceState\` — в истории нет записей, и «Назад» уводит со страницы.
- Побочные эффекты внутри функции-обновления \`setState\`.
- Значения по умолчанию в URL: \`?category=all&sort=none\`.
- Нет подписки на \`popstate\` — URL меняется, а фильтры нет.

### 💡 Ключевые выводы
- URL — полноценное хранилище состояния интерфейса.
- В приложениях с роутером используют \`useSearchParams\` (React Router) или search-параметры TanStack Router — принцип тот же.`,

  14: `### Суть задачи
Доступное поле с автодополнением (combobox): фильтрация подсказок, навигация с клавиатуры, выбор мышью и разметка для скринридеров.

### 🛠 Решение
**1. Состояние**
\`\`\`jsx
const [query, setQuery] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [highlightedIndex, setHighlightedIndex] = useState(-1); // -1 — ничего не подсвечено
\`\`\`
Список подсказок — производные данные, вычисляются из \`query\`.

**2. Клавиатура**
\`\`\`jsx
if (e.key === 'ArrowDown') {
  e.preventDefault(); // каретка не прыгает в конец текста
  setHighlightedIndex((prev) => (prev + 1) % filteredItems.length);
} else if (e.key === 'ArrowUp') {
  e.preventDefault();
  setHighlightedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
} else if (e.key === 'Enter' && highlightedIndex >= 0) {
  e.preventDefault();
  handleSelect(filteredItems[highlightedIndex]);
} else if (e.key === 'Escape') {
  setIsOpen(false);
}
\`\`\`
Остаток от деления зацикливает навигацию.

**3. Выбор мышью и onBlur**
Событие \`blur\` поля происходит раньше \`click\` по опции — список закроется и click потеряется. Выбор делаем на \`onMouseDown\` с \`preventDefault()\`: поле не теряет фокус, и выбор успевает сработать.

**4. Доступность (WAI-ARIA)**
\`\`\`jsx
const listboxId = useId();
const getOptionId = (index) => \`\${listboxId}-option-\${index}\`;

<input
  role="combobox"
  aria-expanded={isOpen}
  aria-autocomplete="list"
  aria-controls={listboxId}
  aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
/>
<ul id={listboxId} role="listbox">
  <li id={getOptionId(index)} role="option" aria-selected={isSelected}>...</li>
</ul>
\`\`\`
- Фокус остаётся в поле, а \`aria-activedescendant\` сообщает скринридеру, какая опция подсвечена.
- \`useId\` даёт уникальные id: компонент можно использовать несколько раз на странице.
- «Ничего не найдено» — обычный текст с \`role="status"\`, а не опция: выбрать его нельзя.

### ⚠️ Частые ошибки
- Нет \`preventDefault\` на стрелках.
- Выбор на \`onClick\` при закрытии списка по \`onBlur\`.
- \`highlightedIndex\` не сбрасывается при новом вводе — подсветка указывает за пределы списка.
- Захардкоженные id и отсутствие \`aria-activedescendant\`.

### 💡 Ключевые выводы
- Combobox — частая задача на senior-собеседованиях именно из-за доступности.
- В продакшене используют готовые headless-решения (Downshift, Radix, React Aria), но механику нужно уметь объяснить.`,

  15: `### Суть задачи
Реализация паттерна **Optimistic UI (оптимистичное обновление)** с сохранением снимка предыдущего состояния и механизмом **отката (Rollback)** при возникновении серверной или сетевой ошибки.

### 💡 Пошаговые этапы решения:

1. **Мгновенное обновление и фиксация снимка (Snapshot)**:
   \`\`\`jsx
   const handleToggleLike = async () => {
     if (isLoading) return;

     // 1. Фиксируем снимок для отката
     const prevLiked = isLiked;
     const prevCount = likesCount;

     const nextLiked = !prevLiked;
     const nextCount = nextLiked ? prevCount + 1 : prevCount - 1;

     // 2. Оптимистичное обновление интерфейса
     setIsLiked(nextLiked);
     setLikesCount(nextCount);
     setErrorMessage('');
     setIsLoading(true);

     try {
       await onToggleLike(nextLiked);
     } catch (error) {
       // 3. Откат к снимку при сбое
       setIsLiked(prevLiked);
       setLikesCount(prevCount);
       setErrorMessage(error.message || 'Ошибка сохранения');
     } finally {
       setIsLoading(false);
     }
   };
   \`\`\`

2. **Предотвращение Race Conditions**:
   Блокировка кнопки через \`disabled={isLoading}\` гарантирует, что пользователь не сможет отправить череду противоречивых запросов (лайк/дизлайк) до завершения текущей сетевой транзакции.

### ⚠️ Частые ошибки на собеседованиях:
- **Забытый откат счетчика**: Обновляют только булево состояние \`isLiked\`, забывая синхронно вернуть \`likesCount\` к исходному числу.
- **Откат к жестко заданным константам**: Пытаются в блоке \`catch\` вызывать обратное действие (\`setLikesCount(c => c - 1)\`), что ломается при повторных или параллельных кликах. Всегда сохраняйте снимок конкретных значений до вызова мутации.
- **Подавление ошибок**: Пользователь должен четко понимать, почему действие не применилось (показ сообщения об ошибке / toast).`,

  16: `### Суть задачи
Корзина с изменением количества, промокодами и расчётом доставки. Главное, что проверяют, — умеет ли кандидат отделить **минимальное состояние** от **производного состояния** (derived state).

### 🛠 Решение
**1. Минимальный state**
\`\`\`jsx
const [items, setItems] = useState(initialItems);
const [promoInput, setPromoInput] = useState('');
const [appliedCode, setAppliedCode] = useState(null);
const [promoError, setPromoError] = useState('');
\`\`\`

**2. Правила — данными, константы — вынесены**
\`\`\`jsx
const FREE_DELIVERY_FROM = 3000;
const DELIVERY_PRICE = 300;

const PROMO_CODES = {
  SAVE10: { minSubtotal: 0, getDiscount: (subtotal) => Math.round(subtotal * 0.1) },
  SALE500: { minSubtotal: 2000, getDiscount: (subtotal) => Math.min(500, subtotal) },
};
\`\`\`

**3. Всё остальное — производное состояние, вычисляемое при рендере**
\`\`\`jsx
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const promo = appliedCode ? PROMO_CODES[appliedCode] : null;
const isPromoActive = promo !== null && subtotal >= promo.minSubtotal;
const discount = isPromoActive ? promo.getDiscount(subtotal) : 0;
const amountAfterDiscount = subtotal - discount;
const delivery = items.length === 0 || amountAfterDiscount >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;
const total = amountAfterDiscount + delivery;
\`\`\`
Если после применения SALE500 пользователь уменьшит корзину ниже 2000 ₽, \`isPromoActive\` станет \`false\`, и скидка исчезнет сама — без единого эффекта.

**4. Количество — одна функция с ограничением диапазона**
\`\`\`jsx
const changeQuantity = (id, delta) => {
  setItems((prev) =>
    prev.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(item.maxStock, Math.max(1, item.quantity + delta)) }
        : item
    )
  );
};
\`\`\`
Кнопки дополнительно блокируются через \`disabled\` на границах.

**5. Применение промокода** проверяет пустой ввод, неизвестный код и минимальную сумму, а при успехе сохраняет только код.

### ⚠️ Частые ошибки
- \`useState\` для \`total\` и \`discount\` + \`useEffect([items])\` — каскадные рендеры.
- Хранить в state рассчитанную скидку: она «застывает» и не реагирует на изменение корзины.
- Магические числа 2000, 3000, 300, разбросанные по коду.

### 💡 Ключевые выводы
- State — минимальный набор фактов, остальное — вычисления при рендере.
- Бизнес-правила удобнее описывать данными: их проще читать, расширять и тестировать.`,

  17: `### Суть задачи
Спроектировать составной компонент (Compound Components) — аккордеон, части которого (\`Accordion.Item\`, \`Accordion.Header\`, \`Accordion.Body\`) координируют состояние через Context.

### 🛠 Решение
**1. Два контекста**
- \`AccordionContext\` — какие секции открыты и как их переключить (уровень всего аккордеона).
- \`AccordionItemContext\` — данные конкретной секции: \`id\`, \`isOpen\` и id для связки заголовка с панелью.

**2. Хуки доступа с проверкой**
\`\`\`jsx
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('Компоненты Accordion.* должны использоваться внутри <Accordion>');
  return context;
};
\`\`\`
Одна проверка вместо копий в каждом подкомпоненте. Ошибка понятна сразу (fail fast).

**3. Корневой компонент и режимы**
\`\`\`jsx
const toggleItem = (id) => {
  setOpenIds((prev) => {
    const next = new Set(allowMultiple ? prev : []);
    if (prev.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
\`\`\`
В single-режиме новый \`Set\` начинается пустым — открывается только выбранная секция.

**4. Секция и доступность**
\`\`\`jsx
function AccordionItem({ id, children }) {
  const { isItemOpen } = useAccordion();
  const baseId = useId();
  const item = { id, isOpen: isItemOpen(id), headerId: \`\${baseId}-header\`, panelId: \`\${baseId}-panel\` };
  return <AccordionItemContext value={item}>{children}</AccordionItemContext>;
}
\`\`\`
Заголовок — кнопка с \`aria-expanded\` и \`aria-controls\`, панель — \`role="region"\` с \`aria-labelledby\`. Скринридер связывает их и объявляет состояние.

**5. Статические свойства**
\`\`\`jsx
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;
\`\`\`
Использование читается как разметка: \`<Accordion.Item>\`, \`<Accordion.Header>\`.

### ⚠️ Частые ошибки
- \`React.Children.map\` + \`cloneElement\` — ломается, как только потребитель обернёт секцию в свой компонент.
- Нет \`aria-expanded\` и связи заголовка с панелью.
- Проверки контекста скопированы в каждый подкомпонент.

### 💡 Ключевые выводы
- Compound Components = общий Context + набор подкомпонентов, которые потребитель свободно компонует.
- Паттерн лежит в основе Radix UI, Headless UI и React Aria. Следующий шаг — поддержка controlled-режима (\`value\` / \`onValueChange\`).`,

  18: `### Суть задачи
Точный секундомер с паузой, кругами и сбросом. Главная проверка — понимает ли кандидат, почему нельзя считать время количеством тиков таймера (Event Loop Drift).

### 🔍 Проблема дрейфа (Event Loop Drift)
\`\`\`js
setInterval(() => setTime((t) => t + 10), 10);
\`\`\`
Таймер — это обещание вызвать колбэк **не раньше** чем через 10 мс. Если основной поток занят рендером или другим кодом, тик опаздывает. Опоздания складываются, а в фоновой вкладке браузер замедляет таймеры до одного раза в секунду — секундомер «теряет» время.

### 🛠 Решение: время — это разница меток
\`\`\`jsx
const startTimeRef = useRef(0);       // момент последнего старта
const accumulatedTimeRef = useRef(0); // время до последней паузы
const frameIdRef = useRef(null);

const getCurrentTime = () =>
  accumulatedTimeRef.current + performance.now() - startTimeRef.current;
\`\`\`
Сколько бы раз ни вызвался колбэк, результат точен: время вычисляется, а не накапливается.

**Цикл отрисовки** через \`requestAnimationFrame\` — синхронизирован с частотой экрана и засыпает в фоновой вкладке:
\`\`\`jsx
const tick = () => {
  setElapsedTime(getCurrentTime());
  frameIdRef.current = requestAnimationFrame(tick);
};
\`\`\`

**Старт и пауза**:
\`\`\`jsx
const handleStart = () => {
  startTimeRef.current = performance.now();
  setIsRunning(true);
  frameIdRef.current = requestAnimationFrame(tick);
};

const handlePause = () => {
  stopLoop(); // cancelAnimationFrame
  accumulatedTimeRef.current = getCurrentTime();
  setElapsedTime(accumulatedTimeRef.current);
  setIsRunning(false);
};
\`\`\`

**Круг** — точная метка в момент нажатия, а не значение из последнего кадра:
\`\`\`jsx
const handleLap = () => {
  const totalTime = getCurrentTime();
  setLaps((prev) => {
    const prevTotal = prev.length > 0 ? prev[0].totalTime : 0;
    return [{ id: prev.length + 1, totalTime, splitTime: totalTime - prevTotal }, ...prev];
  });
};
\`\`\`

**Очистка**: \`useEffect(() => stopLoop, [])\` останавливает цикл при размонтировании.

### Почему \`performance.now()\`, а не \`Date.now()\`
\`Date.now()\` зависит от системных часов: синхронизация времени или ручной перевод может сдвинуть его назад, и секундомер покажет отрицательное время. \`performance.now()\` монотонный и точнее.

### ⚠️ Частые ошибки
- Считать время суммой тиков.
- Хранить метки и id таймера в \`useState\` — лишние рендеры и устаревшие значения в обработчиках.
- Брать время круга из \`elapsedTime\` — оно отстаёт на кадр.
- Не останавливать цикл при размонтировании.

### 💡 Ключевые выводы
- Таймеры и кадры отвечают за **частоту обновления экрана**, метки времени — за **точность**.
- Технические значения, не влияющие на разметку напрямую, живут в \`useRef\`.`,

  51: `### Суть задачи
Добавить к поиску персонажей debounce: запрос уходит только после паузы в наборе имени.

### 🛠 Решение
**1. Хук \`useDebounce\`**
\`\`\`jsx
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  return debouncedValue;
};
\`\`\`
Каждое изменение \`value\` отменяет предыдущий таймер — значение обновится, только когда пользователь перестанет печатать.

**2. Два значения**
\`\`\`jsx
const [name, setName] = useState('');               // для инпута — мгновенно
const debouncedName = useDebounce(name.trim(), 300); // для запроса — с задержкой
\`\`\`

**3. Эффект загрузки зависит от отложенного значения**
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();
  // ... fetchPeople(debouncedName, statusFilter, controller.signal)
  return () => controller.abort();
}, [debouncedName, statusFilter]);
\`\`\`
Смена статуса в селекте применяется сразу — задерживать её незачем, это одно действие, а не серия нажатий.

### ⚠️ Частые ошибки
- Задерживать само поле ввода — интерфейс «залипает».
- \`debounce\` из lodash, созданный в теле компонента, — новая функция на каждом рендере, задержка не работает.
- Убрать \`AbortController\`, считая, что debounce защищает от гонки.

### 💡 Ключевые выводы
- Debounce — для потока событий (ввод), а не для одиночных действий (выбор в селекте).
- Debounce уменьшает число запросов, отмена защищает от гонки — нужны оба.`,

  52: `### Суть задачи
Добавить кеширование: повторный поиск с теми же фильтрами берёт данные из памяти, без запроса к API.

### 🛠 Решение
**1. Кеш на уровне модуля**
\`\`\`jsx
const cache = new Map();
\`\`\`
Он переживает перерендеры и повторные монтирования компонента. \`useRef\` и \`useState\` для этого не подходят — они живут вместе с экземпляром.

**2. Нормализованный ключ**
\`\`\`jsx
const buildQuery = (name, status) => {
  const params = new URLSearchParams();
  const normalizedName = name.trim().toLowerCase();
  if (normalizedName) params.set('name', normalizedName);
  if (status) params.set('status', status);
  return params.toString();
};
\`\`\`
«Rick», « rick » и «RICK» дают один ключ — и один запрос.

**3. Проверка кеша до запроса**
\`\`\`jsx
useEffect(() => {
  const cached = cache.get(query);
  if (cached) {
    setCharacters(cached);
    setStatus('success');
    return;
  }

  const controller = new AbortController();
  const loadCharacters = async () => {
    setStatus('loading');
    try {
      const data = await fetchPeople(query, controller.signal);
      cache.set(query, data); // кешируем только успех
      setCharacters(data);
      setStatus('success');
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message);
      setStatus('error');
    }
  };

  loadCharacters();
  return () => controller.abort();
}, [query]);
\`\`\`
- Попадание в кеш показывает данные сразу, без мигания «Загрузка...».
- Ошибки не кешируются — запрос можно повторить.
- Функция \`fetchPeople\` отвечает только за сеть, кеширование — отдельная ответственность.

### ⚠️ Частые ошибки
- Кеш в \`useState\` — пропадает при размонтировании и вызывает лишние рендеры.
- Ключ без нормализации — дубли записей.
- Кешировать ошибки или пустые ответы при сбое.

### 🚀 Что спросят дальше
- **Рост памяти**: ограничьте размер (LRU) или время жизни записей (TTL).
- **Дедупликация**: два компонента с одинаковым запросом в один момент отправят два запроса — решается кешированием промиса.
- **Устаревание**: данные на сервере меняются — нужно фоновое обновление.

Всё это из коробки дают TanStack Query и SWR: на собеседовании стоит упомянуть, что свой кеш — учебная модель, а в продакшене используют библиотеку.

### 💡 Ключевые выводы
- Кеш = нормализованный ключ + хранилище, переживающее компонент + политика инвалидации.`,

  w1: `### Суть задачи
Объявить состояние в компоненте и вывести его в JSX. Это базовый кирпич React: данные, от которых зависит интерфейс, живут в state.

### 🛠 Решение
\`\`\`jsx
import { useState } from 'react';

const App = () => {
  const [text, setText] = useState('test');
  return <div>{text}</div>;
};
\`\`\`
- \`useState('test')\` возвращает пару: текущее значение и функцию-сеттер.
- Деструктуризация массива позволяет назвать их как удобно: \`[text, setText]\`.
- Значение выводится в JSX через фигурные скобки \`{text}\`.

### Как это работает
Компонент — обычная функция, которая вызывается на каждом рендере. Значение state хранится внутри React и привязано к месту компонента в дереве. Вызов \`setText(...)\` сохраняет новое значение и планирует повторный рендер, в котором \`useState\` вернёт уже его.

### ⚠️ Частые ошибки
- Присваивание \`text = '...'\` вместо \`setText('...')\` — рендера не будет.
- Вызов хука внутри \`if\`, цикла или после раннего \`return\` — нарушает порядок вызовов хуков.
- Хранение в state того, что можно вычислить из других данных (об этом — задача про derived state).

### 💡 Ключевые выводы
- Состояние меняется только через сеттер.
- Хуки вызываются на верхнем уровне компонента, всегда в одном порядке.`,

  w2: `### Суть задачи
Сделать управляемый инпут поиска с выводом введённого текста и кнопкой очистки.

### 🛠 Решение
\`\`\`jsx
const [text, setText] = useState('');

<input value={text} onChange={(e) => setText(e.target.value)} />
<p>Вы ищете: {text}</p>
<button onClick={() => setText('')}>Очистить</button>
\`\`\`
- \`value={text}\` — поле всегда показывает значение из state.
- \`onChange\` записывает каждый ввод в state, React перерисовывает поле.
- Очистка — это просто \`setText('')\`: DOM трогать не нужно.

### Почему это называется «управляемый»
Источник правды — state React. Поэтому текст легко очистить, проверить, отформатировать или использовать в другой части интерфейса.

### ⚠️ Частые ошибки
- \`value\` без \`onChange\` — поле перестаёт реагировать на ввод.
- Начальное значение \`undefined\` или \`null\` вместо \`''\` — предупреждение о переключении из uncontrolled в controlled.
- Очистка через \`document.querySelector('input').value = ''\` — state и экран расходятся.

### 💡 Ключевые выводы
- Управляемое поле = \`value\` + \`onChange\`.
- Начальное значение текстового поля — пустая строка.`,

  w3: `### Суть задачи
Управляемый чекбокс подписки с текстовым статусом.

### 🛠 Решение
\`\`\`jsx
const [isSubscribed, setIsSubscribed] = useState(false);

<label>
  <input
    type="checkbox"
    checked={isSubscribed}
    onChange={(e) => setIsSubscribed(e.target.checked)}
  />
  Получать новости на email
</label>
<p>{isSubscribed ? 'Вы подписаны на рассылку.' : 'Вы не подписаны на рассылку.'}</p>
\`\`\`
- У чекбокса управляемое свойство — \`checked\`, а не \`value\`.
- Новое значение берём из \`e.target.checked\` (boolean).
- \`<label>\` вокруг поля делает кликабельным и текст.

### ⚠️ Частые ошибки
- \`e.target.value\` — всегда строка \`'on'\`, флажок не переключится.
- \`setIsSubscribed(!isSubscribed)\` — работает, но опирается на значение из замыкания. \`e.target.checked\` надёжнее.
- Чекбокс без подписи — проблема доступности.

### 💡 Ключевые выводы
- Текстовые поля управляются через \`value\`, чекбоксы и радиокнопки — через \`checked\`.`,

  w4: `### Суть задачи
Исправить классический баг: при \`unreadCount = 0\` на странице появляется цифра \`0\`.

### 🔍 Причина
\`\`\`jsx
{unreadCount && <p>Новых сообщений: {unreadCount}</p>}
\`\`\`
\`0 && ...\` возвращает \`0\`. React скрывает \`false\`, \`null\` и \`undefined\`, но число \`0\` — это текст, и оно рендерится.

### 🛠 Решение
Слева от \`&&\` должно стоять булево значение:
\`\`\`jsx
{unreadCount > 0 && <p>Новых сообщений: {unreadCount}</p>}
\`\`\`
Альтернативы: \`Boolean(unreadCount) && ...\`, \`!!unreadCount && ...\` или тернарный оператор \`unreadCount > 0 ? <p>...</p> : null\`.

### ⚠️ Частые ошибки
- \`{items.length && <List />}\` — тот же баг для пустых массивов.
- \`{price && <Price />}\` при цене \`0\` скроет бесплатный товар, хотя его нужно показать. Проверяйте ровно то условие, которое имеете в виду: \`price !== undefined\`.

### 💡 Ключевые выводы
- Слева от \`&&\` в JSX — только boolean.
- Для выбора между двумя вариантами используйте тернарный оператор.`,

  w5: `### Суть задачи
Счётчик с кнопками «+» и «−», который не опускается ниже нуля.

### 🛠 Решение
\`\`\`jsx
const [count, setCount] = useState(0);

const increment = () => setCount((prev) => prev + 1);
const decrement = () => setCount((prev) => Math.max(0, prev - 1));
\`\`\`
- Новое значение зависит от предыдущего, поэтому используем функциональную форму \`prev => ...\`.
- \`Math.max(0, prev - 1)\` не даёт уйти в минус.
- Для UX можно дополнительно заблокировать кнопку: \`<button disabled={count === 0}>\`.

### ⚠️ Частые ошибки
- \`count++\` или \`count = count + 1\` — меняется переменная, а не state, рендера нет.
- Проверка \`if (count > 0) setCount(count - 1)\` работает, но опирается на значение из замыкания. При нескольких обновлениях подряд оно может быть устаревшим.

### 💡 Ключевые выводы
- Если новое состояние вычисляется из старого — используйте \`setState(prev => ...)\`.
- Инварианты данных (не меньше нуля) проверяются при обновлении, а не только в разметке.`,

  w6: `### Суть задачи
Увеличить счётчик на 3 за один клик и понять, почему наивное решение даёт +1.

### 🔍 Почему не работает setCount(count + 1) трижды
\`\`\`jsx
// count === 0
setCount(count + 1); // поставить 1
setCount(count + 1); // поставить 1
setCount(count + 1); // поставить 1
\`\`\`
\`count\` — константа текущего рендера (снимок). Все три вызова видят 0, и React получает три одинаковых значения.

### 🛠 Решение — функциональная форма
\`\`\`jsx
const handleAddTriple = () => {
  setCount((prev) => prev + 1); // 0 → 1
  setCount((prev) => prev + 1); // 1 → 2
  setCount((prev) => prev + 1); // 2 → 3
};
\`\`\`
React ставит функции в очередь и применяет их по порядку, передавая каждой результат предыдущей. Все три обновления попадают в **один** рендер — это батчинг.

### ⚠️ Частые ошибки
- Ожидать, что \`console.log(count)\` сразу после \`setCount\` покажет новое значение. Покажет старое: обновится только в следующем рендере.
- Думать, что батчинг «теряет» обновления. Он объединяет рендеры, а не обновления.

### 💡 Ключевые выводы
- State внутри рендера — снимок, \`setState\` его не меняет.
- Когда следующее значение зависит от предыдущего, используйте \`setState(prev => ...)\`.`,

  w7: `### Суть задачи
Обновить одно поле объекта в state, сохранив остальные.

### 🛠 Решение
\`\`\`jsx
setUser((prev) => ({
  ...prev,
  age: prev.age + 1,
}));
\`\`\`
- Spread \`...prev\` копирует все поля в **новый** объект.
- Нужное поле переопределяется после spread.
- Круглые скобки \`({ ... })\` нужны, чтобы стрелочная функция вернула объект, а не открыла блок кода.

### Почему важна новая ссылка
React решает, нужен ли рендер, сравнивая старое и новое значение через \`Object.is\`. Мутированный объект — это та же ссылка, поэтому React считает, что ничего не изменилось.

### ⚠️ Частые ошибки
- \`setUser({ age: 31 })\` — остальные поля потеряются: хук не сливает объекты.
- Spread копирует только верхний уровень. Вложенные объекты остаются общими по ссылке, их тоже нужно копировать.

### 💡 Ключевые выводы
- Состояние неизменяемо: создавайте новый объект вместо изменения старого.
- При глубокой вложенности упрощайте структуру state или используйте Immer.`,

  w8: `### Суть задачи
Форма из трёх полей с единым объектом состояния и одним обработчиком.

### 🛠 Решение
\`\`\`jsx
const [form, setForm] = useState({ name: '', email: '', city: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

<input name="email" value={form.email} onChange={handleChange} />
\`\`\`
- Атрибут \`name\` каждого поля совпадает с ключом в объекте.
- Вычисляемый ключ \`[name]\` обновляет нужное поле.
- Spread \`...prev\` сохраняет остальные поля.

### ⚠️ Частые ошибки
- Забыть \`name\` у поля или опечататься в нём — обработчик создаст новый лишний ключ.
- \`setForm({ [name]: value })\` без spread — остальные поля пропадут.
- Чекбоксы в той же форме: для них нужно брать \`checked\`, а не \`value\` (\`type === 'checkbox' ? checked : value\`).

### 💡 Ключевые выводы
- Один обработчик + атрибут \`name\` масштабируется на любое число полей.
- Для больших форм с валидацией используют библиотеки (React Hook Form) или Actions из React 19.`,

  w9: `### Суть задачи
Отправить форму поиска без перезагрузки страницы — и по кнопке, и по Enter.

### 🛠 Решение
\`\`\`jsx
const handleSubmit = (e) => {
  e.preventDefault();
  setSubmittedQuery(query);
  setQuery('');
};

<form onSubmit={handleSubmit}>
  <input value={query} onChange={(e) => setQuery(e.target.value)} />
  <button type="submit">Искать</button>
</form>
\`\`\`
- \`onSubmit\` у формы срабатывает и по клику, и по Enter.
- \`e.preventDefault()\` отменяет отправку формы браузером и перезагрузку страницы.

### ⚠️ Частые ошибки
- \`onClick\` на кнопке вместо \`onSubmit\` на форме — Enter перестаёт работать, встроенная валидация пропускается.
- Кнопки без \`type\` внутри формы — по умолчанию это \`submit\`, и «Очистить» внезапно отправляет форму.

### 💡 Ключевые выводы
- Обрабатывайте отправку через \`onSubmit\` формы и вызывайте \`e.preventDefault()\`.
- В React 19 есть альтернатива: \`<form action={fn}>\` — React сам предотвращает перезагрузку и передаёт \`FormData\` (см. задачу про Actions).`,

  w10: `### Суть задачи
Регистронезависимый поиск по списку пользователей.

### 🛠 Решение
\`\`\`jsx
const [query, setQuery] = useState('');

const normalizedQuery = query.trim().toLowerCase();
const filteredUsers = USERS.filter((user) =>
  user.name.toLowerCase().includes(normalizedQuery)
);
\`\`\`
- В state хранится только строка поиска — единственный источник правды.
- Отфильтрованный список вычисляется при рендере.
- Запрос нормализуется один раз (\`trim\` + \`toLowerCase\`), а не на каждой итерации.
- Пустой результат показывает сообщение «Никого не нашли» — пользователь понимает, что поиск сработал.

### ⚠️ Частые ошибки
- Хранить \`filteredUsers\` в \`useState\` и обновлять в \`useEffect\` — лишний рендер и рассинхронизация.
- Фильтровать и перезаписывать исходный массив — после очистки поиска данные не вернутся.
- \`key={index}\` в отфильтрованном списке — индексы меняются вместе с фильтром.

### 💡 Ключевые выводы
- Всё, что вычисляется из state и пропсов, вычисляйте при рендере.
- Нормализуйте ввод: пробелы по краям и регистр.`,

  w11: `### Суть задачи
Фильтр товаров по категории через выпадающий список.

### 🛠 Решение
\`\`\`jsx
const ALL = 'all';
const CATEGORIES = [...new Set(PRODUCTS.map((product) => product.category))];

const [category, setCategory] = useState(ALL);

const visibleProducts =
  category === ALL ? PRODUCTS : PRODUCTS.filter((product) => product.category === category);

<select value={category} onChange={(e) => setCategory(e.target.value)}>
  <option value={ALL}>Все</option>
  {CATEGORIES.map((name) => (
    <option key={name} value={name}>{name}</option>
  ))}
</select>
\`\`\`
- \`<select>\` управляется через \`value\` и \`onChange\`, как обычный инпут.
- Категории выводятся из данных через \`Set\` — новая категория появится автоматически.
- Служебное значение «все категории» вынесено в константу \`ALL\`, чтобы не путать его с названием категории.
- Список товаров вычисляется при рендере.

### ⚠️ Частые ошибки
- \`selected\` на \`<option>\` вместо \`value\` на \`<select>\` — так в React не делают.
- Хардкод опций, который расходится с данными.
- Хранить отфильтрованный массив в state.

### 💡 Ключевые выводы
- Управляемый \`<select>\` = \`value\` + \`onChange\` на самом \`<select>\`.
- Генерируйте опции из данных и держите служебные значения в константах.`,

  w12: `### Суть задачи
Научиться корректно обрабатывать списки элементов без уникальных идентификаторов (id), получаемые из внешнего API.

### ⚠️ Ошибки и подвохи на собеседовании:

1. **Использование key={index}**:
   Индекс элемента в массиве изменчив. Если пользователь удалит элемент из списка, индексы всех последующих элементов сдвинутся. При несовпадении ключей React может неправильно сопоставить компоненты при сверке DOM (reconciliation), перепутать их внутреннее состояние или вызвать лишние перерисовки.

2. **Генерация key={crypto.randomUUID()} прямо внутри .map() в JSX**:
   На **каждом** рендере будет создаваться новый randomUUID. React решит, что в списке появились совершенно новые элементы, полностью уничтожит все DOM-узлы и пересоздаст их заново. Элементы будут терять фокус, сбрасывать анимации и тормозить.

3. **Правильное решение (Обогащение данных)**:
   Генерируйте уникальный id один раз — в момент получения данных или при инициализации состояния (useState(() => ...)):
   \`\`\`jsx
   const [products, setProducts] = useState(() =>
     RAW_PRODUCTS.map((product) => ({
       ...product,
       id: crypto.randomUUID(),
     }))
   );
   \`\`\`
   После этого каждый объект массива приобретает свой стабильный id, который можно смело передавать в key={product.id}.

### 💡 Ключевые выводы:
- Никогда не создавайте случайные key (Math.random(), randomUUID()) прямо внутри выражения JSX .map(...).
- Мапируйте исходные серверные данные один раз, приписывая стабильные id при занесении в state.`,

  w13: `### Суть задачи
Написать async-функцию загрузки данных с корректной обработкой ошибок.

### 🛠 Решение
\`\`\`js
const loadData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    return await response.json();
  } catch (error) {
    console.error('Не удалось загрузить данные:', error);
    throw error;
  } finally {
    console.log('Запрос завершён');
  }
};
\`\`\`
- \`await\` приостанавливает функцию до завершения промиса.
- Отклонённый промис превращается в исключение и попадает в \`catch\`.
- \`finally\` выполняется всегда — удобно для снятия индикатора загрузки.
- Ошибка пробрасывается дальше, чтобы вызывающий код решил, что показать пользователю.

### ⚠️ Частые ошибки
- Назвать функцию \`fetch\` — она перекроет глобальный \`fetch\`.
- Пустой \`catch {}\` — ошибка исчезает, и баг невозможно найти.
- Забыть \`await\` перед \`response.json()\` — в переменной окажется промис.

### 💡 Ключевые выводы
- async-функция всегда возвращает Promise.
- Ловите ошибку там, где можете её обработать; иначе — пробрасывайте.`,

  w14: `### Суть задачи
Написать функцию \`fetchUsers\`, которая загружает пользователей и правильно сообщает об ошибках.

### 🛠 Решение
\`\`\`js
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');

  if (!response.ok) {
    throw new Error(\`Не удалось загрузить пользователей: HTTP \${response.status}\`);
  }

  return response.json();
};
\`\`\`
- \`fetch\` не считает 404 и 500 ошибкой — проверяем \`response.ok\` сами.
- Функция пробрасывает ошибку, а не глотает её: решение, что показать пользователю, принимает вызывающий код.

### Как вызывать
\`\`\`js
try {
  const users = await fetchUsers();
} catch (error) {
  console.error(error.message);
}
\`\`\`

### ⚠️ Частые ошибки
- Нет проверки \`response.ok\` — на 500 код попытается разобрать HTML-страницу ошибки как JSON.
- \`catch (e) { throw new Error(e.message) }\` — исходный стек теряется. Если нужно добавить контекст, используйте \`new Error('...', { cause: e })\`.
- \`catch (e) { console.log(e) }\` без проброса — функция вернёт \`undefined\`, и UI покажет пустой список вместо ошибки.

### 💡 Ключевые выводы
- \`fetch\` + проверка \`res.ok\` + \`await res.json()\` — минимальный корректный запрос.
- Функции доступа к данным пробрасывают ошибки, компоненты их обрабатывают.`,

  w15: `### Суть задачи
Разобраться в устройстве \`useEffect\`: эффект, очистка и зависимости.

### 🛠 Синтаксис
\`\`\`js
useEffect(() => {
  // 1. Синхронизация с внешней системой
  const id = setInterval(tick, 1000);

  // 2. Cleanup
  return () => clearInterval(id);
}, [tick]); // 3. Зависимости
\`\`\`

### Массив зависимостей
| Запись | Когда выполняется |
|---|---|
| \`useEffect(fn)\` | после каждого рендера |
| \`useEffect(fn, [])\` | один раз после монтирования |
| \`useEffect(fn, [a, b])\` | после монтирования и при изменении \`a\` или \`b\` |

В зависимости попадают все реактивные значения, которые использует эффект: пропсы, state и функции, объявленные в компоненте.

### Жизненный цикл эффекта
1. Рендер и коммит в DOM.
2. Браузер отрисовывает экран.
3. Выполняется эффект.
4. При смене зависимостей: cleanup старого эффекта → новый эффект.
5. При размонтировании: cleanup.

### ⚠️ Частые ошибки
- Забытые зависимости — эффект работает со значениями из старого рендера.
- \`useEffect(async () => ...)\` — эффект вернёт Promise вместо cleanup.
- Эффект для вычислений или реакции на клик — это работа рендера и обработчиков.

### 💡 Ключевые выводы
- \`useEffect\` — инструмент синхронизации с внешним миром: подписки, таймеры, сеть, DOM API.
- Каждой подписке — своя очистка.`,

  w16: `### Суть задачи
Загрузить пользователей при монтировании и показать загрузку, ошибку или список.

### 🛠 Решение
\`\`\`jsx
const fetchUsers = async () => {
  const response = await fetch(USERS_URL);
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.json();
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsers(await fetchUsers());
        setStatus('success');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };
    loadUsers();
  }, []);

  if (status === 'loading') return <p>Загрузка...</p>;
  if (status === 'error') return <p>Ошибка: {error}</p>;
  return <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
};
\`\`\`
- Колбэк эффекта синхронный, асинхронная функция объявлена внутри.
- \`fetchUsers\` пробрасывает ошибку, компонент решает, что показать.
- Статус — одна строка, а не набор флагов. Запрос стартует сразу, поэтому начальный статус — \`'loading'\`.
- Ранние \`return\` делают рендер читаемым: каждое состояние — отдельная ветка.

### ⚠️ Частые ошибки
- \`useEffect(async () => ...)\`.
- Нет проверки \`res.ok\` — ошибки сервера выглядят как пустые данные.
- Несколько флагов \`isLoading\` / \`isError\`, которые противоречат друг другу.
- Нет отмены запроса при размонтировании — это следующая задача про \`AbortController\`.

### 💡 Ключевые выводы
- Загрузка в эффекте = асинхронная функция внутри + обработка трёх состояний.
- В продакшене серверное состояние обычно отдают TanStack Query: кеш, повторы и отмена из коробки.`,

  w17: `### Суть задачи
Загрузить пользователей в \`useEffect\` и уметь **отменить** запрос, когда он больше не нужен: компонент размонтирован, параметры запроса изменились или эффект перезапустился в StrictMode.

### 🔍 Какую проблему решаем
Эффект запускает асинхронную работу, которая живёт дольше самого эффекта. Пример:
1. Пользователь открыл страницу — ушёл запрос.
2. Через 100 мс ушёл со страницы — компонент размонтирован.
3. Через 2 секунды пришёл ответ — код вызывает \`setUsers\` для компонента, которого уже нет.

Ресурсы потрачены впустую. А если вместо размонтирования сменился параметр (\`userId\`), поздний ответ **перезапишет** данные нового запроса — это уже баг в интерфейсе.

### Как устроен AbortController
\`\`\`js
const controller = new AbortController();
const { signal } = controller;

signal.aborted;      // false
controller.abort();  // отменить
signal.aborted;      // true
signal.reason;       // DOMException с именем "AbortError"
\`\`\`
- **controller** — кнопка «отменить».
- **signal** — провод, который передают тем, кто должен узнать об отмене: \`fetch\`, \`addEventListener\`, axios и другим API.
- Отмена **необратима**: отменённый signal остаётся отменённым навсегда, повторный \`abort()\` ничего не делает. Поэтому на каждый запуск эффекта нужен **новый** контроллер.

### Что происходит с fetch при отмене
| Момент вызова \`abort()\` | Результат |
|---|---|
| До получения ответа | промис \`fetch(...)\` отклоняется |
| Заголовки получены, тело ещё читается | отклоняется \`response.json()\` |
| Тело уже прочитано | ничего: отменять нечего |

Отклонение происходит с \`signal.reason\`. Если вызвать \`abort()\` без аргументов, это \`DOMException\` с \`name === 'AbortError'\`.

### 🛠 Решение по шагам
**1. Функция запроса принимает signal и не прячет ошибки**
\`\`\`jsx
const fetchUsers = async (signal) => {
  const response = await fetch(USERS_URL, { signal });
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return response.json();
};
\`\`\`
Без \`try/catch\`: функции нечего делать с ошибкой, решение принимает компонент.

**2. Свой контроллер на каждый запуск эффекта**
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  const loadUsers = async () => {
    try {
      const data = await fetchUsers(controller.signal);
      setUsers(data);
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) return; // отмена — не ошибка
      setError(err.message);
      setStatus('error');
    }
  };

  loadUsers();
  return () => controller.abort();
}, []);
\`\`\`

**3. Cleanup отменяет запрос**
React вызывает cleanup перед размонтированием и перед каждым повторным запуском эффекта. Каждый запуск отменяет **только свой** запрос, потому что контроллер — локальная переменная этого запуска.

### Почему \`signal.aborted\`, а не \`err.name === 'AbortError'\`
Проверка по имени хрупкая:
- **Переобёрнутая ошибка.** В заготовке задачи \`fetchUsers\` делает \`\` throw new Error(\`Error: \${e.message}\`) \`\`. После этого \`err.name === 'Error'\`, фильтр не срабатывает, и пользователь видит ложное сообщение вроде «Ошибка: signal is aborted without reason» (текст зависит от браузера).
- **Своя причина отмены.** \`controller.abort(new Error('Пользователь ушёл'))\` — fetch отклонится именно этой ошибкой.
- **Таймаут.** \`AbortSignal.timeout(5000)\` отклоняет с \`name === 'TimeoutError'\`.

\`controller.signal.aborted\` однозначно отвечает на вопрос «это мы отменили?».

### Жизненный цикл на практике
| Событие | Что происходит |
|---|---|
| Монтирование | эффект создаёт контроллер A, уходит запрос A |
| StrictMode (только dev) | cleanup → \`A.abort()\`, эффект снова: контроллер B, запрос B. В Network запрос A — «(canceled)» |
| Размонтирование до ответа | cleanup → \`B.abort()\`, \`catch\` видит \`aborted\` и молча выходит |
| Ответ пришёл вовремя | обычный \`setUsers\`, последующий \`abort()\` в cleanup ничего не делает |

### Тот же приём при смене параметров
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUser)
    .catch((err) => {
      if (!controller.signal.aborted) setError(err.message);
    });
  return () => controller.abort();
}, [userId]);
\`\`\`
Сменился \`userId\` → cleanup отменил старый запрос → его поздний ответ уже не перезапишет нового пользователя. Это и есть защита от гонки.

### Чего abort() НЕ делает
- **Не отменяет действие на сервере.** Запрос мог уже дойти и обработаться. Для GET это не страшно, а POST (оплата, создание записи) отмена не откатывает: такие операции делают идемпотентными.
- **Не останавливает код, который signal не слушает.** Если после \`fetch\` есть \`await\` другой долгой операции, проверьте \`signal.aborted\` (или вызовите \`signal.throwIfAborted()\`) перед обновлением state.

### Полезные возможности signal
\`\`\`js
// Таймаут без ручного setTimeout
fetch(url, { signal: AbortSignal.timeout(5000) });

// Отмена по любому из сигналов: размонтирование ИЛИ таймаут
fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]) });

// Отписка от нескольких событий одним вызовом
window.addEventListener('resize', onResize, { signal: controller.signal });
window.addEventListener('scroll', onScroll, { signal: controller.signal });
controller.abort(); // снимает оба слушателя
\`\`\`
TanStack Query передаёт \`signal\` в \`queryFn\` сам — достаточно пробросить его в \`fetch\`.

### AbortController или флаг ignore
| | \`AbortController\` | \`let ignore = false\` |
|---|---|---|
| Обрывает сетевой запрос | да | нет, запрос выполняется до конца |
| Защищает state от устаревшего ответа | да | да |
| Работает с любым промисом | только с API, принимающими signal | да |

### ⚠️ Частые ошибки
- **Контроллер вне эффекта** (в теле компонента или в \`useRef\` на все запуски) — после первой отмены все следующие запросы падают сразу.
- **Ложная ошибка на экране** — отмена не отфильтрована в \`catch\`.
- **Фильтр по \`err.name\` после переобёртывания ошибки** — имя \`AbortError\` потеряно.
- **\`useEffect(async () => ...)\`** — эффект вернёт промис вместо cleanup, и \`abort()\` некуда поставить.
- **Ожидание, что отмена откатит POST на сервере.**

### 💡 Ключевые выводы
- Любой асинхронный эффект должен уметь отменяться в cleanup.
- Один запуск эффекта — один контроллер.
- Отмену определяйте по \`signal.aborted\`, а не по имени ошибки.
- Отмена экономит сеть и защищает от гонок, но не отменяет то, что уже сделал сервер.`,

  w18: `### Суть задачи
Освоить синтаксис \`useMemo\` и понять, когда он оправдан.

### 🛠 Синтаксис
\`\`\`js
const sortedItems = useMemo(() => [...items].sort(compareByPrice), [items]);
\`\`\`
- Первый аргумент — функция, которая вычисляет значение.
- Второй — зависимости. Пока они не изменились (по \`Object.is\`), возвращается закешированный результат.

### Два законных сценария
1. **Дорогое вычисление**: сортировка или фильтрация тысяч элементов, когда компонент часто рендерится по другим причинам.
2. **Стабильная ссылка**: объект или массив уходит в \`memo\`-компонент или в зависимости эффекта.
\`\`\`js
const options = useMemo(() => ({ sortBy, order }), [sortBy, order]);
\`\`\`

### ⚠️ Частые ошибки
- \`useMemo(() => a + b, [a, b])\` — мемоизация дороже самого сложения.
- Мутации внутри (\`items.sort()\` сортирует исходный массив на месте) — копируйте: \`[...items].sort()\` или \`items.toSorted()\`.
- Забытые зависимости — устаревший результат.

### 💡 Ключевые выводы
- \`useMemo\` кеширует **значение**, \`useCallback\` — **функцию**.
- Сначала измерьте, потом мемоизируйте.`,

  w19: `### Суть задачи
Не пересчитывать фильтрацию 10 000 пользователей при рендерах, не связанных с поиском (смена темы).

### 🛠 Решение
\`\`\`jsx
const filteredUsers = useMemo(() => {
  const normalizedQuery = query.trim().toLowerCase();
  return USERS.filter((user) => user.toLowerCase().includes(normalizedQuery));
}, [query]);

<ul>
  {filteredUsers.map((user) => (
    <li key={user}>{user}</li>
  ))}
</ul>
\`\`\`
- Зависимость только \`query\`: от \`theme\` результат не зависит.
- Клик по кнопке темы вызывает рендер, но берёт результат из кеша.
- Ключ — сама строка имени: она уникальна и стабильна. Индекс не подходит — он меняется вместе с фильтром.

### Как убедиться, что оптимизация нужна
Оберните вычисление в \`console.time('filter')\` / \`console.timeEnd('filter')\` или запишите профиль в React DevTools. Если фильтрация занимает меньше миллисекунды, \`useMemo\` не нужен.

### ⚠️ Частые ошибки
- \`key={index}\` в фильтруемом списке.
- Лишние зависимости (\`theme\`) — кеш сбрасывается без причины.
- Ожидать, что \`useMemo\` ускорит рендер самого списка: он кеширует только вычисление.

### 💡 Ключевые выводы
- \`useMemo\` полезен, когда дорогое вычисление повторяется из-за несвязанных рендеров.
- Если медленный рендер, а не вычисление, — смотрите в сторону виртуализации и \`useDeferredValue\`.`,

  w20: `### Суть задачи
Освоить синтаксис \`useCallback\` и понять, когда он нужен.

### 🛠 Синтаксис
\`\`\`js
const handleSelect = useCallback(
  (id) => {
    onSelect(id, filter);
  },
  [onSelect, filter]
);
\`\`\`
- Возвращает ту же функцию между рендерами, пока зависимости не изменились.
- \`useCallback(fn, deps)\` эквивалентен \`useMemo(() => fn, deps)\`.

### Когда это нужно
- Функция уходит в компонент, обёрнутый в \`memo\`.
- Функция в зависимостях \`useEffect\`, и эффект не должен перезапускаться на каждый рендер.

### ⚠️ Частые ошибки
- \`useCallback\` для обработчика обычной кнопки — ссылка никем не сравнивается, оптимизации нет.
- Пропущенные зависимости — устаревшее замыкание.
- Ожидать, что \`useCallback\` ускорит сам компонент: он лишь стабилизирует ссылку.

### 💡 Ключевые выводы
- \`useCallback\` работает только в связке с потребителем, который сравнивает ссылки.
- С функциональным сеттером (\`setX(prev => ...)\`) state часто можно убрать из зависимостей.`,

  w21: `### Суть задачи
Не перерисовывать кнопку при каждом изменении счётчика: связка \`React.memo\` + \`useCallback\`.

### 🛠 Решение
\`\`\`jsx
const IncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Увеличить</button>
));

const SimpleCounter = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <>
      <p>Счётчик: {count}</p>
      <IncrementButton onIncrement={increment} />
    </>
  );
};
\`\`\`
- \`React.memo\` пропускает рендер ребёнка, если пропсы поверхностно равны.
- Без \`useCallback\` функция \`increment\` новая на каждом рендере, и memo не работает.
- Функциональный сеттер позволяет оставить зависимости пустыми.

### Как проверить
Добавьте \`console.log\` в \`IncrementButton\` или включите «Highlight updates» в React DevTools: после клика кнопка не должна подсвечиваться.

### ⚠️ Частые ошибки
- Только \`useCallback\` без \`memo\` — эффекта нет.
- \`count\` в зависимостях вместо функционального сеттера — функция пересоздаётся на каждый клик.

### 💡 Ключевые выводы
- \`memo\` и \`useCallback\` работают только вместе.
- Для такого маленького компонента оптимизация не нужна — это учебный пример механики. В реальном коде мемоизируют дорогие поддеревья.`,

  w22: `### Суть задачи
Освоить два сценария \`useRef\`: доступ к DOM и хранение значения между рендерами.

### 🛠 Синтаксис
\`\`\`jsx
// 1. Ссылка на DOM-элемент
const inputRef = useRef(null);
<input ref={inputRef} />
// после монтирования: inputRef.current.focus()

// 2. Значение, которое не влияет на разметку
const timerIdRef = useRef(null);
timerIdRef.current = setInterval(tick, 1000);
\`\`\`
\`useRef\` возвращает объект \`{ current }\`, который живёт всё время жизни компонента.

### useRef или useState
| | \`useState\` | \`useRef\` |
|---|---|---|
| Изменение вызывает рендер | да | нет |
| Значение доступно в JSX | да | не стоит |
| Типичное применение | данные для UI | DOM-узлы, id таймеров, предыдущие значения |

### ⚠️ Частые ошибки
- Хранить в ref то, что выводится на экран, — экран не обновится.
- Читать \`ref.current\` во время рендера.

### 💡 Ключевые выводы
- ref — «коробка», которая переживает рендеры и не вызывает их.`,

  w23: `### Суть задачи
Поставить фокус на инпут по клику на кнопку через \`useRef\`.

### 🛠 Решение
\`\`\`jsx
const inputRef = useRef(null);

const handleFocus = () => {
  inputRef.current?.focus();
};

<input ref={inputRef} />
<button onClick={handleFocus}>Сделать фокус</button>
\`\`\`
- \`ref={inputRef}\` — React запишет DOM-узел в \`inputRef.current\` после монтирования.
- В обработчике клика узел уже существует; опциональная цепочка \`?.\` защищает от \`null\`, если поле не отрендерено.

### ⚠️ Частые ошибки
- Вызывать \`inputRef.current.focus()\` прямо в теле компонента — во время рендера там ещё \`null\`.
- \`document.getElementById\` вместо ref.

### 💡 Ключевые выводы
- ref — способ «выйти» из React к DOM для императивных действий: фокус, скролл, измерения, медиа.`,

  w24: `### Суть задачи
Сделать неуправляемую форму: значение живёт в DOM и читается через ref только при отправке.

### 🛠 Решение
\`\`\`jsx
const inputRef = useRef(null);

const handleSubmit = (e) => {
  e.preventDefault();
  const input = inputRef.current;
  console.log('Отправлено значение:', input.value);
  input.value = '';
  input.focus();
};

<form onSubmit={handleSubmit}>
  <input ref={inputRef} name="username" defaultValue="" />
  <button type="submit">Отправить</button>
</form>
\`\`\`
- Отправка через \`onSubmit\` формы: работает и по Enter.
- Ввод не вызывает рендеров — React не управляет \`value\`.
- Для неуправляемого поля прямая запись \`input.value = ''\` допустима: источник правды — DOM.

### Когда выбирать
- **Неуправляемая**: простые формы, значения нужны только при отправке, интеграция с не-React кодом.
- **Управляемая**: мгновенная валидация, маски ввода, зависимые поля.

### ⚠️ Частые ошибки
- Писать в \`.value\` управляемого поля — состояние React и DOM расходятся (см. рефакторинг про \`useImperativeHandle\`).
- \`value\` без \`onChange\` вместо \`defaultValue\`.

### 💡 Ключевые выводы
- Для многих полей удобнее \`new FormData(e.currentTarget)\` или \`<form action>\` из React 19, чем ref на каждое поле.`,

  w25: `### Суть задачи
Реализация базовых операций управления коллекцией в React (CRUD): добавление, переключение флага и удаление элементов массива с соблюдением строгой иммутабельности.

### Пошаговые этапы решения:

1. **Добавление нового элемента**:
   \`\`\`jsx
   const handleAdd = (e) => {
     e.preventDefault();
     if (!text.trim()) return;
     setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: text.trim(), completed: false }]);
     setText("");
   };
   \`\`\`

2. **Переключение статуса (обновление по id)**:
   \`\`\`jsx
   const handleToggle = (id) => {
     setTodos((prev) =>
       prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
     );
   };
   \`\`\`

3. **Удаление элемента (фильтрация по id)**:
   \`\`\`jsx
   const handleDelete = (id) => {
     setTodos((prev) => prev.filter((todo) => todo.id !== id));
   };
   \`\`\`

### Ключевые выводы:
- Прямые мутации массива (\`todos.push()\`, \`todos.splice()\`) не создают новую ссылку в памяти, из-за чего React отменяет рендеринг.
- Всегда используйте методы, возвращающие новый массив: \`[...prev, item]\`, \`.filter()\`, \`.map()\`.`,

  w26: `### Суть задачи
Организация однонаправленного потока данных (Props Down, Events Up) и поднятие состояния (Lifting State Up) к общему предку.

### Пошаговые этапы решения:

1. **Хранение стейта в родительском контейнере**:
   \`\`\`jsx
   const [activeTab, setActiveTab] = useState("overview");
   \`\`\`

2. **Передача пропсов и колбэка в дочерний компонент**:
   \`\`\`jsx
   <TabButton
     key={tab.id}
     id={tab.id}
     label={tab.label}
     isActive={tab.id === activeTab}
     onSelect={setActiveTab}
   />
   \`\`\`

3. **Вызов колбэка дочерним компонентом**:
   \`\`\`jsx
   const TabButton = ({ id, label, isActive, onSelect }) => (
     <button onClick={() => onSelect(id)} disabled={isActive}>
       {label} {isActive ? "✓" : ""}
     </button>
   );
   \`\`\`

### Ключевые выводы:
- Дочерние компоненты не должны дублировать или синхронизировать состояние родителя в собственном \`useState\`.
- Если состояние нужно нескольким компонентам, его поднимают в ближайшего общего предка.`,

  w27: `### Суть задачи
Запустить секундомер через \`setInterval\` в эффекте, правильно его очистить и избежать устаревшего замыкания.

### 🛠 Решение
\`\`\`jsx
useEffect(() => {
  const intervalId = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(intervalId);
}, []);
\`\`\`
- Интервал создаётся один раз после монтирования.
- Функциональный сеттер не зависит от значения в замыкании, поэтому зависимостей нет.
- Cleanup останавливает интервал при размонтировании.

### 🔍 Ловушка stale closure
\`\`\`jsx
useEffect(() => {
  const id = setInterval(() => setSeconds(seconds + 1), 1000); // seconds навсегда 0
  return () => clearInterval(id);
}, []);
\`\`\`
Колбэк видит \`seconds\` из первого рендера. Добавить \`seconds\` в зависимости — тоже плохо: интервал будет пересоздаваться каждую секунду.

### ⚠️ Частые ошибки
- Нет cleanup — интервалы копятся, в StrictMode таймер идёт ×2.
- Хранить id интервала в \`useState\` — лишние рендеры (для этого есть \`useRef\`).

### 💡 Ключевые выводы
- Каждому \`setInterval\` — свой \`clearInterval\` в cleanup.
- Функциональная форма сеттера убирает state из зависимостей эффекта.`,

  w28: `### Суть задачи
Закрывать модальное окно по Escape через глобальный слушатель клавиатуры и корректно отписываться.

### 🛠 Решение
\`\`\`jsx
useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen]);
\`\`\`
- Подписываемся только когда окно открыто.
- Обработчик сохранён в переменную — в \`removeEventListener\` уходит та же ссылка.
- При закрытии или размонтировании cleanup снимает слушатель.

### ⚠️ Частые ошибки
- \`removeEventListener('keydown', (e) => ...)\` — новая функция, слушатель не удалится.
- Подписка без cleanup — слушатели копятся при каждом открытии.
- Обработчик читает state из замыкания и не перезапускается при его изменении — устаревшее значение (разбор в задаче рефакторинга про \`useEffectEvent\`).

### 💡 Ключевые выводы
- \`add\` и \`remove\` — с одной и той же ссылкой на функцию.
- Подписка живёт ровно столько, сколько нужна: управляйте этим через зависимости эффекта.`,

  w30: `### Суть задачи
Посчитать количество товаров и итоговую сумму корзины без лишних \`useState\` и \`useEffect\`.

### 🛠 Решение
\`\`\`jsx
const [items, setItems] = useState(INITIAL_CART);

// Производные данные вычисляются при каждом рендере
const totalCount = items.reduce((sum, item) => sum + item.count, 0);
const totalPrice = items.reduce((sum, item) => sum + item.price * item.count, 0);
\`\`\`
Изменение количества обновляет только \`items\`, а итоги пересчитываются в том же рендере:
\`\`\`jsx
const handleUpdateCount = (id, delta) => {
  setItems((prev) =>
    prev
      .map((item) => (item.id === id ? { ...item, count: item.count + delta } : item))
      .filter((item) => item.count > 0)
  );
};
\`\`\`

### 🔍 Антипаттерн, которого избегаем
\`\`\`jsx
const [totalPrice, setTotalPrice] = useState(0);
useEffect(() => {
  setTotalPrice(items.reduce(...));
}, [items]);
\`\`\`
Первый рендер показывает устаревшую сумму, эффект вызывает второй рендер, а при ошибке в зависимостях данные расходятся.

### ⚠️ Частые ошибки
- Хранить в state то, что вычисляется из другого state.
- Оборачивать дешёвые вычисления в \`useMemo\` «на всякий случай».

### 💡 Ключевые выводы
- Минимальный state + вычисления при рендере = нет рассинхронизации.
- \`useEffect\` нужен для синхронизации с внешними системами, а не между частями state.`,

  w31: `### Суть задачи
Вынести логику переключателя в переиспользуемый хук \`useToggle\`.

### 🛠 Решение
\`\`\`jsx
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(Boolean(initialValue));
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggle, setValue];
};

const [isVisible, toggleVisible, setIsVisible] = useToggle(false);
\`\`\`
- Хук — обычная функция, которая вызывает другие хуки.
- \`toggle\` стабилен благодаря \`useCallback\` и функциональному сеттеру: его можно безопасно передавать в memo-компоненты и эффекты.
- \`setValue\` возвращается для явных действий «показать» и «скрыть».

### ⚠️ Частые ошибки
- Вызов хука в условии или цикле.
- Ожидать, что два компонента с одним хуком делят состояние.
- Имя без \`use\` — линтер перестанет проверять правила хуков.

### 💡 Ключевые выводы
- Кастомные хуки переиспользуют логику с состоянием, а не само состояние.
- Хороший хук повторяет знакомый API: \`useToggle\` выглядит как \`useState\`.`,

  a1: `### Суть задачи
Организация загрузки асинхронных данных через связку \`useReducer\` + кастомный хук, с чётким разделением состояний загрузки, ошибки и успешного результата, а также отменой запроса через \`AbortController\`.

### 🛠 Пошаговые этапы решения:

1. **Описание состояний через reducer**:
   \`\`\`js
   export const initialState = {
     users: [],
     loading: true,
     error: null,
   };

   export const reducer = (state, action) => {
     switch (action.type) {
       case FETCH_INIT:
         return { ...state, loading: true, error: null };
       case FETCH_SUCCESS:
         return { ...state, loading: false, users: action.payload };
       case FETCH_FAILURE:
         return { ...state, loading: false, error: action.payload };
       default:
         throw new Error(\`Unhandled action type: \${action.type}\`);
     }
   };
   \`\`\`
**Разбор**: Вместо нескольких разрозненных \`useState\` (для \`users\`, \`loading\`, \`error\`) вся логика переходов между состояниями собрана в одном редьюсере. Каждый \`case\` возвращает новый объект состояния иммутабельно (через spread), а не мутирует старый. \`FETCH_INIT\` сбрасывает ошибку и включает загрузку — это важно для повторных запросов. \`default: throw new Error(...)\` — хорошая практика, которая сразу подсвечивает опечатку в типе action на этапе разработки, а не тихо игнорирует её.

2. **Вынесение логики запроса в кастомный хук**:
   \`\`\`js
   export const useFetchUsers = () => {
     const [state, dispatch] = useReducer(reducer, initialState);

     useEffect(() => {
       const controller = new AbortController();

       const loadData = async () => {
         dispatch({ type: FETCH_INIT });
         try {
           const response = await fetch(URL, { signal: controller.signal });
           if (!response.ok) throw new Error('Не удалось загрузить данные');
           const data = await response.json();
           dispatch({ type: FETCH_SUCCESS, payload: data });
         } catch (err) {
           if (err.name !== 'AbortError') {
             dispatch({ type: FETCH_FAILURE, payload: err.message });
           }
         }
       };

       loadData();
       return () => controller.abort();
     }, []);

     return state;
   };
   \`\`\`
**Разбор**: Хук \`useFetchUsers\` инкапсулирует всю работу с \`useReducer\`, \`fetch\` и \`AbortController\`, возвращая наружу только готовый \`state\` — компонент не знает деталей реализации загрузки. Проверка \`response.ok\` нужна, поскольку \`fetch\` не бросает исключение сам по себе на HTTP-ошибки (404, 500 и т.д.) — только на сетевые сбои, поэтому её приходится делать явно. \`AbortController\` отменяет запрос при размонтировании (или при повторном срабатывании эффекта), а фильтр \`err.name !== 'AbortError'\` в \`catch\` предотвращает запись ложной ошибки в стейт при отмене запроса.

3. **Использование хука в компоненте**:
   \`\`\`jsx
   const { users, loading, error } = useFetchUsers();

   if (loading) return <div>Загрузка...</div>;
   if (error) return <div>Ошибка: {error}</div>;

   return (
     <div>
       <ul>
         {users.map((user) => (
           <li key={user.id}>{user.name} ({user.email})</li>
         ))}
       </ul>
     </div>
   );
   \`\`\`
**Разбор**: Компонент получает уже готовое, агрегированное состояние из хука и строит рендер по принципу ранних возвратов (early return): сначала проверяется \`loading\`, затем \`error\`, и только потом рендерится основной список. Такой порядок гарантирует, что пользователь никогда не увидит одновременно и спиннер, и данные, и ошибку. \`key={user.id}\` использует стабильный идентификатор из API, а не индекс массива.

### 💡 Ключевые выводы:
- \`useReducer\` предпочтительнее нескольких \`useState\`, когда состояния логически связаны и переключаются согласованно (loading/error/data по сути — конечный автомат из трёх взаимоисключающих фаз).
- Вынесение fetch-логики в кастомный хук (\`useFetchUsers\`) отделяет побочные эффекты и работу с данными от компонента представления — компонент становится «глупым» и легко тестируемым.
- \`AbortController\` и фильтрация \`AbortError\` — обязательный паттерн для эффектов с асинхронными запросами, предотвращающий утечки состояния (state update on unmounted component) и ложные ошибки.
- Явная проверка \`response.ok\` необходима, так как \`fetch\` считает HTTP-ошибки «успешным» разрешением промиса.`,

  a2: `### Суть задачи
Загрузить пользователей через Redux Toolkit: асинхронный thunk, слайс со статусом загрузки, стор и подключение к компоненту.

### 🛠 Решение
**1. Thunk**
\`\`\`js
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { signal }) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
    if (!response.ok) throw new Error(\`Не удалось загрузить данные: HTTP \${response.status}\`);
    return response.json();
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().users;
      return status === 'idle' || status === 'failed';
    },
  }
);
\`\`\`
- Возвращённое значение попадает в \`fulfilled\`, выброшенная ошибка — в \`rejected\`. Оборачивать тело в \`try/catch\` с повторным \`throw\` не нужно.
- \`signal\` позволяет отменить запрос через \`promise.abort()\`.
- \`condition\` не даёт запустить повторную загрузку, если она уже идёт или данные получены.

**2. Слайс**
\`\`\`js
const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
\`\`\`
«Мутации» безопасны: Immer превращает их в новое состояние.

**3. Стор и компонент**
\`\`\`jsx
export const store = configureStore({ reducer: { users: usersReducer } });

const { users, status, error } = useSelector((state) => state.users);
useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);

if (status === 'idle' || status === 'loading') return <div>Загрузка...</div>;
if (status === 'failed') return <div>Ошибка: {error}</div>;
\`\`\`

### ⚠️ Частые ошибки
- Нет проверки \`response.ok\` — ответ 500 «успешно» попадёт в \`fulfilled\`.
- Статус \`idle\` не обработан — первый рендер показывает пустой список вместо загрузки.
- Повторный \`dispatch(fetchUsers())\` при каждом монтировании без \`condition\`.

### 💡 Ключевые выводы
- \`createAsyncThunk\` = автоматические \`pending\` / \`fulfilled\` / \`rejected\`.
- Для серверных данных в продакшене чаще берут RTK Query или TanStack Query.`,

  a3: `### Суть задачи
Добавить к загрузке пользователей поиск по имени и мемоизированный селектор для фильтрации.

### 🛠 Решение
**1. Строка поиска в слайсе**
\`\`\`js
reducers: {
  setSearchQuery: (state, action) => {
    state.searchQuery = action.payload;
  },
},
\`\`\`

**2. Простые селекторы — обычные функции**
\`\`\`js
export const selectUsers = (state) => state.users.users;
export const selectSearchQuery = (state) => state.users.searchQuery;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
\`\`\`
Они возвращают ссылку на уже существующее значение — оборачивать их в \`createSelector\` бессмысленно.

**3. Мемоизация — только для вычисляемых данных**
\`\`\`js
export const selectFilteredUsers = createSelector(
  [selectUsers, selectSearchQuery],
  (users, searchQuery) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => user.name.toLowerCase().includes(query));
  }
);
\`\`\`
\`filter\` создаёт новый массив. Без мемоизации \`useSelector\` получал бы новую ссылку на каждый вызов и перерисовывал компонент при любом действии в сторе. \`createSelector\` пересчитывает результат, только когда изменились \`users\` или \`searchQuery\`.

**4. Компонент**
\`\`\`jsx
const users = useSelector(selectFilteredUsers);
const searchQuery = useSelector(selectSearchQuery);

<input value={searchQuery} onChange={(e) => dispatch(setSearchQuery(e.target.value))} />
\`\`\`

### ⚠️ Частые ошибки
- Фильтрация прямо в \`useSelector(state => state.users.users.filter(...))\` — лишние рендеры.
- \`createSelector\` для каждого поля — лишний код и накладные расходы без выгоды.
- Один экземпляр параметризованного селектора на несколько компонентов — кеш постоянно сбрасывается.

### 💡 Ключевые выводы
- Мемоизируйте селекторы, которые **создают** новые объекты и массивы.
- Селекторы — публичный API слайса: компоненты не знают структуру стора.`,

  r1: `### Суть задачи
Найти ошибку мутации состояния и восстановить реактивность компонента. При попытке отключить уведомления интерфейс не обновляется, хотя обработчик вызывается.

### 🔍 Разбор проблемы и почему это ошибка:
В JavaScript объекты и массивы передаются по ссылке. В исходном коде:
\`\`\`jsx
const disableNotifications = () => {
  const updatedUser = user;
  updatedUser.settings.notifications = false;
  setUser(updatedUser);
};
\`\`\`
1. **Мутация вместо копии**: Строка \`const updatedUser = user\` не создаёт новый объект, а лишь копирует ссылку на существующий объект \`user\` в памяти.
2. **Прямое изменение вложенных полей**: Строка \`updatedUser.settings.notifications = false\` напрямую мутирует объект состояния в обход React.
3. **Сравнение Object.is**: Когда вызывается \`setUser(updatedUser)\`, React выполняет оптимизационную проверку равенства предыдущего и нового состояния через алгоритм \`Object.is(prevState, nextState)\`. Так как ссылка осталась прежней (\`user === updatedUser\`), React считает, что состояние не изменилось, и полностью отменяет ре-рендер компонента.

### 🛠 Пошаговый рефакторинг:
Для корректного обновления необходимо создать новый объект с поверхностным копированием как самого объекта, так и всех мутируемых вложенных структур:
\`\`\`jsx
const disableNotifications = () => {
  setUser((prevUser) => ({
    ...prevUser,
    settings: {
      ...prevUser.settings,
      notifications: false,
    },
  }));
};
\`\`\`

### 💡 Ключевые выводы:
- **Состояние в React иммутабельно**: Прямая мутация полей объекта (\`state.prop = value\`) запрещена.
- **Поверхностное копирование (Shallow Copy)**: Spread-оператор \`{ ...prev }\` копирует только свойства первого уровня. Если внутри есть вложенные объекты, их также необходимо копировать: \`{ ...prev, nested: { ...prev.nested } }\`.
- **Функциональный сеттер**: Использование \`setUser(prev => ...)\` гарантирует работу с самым актуальным состоянием даже при батчинге обновлений.`,

  r2: `### Суть задачи
Устранить избыточный \`useEffect\` и \`useState\`, заменив синхронизацию состояния на вычисление производных данных (derived state) во время рендера.

### 🔍 Разбор проблемы и почему это ошибка:
В исходном коде для фильтрации постов заведён отдельный стейт \`filteredPosts\`:
\`\`\`jsx
const [filteredPosts, setFilteredPosts] = useState([]);

useEffect(() => {
  if (filterCategory === 'all') {
    setFilteredPosts(posts);
  } else {
    const filtered = posts.filter(post => post.category === filterCategory);
    setFilteredPosts(filtered);
  }
}, [posts, filterCategory]);
\`\`\`
1. **Каскадные рендеры (Double Render)**: При смене пропса \`filterCategory\` React сначала отрисовывает компонент со старыми \`filteredPosts\`, затем запускает \`useEffect\`, вызывает \`setFilteredPosts\`, что немедленно провоцирует второй внеочередной рендер.
2. **Временная рассинхронизация (UI Glitch)**: Пользователь на долю секунды может увидеть устаревшие данные.
3. **Нарушение принципа единого источника правды**: Список постов дублируется в двух состояниях.

### 🛠 Пошаговый рефакторинг:
Согласно официальному гайду React *«You Might Not Need an Effect»*, если данные можно вычислить из существующих пропсов или стейта, их нужно считать прямо в теле компонента:
\`\`\`jsx
export default function Feed({ posts, filterCategory }) {
  const filteredPosts =
    filterCategory === 'all'
      ? posts
      : posts.filter((post) => post.category === filterCategory);

  return (
    <ul>
      {filteredPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

### 💡 Ключевые выводы:
- **Вам не нужен useEffect для производного стейта**: Если значение вычисляется синхронно на основе пропсов или другого стейта, вычисляйте его на лету.
- **1 рендер вместо 2**: Устранение избыточного эффекта избавляет компонент от лишней фазы отрисовки и мерцания интерфейса.
- **useMemo опционален**: Если массив содержит до нескольких сотен элементов, обычный \`.filter()\` выполняется за микросекунды и мемоизация не требуется.`,

  r3: `### Суть задачи
Ускорить ввод цвета без \`React.memo\`, \`useMemo\` и \`useCallback\` — только правильной композицией компонентов.

### 🔍 Разбор проблемы:
\`\`\`jsx
export default function App() {
  const [color, setColor] = useState('#ff0000');
  return (
    <div style={{ border: \`4px solid \${color}\` }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <ExpensiveTree /> {/* рендерится на каждое нажатие клавиши */}
    </div>
  );
}
\`\`\`
Состояние \`color\` живёт в \`App\`, поэтому любое изменение перерисовывает весь \`App\` вместе с медленным \`ExpensiveTree\`, хотя цвет ему не нужен.

### 🛠 Решение: поднимаем содержимое вверх через children
Состояние нужно обёртке (рамка) и инпуту, но не \`ExpensiveTree\`. Выносим всё, что зависит от цвета, в \`ColorFrame\`, а медленное поддерево передаём снаружи:
\`\`\`jsx
function ColorFrame({ children }) {
  const [color, setColor] = useState('#ff0000');
  return (
    <div style={{ border: \`4px solid \${color}\`, padding: 16 }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Привет, мир!</p>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <ColorFrame>
      <ExpensiveTree />
    </ColorFrame>
  );
}
\`\`\`
Элемент \`<ExpensiveTree />\` создаёт \`App\`, а \`App\` при вводе больше не рендерится. \`ColorFrame\` каждый раз получает тот же объект элемента в \`children\`, и React пропускает это поддерево.

### 💡 Ключевые выводы:
- **Опустить состояние вниз**: если state нужен только части UI, вынесите эту часть в отдельный компонент.
- **Поднять содержимое вверх**: если state нужен обёртке, передайте независимое поддерево через \`children\`.
- Начинайте с композиции: она бесплатна и не ломается от inline-объектов. \`memo\` — следующий шаг, а не первый.`,

  r4: `### Суть задачи
Найти, почему \`React.memo\` не защищает \`TodoItem\` от лишних рендеров, хотя \`onRemove\` уже обёрнут в \`useCallback\`.

### 🔍 Что ломает мемоизацию:
\`React.memo\` сравнивает каждый проп через \`Object.is\`. Любое значение, созданное заново при рендере родителя, — это новая ссылка:
\`\`\`jsx
<TodoItem
  todo={{ ...todo, text: todo.text.trim() }} // 1. новый объект на каждом рендере
  onRemove={handleRemove}                    //    стабилен благодаря useCallback
  style={{ padding: 4 }}                     // 2. новый объект стилей
>
  <span>⭐</span>                             {/* 3. children — новый React-элемент */}
</TodoItem>
\`\`\`
Хватает одного такого пропа, чтобы memo каждый раз пропускал рендер дальше.

### 🛠 Пошаговый рефакторинг:
1. **Данные готовим один раз** — при создании состояния, а не в JSX:
   \`\`\`jsx
   const [todos, setTodos] = useState(() =>
     INITIAL_TODOS.map((todo) => ({ ...todo, text: todo.text.trim() }))
   );
   \`\`\`
2. **Константы выносим за пределы компонента**:
   \`\`\`jsx
   const ITEM_STYLE = { padding: 4 };
   \`\`\`
3. **Статичную разметку переносим внутрь ребёнка** вместо передачи через \`children\`.

\`\`\`jsx
const TodoItem = memo(({ todo, onRemove }) => (
  <li style={ITEM_STYLE}>
    {todo.text} <span>⭐</span>
    <button onClick={() => onRemove(todo.id)}>Удалить</button>
  </li>
));

<TodoItem key={todo.id} todo={todo} onRemove={handleRemove} />
\`\`\`

### 💡 Ключевые выводы:
- \`React.memo\` работает, только если **все** пропсы ссылочно стабильны: функции, объекты, массивы и JSX.
- \`children\` — тоже проп. JSX внутри мемоизированного компонента ломает memo.
- Стабилизировать пропсы можно без хуков: константы вне компонента, примитивы вместо объектов, подготовка данных в состоянии.`,

  r5: `### Суть задачи
Удалить вредные и избыточные оптимизации (\`useMemo\` и \`useCallback\`), ухудшающие читаемость кода и расходующие лишнюю память.

### 🔍 Разбор проблемы и почему это ошибка:
В исходном компоненте \`SimpleCalculator\`:
\`\`\`jsx
const sum = useMemo(() => a + b, [a, b]);
const handleChange = useCallback((e) => {
  setInput(e.target.value);
}, []);
...
<input value={input} onChange={handleChange} />
\`\`\`
1. **Бесполезный useMemo**: Операция сложения \`a + b\` выполняется в JS-движке за доли наносекунды. Затраты на вызов самого хука \`useMemo\`, выделение памяти под массив зависимостей \`[a, b]\` и их попарное сравнение через \`Object.is\` многократно превышают время самого сложения.
2. **Бесполезный useCallback**: Функция \`handleChange\` передаётся в обычный нативный тег \`<input>\`. Нативные HTML-элементы не обёрнуты в \`React.memo\` и не кэшируют пропсы — они обновляются на уровне виртуального DOM всегда. Создание \`useCallback\` здесь лишь аллоцирует дополнительную память.

### 🛠 Пошаговый рефакторинг:
Удаляем лишние хуки и оставляем лаконичный декларативный код:
\`\`\`jsx
import React, { useState } from 'react';

export default function SimpleCalculator({ a = 2, b = 3 }) {
  const [input, setInput] = useState('');
  const sum = a + b;

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <input value={input} onChange={handleChange} />
      <p>Сумма: {sum}</p>
    </div>
  );
}
\`\`\`

### 💡 Ключевые выводы:
- **Преждевременная оптимизация — корень всех зол**: Не мемоизируйте примитивные математические операции и простые трансформации строк.
- **useCallback на нативных DOM-элементах бесполезен**: Передача стабильной ссылки в \`<button>\`, \`<input>\` или \`<div>\` ничего не оптимизирует.
- **Правило простоты**: Код без лишних хуков легче читать, отлаживать и поддерживать.`,

  r6: `### Суть задачи
Устранить гонку запросов: при быстрой смене \`userId\` на экране оказывается не тот пользователь.

### 🔍 Разбор проблемы
\`\`\`jsx
useEffect(() => {
  fetchUser(userId).then(setUserData);
}, [userId]);
\`\`\`
1. \`userId = 1\` — уходит запрос A.
2. \`userId = 2\` — уходит запрос B.
3. Ответ B приходит через 100 мс — на экране пользователь 2.
4. Ответ A приходит через 500 мс и **перезаписывает** state — на экране пользователь 1, хотя выбран 2.

Порядок отправки запросов не гарантирует порядок ответов.

### 🛠 Рефакторинг — флаг актуальности
\`\`\`jsx
useEffect(() => {
  let ignore = false;
  setStatus('loading');

  const load = async () => {
    try {
      const response = await fetch(\`/users/\${userId}\`);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      const data = await response.json();
      if (!ignore) {
        setUserData(data);
        setStatus('success');
      }
    } catch (err) {
      if (!ignore) {
        setError(err.message);
        setStatus('error');
      }
    }
  };

  load();
  return () => {
    ignore = true;
  };
}, [userId]);
\`\`\`
У каждого запуска эффекта своя переменная \`ignore\`. Cleanup предыдущего запуска выставляет её в \`true\`, и поздний ответ игнорируется.

Заодно исправлено:
- проверка \`response.ok\` — ошибки сервера больше не выглядят как данные;
- ошибка показывается пользователю, а не только пишется в консоль;
- состояние описано одним статусом вместо пары \`loading\` + \`userData\`.

### Альтернатива — AbortController
\`\`\`jsx
const controller = new AbortController();
fetch(url, { signal: controller.signal });
return () => controller.abort();
\`\`\`
Отменяет сам запрос и экономит трафик. Флаг \`ignore\` универсальнее: работает с любым промисом.

### ⚠️ Частые ошибки
- Флаг, объявленный вне эффекта (\`useRef\`), — один на все запуски, и новый запрос «отменяет» сам себя.
- Защищать только \`setUserData\`, но не \`setError\` и не статус.

### 💡 Ключевые выводы
- Любой эффект с асинхронным результатом, зависящий от параметров, должен защищаться от гонки.
- В продакшене эту задачу решают кешем по ключу (TanStack Query, SWR).`,

  r7: `### Суть задачи
Не отправлять запрос на каждое нажатие клавиши: задержать поиск до паузы в вводе и при этом не сломать отзывчивость поля.

### 🔍 Разбор проблемы
\`\`\`jsx
useEffect(() => {
  fetch(\`/search?q=\${query}\`).then(...);
}, [query]);
\`\`\`
- Слово «react» — пять запросов вместо одного.
- Ответы могут прийти в обратном порядке, и на экране окажутся результаты по «rea».
- \`query\` не экранирован: символы \`&\` и \`#\` ломают URL.
- Ошибки только пишутся в консоль.

### 🛠 Рефакторинг
**1. Хук \`useDebounce\`** откладывает значение, пока пользователь печатает:
\`\`\`jsx
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`
Каждое новое нажатие отменяет предыдущий таймер, и значение обновится только после паузы.

**2. Два значения**: \`query\` для поля (мгновенно) и \`debouncedQuery\` для сети.
\`\`\`jsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query.trim(), 500);
\`\`\`

**3. Эффект запроса с отменой** — debounce не защищает от гонки:
\`\`\`jsx
useEffect(() => {
  if (!debouncedQuery) {
    setResults([]);
    return;
  }

  const controller = new AbortController();
  const search = async () => {
    try {
      setError(null);
      const response = await fetch(
        \`https://api.example.com/search?q=\${encodeURIComponent(debouncedQuery)}\`,
        { signal: controller.signal }
      );
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      setResults(await response.json());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    }
  };

  search();
  return () => controller.abort();
}, [debouncedQuery]);
\`\`\`

### ⚠️ Частые ошибки
- \`debounce(fn)\` из lodash прямо в теле компонента — на каждом рендере создаётся новая функция со своим таймером, и задержка не работает. Её нужно создать один раз (\`useMemo\`, \`useRef\`).
- Задерживать само поле ввода — ввод начинает «залипать».
- Считать, что debounce защищает от гонки ответов.

### 💡 Ключевые выводы
- Поле — мгновенно, сеть — с задержкой.
- Debounce уменьшает число запросов, AbortController защищает от гонки — нужны оба.
- Альтернатива для тяжёлых вычислений без сети — \`useDeferredValue\`.`,

  r8: `### Суть задачи
Починить отправку по Ctrl+Enter: глобальный слушатель видит устаревшее значение \`message\`. Подписка при этом должна создаваться один раз.

### 🔍 Разбор проблемы — устаревшее замыкание (stale closure):
\`\`\`jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) onSend(message); // message === '' навсегда
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
\`\`\`
Эффект выполнился один раз, и \`handleKeyDown\` замкнул \`message\` первого рендера. Если добавить \`message\` в зависимости, баг пропадёт, но слушатель будет переподписываться на каждое нажатие клавиши.

### 🛠 Решение (React 19.2+): useEffectEvent
\`\`\`jsx
const sendMessage = useEffectEvent(() => {
  onSend(message);
  setMessage('');
});

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) sendMessage();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
\`\`\`
Effect Event всегда читает свежие пропсы и состояние, но не считается реактивной зависимостью, поэтому эффект не перезапускается.

### Как это делали до React 19.2 — паттерн «latest ref»:
\`\`\`jsx
const latest = useRef({ message, onSend });
useLayoutEffect(() => {
  latest.current = { message, onSend };
});

// внутри handleKeyDown:
latest.current.onSend(latest.current.message);
\`\`\`

### 💡 Ключевые выводы:
- Функция внутри эффекта видит значения того рендера, в котором эффект был создан.
- «Реактивную» логику (на что подписываемся) отделяйте от «событийной» (что делаем при срабатывании).
- \`useEffectEvent\` вызывают только внутри эффектов; передавать его в пропсы или вызывать при рендере нельзя.`,

  r10: `### Суть задачи
Заменить хранение технического идентификатора таймера (\`timerId\`) в \`useState\` на хук \`useRef\`, устранив паразитный ре-рендер при старте таймера.

### 🔍 Разбор проблемы и почему это ошибка:
В исходном коде:
\`\`\`jsx
const [isRecording, setIsRecording] = useState(false);
const [seconds, setSeconds] = useState(0);
const [timerId, setTimerId] = useState(null); // Ошибка!

const startRecording = () => {
  setIsRecording(true);
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  setTimerId(id); // Вызывает лишний рендер компонента!
};
\`\`\`
\`timerId\` — это служебная техническая переменная. Она не участвует в рендере JSX и пользователю не видна.
- Вызов \`setTimerId(id)\` заставляет React планировать внеочередной ре-рендер и выполнять согласование (reconciliation) виртуального дерева без какой-либо визуальной пользы.
- Использование \`useState\` для изменяемых мутабельных значений, нужных только для сайд-эффектов, является грубым антипаттерном.

### 🛠 Пошаговый рефакторинг:
Используем \`useRef\` для хранения мутабельных значений, изменение которых не должно вызывать перерисовку интерфейса:
\`\`\`jsx
import React, { useState, useRef, useEffect } from 'react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const startRecording = () => {
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // Очистка таймера при размонтировании компонента:
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div>
      <p>Запись: {seconds} сек</p>
      {!isRecording ? (
        <button onClick={startRecording}>Старт</button>
      ) : (
        <button onClick={stopRecording}>Стоп</button>
      )}
    </div>
  );
}
\`\`\`

### 💡 Ключевые выводы:
- **useState vs useRef**: Если данные отображаются в разметке JSX — используйте \`useState\`. Если значение нужно только для технической логики (id таймеров, WebSocket-соединения, флаги, предыдущие значения) — используйте \`useRef\`.
- **Мутация .current не вызывает рендер**: Запись в \`ref.current = value\` происходит синхронно и мгновенно без триггера обновления компонента.`,

  r11: `### Суть задачи
Починить очистку поля поиска и перевести работу с ref на идиоматичный стиль React 19: ref как обычный проп и \`useImperativeHandle\` вместо прямого доступа родителя к DOM.

### 🔍 Разбор проблемы и почему это ошибка:
\`\`\`jsx
const handleClear = () => {
  searchRef.current.value = ''; // пишем прямо в DOM управляемого инпута
  searchRef.current.focus();
};
\`\`\`
- Источник правды у управляемого инпута — состояние \`query\`. Запись в \`.value\` его не меняет: поле выглядит пустым, а \`query\` и счётчик символов хранят старый текст.
- При следующем рендере \`SearchField\` React сверит DOM с состоянием и вернёт старое значение в поле.
- Родитель получил весь DOM-узел и может менять что угодно в обход компонента — инкапсуляция сломана.
- \`forwardRef\` в React 19 больше не нужен: ref приходит обычным пропсом.

### 🛠 Пошаговый рефакторинг:
1. Убираем \`forwardRef\` и принимаем \`ref\` из пропсов.
2. Внутри компонента заводим собственный \`inputRef\` для DOM-узла.
3. Через \`useImperativeHandle\` отдаём наружу только нужные команды: \`focus()\` и \`clear()\`. Метод \`clear()\` меняет состояние, а не DOM.

\`\`\`jsx
const SearchField = ({ placeholder, ref }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      setQuery('');
      inputRef.current?.focus();
    },
  }), []);

  return (
    <div>
      <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
      <span>Символов: {query.length}</span>
    </div>
  );
};

export default function SearchPanel() {
  const searchRef = useRef(null);
  return (
    <div>
      <SearchField ref={searchRef} placeholder="Поиск..." />
      <button onClick={() => searchRef.current?.clear()}>Очистить</button>
    </div>
  );
}
\`\`\`

### 💡 Ключевые выводы:
- **React 19**: функциональные компоненты получают \`ref\` как обычный проп, \`forwardRef\` устарел. В проектах на React 18 и ниже он по-прежнему нужен — это частый вопрос на собеседовании.
- **useImperativeHandle** задаёт узкий публичный контракт компонента вместо выдачи всего DOM-узла.
- **Управляемые поля меняются только через состояние.** Прямая запись в DOM рассинхронизирует UI и данные.`,

  r12: `### Суть задачи
Изолировать модальное окно от родительского DOM-дерева и контекста наложения стилей с помощью \`createPortal\`.

### 🔍 Разбор проблемы и почему это ошибка:
В исходном коде разметка всплывающего модального окна рендерится непосредственно внутри дочернего элемента карточки:
\`\`\`jsx
export default function FeedPost({ post }) {
  ...
  return (
    <div className="feed-post">
      ...
      {isModalOpen && (
        <div className="modal-overlay">...</div>
      )}
    </div>
  );
}
\`\`\`
Если родительский контейнер списка постов имеет CSS-свойства:
- \`overflow: hidden\` или \`overflow: auto\` — модальное окно будет физически обрезано границами карточки.
- \`transform\`, \`filter\` или \`perspective\` — элемент создаёт новый контекст наложения (stacking context), из-за чего модалка с \`position: fixed\` и высоким \`z-index\` окажется перекрыта соседними элементами страницы.

### 🛠 Пошаговый рефакторинг:
Используем \`createPortal\` из пакета \`react-dom\`. Логически модалка остаётся частью компонента \`FeedPost\` (имеет доступ к его пропсам, состоянию и событиям), но физически монтируется в корень страницы (например, в \`document.body\`):
\`\`\`jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function FeedPost({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <button onClick={() => setIsModalOpen(true)}>Поделиться</button>

      {isModalOpen &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Ссылка скопирована!</p>
              <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
            </div>
          </div>,
          document.body // Телепортируем HTML-разметку прямо в body
        )}
    </div>
  );
}
\`\`\`

### 💡 Ключевые выводы:
- **Разделение логической и физической структуры**: Порталы позволяют отрендерить дочерний элемент в совершенно другую часть DOM-дерева без разрыва React-дерева.
- **Всплытие событий (Event Bubbling)**: События, происходящие внутри портала (например, клики), продолжают всплывать по виртуальному дереву React к родительскому компоненту, несмотря на то, что в реальном DOM они находятся в \`document.body\`.`,

  r13: `### Суть задачи
Перевести навигацию приложения на React Router: ссылки, программный переход после отправки формы и чтение параметров URL.

### 🔍 Разбор проблем:
1. \`<a href="/messages">\` — браузер делает полный HTTP-запрос: HTML и бандл загружаются заново, всё состояние в памяти теряется.
2. \`window.location.href = ...\` после создания поста — та же полная перезагрузка, только программная.
3. \`window.location.pathname.split('/').pop()\` — хрупкий ручной парсинг: ломается при query-параметрах, слеше на конце или вложенных роутах и не реагирует на клиентскую навигацию.

### 🛠 Пошаговый рефакторинг:
\`\`\`jsx
import { Link, useNavigate, useParams } from 'react-router-dom';

export function Sidebar() {
  return (
    <nav>
      <Link to="/">Лента</Link>
      <Link to="/messages">Сообщения</Link>
      <Link to="/profile/me">Мой профиль</Link>
    </nav>
  );
}

export function CreatePost() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = await createPost(title);
    navigate(\`/post/\${newPost.id}\`);
  };
  // ...
}

// <Route path="/post/:id" element={<PostPage />} />
export function PostPage() {
  const { id } = useParams();
  return <div>Страница поста ID: {id}</div>;
}
\`\`\`

### 💡 Ключевые выводы:
- **Link** рендерит обычную ссылку (работают Ctrl+клик, SEO и доступность), но перехватывает клик и меняет URL через History API.
- **useNavigate** — для переходов после действий: отправки формы, логина, таймаута.
- **useParams** берёт параметры из описания маршрута, а не из ручного разбора строки.`,

  r15: `### Суть задачи
Код-ревью компонента \`UserPostsList\`: он загружает посты пользователя, фильтрует их по названию и позволяет выбрать пост. На собеседовании важно не только исправить код, но и **назвать проблемы по категориям**.

### 🔍 Карта проблем
| # | Проблема | Категория |
|---|---|---|
| 1 | Нет \`res.ok\`, нет \`catch\`, нет отмены запроса | Надёжность, гонка |
| 2 | \`setInterval\` без \`clearInterval\` | Утечка ресурсов |
| 3 | \`posts.sort()\` в рендере | Мутация state |
| 4 | \`key={index}\` | Реконсиляция |
| 5 | \`handleSelect\` пересоздаётся | Сломанная мемоизация |
| 6 | \`isLoading\` и \`error\` не используются | Мёртвый код, плохой UX |
| 7 | Две одинаковые кнопки в \`PostItem\` | Разметка, доступность |

### 1. Загрузка данных
\`\`\`jsx
// Было
fetch(url).then((r) => r.json()).then((data) => { setPosts(data); setIsLoading(false); });
\`\`\`
- \`fetch\` не отклоняет промис на 404 и 500 — нужна проверка \`response.ok\`.
- Нет \`catch\`: при ошибке сети \`isLoading\` навсегда останется \`true\`, а \`error\` не заполнится.
- При быстрой смене \`userId\` поздний ответ перезапишет посты другого пользователя.

\`\`\`jsx
// Стало
useEffect(() => {
  const controller = new AbortController();

  const loadPosts = async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await fetch(\`.../posts?userId=\${userId}\`, { signal: controller.signal });
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      setPosts(await response.json());
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setStatus('error');
    }
  };

  loadPosts();
  return () => controller.abort();
}, [userId]);
\`\`\`
\`AbortController\` отменяет устаревший запрос и при смене \`userId\`, и при размонтировании. Флаг \`isMounted\` только игнорировал бы ответ — запрос всё равно выполнялся бы.

### 2. Интервал без очистки
\`\`\`jsx
// Было
useEffect(() => {
  setInterval(() => console.log(...), 3000);
}, [userId, posts.length]);
\`\`\`
Эффект перезапускается при каждой загрузке, и каждый запуск добавляет новый интервал. Через минуту в консоль пишут десятки таймеров, а после ухода со страницы они продолжают работать.
\`\`\`jsx
// Стало
useEffect(() => {
  const intervalId = setInterval(() => console.log(...), 3000);
  return () => clearInterval(intervalId);
}, [userId, posts.length]);
\`\`\`
\`useRef\` для id здесь не нужен: интервал живёт внутри одного запуска эффекта, локальной переменной достаточно.

### 3. Мутация в \`sort\`
\`posts.sort(...)\` сортирует массив **на месте**, то есть меняет state прямо во время рендера. Ссылка не меняется — memo и эффекты не видят изменений. Сначала фильтруем: \`filter\` возвращает новый массив, и сортировать можно уже его (заодно сортируется меньше элементов):
\`\`\`jsx
const visiblePosts = posts
  .filter((post) => post.title.toLowerCase().includes(normalizedFilter))
  .sort((a, b) => a.title.localeCompare(b.title)); // сортируется копия, а не state
\`\`\`
Если сортировка нужна без фильтрации — копируйте явно: \`[...posts].sort(...)\` или \`posts.toSorted(...)\` (ES2023).

### 4. Ключи
Список сортируется и фильтруется, поэтому индекс одного и того же поста меняется. С \`key={index}\` React переиспользует не те элементы, и выделение может «перепрыгнуть». Ключ — \`post.id\`.

### 5. Мемоизация
\`PostItem\` обёрнут в \`memo\`, но получает новый \`handleSelect\` на каждом рендере — memo не срабатывает. Стабилизируем через \`useCallback\`:
\`\`\`jsx
const handleSelect = useCallback((id) => setSelectedId(id), []);
\`\`\`
\`useMemo\` для фильтрации десятка постов не нужен — это не узкое место.

### 6. Состояния загрузки и ошибки
Флаги \`isLoading\` и \`error\` были объявлены, но не выводились. Заменяем их одним статусом \`'loading' | 'success' | 'error'\` и показываем каждое состояние.

### 7. Разметка \`PostItem\`
Две кнопки с одинаковым действием сбивают с толку и дублируют элементы для клавиатуры и скринридера. Оставляем одну кнопку выбора, текст поста выводим абзацем, состояние выбора сообщаем через \`aria-pressed\`.

### 💡 Ключевые выводы
- На ревью группируйте находки: надёжность и гонки, утечки, мутации, ключи, мемоизация, UX.
- Исправляйте причину, а не симптом: мутацию — неизменяющими методами, а не \`useMemo\`.
- В продакшене загрузку постов логично отдать TanStack Query: кеш по ключу \`['posts', userId]\` решает гонку, повторы и состояния загрузки.`,

  r16: `# Подробный разбор задачи: рефакторинг компонента Timer

## 1. Что вообще делает этот компонент

Это секундомер:
- кнопка \`Start/Pause\` — запускает или ставит на паузу отсчёт секунд;
- кнопка \`Stop\` — останавливает и сбрасывает счётчик в 0;
- каждые 5 секунд элемент с временем должен "мигать" (класс \`pulsate\`, анимация подключается через CSS).

Задача не в том, чтобы придумать что-то новое, а в том, чтобы **сохранить это же поведение**, но исправить код изнутри — сделать его безопаснее, понятнее и без багов.

---

## 2. Проблема №1: прямая работа с DOM внутри React

### Было
\`\`\`jsx
useEffect(() => {
  if (currentTime % 5 === 0 && currentTime !== 0) {
    document.querySelector(".timer").classList.add("pulsate");
  }
}, [currentTime]);
\`\`\`

### Почему это плохо
React построен на идее: **UI — это функция от состояния** (\`UI = f(state)\`). Ты не должен руками искать элементы на странице и менять им классы через \`document.querySelector\`. Это называется "императивная" работа с DOM, и в React-компонентах она — красный флаг, потому что:

1. React ничего не знает об этом изменении. Он не отслеживает и не контролирует такие правки — это работа "в обход" React.
2. \`document.querySelector(".timer")\` находит **первый** элемент с классом \`.timer\` во всём документе. Если на странице появится второй такой компонент (например, два таймера рядом), баг гарантирован — оба будут ссылаться на один и тот же DOM-узел.
3. Такой код сложно тестировать (юнит-тесты React обычно тестируют состояние/рендер, а не реальный DOM).

### Как исправили
Вместо ручного изменения DOM — заводим **состояние** \`isPulsating\` и подставляем класс через JSX:

\`\`\`jsx
const [isPulsating, setIsPulsating] = useState(false);

// ...

<div className={\`timer\${isPulsating ? " pulsate" : ""}\`}>
  {formatTime(elapsedSeconds)}
</div>
\`\`\`

Теперь класс \`pulsate\` полностью зависит от состояния компонента. React сам решает, когда обновить DOM — а не мы вручную.

**Правило для запоминания:** если ловишь себя на мысли "надо бы найти элемент через \`querySelector\` и поменять ему класс/стиль" — почти всегда это сигнал, что нужно вместо этого завести \`state\`.

---

## 3. Проблема №2: класс \`pulsate\` никогда не убирался

### Было
Класс добавлялся:
\`\`\`js
document.querySelector(".timer").classList.add("pulsate");
\`\`\`
...но нигде в коде не было \`classList.remove("pulsate")\`. То есть один раз на 5-й секунде класс появился — и остался **навсегда**, хотя, судя по названию, \`pulsate\` (пульсация) — это что-то кратковременное, разовая анимация-моргание, а не постоянное состояние.

### Почему это баг
Пользователь видит: секундомер один раз "мигнул" на 5-й секунде и дальше либо висит с этим классом вечно, либо (в зависимости от CSS-анимации) анимация просто перестаёт быть заметна — но класс всё равно "прилип" к элементу зря.

### Как исправили
Добавили включение пульсации **на время**, а потом автоматически её выключаем через \`setTimeout\`:

\`\`\`jsx
const PULSATE_DURATION_MS = 600;

useEffect(() => {
  const shouldPulsate =
    elapsedSeconds !== 0 && elapsedSeconds % PULSATE_EVERY_N_SECONDS === 0;

  if (!shouldPulsate) return;

  setIsPulsating(true);
  const timeoutId = setTimeout(() => {
    setIsPulsating(false);
  }, PULSATE_DURATION_MS);

  return () => clearTimeout(timeoutId); // чистим таймер, если currentTime
                                         // поменяется раньше, чем сработает setTimeout
}, [elapsedSeconds]);
\`\`\`

Логика: как только секунда стала кратна 5 — включаем \`isPulsating\`, запускаем таймер на 600 мс, через 600 мс сами же выключаем. Если эффект запустится заново раньше (значит, время снова изменилось) — предыдущий \`setTimeout\` отменяется через \`return () => clearTimeout(...)\` (это называется **cleanup-функция** эффекта, о ней ниже).

---

## 4. Проблема №3: утечка памяти — интервал не чистится при размонтировании

### Было
\`setInterval\` создавался в \`startHandler\`, но нигде не было проверки: а что если компонент **исчезнет со страницы** (размонтируется), пока таймер всё ещё тикает? Например, пользователь запустил секундомер и тут же ушёл на другую страницу (в SPA-приложении).

В таком случае \`setInterval\` **продолжит работать в фоне**, хотя сам компонент, к которому он относился, уже не существует. Это классическая **утечка памяти** (memory leak) — таймер продолжает вызывать \`setCurrentTime\`, хотя обновлять уже нечего.

### Как исправили
В React для подобных ситуаций (подписки, таймеры, слушатели событий) в \`useEffect\` предусмотрен механизм **cleanup-функции** — она возвращается из \`useEffect\` и автоматически вызывается, когда компонент размонтируется (или перед повторным запуском эффекта):

\`\`\`jsx
useEffect(() => clearTick, []);
\`\`\`

Это короткая запись того же самого:
\`\`\`jsx
useEffect(() => {
  return () => {
    clearTick();
  };
}, []);
\`\`\`

Пустой массив зависимостей \`[]\` означает "выполнить один раз при монтаже", а возвращаемая функция выполнится один раз при размонтировании компонента — именно тогда мы гарантированно чистим интервал, даже если пользователь ушёл со страницы посреди отсчёта.

**Правило для запоминания:** если внутри компонента запускаешь что-то "живущее своей жизнью" — \`setInterval\`, \`setTimeout\`, подписку на событие, WebSocket — почти всегда нужна cleanup-функция в \`useEffect\`, которая это остановит.

---

## 5. Проблема №4: плохие имена переменных и функций

Хорошие имена — это не "красота ради красоты", а способ **не тратить время на разгадывание кода** через полгода (или силами другого разработчика).

| Было | Стало | Почему лучше |
|---|---|---|
| \`intervalId\` (это \`useRef\`, а не id) | \`intervalRef\` | Имя показывает, что это ref-объект, а не число-идентификатор |
| \`currentTime\` | \`elapsedSeconds\` | Это не "текущее время" (не часы дня), а количество прошедших секунд с начала отсчёта |
| \`startHandler\` (стартует **и** ставит на паузу) | \`toggle\` (внутри хука) | Функция реально делает две разные вещи в зависимости от \`started\`, значит, имя должно отражать переключение, а не только "старт" |
| \`stopHandler\` | \`stop\` | После вынесения в хук \`useTimer\` префикс \`Handler\` в названии самого действия избыточен — обработчиком он становится уже в JSX (\`onClick={stop}\`) |

Здесь же разделили ответственность: \`start\`, \`pause\`, \`stop\`, \`toggle\` — это отдельные, маленькие, понятные функции, а не одна большая с \`if/else\` внутри.

---

## 6. Проблема №5: магические числа

### Было
\`\`\`js
setInterval(() => {...}, 1000);
// ...
if (currentTime % 5 === 0 && currentTime !== 0) {...}
\`\`\`
Числа \`1000\` и \`5\` разбросаны по коду без объяснений. Что будет, если дизайнер попросит пульсировать каждые 10 секунд вместо 5? Нужно искать это магическое число по всему файлу и надеяться, что не пропустишь ещё одно такое же число \`5\`, которое означает что-то другое.

### Как исправили
Вынесли всё в именованные константы в начале файла:
\`\`\`js
const TICK_INTERVAL_MS = 1000;        // раз в сколько мс обновляется секундомер
const PULSATE_EVERY_N_SECONDS = 5;    // раз в сколько секунд мигать
const PULSATE_DURATION_MS = 600;      // сколько длится сама вспышка
\`\`\`
Теперь у каждого числа есть **имя, объясняющее его смысл**, и менять поведение — значит поменять одну строчку в одном месте.

---

## 7. Проблема №6: вся логика жила прямо в компоненте

### Было
Компонент \`App\` одновременно отвечал:
- за состояние секундомера (\`started\`, \`currentTime\`);
- за работу с \`setInterval\`;
- за DOM-манипуляции с пульсацией;
- за то, что должно рендериться на экране.

Это слишком много ответственности для одной функции. В программировании есть принцип **Single Responsibility** ("одна функция/модуль должен отвечать за одну вещь") — здесь он был нарушен.

### Как исправили
Всю логику секундомера (не относящуюся к отрисовке) вынесли в отдельный **кастомный хук** \`useTimer\`:

\`\`\`jsx
const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  // ...start, pause, toggle, stop...

  return { isRunning, elapsedSeconds, toggle, stop };
};
\`\`\`

Теперь сам компонент \`App\` выглядит гораздо проще и **читается как описание интерфейса**, а не как реализация таймера:

\`\`\`jsx
const App = () => {
  const { isRunning, elapsedSeconds, toggle, stop } = useTimer();
  // ... логика пульсации ...

  return (
    <main className="main">
      <div className="timer-controls">
        <button onClick={toggle}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={stop}>Stop</button>
      </div>
      <div className={\`timer\${isPulsating ? " pulsate" : ""}\`}>
        {formatTime(elapsedSeconds)}
      </div>
    </main>
  );
};

export default App;
\`\`\`

Плюс такой хук можно переиспользовать в другом компоненте (например, если понадобится ещё один таймер где-то ещё в приложении) — просто вызвать \`useTimer()\` заново, без копирования всей логики.

---

## 8. Проблема №7: неудобное отображение времени

### Было
\`\`\`jsx
<div className="timer">>>> : {currentTime}</div>
\`\`\`
Выводилось просто число секунд подряд: \`0, 1, 2, ... 65, 66...\`. Для секундомера гораздо привычнее видеть формат \`мм:сс\`.

### Как исправили
Написали маленькую чистую функцию-форматтер:

\`\`\`js
const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return \`\${minutes}:\${seconds}\`;
};
\`\`\`

Как это работает:
- \`Math.floor(totalSeconds / 60)\` — сколько целых минут прошло;
- \`totalSeconds % 60\` — остаток секунд сверх этих минут;
- \`.padStart(2, "0")\` — дописывает \`0\` спереди, если число однозначное (\`5\` → \`"05"\`), чтобы всегда было 2 цифры.

65 секунд → \`01:05\`, а не просто \`65\`.

---

## 9. Итоговое сравнение "было / стало"

| Критерий | Было | Стало |
|---|---|---|
| Работа с DOM | напрямую через \`document.querySelector\` | через React state и JSX |
| Класс \`pulsate\` | добавляется и остаётся навсегда | появляется и сам пропадает через \`setTimeout\` |
| Очистка интервала при уходе со страницы | отсутствует (утечка памяти) | есть, через cleanup в \`useEffect\` |
| Имена | \`intervalId\`, \`currentTime\`, \`startHandler\` | \`intervalRef\`, \`elapsedSeconds\`, \`start/pause/toggle/stop\` |
| Магические числа | \`1000\`, \`5\` разбросаны в коде | вынесены в константы \`TICK_INTERVAL_MS\`, \`PULSATE_EVERY_N_SECONDS\` |
| Структура кода | вся логика в одном компоненте | логика вынесена в хук \`useTimer\`, компонент отвечает только за рендер |
| Формат времени | сырое число секунд | \`мм:сс\` |

---

## 10. Что стоит запомнить из этой задачи

1. **Не трогай DOM напрямую в React** — всё, что должно влиять на интерфейс, должно проходить через \`state\`.
2. **Если что-то "включаешь" (класс, флаг) — подумай, кто и когда это выключит.** Баги "включили и забыли выключить" — одни из самых частых.
3. **Любой \`setInterval\`/\`setTimeout\`/подписка внутри компонента почти всегда требует cleanup-функцию** в \`useEffect\`, иначе рискуешь получить утечку памяти после размонтирования.
4. **Имена — это документация.** Хорошее имя переменной/функции экономит время всем, кто будет читать код после тебя (включая тебя самого через месяц).
5. **Магические числа — выноси в константы** с говорящими именами.
6. **Кастомные хуки — способ отделить "что происходит" (логика) от "как это выглядит" (рендер)**, и заодно сделать логику переиспользуемой.`,

  r17: `# Подробный разбор задачи: рефакторинг генератора случайных чисел (Company X)

## 1. Что делает это приложение

Приложение представляет собой интерактивный генератор случайных чисел:
1. Кнопка **«Показать / Скрыть список»** скрывает и отображает компонент со списком чисел.
2. Кнопка **«Новое число»** добавляет в конец списка случайное число от 1 до 10.
3. Кнопка **«Старт»** запускает интервал (1 сек.), автоматически добавляющий новые случайные числа каждую секунду.
4. Кнопка **«Стоп»** останавливает интервал.
5. Рядом с каждым числом должна быть кнопка **«Удалить»**, удаляющая конкретный элемент из списка.

---

## 2. Проблема №1: Список не переключается по кнопке «Показать / Скрыть»

### Было
\`\`\`jsx
const [visibleList, setVisibleList] = React.useState(true);

const toggleVisibleList = () => {
  setVisibleList(visibleList);
};
\`\`\`

### Почему это баг
React выполняет сравнение предыдущего и нового значения состояния через \`Object.is(prevState, nextState)\`. Передача текущего значения \`visibleList\` (например, \`true\` при текущем \`true\`) не регистрирует изменений, и React оптимизирует рендеринг, пропуская его (*bailout*).

### Как исправить
Использовать функциональную форму обновления состояния с инверсией:
\`\`\`jsx
const toggleVisibleList = () => {
  setVisibleList((prev) => !prev);
};
\`\`\`

---

## 3. Проблема №2: Кнопка «Стоп» не останавливает таймер

### Было
\`\`\`jsx
export default function List() {
  const [numbers, setNumbers] = React.useState([1, 2, 3]);
  let timer = null;
  let started = false;

  const addRandomNumber = () => {
    const random = Math.round(Math.random() * 10);
    setNumbers((prev) => [...prev, random]);
  };

  const start = () => {
    timer = setInterval(addRandomNumber, 1000);
    started = true;
  };

  const stop = () => {
    clearInterval(timer);
    started = false;
  };
  // ...
}
\`\`\`

### Почему это баг
При каждом повторном рендере функционального компонента его тело выполняется заново. Локальная переменная \`let timer = null\` пересоздаётся и снова инициализируется значением \`null\`.
Когда таймер делает первый тик и вызывает \`setNumbers\`, происходит перерендер, и ссылка на созданный интервал теряется (\`timer\` снова равен \`null\`). При нажатии на «Стоп» вызывается \`clearInterval(null)\`, а уже запущенный интервал продолжает бесконечно добавлять числа.

Аналогично, \`let started = false\` сбрасывается в \`false\` на каждом рендере, из-за чего кнопки не получают реактивного состояния блокировки.

### Как исправить
1. Хранить идентификатор таймера в рефе: \`const timerRef = React.useRef(null);\`. Реф сохраняет своё значение между рендерами и не вызывает лишних перерисовок при мутации \`timerRef.current\`.
2. Флаг \`started\` перенести в реактивное состояние: \`const [started, setStarted] = React.useState(false);\`.
3. Добавить очистку интервала в \`useEffect\` при размонтировании компонента для предотвращения утечек памяти (*memory leak*).

\`\`\`jsx
const timerRef = React.useRef(null);
const [started, setStarted] = React.useState(false);

const start = () => {
  if (timerRef.current) return;
  timerRef.current = setInterval(addRandomNumber, 1000);
  setStarted(true);
};

const stop = () => {
  clearInterval(timerRef.current);
  timerRef.current = null;
  setStarted(false);
};

React.useEffect(() => {
  return () => clearInterval(timerRef.current);
}, []);
\`\`\`

---

## 4. Проблема №3: Сброс списка к [1, 2, 3] при скрытии и повторном показе

### Было
В \`App.jsx\`:
\`\`\`jsx
{visibleList && <List />}
\`\`\`
А состояние \`numbers\` хранилось внутри \`List.jsx\`:
\`\`\`jsx
export default function List() {
  const [numbers, setNumbers] = React.useState([1, 2, 3]);
  // ...
}
\`\`\`

### Почему это происходило
При \`visibleList === false\` React полностью размонтирует (\`unmount\`) компонент \`<List />\` из Fiber-дерева, уничтожая все его внутренние \`useState\`. При возврате \`visibleList === true\` компонент монтируется с нуля с начальным массивом \`[1, 2, 3]\`.

### Как исправить (Lifting State Up)
Поднять состояние списка (\`numbers\`) и методы работы с ним (\`addRandomNumber\`, \`removeNumber\`) в родительский компонент \`App\`, передавая их в \`<List />\` через пропсы. В этом случае состояние сохраняется на уровне \`App\` независимо от монтирования/размонтирования дочернего \`List\`.

---

## 5. Проблема №4: Нестабильные ключи и удаление элементов

### Было
\`\`\`jsx
{numbers.map((num, index) => (
  <li key={\`\${index}_\${num}\`}>{num}</li>
))}
\`\`\`

### Почему это плохо
1. При удалении элемента из середины массива индексы всех последующих элементов сдвигаются. React сопоставит старые DOM-узлы не с теми элементами.
2. Значения случайных чисел могут повторяться, создавая дублирующиеся ключи.

### Как исправить
Хранить элементы как объекты с уникальным стабильным идентификатором: \`{ id, value }\`.
Для генерации \`id\` можно использовать \`useRef(4)\` (так как начальные id: 1, 2, 3).
\`\`\`jsx
const nextId = React.useRef(4);

const addRandomNumber = React.useCallback(() => {
  const random = Math.floor(Math.random() * 10) + 1;
  const id = nextId.current++; // вне updater: функция-обновление должна быть чистой
  setNumbers((prev) => [...prev, { id, value: random }]);
}, []);

const removeNumber = React.useCallback((id) => {
  setNumbers((prev) => prev.filter((item) => item.id !== id));
}, []);
\`\`\`

И в списке:
\`\`\`jsx
{numbers.map((item) => (
  <li key={item.id}>
    {item.value} <button onClick={() => removeNumber(item.id)}>Удалить</button>
  </li>
))}
\`\`\`

---

## 6. Проблема №5: Блокировка кнопок (Disabled states) и UX

### Было
\`\`\`jsx
<button disabled={started} onClick={onStart}>Старт</button>
<button onClick={onStop}>Стоп</button>
\`\`\`
Кнопка «Стоп» была всегда активна (даже когда таймер не запущен), а «Старт» не блокировалась из-за того, что \`started\` не было состоянием.

### Как исправили
\`\`\`jsx
<button disabled={started} onClick={onStart}>Старт</button>
<button disabled={!started} onClick={onStop}>Стоп</button>
\`\`\`

---

## 7. Вопросы на собеседовании (FAQ)

1. **Почему при вызове \`setVisibleList(visibleList)\` список не скрывается и не раскрывается?**  
   *Ответ:* React сравнивает предыдущее и следующее состояние через \`Object.is(prevState, nextState)\`. Передача того же значения не триггерит ре-рендер (*bailout*). Нужно использовать \`setVisibleList((prev) => !prev)\`.

2. **Почему хранение ID таймера в локальной переменной \`let timer = null\` ломает «Стоп»?**  
   *Ответ:* При каждом рендере функционального компонента локальные переменные инициализируются заново. После обновления состояния \`timer\` становится \`null\`, и \`clearInterval(timer)\` не может остановить фоновый интервал. Нужно использовать \`useRef\`.

3. **Почему \`{visibleList && <List />}\` сбрасывает данные?**  
   *Ответ:* Условный рендеринг размонтирует узел из React Fiber Tree и уничтожает его \`useState\`. Для сохранения данных состояние поднимается в родительский компонент (*Lifting State Up*).

4. **В чём опасность \`key={\`\${index}_\${num}\`}\` при удалении элементов?**  
   *Ответ:* При удалении или изменении порядка индексы сдвигаются. React сопоставляет старые DOM-узлы не с теми элементами списка. Требуется стабильный уникальный \`id\`.

5. **Зачем \`clearInterval\` в функции очистки \`useEffect\`?**  
   *Ответ:* Предотвращает утечки памяти (*memory leaks*) и попытки обновления состояния на размонтированном компоненте при неожиданном закрытии/навигации.`,

  ts1: `### Суть задачи
Создать типобезопасный универсальный переиспользуемый компонент списка \`List<T>\` в React, который сохраняет тип переданных элементов, поддерживает кастомный рендеринг через функцию-колбэк \`renderItem\` и гарантирует извлечение уникального ключа \`getKey\`.

### Пошаговые этапы решения:

1. **Дженерик-тип пропсов \`ListProps<T>\`**:
   Компонент должен работать с массивом любых объектов (пользователи, товары, посты) без потери типизации. Объявляем тип с параметром-дженериком \`T\`:
   \`\`\`tsx
   type ListProps<T> = {
     items: T[];
     renderItem: (item: T) => React.ReactNode;
     getKey: (item: T) => React.Key;
   };
   \`\`\`
   - \`items: T[]\` — массив исходных элементов произвольного типа.
   - \`renderItem: (item: T) => React.ReactNode\` — функция рендера элемента, возвращающая валидное для React содержимое.
   - \`getKey: (item: T) => React.Key\` — функция для извлечения стабильного уникального ключа (\`string | number | bigint\`).

2. **Объявление компонента как дженерик-функции**:
   \`\`\`tsx
   export function List<T>({ items, renderItem, getKey }: ListProps<T>) {
     return (
       <ul>
         {items.map((item) => (
           <li key={getKey(item)}>{renderItem(item)}</li>
         ))}
       </ul>
     );
   }
   \`\`\`

3. **Автоматический вывод типов потребителем**:
   При передаче массива объектов TypeScript самостоятельно выводит тип \`T\` из структуры массива:
   \`\`\`tsx
   <List
     items={users}
     getKey={(user) => user.id}
     // user автоматически типизирован как { id: number; name: string; role: string; }
     renderItem={(user) => <span>{user.name} ({user.role})</span>}
   />
   \`\`\`

### Ключевые выводы:
- Дженерик-компоненты позволяют повторно использовать единую UI-логику списков и таблиц со строгим автодополнением и проверкой типов.
- В стрелочных функциях внутри TSX файлов синтаксис требует запятой \`<T,>\`, чтобы компилятор не путал объявление дженерика с открывающим JSX-тегом.
- Тип \`React.Key\` является стандартным типом для \`key\` в React (\`string | number | bigint\`).`,

  ts2: `### Суть задачи
Создать полиморфный компонент \`Button\`, который через проп \`as\` может рендериться как кнопка (\`<button>\`), ссылка (\`<a>\`) или любой другой HTML-элемент/компонент с автоматической поддержкой и проверкой соответствующих нативных HTML-атрибутов.

### Пошаговые этапы решения:

1. **Определение параметра \`ElementType\`**:
   Объявляем дженерик \`E extends React.ElementType = 'button'\`, ограничивающий параметр валидными HTML-тегами и компонентами React (по умолчанию \`'button'\`):
   \`\`\`tsx
   type ButtonOwnProps<E extends React.ElementType = 'button'> = {
     as?: E;
     children: React.ReactNode;
   };
   \`\`\`

2. **Комбинация собственных пропсов с нативными атрибутами через \`Omit\`**:
   Используем утилиту \`React.ComponentPropsWithoutRef<E>\` для извлечения всех стандартных атрибутов целевого тега, исключая совпадающие имена из \`ButtonOwnProps\`:
   \`\`\`tsx
   type ButtonProps<E extends React.ElementType = 'button'> = ButtonOwnProps<E> &
     Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;
   \`\`\`

3. **Реализация полиморфного рендеринга**:
   Присваиваем \`as\` динамической переменной с заглавной буквы \`Component\`, чтобы JSX воспринял её как компонент, и пробрасываем оставшиеся свойства:
   \`\`\`tsx
   export function Button<E extends React.ElementType = 'button'>({
     as,
     children,
     ...rest
   }: ButtonProps<E>) {
     const Component = as || 'button';
     return <Component {...rest}>{children}</Component>;
   }
   \`\`\`

### Ключевые выводы:
- Полиморфизм позволяет сохранять единую визуальную стилизацию дизайн-системы, адаптируя семантическую разметку под SEO и a11y (кнопки для действий, ссылки для навигации).
- \`ComponentPropsWithoutRef<E>\` автоматически предоставляет атрибуты вроде \`href\`, \`target\` для тега \`a\` или \`disabled\`, \`type\` для \`button\`.
- \`Omit\` защищает от конфликтов имён между кастомными пропсами и стандартными HTML-атрибутами.`,

  ts3: `### Суть задачи
Обеспечить строгую типизацию синтетических событий React (\`SyntheticEvent\`) в интерактивных формах: изменение полей ввода, выбор файлов, обработка горячих клавиш и отправка формы без \`any\`.

### Пошаговые этапы решения:

1. **Событие текстового ввода — \`React.ChangeEvent<HTMLInputElement>\`**:
   \`\`\`tsx
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setText(e.target.value);
   };
   \`\`\`

2. **Событие выбора файла — работа с \`FileList\`**:
   Свойство \`files\` у \`HTMLInputElement\` имеет тип \`FileList | null\`. Перед чтением обязательно проверяем его наличие:
   \`\`\`tsx
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (files && files.length > 0) {
       setFileName(files[0].name);
     }
   };
   \`\`\`

3. **События клавиатуры — \`React.KeyboardEvent<HTMLInputElement>\`**:
   Типизация даёт безопасный доступ к \`e.key\`, \`e.code\`, \`e.altKey\`, \`e.ctrlKey\`:
   \`\`\`tsx
   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Enter') {
       console.log('Enter pressed:', text);
     }
   };
   \`\`\`

4. **Событие отправки формы — \`React.SubmitEvent<HTMLFormElement>\`** (в старом коде — \`React.FormEvent\`, в @types/react 19 он помечен устаревшим):
   \`\`\`tsx
   const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
     e.preventDefault();
     alert(\`Отправлено: \${text}\`);
   };
   \`\`\`

### Ключевые выводы:
- React использует собственную кроссбраузерную обертку событий \`React.SyntheticEvent\`.
- Передача целевого DOM-элемента в дженерик (например, \`React.ChangeEvent<HTMLInputElement>\`) дает точную типизацию \`e.target\`.
- Для инпутов файлов всегда учитывайте, что \`files\` может быть \`null\` при отмене выбора пользователем.`,

  ts4: `### Суть задачи
Спроектировать типы пользователей так, чтобы невозможные комбинации полей не компилировались, и безопасно отрисовать каждый вариант.

### 🛠 Решение
**1. Discriminated union**
\`\`\`tsx
type BaseUser = { id: number; name: string };
type AdminUser = BaseUser & { role: 'admin'; permissions: string[] };
type EmployeeUser = BaseUser & { role: 'employee'; department: string };
type GuestUser = BaseUser & { role: 'guest' };

type User = AdminUser | EmployeeUser | GuestUser;
\`\`\`
У каждого варианта свой набор полей, а \`role\` — общий дискриминант. «Гость с правами администратора» теперь просто не скомпилируется.

**2. Сужение и проверка полноты**
\`\`\`tsx
function assertNever(value: never): never {
  throw new Error(\`Необработанный вариант: \${JSON.stringify(value)}\`);
}

switch (user.role) {
  case 'admin':
    return <p>Права: {user.permissions.join(', ')}</p>; // user: AdminUser
  case 'employee':
    return <p>Отдел: {user.department}</p>;            // user: EmployeeUser
  case 'guest':
    return <p>Гость: {user.name}</p>;
  default:
    return assertNever(user);
}
\`\`\`
Если в union добавят роль \`'manager'\` и забудут \`case\`, в \`default\` попадёт не \`never\`, и TypeScript покажет ошибку. Без этой проверки новая роль молча отобразилась бы как «гость».

**3. Type guard — там, где сужение не выводится само**
\`\`\`tsx
function isAdmin(user: User): user is AdminUser {
  return user.role === 'admin';
}

const permissions = users.filter(isAdmin).flatMap((admin) => admin.permissions);
\`\`\`
Внутри \`switch\` guard не нужен. Он полезен для \`filter\` и переиспользуемых проверок.

### ⚠️ Частые ошибки
- Один тип с опциональными полями — невозможные состояния разрешены.
- Ветка «иначе» без проверки полноты — новые варианты проглатываются молча.
- \`as AdminUser\` вместо сужения — компилятор перестаёт помогать.

### 💡 Ключевые выводы
- Моделируйте данные так, чтобы невозможные состояния были непредставимы.
- \`switch\` по дискриминанту + \`assertNever\` — стандарт обработки union.`,

  ts5: `### Суть задачи
Использование стандартных утилитных типов TypeScript (\`Omit\`, \`Pick\`, \`Record\`) для преобразования серверных DTO-моделей в пропсы UI-компонентов и создания исчерпывающих словарей конфигураций.

### Пошаговые этапы решения:

1. **Исключение приватных полей через \`Omit\`**:
   Создаём пропсы для публичной карточки пользователя, исключив системные поля \`internalId\` и \`passwordHash\`:
   \`\`\`tsx
   export type FullUserProfile = {
     id: number;
     internalId: string;
     name: string;
     email: string;
     passwordHash: string;
     status: 'active' | 'pending' | 'banned';
   };

   export type UserCardProps = Omit<FullUserProfile, 'internalId' | 'passwordHash'>;
   \`\`\`

2. **Исчерпывающий словарь статусов через \`Record\`**:
   \`Record<K, T>\` проверяет, что объект содержит свойства ДЛЯ ВСЕХ вариантов статуса из объединения:
   \`\`\`tsx
   const STATUS_LABELS: Record<FullUserProfile['status'], { label: string; color: string }> = {
     active: { label: 'Активен', color: 'green' },
     pending: { label: 'Ожидает подтверждения', color: 'orange' },
     banned: { label: 'Заблокирован', color: 'red' },
   };
   \`\`\`

3. **Рендеринг компонента**:
   \`\`\`tsx
   export function UserCard(props: UserCardProps) {
     const statusInfo = STATUS_LABELS[props.status];
     return (
       <div>
         <h4>{props.name} ({props.email})</h4>
         <p style={{ color: statusInfo.color }}>Статус: {statusInfo.label}</p>
       </div>
     );
   }
   \`\`\`

### Ключевые выводы:
- \`Omit<T, K>\` и \`Pick<T, K>\` позволяют соблюдать принцип DRY (Don't Repeat Yourself), строя пропсы на основе единого источника правды (моделей домена).
- \`Record<Keys, Value>\` обеспечивает проверку на полноту (Exhaustiveness checking): при добавлении нового статуса (например, \`'suspended'\`) TypeScript выдаст ошибку компиляции, пока разработчик не добавит его обработку в \`STATUS_LABELS\`.`,

  ts6: `### Суть задачи
Корректно типизировать возвращаемое значение пользовательского хука \`useToggle\` с использованием конструкции \`as const\`, получив строгий неизменяемый кортеж (Tuple), как в \`useState\`.

### Пошаговые этапы решения:

1. **Логика хука-переключателя**:
   Хук должен поддерживать как инверсию значения без аргументов, так и принудительную установку \`true\` / \`false\`:
   \`\`\`tsx
   export function useToggle(initialValue = false) {
     const [value, setValue] = useState<boolean>(initialValue);

     const toggle = (nextValue?: boolean) => {
       if (typeof nextValue === 'boolean') {
         setValue(nextValue);
       } else {
         setValue((prev) => !prev);
       }
     };

     return [value, toggle] as const;
   }
   \`\`\`

2. **Зачем нужен \`as const\`**:
   Без \`as const\` TypeScript выводит тип возвращаемого значения как массив \`(boolean | ((nextValue?: boolean) => void))[]\`. При деструктуризации \`const [isOn, toggle] = useToggle()\` переменная \`isOn\` получила бы тип \`boolean | Function\`, а \`toggle\` не могла бы быть вызвана без предварительной проверки.
   Конструкция \`as const\` фиксирует позиции и типы элементов: \`readonly [boolean, (nextValue?: boolean) => void]\`.

3. **Использование в компоненте**:
   \`\`\`tsx
   const [isOn, toggle] = useToggle(false);
   // isOn строго boolean
   // toggle строго (nextValue?: boolean) => void
   \`\`\`

### Ключевые выводы:
- \`as const\` (const assertion) превращает массив в неизменяемый кортеж с точными типами на каждой позиции.
- Это стандартный паттерн для всех React-хуков, возвращающих пару \`[значение, функция]\`.`,

  ts7: `### Суть задачи
Спроектировать типобезопасный контекст авторизации, который нельзя случайно использовать вне провайдера.

### 🛠 Решение
**1. Тип значения и контекст с \`null\`**
\`\`\`tsx
export type AuthContextType = {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
\`\`\`
\`null\` означает «провайдера нет». Заглушка вроде \`{ login: () => {} }\` скрыла бы ошибку.

**2. Провайдер со стабильным \`value\`**
\`\`\`tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const login = useCallback((name: string) => setUser(name), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<AuthContextType>(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
\`\`\`
- Объект в JSX был бы новым на каждом рендере и перерисовывал бы всех потребителей.
- В React 19 контекст сам является провайдером: \`<AuthContext value={...}>\`.

**3. Хук с проверкой**
\`\`\`tsx
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  return context;
}
\`\`\`
После проверки TypeScript сужает тип до \`AuthContextType\` — потребители работают без \`?.\` и проверок на \`null\`.

### ⚠️ Частые ошибки
- \`createContext<AuthContextType>({} as AuthContextType)\` — приведение обманывает компилятор.
- Экспорт самого контекста и прямой \`useContext\` в компонентах — проверку легко забыть.
- Немемоизированный \`value\` в контексте, который читает всё приложение.

### 💡 Ключевые выводы
- Контекст + провайдер + хук с проверкой — стандартная тройка для любого контекста.
- Типы помогают, только если их не обходить приведениями.`,

  ts8: `### Суть задачи
Разобрать фундаментальные отличия типов \`React.ReactNode\`, \`React.ReactElement\` и утилиты \`React.PropsWithChildren<T>\` при проектировании компонентных интерфейсов.

### Пошаговые этапы решения:

1. **\`React.ReactElement\` — строгий инстанс JSX-элемента**:
   Используется, когда проп ДОЛЖЕН быть строго JSX-элементом (например, компонент иконки, аватарки или кнопки-действия), а не произвольным текстом или числом:
   \`\`\`tsx
   type CardHeaderProps = {
     title: string;
     icon: React.ReactElement;
   };

   export function CardHeader({ title, icon }: CardHeaderProps) {
     return (
       <div>
         {icon}
         <h3>{title}</h3>
       </div>
     );
   }
   \`\`\`

2. **\`React.PropsWithChildren<T>\` и \`React.ReactNode\`**:
   \`React.PropsWithChildren<T>\` автоматически примешивает опциональный \`children?: React.ReactNode\`:
   \`\`\`tsx
   type CardProps = React.PropsWithChildren<{
     className?: string;
   }>;

   export function Card({ children }: CardProps) {
     return <div className="card">{children}</div>;
   }
   \`\`\`

3. **Иерархия типов**:
   - \`JSX.Element\` / \`React.ReactElement\` — это объект описания виртуального DOM (результат вызова \`React.createElement\` или JSX-тега).
   - \`React.ReactNode\` — суперсет, включающий: \`ReactElement\`, \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`ReactFragment\`, \`ReactPortal\`.

### Ключевые выводы:
- Для слотов контента общего назначения (\`children\`, подвалы, модалки) всегда используйте \`React.ReactNode\` или \`PropsWithChildren\`.
- Для слотов, требующих строго переданный JSX-компонент для клонирования (\`React.cloneElement\`) или строгой разметки, используйте \`React.ReactElement\`.`,

  ts9: `### Суть задачи
Спроектировать типы состояния и действий редьюсера так, чтобы противоречивые комбинации данных были невозможны.

### 🛠 Решение
**1. Состояние — union по статусу**
\`\`\`tsx
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; error: string };
\`\`\`
Нет «загрузки с ошибкой» и «данных при ошибке»: каждое состояние несёт только свои поля.

**2. Действия — union с привязанным payload**
\`\`\`tsx
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: string[] }
  | { type: 'FETCH_ERROR'; payload: string };
\`\`\`

**3. Редьюсер с проверкой полноты**
\`\`\`tsx
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload };
    case 'FETCH_ERROR':
      return { status: 'error', error: action.payload };
    default: {
      const unhandled: never = action;
      throw new Error(\`Неизвестное действие: \${JSON.stringify(unhandled)}\`);
    }
  }
}
\`\`\`
Добавят действие и забудут \`case\` — ошибка компиляции, а не тихий \`return state\`.

**4. Рендер с сужением**
\`\`\`tsx
{state.status === 'success' && (
  <ul>
    {state.data.map((post) => <li key={post}>{post}</li>)}
  </ul>
)}
\`\`\`
\`state.data\` доступна только в ветке \`'success'\` — обратиться к ней раньше времени не получится.

### ⚠️ Частые ошибки
- \`{ loading: boolean; data?: string[]; error?: string }\` — невозможные состояния разрешены.
- \`payload: any\` в действиях.
- \`default: return state\` без проверки \`never\`.

### 💡 Ключевые выводы
- Union по статусу — главный приём моделирования асинхронных состояний.
- Проверка \`never\` превращает «забыли обработать» в ошибку компиляции.`,

  ts10: `### Суть задачи
Спроектировать интерфейс пропсов компонента \`StatusBadge\` так, чтобы на уровне компилятора TypeScript запретить одновременную передачу взаимоисключающих пропсов (например, числового счётчика \`count\` и флага точки \`dot\`).

### Пошаговые этапы решения:

1. **Использование типа \`never\` для запрещённых свойств**:
   Описываем два взаимоисключающих режима:
   \`\`\`tsx
   type CountMode = {
     count: number;
     dot?: never;
   };

   type DotMode = {
     dot: boolean;
     count?: never;
   };

   export type StatusBadgeProps = CountMode | DotMode;
   \`\`\`
   - В режиме \`CountMode\` свойство \`dot\` помечено как \`dot?: never\`. Это означает, что его нельзя передать.
   - В режиме \`DotMode\` свойство \`count\` помечено как \`count?: never\`.

2. **Проверка свойств в компоненте**:
   Используем оператор \`in\` для безопасного сужения пропсов:
   \`\`\`tsx
   export function StatusBadge(props: StatusBadgeProps) {
     if ('dot' in props && props.dot) {
       return <span className="badge-dot" />;
     }

     if ('count' in props && props.count !== undefined) {
       return <span className="badge-count">{props.count}</span>;
     }

     return null;
   }
   \`\`\`

3. **Результат валидации TypeScript**:
   \`\`\`tsx
   <StatusBadge count={5} />        //  Корректно
   <StatusBadge dot={true} />       //  Корректно
   <StatusBadge count={5} dot />    //  Ошибка TypeScript: Types of property 'dot' are incompatible
   \`\`\`

### Ключевые выводы:
- Паттерн \`key?: never\` в составе объединения типов — мощный способ проектирования дизайн-систем, предотвращающий конфликты пропсов.
- Оператор \`in\` позволяет TypeScript безопасно сужать типы при работе с опциональными свойствами объединений.`,

  ts11: `### Суть задачи
Сохранить generic-тип \`<T>\` опций в компоненте \`Select\` и пробросить \`ref\` на нативный \`<select>\` без \`forwardRef\`, \`any\` и приведений типов.

### 🔍 Почему исходный код плох:
- \`forwardRef\` возвращает \`ForwardRefExoticComponent<P>\` с фиксированными пропсами, и generic-параметр теряется. Поэтому автор написал \`SelectProps<any>\`.
- \`e.target.value as any\` скрывает реальную ошибку: значение в DOM всегда строка. Для опций \`true\` / \`false\` в \`onChange\` придут строки \`"true"\` / \`"false"\`.

### Пошаговые этапы решения:
1. **ref — обычный проп (React 19)**: описываем его прямо в типе пропсов.
   \`\`\`tsx
   export type SelectProps<T> = {
     options: Option<T>[];
     value: T;
     onChange: (value: T) => void;
     ref?: React.Ref<HTMLSelectElement>;
   };
   \`\`\`
2. **Обычная generic-функция**: без обёртки тип \`T\` выводится из пропсов в месте использования.
3. **Индекс вместо строки**: в \`<option>\` кладём индекс, а настоящее значение берём из массива — так компонент работает с любыми \`T\` без приведений.
   \`\`\`tsx
   export function Select<T>({ options, value, onChange, ref }: SelectProps<T>) {
     const selectedIndex = options.findIndex((option) => option.value === value);

     return (
       <select
         ref={ref}
         value={selectedIndex}
         onChange={(e) => onChange(options[Number(e.target.value)].value)}
       >
         {options.map((option, index) => (
           <option key={option.label} value={index}>
             {option.label}
           </option>
         ))}
       </select>
     );
   }
   \`\`\`
4. **Использование**: \`<Select options={THEME_OPTIONS} value={theme} onChange={setTheme} />\` — \`T\` выводится как \`Theme\`, а опция со значением \`'blue'\` станет ошибкой компиляции.

### Как это делали до React 19:
\`\`\`tsx
export const Select = forwardRef(SelectInner) as <T>(
  props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> }
) => React.ReactElement;
\`\`\`
Приведение сигнатуры возвращало generic, но это обход типов. В React 19 он не нужен, однако в legacy-коде встречается часто.

### Ключевые выводы:
- В React 19 generic-компонент с ref — это просто generic-функция с \`ref\` в пропсах.
- \`e.target.value\` всегда строка: не приводите её к \`T\`, а восстанавливайте значение из исходных данных.`,

  ts12: `### Суть задачи
Исправить ошибки компиляции, которые появились после обновления на \`@types/react\` 19, и разобраться, что изменилось в типизации ref.

### 🔍 Какие ошибки выдаёт TypeScript:
1. \`useRef<HTMLInputElement>()\` и \`useRef<number>()\` — *Expected 1 arguments, but got 0*. В React 19 убрали перегрузку \`useRef\` без аргумента.
2. \`ref={(node) => (panelRef.current = node)}\` — стрелка без фигурных скобок неявно возвращает узел. В React 19 ref callback может вернуть cleanup-функцию, поэтому любой другой возврат — ошибка типов.
3. После исправления п. 1 появится \`inputRef.current.focus()\` — *'inputRef.current' is possibly 'null'*.

### Пошаговые этапы решения:
1. **Явное начальное значение**:
   \`\`\`tsx
   const inputRef = useRef<HTMLInputElement>(null); // RefObject<HTMLInputElement | null>
   const timerRef = useRef<number | null>(null);    // current можно перезаписывать
   \`\`\`
   В React 19 \`RefObject.current\` больше не readonly, а \`MutableRefObject\` объявлен устаревшим.
2. **Ref callback с cleanup**: подключаем \`ResizeObserver\` и возвращаем функцию отключения.
   \`\`\`tsx
   const measurePanel = useCallback((node: HTMLDivElement) => {
     const observer = new ResizeObserver(([entry]) => {
       setWidth(Math.round(entry.contentRect.width));
     });
     observer.observe(node);
     return () => observer.disconnect();
   }, []);

   <div ref={measurePanel}>...</div>
   \`\`\`
   \`useCallback\` нужен, чтобы колбэк не пересоздавался: новая функция на каждом рендере заставит React вызывать cleanup и подключать наблюдатель заново.
3. **Безопасный таймер**:
   \`\`\`tsx
   const startTimer = () => {
     if (timerRef.current !== null) return;
     timerRef.current = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
   };

   const stopTimer = () => {
     if (timerRef.current === null) return;
     clearInterval(timerRef.current);
     timerRef.current = null;
   };

   useEffect(() => {
     return () => {
       if (timerRef.current !== null) clearInterval(timerRef.current);
     };
   }, []);
   \`\`\`
4. **Проверка на null**: \`inputRef.current?.focus()\`.

### Ключевые выводы:
- В React 19 \`useRef\` всегда требует аргумент; для DOM-ссылок передаём \`null\`.
- Одного \`RefObject\` достаточно и для DOM, и для мутируемых значений — разделение на \`MutableRefObject\` ушло в прошлое.
- Ref callback может возвращать cleanup-функцию. Поэтому неявный возврат из стрелки (\`(n) => (ref.current = n)\`) теперь ошибка.`,

  tsp1: `### Суть задачи
Загрузить данные из сетевого API при монтировании компонента, корректно обработать состояния загрузки и ошибки — на TypeScript, с полной типизацией данных, состояния и ошибок.

### 🛠 Пошаговые этапы решения:

1. **Типизация формы данных с сервера**:
Описываем \`interface User\`, отражающий структуру объекта, который приходит из jsonplaceholder.typicode.com/users. Это даёт автокомплит на user.name / user.id и защищает от опечаток в полях на этапе компиляции, а не в рантайме.

\`\`\`ts
interface User {
  id: number;
  name: string;
  email: string;
}
\`\`\`

2. **status как union type, а не произвольная строка**:
В JS-версии status мог принять любую строку, включая опечатку вроде "succes", и TS про это ничего бы не сказал. В TS описываем допустимые значения явно:

\`\`\`ts
type Status = "loading" | "success" | "error";

// Запрос стартует при монтировании, поэтому начальный статус — "loading"
const [status, setStatus] = useState<Status>("loading");
\`\`\`

Теперь setStatus("succes") — это ошибка компиляции, а не баг, который проявится только в рантайме на проде.

3. **Явный возвращаемый тип у функции запроса**:
fetchUsers типизируется как \`Promise<User[]>\`. Если в какой-то ветке функция вернёт не тот тип (например, забудут return, и получится undefined), TS укажет на это сразу в редакторе.

\`\`\`ts
const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error(\`HTTP: \${res.status}\`);
  }
  return res.json();
};
\`\`\`

4. **Типизация состояния users**:

\`\`\`ts
const [users, setUsers] = useState<User[]>([]);
\`\`\`

Без дженерика TS вывел бы тип из начального значения [] как never[], и любой setUsers(data) с реальными данными подсветился бы ошибкой. Явный User[] фиксирует правильный тип сразу.

5. **Типизация ошибки в catch — ключевое отличие от JS-версии**:
В TS (при включённом useUnknownInCatchVariables, который в TS 4.4+ включён по умолчанию) переменная в catch имеет тип unknown, а не any. Обращение к e.message напрямую не скомпилируется — нужна проверка типа:

\`\`\`ts
} catch (e) {
  setError(e instanceof Error ? e.message : "Неизвестная ошибка");
  setStatus("error");
}
\`\`\`

Это не формальность: throw в JS может кинуть что угодно — строку, объект, undefined — и слепое обращение к .message в рантайме упадёт, если поймали не Error. TS заставляет обработать этот случай явно.

6. **Остальная логика — без изменений относительно JS-версии**:
Внутренняя async-функция внутри useEffect, проброс ошибки из fetchUsers через throw вместо проглатывания, отдельный state для текста ошибки, отображение по status — все эти решения из предыдущего разбора остаются в силе, TS их не меняет, а только защищает типами.

### 💡 Ключевые выводы:
- Типизируйте форму серверных данных через interface/type — это не бюрократия, а защита от опечаток в полях и от неожиданной формы ответа API.
- Заменяйте свободную строку в status на union type ("loading" | "success" | "error") — TS не даст присвоить туда опечатку или несуществующее значение.
- В catch (e) переменная имеет тип unknown, а не any — всегда проверяйте e instanceof Error перед обращением к .message.
- Указывайте явный возвращаемый тип у async-функций (Promise<User[]>) — так TS ловит несоответствие формы данных ещё на этапе написания кода, а не после первого реального запроса.`,

  tsp2: `### Суть задачи
Перевести RefetchImage на TypeScript: типы пропсов и статусов, типизированные рефы и асинхронный обработчик без утечек памяти.

### 🛠 Решение
**1. Типы**
\`\`\`ts
export interface TGalleryImage {
  src: string;
  alt?: string;
}

export type TRefetchImageProps = TGalleryImage;
export type TStatus = 'idle' | 'loading' | 'success' | 'error';
\`\`\`

**2. Типизированные рефы для технических ресурсов**
\`\`\`ts
const objectUrlRef = useRef<string | null>(null);
const controllerRef = useRef<AbortController | null>(null);
\`\`\`

**3. Обработчик**
\`\`\`ts
const handleRefetch = async (): Promise<void> => {
  controllerRef.current?.abort();
  const controller = new AbortController();
  controllerRef.current = controller;
  setStatus('loading');

  try {
    const response = await fetch(src, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const blob: Blob = await response.blob();
    if (controller.signal.aborted) return;

    const nextUrl = URL.createObjectURL(blob);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = nextUrl;
    setImageSrc(nextUrl);
    setStatus('success');
  } catch (error: unknown) {
    if (controller.signal.aborted) return;
    setStatus('error');
  }
};
\`\`\`

**4. Очистка при размонтировании**
\`\`\`ts
useEffect(() => {
  return () => {
    controllerRef.current?.abort();
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  };
}, []);
\`\`\`
Если компонент размонтировали во время загрузки, запрос отменяется, и новый blob-URL не создаётся — иначе его никто не освободил бы.

### ⚠️ Частые ошибки
- \`useRef()\` без аргумента — в @types/react 19 это ошибка компиляции.
- Нет \`revokeObjectURL\` или нет отмены запроса при размонтировании.
- \`catch (e)\` с обращением к \`e.message\` без проверки типа.

### 💡 Ключевые выводы
- TypeScript не защищает от утечек ресурсов — это зона ответственности логики очистки.
- Типизация рефов с \`| null\` честно описывает «ресурса может не быть».`,

  tsp3: `### Суть задачи
Перевести PostsManager (загрузка постов, локальное добавление, удаление) на TypeScript: модели данных, пропсы, состояния и события.

### 🛠 Решение
**1. Модели данных**
\`\`\`ts
export interface Post {
  id: number | string;
  title: string;
  body?: string;
}

export interface LocalPost extends Post {
  isLocal?: boolean;
}
\`\`\`
Серверные посты приходят с числовым \`id\`, локальные получают UUID — тип отражает оба источника.

**2. Пропсы и состояния**
\`\`\`ts
export interface PostsManagerProps {
  url: string;
}

export type TStatus = 'loading' | 'success' | 'error';

const [posts, setPosts] = useState<LocalPost[]>([]);
const [status, setStatus] = useState<TStatus>('loading');
const [error, setError] = useState<string | null>(null);
\`\`\`
Без дженерика \`useState([])\` вывел бы \`never[]\`.

**3. Загрузка**
\`\`\`ts
useEffect(() => {
  const controller = new AbortController();
  const loadPosts = async (): Promise<void> => {
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      const data: Post[] = await response.json();
      setPosts(data.slice(0, POSTS_LIMIT));
      setStatus('success');
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Не удалось загрузить посты');
      setStatus('error');
    }
  };
  loadPosts();
  return () => controller.abort();
}, [url]);
\`\`\`
- \`response.json()\` возвращает \`any\`: аннотация \`Post[]\` — обещание компилятору, а не проверка. Для настоящей гарантии данные валидируют (Zod, Valibot).
- Ошибка в \`catch\` имеет тип \`unknown\` — сначала \`instanceof Error\`.

**4. События**
\`\`\`ts
const addPost = (e: React.SubmitEvent<HTMLFormElement>): void => {
  e.preventDefault();
  // ...
};

const deletePost = (id: LocalPost['id']): void => {
  setPosts((prev) => prev.filter((post) => post.id !== id));
};
\`\`\`
\`LocalPost['id']\` — индексный доступ к типу: при изменении модели параметр обновится сам.

### ⚠️ Частые ошибки
- \`useState([])\` без дженерика.
- \`catch (e: any)\` и обращение к \`e.message\` без проверки.
- \`React.FormEvent\` — в @types/react 19 устарел.

### 💡 Ключевые выводы
- Типы моделей, пропсов и состояний описываются один раз и переиспользуются через \`extends\` и индексный доступ.
- Граница с сетью — место для рантайм-валидации, а не только аннотаций.`,

  w32: `### Суть задачи
Перенести логику счётчика с шагом из компонента в чистую функцию \`reducer\` и менять состояние только через \`dispatch\`.

### Пошаговые этапы решения:
1. **Начальное состояние** — один объект: \`{ count: 0, step: 1 }\`.
2. **Reducer** описывает все переходы в одном месте:
\`\`\`jsx
const reducer = (state, action) => {
  switch (action.type) {
    case "increment": return { ...state, count: state.count + state.step };
    case "decrement": return { ...state, count: state.count - state.step };
    case "setStep":   return { ...state, step: action.payload };
    case "reset":     return initialState;
    default: throw new Error(\`Неизвестное действие: \${action.type}\`);
  }
};
\`\`\`
3. **Компонент** только сообщает, что произошло: \`dispatch({ type: "increment" })\`.

### Ключевые выводы:
- Reducer — чистая функция: никаких запросов, таймеров и мутаций.
- Ошибка на неизвестный тип действия сразу показывает опечатку в \`dispatch\`.
- useReducer удобен, когда переходов много или новое состояние зависит от нескольких полей.`,

  w33: `### Суть задачи
Передать тему оформления компонентам на разной глубине через Context, чтобы промежуточный \`Layout\` не пробрасывал пропсы.

### Пошаговые этапы решения:
1. Создаём контекст: \`export const ThemeContext = createContext(null);\`
2. Оборачиваем дерево в провайдер (в React 19 контекст сам является провайдером):
\`\`\`jsx
<ThemeContext value={{ theme, toggleTheme }}>
  <Layout />
</ThemeContext>
\`\`\`
3. Читаем значение через хук-обёртку с понятной ошибкой:
\`\`\`jsx
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme должен вызываться внутри ThemeContext.Provider");
  return context;
};
\`\`\`

### Ключевые выводы:
- Context решает prop drilling для данных, нужных многим компонентам: тема, локаль, пользователь.
- Значение по умолчанию \`null\` плюс проверка в хуке ловит использование вне провайдера.
- Все потребители перерисовываются при смене \`value\` — для часто меняющихся данных это важно (см. задачу про лишние ререндеры из-за Context).`,

  w34: `### Суть задачи
Сбросить черновик сообщения при смене собеседника без \`useEffect\`.

### 🔍 Почему черновик «переезжает»:
React хранит состояние по **позиции** компонента в дереве. \`<Chat>\` остаётся на том же месте и того же типа, поэтому React считает его тем же экземпляром: меняются пропсы, а \`useState\` сохраняет значение.

### 🛠 Решение:
\`\`\`jsx
<Chat key={activeContact.id} contact={activeContact} />
\`\`\`
Новый \`key\` — это новый компонент с точки зрения React: старый экземпляр размонтируется, новый создаётся с чистым состоянием (включая все вложенные компоненты).

### Почему не useEffect:
\`\`\`jsx
useEffect(() => setDraft(""), [contact]); // ❌
\`\`\`
Компонент сначала покажет старый черновик, затем сделает лишний рендер, и сбросить придётся каждое поле вручную.

### Ключевые выводы:
- Состояние привязано к позиции и \`key\` в дереве.
- \`key\` работает не только в списках: это способ сказать React «это другая сущность».`,

  w35: `### Суть задачи
Написать хук \`useLocalStorage\`, который работает как \`useState\`, но сохраняет значение между перезагрузками страницы.

### Пошаговые этапы решения:
1. **Безопасное чтение** — битый JSON и недоступное хранилище не должны ронять приложение:
\`\`\`jsx
const readValue = (key, initialValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch {
    return initialValue;
  }
};
\`\`\`
2. **Ленивая инициализация** — localStorage читается только при первом рендере:
\`\`\`jsx
const [value, setValue] = useState(() => readValue(key, initialValue));
\`\`\`
3. **Запись** — синхронизация с внешней системой в эффекте:
\`\`\`jsx
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value));
}, [key, value]);
\`\`\`

### Ключевые выводы:
- \`useState(fn)\` вызывает \`fn\` один раз, а \`useState(fn())\` — на каждом рендере.
- Хук повторяет API \`useState\` (\`[value, setValue]\`) — его легко подставить вместо обычного состояния.
- Для синхронизации между вкладками можно подписаться на событие \`storage\`.`,

  r18: `### Суть задачи
Убрать лишние ререндеры: один контекст хранит и редкие (тема), и частые (уведомления) данные.

### 🔍 Разбор проблемы:
\`\`\`jsx
<AppContext.Provider value={{ theme, toggleTheme, notifications }}>
\`\`\`
- Каждые 2 секунды меняется \`notifications\` → провайдер рендерится → \`value\` — новый объект.
- Все потребители \`AppContext\` перерисовываются, даже \`ThemeButton\`, которому уведомления не нужны.
- \`React.memo\` здесь не помогает: подписка на контекст обходит memo.

### 🛠 Пошаговый рефакторинг:
1. **Разделяем контекст** по частоте изменений: \`ThemeContext\` и \`NotificationsContext\`.
2. **Стабилизируем value** темы:
\`\`\`jsx
const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);
const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
\`\`\`
3. **Передаём потребителей через children**: элементы создаются в \`App\`, поэтому ререндер \`NotificationsProvider\` их не задевает.

### 💡 Ключевые выводы:
- Потребитель перерисовывается при любой смене \`value\` по \`Object.is\`.
- Разделяйте контексты по частоте изменений и мемоизируйте объект \`value\`.
- Для большого часто меняющегося состояния нужен стор с селекторами (Zustand, Redux).`,

  r19: `### Суть задачи
Заменить два HOC на кастомные хуки и избавиться от конфликта пропсов.

### 🔍 Разбор проблемы:
\`\`\`jsx
export default withOnlineStatus(withWindowSize(StatusBar));
\`\`\`
- Оба HOC передают проп \`data\` — внешний затирает внутренний, размеры окна теряются.
- \`StatusBar\` получает пропсы «из ниоткуда»: по коду компонента не видно, откуда они.
- В DevTools дерево обрастает обёртками (wrapper hell), усложняются типизация и проброс ref.

### 🛠 Рефакторинг:
\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

export default function StatusBar() {
  const { width, height } = useWindowSize();
  const isOnline = useOnlineStatus();
  // ...
}
\`\`\`

### 💡 Ключевые выводы:
- Хуки переиспользуют логику без изменения дерева компонентов.
- Компонент сам называет переменные — конфликт имён невозможен.
- HOC остаются уместны там, где нужно обернуть компонент целиком: Error Boundary, проверка доступа.`,

  r20: `### Суть задачи
Сделать ввод в поиск мгновенным, пока тяжёлый список перерисовывается, — средствами конкурентного React, без debounce.

### 🔍 Разбор проблемы:
Каждое нажатие клавиши синхронно рендерит инпут **и** тысячи элементов списка. Пока рендер не закончится, браузер не может показать введённый символ — поле «залипает».

### 🛠 Решение:
\`\`\`jsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;

<input value={query} onChange={(e) => setQuery(e.target.value)} />
<div style={{ opacity: isStale ? 0.5 : 1 }}>
  <ResultsList query={deferredQuery} />
</div>
\`\`\`
\`ResultsList\` обязательно оборачиваем в \`memo\`: иначе он перерисуется вместе с инпутом в срочном рендере.

### Как это работает:
1. Срочный рендер: инпут получает новый \`query\`, а список — старый \`deferredQuery\` (memo пропускает его).
2. Фоновый рендер: React рендерит список с новым значением. Если пользователь печатает дальше, рендер прерывается и начинается заново.

### 💡 Ключевые выводы:
- \`useDeferredValue\` — когда значение приходит извне; \`useTransition\` — когда вы сами вызываете \`setState\`.
- В отличие от debounce, нет фиксированной задержки: на быстром устройстве список обновится почти сразу.`,

  19: `### Суть задачи
Реализовать форму регистрации с валидацией, удобной для пользователя и доступной для скринридеров.

### Пошаговые этапы решения:
1. **Ошибки вычисляются**, а не хранятся в state:
\`\`\`jsx
const errors = validate(values);
const hasErrors = Object.keys(errors).length > 0;
\`\`\`
2. **Когда показывать ошибку** — после blur поля или попытки отправки:
\`\`\`jsx
showError: isSubmitted || touched[name]
\`\`\`
3. **Доступность** — \`useId\` связывает label, поле и текст ошибки:
\`\`\`jsx
const id = useId();
<label htmlFor={id}>{label}</label>
<input id={id} aria-invalid={isInvalid} aria-describedby={isInvalid ? \`\${id}-error\` : undefined} />
{isInvalid && <p id={\`\${id}-error\`} role="alert">{error}</p>}
\`\`\`
4. **Отправка**: \`e.preventDefault()\`, отметка \`isSubmitted\` и выход при ошибках.

### Ключевые выводы:
- Значения — состояние, ошибки — производные данные.
- Не ругайтесь на пустые поля при первом рендере: ошибка после blur — стандарт UX.
- \`useId\` даёт уникальные id даже для нескольких экземпляров поля и не ломает SSR-гидратацию.`,

  20: `### Суть задачи
Сделать модальное окно, с которым удобно работать и мышью, и клавиатурой.

### Пошаговые этапы решения:
1. **Портал** выносит модалку из родителей с \`overflow: hidden\` и \`z-index\`:
\`\`\`jsx
return createPortal(<div style={overlayStyle}>...</div>, document.body);
\`\`\`
2. **Закрытие по клику на фон** — только если кликнули ровно по overlay:
\`\`\`jsx
onClick={(e) => e.target === e.currentTarget && onClose()}
\`\`\`
3. **Фокус**: при открытии запоминаем \`document.activeElement\` и переводим фокус на кнопку «Закрыть», при закрытии (в cleanup эффекта) возвращаем фокус обратно.
4. **Focus trap**: на Tab с последнего элемента переходим на первый, на Shift+Tab с первого — на последний.
5. **Escape** закрывает модалку; все подписки снимаются в cleanup.
6. **ARIA**: \`role="dialog"\`, \`aria-modal="true"\`, \`aria-labelledby\` на заголовок.

### Ключевые выводы:
- Портал меняет место в DOM, но не в React-дереве: события и контекст работают как обычно.
- Возврат фокуса на триггер — обязательная часть доступной модалки.
- Нативный \`<dialog>\` с \`showModal()\` даёт focus trap и Escape из коробки — хороший ответ на вопрос «как сделать проще».`,

  21: `### Суть задачи
Отрисовать дерево папок любой глубины одним рекурсивным компонентом.

### Пошаговые этапы решения:
1. **Различаем узлы**: папка — это узел с массивом \`children\`.
2. **Рекурсивный подсчёт файлов**:
\`\`\`jsx
const countFiles = (node) =>
  isFolder(node) ? node.children.reduce((sum, child) => sum + countFiles(child), 0) : 1;
\`\`\`
3. **Компонент рендерит сам себя** для дочерних узлов:
\`\`\`jsx
{isOpen && (
  <ul>
    {node.children.map((child) => (
      <TreeNode key={child.name} node={child} depth={depth + 1} />
    ))}
  </ul>
)}
\`\`\`
4. **Состояние раскрытия** хранится в каждой папке (\`useState(false)\`).
5. **База рекурсии** — файл или свёрнутая папка: дальше рендер не идёт.

### Ключевые выводы:
- Рекурсивные компоненты — стандартный ответ для деревьев, меню и вложенных комментариев.
- Свёрнутые папки не рендерят детей — это бесплатная оптимизация для больших деревьев.
- \`aria-expanded\` на кнопке папки сообщает скринридеру её состояние.`,

  22: `### Суть задачи
Подгружать посты постранично, когда пользователь докручивает до конца списка.

### Пошаговые этапы решения:
1. **Маячок** — пустой элемент в конце списка, за которым следит \`IntersectionObserver\`:
\`\`\`jsx
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) loadPage(page);
});
observer.observe(sentinelRef.current);
return () => observer.disconnect();
\`\`\`
2. **Защита от дублей** — флаг загрузки в ref: он нужен синхронно и не должен вызывать рендер.
\`\`\`jsx
if (isLoadingRef.current) return;
isLoadingRef.current = true;
\`\`\`
3. **Конец данных**: если пришло меньше \`PAGE_SIZE\` записей, \`hasMore = false\`, маячок убирается, наблюдение прекращается.
4. **Ошибка** показывается с кнопкой «Повторить»; пока есть ошибка, observer не создаётся.

### Ключевые выводы:
- IntersectionObserver эффективнее обработчика scroll: браузер сам считает пересечения.
- Эффект пересоздаёт наблюдатель при смене страницы — если маячок всё ещё виден, загрузится следующая страница, и экран заполнится.
- В реальных проектах длинные списки дополняют виртуализацией.`,

  23: `### Суть задачи
Написать переиспользуемый хук загрузки данных с отменой устаревших запросов.

### Пошаговые этапы решения:
1. **Состояния**: \`data\`, \`error\`, \`isLoading\`.
2. **AbortController** в эффекте: смена \`url\` или размонтирование отменяют текущий запрос.
\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();
  // fetch(url, { signal: controller.signal }) ...
  return () => controller.abort();
}, [url, reloadKey]);
\`\`\`
3. **Отмена — не ошибка**:
\`\`\`jsx
if (err.name !== "AbortError") setError(err.message);
\`\`\`
4. **!res.ok** превращаем в ошибку: \`fetch\` не отклоняет промис на 404 и 500.
5. **refetch** меняет служебный счётчик \`reloadKey\` — эффект перезапускается без смены url.

### Ключевые выводы:
- AbortController решает и race condition, и утечки после размонтирования.
- Хук инкапсулирует механику, а компонент описывает только UI.
- В продакшене для серверного состояния обычно берут TanStack Query: кеш, повторы, дедупликация.`,

  24: `### Суть задачи
Не дать ошибке в одном виджете уронить всё приложение.

### Пошаговые этапы решения:
1. **Классовый компонент** — у хуков нет аналога:
\`\`\`jsx
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }
  reset = () => this.setState({ error: null });
  render() {
    if (this.state.error) return <Fallback error={this.state.error} onReset={this.reset} />;
    return this.props.children;
  }
}
\`\`\`
2. **Изоляция**: каждый виджет в своей границе — падение одного не трогает другие.
3. **Сброс**: после \`reset\` поддерево монтируется заново с чистым состоянием.

### Что Error Boundary НЕ ловит:
- ошибки в обработчиках событий (они выполняются вне рендера — нужен try/catch);
- асинхронный код: setTimeout, промисы вне рендера;
- ошибки в самом Error Boundary и при SSR.

### Ключевые выводы:
- \`getDerivedStateFromError\` переключает UI на fallback, \`componentDidCatch\` логирует.
- Ставьте границы вокруг независимых зон: виджетов, маршрутов, сторонних компонентов.
- В проектах часто используют библиотеку \`react-error-boundary\`.`,

  25: `### Суть задачи
Загрузить тяжёлый компонент по требованию и прочитать данные через \`use()\` вместо \`useEffect\` + \`isLoading\`.

### Пошаговые этапы решения:
1. **Code splitting** через \`lazy\` на уровне модуля:
\`\`\`jsx
const LazyChart = lazy(() => import("./Chart")); // в задаче имитация: lazy(loadChartModule)
\`\`\`
2. **Suspense** показывает fallback, пока чанк загружается:
\`\`\`jsx
<Suspense fallback={<p>Загрузка графика...</p>}>
  <LazyChart />
</Suspense>
\`\`\`
3. **use()** читает промис. Пока он не выполнен, ближайший Suspense показывает fallback:
\`\`\`jsx
const profilePromise = fetchProfile(); // вне рендера!

const Profile = ({ profilePromise }) => {
  const profile = use(profilePromise);
  return <p>{profile.name}</p>;
};
\`\`\`

### Типичные ошибки:
- \`lazy\` внутри компонента — новый тип на каждый рендер, потеря состояния.
- \`use(fetchProfile())\` в теле компонента — новый промис на каждый рендер, бесконечная приостановка.

### Ключевые выводы:
- Suspense декларативно описывает состояние загрузки, а ошибки уходят в Error Boundary.
- Промисы для \`use()\` создаются вне рендера: в роутере, фреймворке, Server Component или кеше.`,

  26: `### Суть задачи
Переписать форму комментария на Actions из React 19, убрав ручное управление \`isPending\` и \`error\`.

### Пошаговые этапы решения:
1. **useActionState** — action получает предыдущее состояние и \`FormData\`, возвращает новое:
\`\`\`jsx
const [state, formAction] = useActionState(async (prevState, formData) => {
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return { ...prevState, error: "Комментарий не может быть пустым" };
  addOptimistic({ id: \`temp-\${crypto.randomUUID()}\`, text, isSending: true });
  try {
    const comment = await postComment(text);
    return { comments: [...prevState.comments, comment], error: null };
  } catch (err) {
    return { ...prevState, error: err.message };
  }
}, INITIAL_STATE);
\`\`\`
2. **useOptimistic** — комментарий виден сразу, пока action выполняется:
\`\`\`jsx
const [optimisticComments, addOptimistic] = useOptimistic(
  state.comments,
  (current, newComment) => [...current, newComment]
);
\`\`\`
После завершения action React возвращает список к \`state.comments\`. При ошибке оптимистичный комментарий исчезает сам.
3. **useFormStatus** — кнопка узнаёт статус родительской формы без пропсов:
\`\`\`jsx
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Отправка..." : "Отправить"}</button>;
};
\`\`\`
4. **<form action={formAction}>** — после завершения action React сбрасывает неуправляемые поля.

### Ключевые выводы:
- Actions убирают шаблонный код: pending, ошибки и оптимистичные обновления.
- \`useFormStatus\` работает только в дочернем компоненте формы.
- Эта же модель используется для Server Actions в Next.js.`,

  a6: `### Суть задачи
Убрать prop drilling корзины, построив глобальное состояние на Context + useReducer.

### Пошаговые этапы решения:
1. **Reducer** с действиями \`add\` (с увеличением quantity), \`remove\`, \`clear\`.
2. **Два контекста** — данные и dispatch:
\`\`\`jsx
const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, []);
  return (
    <CartDispatchContext value={dispatch}>
      <CartStateContext value={items}>{children}</CartStateContext>
    </CartDispatchContext>
  );
};
\`\`\`
3. **Хуки доступа** с проверкой провайдера: \`useCart()\` и \`useCartDispatch()\`.
4. **Компоненты** читают только нужное: \`ProductList\` берёт лишь \`dispatch\` и не перерисовывается при изменении корзины.

### Ключевые выводы:
- \`dispatch\` стабилен — его отдельный контекст не вызывает ререндеров.
- Это «Redux без библиотеки»: подходит для средних по размеру и частоте обновлений состояний.
- При частых обновлениях большого состояния нужен стор с селекторами.`,

  a7: `### Суть задачи
Создать стор на Zustand и подписать компоненты через селекторы без лишних ререндеров.

### Пошаговые этапы решения:
1. **Стор** — состояние и действия в одном месте:
\`\`\`jsx
export const useTodoStore = create((set) => ({
  todos: [],
  filter: "all",
  addTodo: (text) => set((state) => ({ todos: [...state.todos, { id: crypto.randomUUID(), text, done: false }] })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  })),
  setFilter: (filter) => set({ filter }),
}));
\`\`\`
2. **Селекторы**: каждый компонент берёт только нужное.
\`\`\`jsx
const filter = useTodoStore((state) => state.filter);
const activeCount = useTodoStore((state) => state.todos.filter((t) => !t.done).length);
\`\`\`
3. **Производные данные** (отфильтрованный список) вычисляются в компоненте.

### Ключевые выводы:
- Zustand сравнивает результат селектора через \`Object.is\`: примитив — ререндер только при изменении значения.
- Селектор, возвращающий новый объект, вызывает лишние ререндеры — используйте \`useShallow\` или отдельные селекторы.
- Провайдер не нужен, а действия в сторе стабильны.`,

  a8: `### Суть задачи
Безопасно подписаться на внешние источники данных через \`useSyncExternalStore\`.

### Пошаговые этапы решения:
1. **subscribe** вне компонента — стабильная ссылка:
\`\`\`jsx
const subscribeOnline = (callback) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const useOnlineStatus = () => useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
\`\`\`
2. **Внешний стор** — значение, \`Set\` подписчиков и уведомление при изменении:
\`\`\`jsx
const createCounterStore = () => {
  let count = 0;
  const listeners = new Set();
  return {
    getState: () => count,
    increment: () => { count += 1; listeners.forEach((l) => l()); },
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  };
};
\`\`\`
3. **Хук**: \`useSyncExternalStore(store.subscribe, store.getState)\`.

### Ключевые выводы:
- Хук защищает от tearing — рассинхронизации UI в конкурентном рендере.
- \`getSnapshot\` возвращает примитив или ту же ссылку, иначе получится бесконечный цикл ререндеров.
- На этом хуке построены Zustand, Redux и другие библиотеки состояния.`,

  a9: `### Суть задачи
Предсказать логи, число рендеров и итоговое значение после клика.

### Разбор по шагам:
1. Монтирование: **render 0**.
2. Обработчик клика: \`count\` — константа рендера, равная 0. Оба \`setCount(count + 1)\` ставят значение 1. \`console.log\` выводит **handler 0** — переменная не меняется сразу.
3. Обработчик завершился, обновления объединены в один рендер: **render 1**.
4. Срабатывает \`setTimeout\`: колбэк замкнул \`count = 0\`, поэтому **timeout 0**. Функциональные обновления берут актуальное значение из очереди: 1 → 2 → 3.
5. В React 18+ батчинг автоматический и в таймерах: **render 3**.

### Ответ:
\`\`\`
render 0
handler 0
render 1
timeout 0
render 3
\`\`\`
После клика — 2 рендера, на экране \`count: 3\`.

### Ключевые выводы:
- State — снимок рендера: \`setState\` не меняет переменную в текущем вызове.
- \`setCount(count + 1)\` дважды подряд даёт +1, \`setCount(prev => prev + 1)\` — +2.
- С React 18 батчинг работает в обработчиках, таймерах и промисах; в React 17 внутри setTimeout было бы два отдельных рендера.`,

  a10: `### Суть задачи
Определить, какие компоненты перерисуются после изменения состояния \`Wrapper\`.

### Разбор:
| Компонент | Рендер? | Причина |
|---|---|---|
| Wrapper | ✅ | изменилось его состояние |
| Plain | ✅ | обычный ребёнок рендерится вместе с родителем |
| Memoized | ❌ | memo, пропсы не изменились |
| MemoizedWithProps | ✅ | \`["a", "b"]\` — новый массив на каждом рендере |
| FromChildren | ❌ | элемент создан в \`App\`, который не рендерился |

### Ответ:
\`\`\`
Wrapper
Plain
MemoizedWithProps
\`\`\`

### Ключевые выводы:
- Компонент рендерится, если изменились его состояние или контекст либо перерисовался родитель, который его **создал**.
- \`children\` — способ «поднять» поддерево выше и вывести его из-под ререндеров.
- memo сравнивает пропсы поверхностно: inline-массивы и объекты его ломают.
- React Compiler автоматически мемоизирует такие значения и JSX.`,

  a11: `### Суть задачи
Объяснить, почему отложенный \`alert\` показывает старое значение, и исправить это.

### 🔍 Разбор:
Каждый рендер — отдельный вызов функции \`DelayedAlert\` со своей константой \`count\`. Пользователь нажал «Показать» в рендере, где \`count = 0\`. Колбэк \`setTimeout\` замкнул именно этот \`count\`. Три клика «+1» создали новые рендеры и новые замыкания, но таймер держит старое. **Ответ: «Счётчик: 0».**

### 🛠 Исправление — ref как «коробка», общая для всех рендеров:
\`\`\`jsx
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);

const showLater = () => {
  setTimeout(() => alert(\`Счётчик: \${countRef.current}\`), 3000);
};
\`\`\`

### Ключевые выводы:
- Устаревшее значение — не баг React, а свойство замыканий. Иногда это нужное поведение: например, отправить сообщение собеседнику, выбранному в момент клика.
- Для обновления состояния достаточно \`setCount(prev => prev + 1)\`; для чтения актуального значения в отложенном коде — ref.
- В эффектах ту же задачу решает \`useEffectEvent\` (React 19.2+).`,

  a12: `### Суть задачи
Перевести загрузку и изменение серверных данных с ручных \`useEffect\` + \`useState\` на TanStack Query.

### 🔍 Проблемы исходного кода:
- \`TodoList\` и \`TodoCount\` загружают одно и то же — два запроса вместо одного.
- После добавления задачи \`TodoCount\` показывает устаревшее число: у каждого компонента своя копия данных.
- Загрузку, ошибки, повторный запрос и блокировку кнопки приходится писать вручную.

### Пошаговые этапы решения:
1. **QueryClient на уровне модуля** и провайдер:
\`\`\`jsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

<QueryClientProvider client={queryClient}>
  <TodoCount />
  <TodoList />
</QueryClientProvider>
\`\`\`
2. **Один хук — один ключ**: оба компонента читают общий кеш, запрос уходит один раз.
\`\`\`jsx
const useTodos = () => useQuery({ queryKey: ['todos'], queryFn: api.getTodos });
\`\`\`
3. **Мутация с инвалидацией**:
\`\`\`jsx
const queryClient = useQueryClient();
const addTodo = useMutation({
  mutationFn: api.addTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

<button disabled={addTodo.isPending}>Добавить</button>
{addTodo.isError && <p role="alert">{addTodo.error.message}</p>}
\`\`\`
После инвалидации список перезапрашивается, и обновляются оба компонента.

### staleTime и gcTime:
- **staleTime** — сколько данные считаются свежими. Пока они свежие, новые подписчики получают кеш без запроса. По умолчанию 0: данные сразу устаревшие и перезапрашиваются при монтировании и фокусе окна.
- **gcTime** — сколько неиспользуемые данные хранятся в кеше после размонтирования всех подписчиков (по умолчанию 5 минут).

### 💡 Ключевые выводы:
- Серверное состояние — это кеш, а не локальное состояние. Не копируйте его в \`useState\` или клиентские сторы.
- \`queryKey\` — адрес данных в кеше: одинаковый ключ означает общие данные и дедупликацию запросов.
- \`invalidateQueries\` — простой и надёжный способ синхронизации после мутаций. \`setQueryData\` нужен для ручных и оптимистичных обновлений.`,

  js_while_1: `### Суть задачи
Изучение базовой конструкции цикла \`while\` в JavaScript, принципа проверки предусловия перед каждой итерацией и создание бесконечного цикла \`while (true) {}\`.

### Пошаговые этапы решения:

1. **Анатомия цикла \`while\`**:
Инструкция \`while\` проверяет логическое выражение (условие) перед выполнением тела цикла на каждой итерации:
\`\`\`js
while (условие) {
  // тело цикла, выполняемое пока условие truthy
}
\`\`\`
**Разбор**: 
- **Проверка условия**: выражение внутри круглых скобок неявно приводится к булевому типу (\`Boolean(условие)\`).
- Если результат равен \`true\`, поток управления входит в тело цикла \`{ ... }\`.
- Если условие сразу равно \`false\`, тело цикла не выполнится ни одного раза (в отличие от \`do...while\`).

2. **Создание бесконечного цикла**:
Передача литерала \`true\` в качестве условия:
\`\`\`js
while (true) {
  // бесконечный цикл
}
\`\`\`
**Разбор**: Цикл \`while (true)\` выполняется бесконечно, пока внутри не сработает инструкция \`break\`, \`return\` или не будет выброшено исключение \`throw\`. Такие циклы часто применяются в серверах событий (Game Loop, Event Polling, чтение потоковых данных).

### Ключевые выводы:
• Цикл \`while\` является циклом с **предусловием** — условие вычисляется ДО первой итерации.
• Конструкция \`while (true) {}\` создает бесконечный цикл и требует явного выхода по \`break\` или \`return\`.
• При пропуске условия остановки бесконечный цикл блокирует Main Thread JavaScript.`,

  js_while_2: `### Суть задачи
Реализация обратного счётчика от положительного числа \`N\` до 1 с выводом чисел в консоль при помощи цикла \`while\` и декремента счетчика.

### Пошаговые этапы решения:

1. **Явный декремент внутри тела цикла**:
Управляем счётчиком, проверяя условие \`n > 0\` и уменьшая \`n\` на 1 на каждом шаге:
\`\`\`js
const countdown = (n) => {
  while (n > 0) {
    console.log(n);
    n--;
  }
};
\`\`\`
**Разбор**: 
- На первой итерации при \`n = 3\` условие \`3 > 0\` истинно, выводится \`3\`, \`n\` становится \`2\`.
- На последней итерации при \`n = 1\` условие \`1 > 0\` истинно, выводится \`1\`, \`n\` становится \`0\`.
- При следующей проверке \`0 > 0\` возвращает \`false\`, и цикл корректно завершается.

2. **Идиоматичный пост-декремент \`while (n--)\`**:
Компактный синтаксис, использующий неявное приведение типов:
\`\`\`js
const countdown = (n) => {
  while (n) {
    console.log(n--);
  }
};
\`\`\`
**Разбор**: Выражение \`n--\` возвращает текущее значение \`n\` (которое выводится в консоль), а затем уменьшает его на 1. Число \`0\` приводится к \`false\`, останавливая цикл.

### Ключевые выводы:
• Шаг декремента \`n--\` обязателен внутри тела цикла для предотвращения зацикливания.
• Цикл \`while (n > 0)\` наглядно выражает намерение и защищает от ошибок с отрицательными числами.
• Сложность алгоритма: O(N) по времени и O(1) по дополнительной памяти.`,

  js_while_3: `### Суть задачи
Вычисление суммы всех цифр целого неотрицательного числа с помощью арифметической декомпозиции в цикле \`while\` за логарифмическое время O(log10 N) без выделения памяти на строки и массивы.

### Пошаговые этапы решения:

1. **Извлечение последней цифры через остаток от деления**:
Оператор \`% 10\` возвращает младший разряд десятичного числа:
\`\`\`js
const lastDigit = n % 10; // 1234 % 10 => 4
\`\`\`
**Разбор**: Взятие остатка от деления на 10 всегда возвращает последнюю цифру любого положительного целого числа.

2. **Сдвиг разряда вправо через целочисленное деление**:
Удаляем младшую цифру делением на 10 с округлением вниз \`Math.floor\`:
\`\`\`js
n = Math.floor(n / 10); // Math.floor(1234 / 10) => 123
\`\`\`
**Разбор**: Поскольку числа в JavaScript являются 64-битными числами с плавающей точкой (IEEE 754), \`1234 / 10\` вернет \`123.4\`. Метод \`Math.floor\` отбрасывает дробную часть, оставляя только целые разряды.

3. **Сборка аккумулятора в цикле \`while\`**:
Объединяем шаги в цикл до обнуления числа:
\`\`\`js
const sumOfDigits = (num) => {
  let sum = 0;
  let n = Math.abs(num);

  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }

  return sum;
};
\`\`\`
**Разбор**: Число \`1234\` раскладывается на шагах: \`4\` (остаток \`123\`), \`3\` (остаток \`12\`), \`2\` (остаток \`1\`), \`1\` (остаток \`0\`). Итоговая сумма: \`4 + 3 + 2 + 1 = 10\`.

### Ключевые выводы:
• Арифметический метод работает за O(log10 N) времени и O(1) памяти.
• Подход через строки (\`String(num).split('').reduce(...)\`) требует O(K) аллокаций памяти под строковые чанки и массив, что значительно медленнее в высоконагруженных вычислениях.
• \`Math.abs(num)\` защищает алгоритм от отрицательных чисел.`,

  js_while_4: `### Суть задачи
Реализация алгоритма разворота десятичного числа (Reverse Integer) с помощью чисто арифметического аккумулятора в цикле \`while\`.

### Пошаговые этапы решения:

1. **Формула сдвига и накопления разрядов**:
Каждая новая цифра добавляется в младший разряд перевернутого числа:
\`\`\`js
reversed = reversed * 10 + (n % 10);
\`\`\`
**Разбор**: 
- Умножение \`reversed * 10\` сдвигает накопленные цифры влево на один десятичный порядок.
- Прибавление \`n % 10\` подставляет текущую цифру на место единиц.
- Пример для числа \`123\`:
  - Шаг 1: \`0 * 10 + 3 = 3\`
  - Шаг 2: \`3 * 10 + 2 = 32\`
  - Шаг 3: \`32 * 10 + 1 = 321\`

2. **Итоговая функция с циклом \`while\`**:
\`\`\`js
const reverseNumber = (num) => {
  let reversed = 0;
  let n = Math.abs(num);

  while (n > 0) {
    reversed = reversed * 10 + (n % 10);
    n = Math.floor(n / 10);
  }

  return num < 0 ? -reversed : reversed;
};
\`\`\`
**Разбор**: Цикл выполняется ровно столько раз, сколько цифр в числе. Ведущие нули (например, в \`980\`) естественным образом поглощаются умножением \`0 * 10 + 8 = 8\`, на выходе давая \`89\`.

### Ключевые выводы:
• Алгоритм работает без перевода в строку за O(log10 N) времени и O(1) памяти.
• Идиоматичная формула \`reversed * 10 + digit\` является фундаментальным приёмом в алгоритмических задачах на манипуляцию числами.`,

  js_while_5: `### Суть задачи
Нахождение наибольшего общего делителя (НОД / GCD) двух целых чисел с использованием классического алгоритма Евклида через остаток от деления в цикле \`while\`.

### Пошаговые этапы решения:

1. **Математическая основа алгоритма Евклида**:
НОД двух чисел a и b (где a >= b) равен НОД чисел b и остатка от деления a % b:
\`\`\`
gcd(a, b) = gcd(b, a % b)
\`\`\`
Когда остаток становится равным 0, текущее значение a является искомым делителем.

2. **Итеративная реализация через \`while\`**:
\`\`\`js
const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x;
};
\`\`\`
**Разбор**:
Пример для \`gcd(48, 18)\`:
- Итерация 1: \`x = 48, y = 18\` -> \`temp = 18\`, \`y = 48 % 18 = 12\`, \`x = 18\`.
- Итерация 2: \`x = 18, y = 12\` -> \`temp = 12\`, \`y = 18 % 12 = 6\`, \`x = 12\`.
- Итерация 3: \`x = 12, y = 6\` -> \`temp = 6\`, \`y = 12 % 6 = 0\`, \`x = 6\`.
- Итерация 4: \`y === 0\`, цикл завершается, возвращается \`x = 6\`.

### Ключевые выводы:
• Алгоритм Евклида сходится чрезвычайно быстро: временная сложность O(log(min(a, b))), память O(1).
• Худшим случаем для алгоритма Евклида являются два последовательных числа Фибоначчи (теорема Ламе).
• Цикл \`while (y !== 0)\` автоматически меняет аргументы местами, если на входе a < b.`,

  js_while_6: `### Суть задачи
Реализация алгоритма двоичного (бинарного) поиска элемента в отсортированном массиве за логарифмическое время O(log N) с использованием двух указателей \`left\` и \`right\` и цикла \`while (left <= right)\`.

### Пошаговые этапы решения:

1. **Инициализация указателей границ поиска**:
Устанавливаем границы на начало и конец массива:
\`\`\`js
let left = 0;
let right = arr.length - 1;
\`\`\`

2. **Деление диапазона пополам и сужение границ**:
На каждом шаге вычисляем индекс середины \`mid\` и сравниваем \`arr[mid]\` с \`target\`:
\`\`\`js
const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid; // Элемент найден
    }

    if (arr[mid] < target) {
      left = mid + 1; // Искомый элемент в правой половине
    } else {
      right = mid - 1; // Искомый элемент в левой половине
    }
  }

  return -1; // Элемент не найден
};
\`\`\`
**Разбор**:
- Условие \`while (left <= right)\` гарантирует проверку диапазона, даже когда он сжимается до одного элемента (\`left === right\`).
- Формула \`left + Math.floor((right - left) / 2)\` исключает риск целочисленного переполнения и точно находит центр.
- Если целевое значение меньше \`arr[mid]\`, сдвигаем правую границу \`right = mid - 1\`. Если больше — сдвигаем левую \`left = mid + 1\`.

### Ключевые выводы:
• Бинарный поиск применим только к **отсортированным** коллекциям данных.
• Временная сложность O(log N) превосходит линейный поиск O(N) (для массива из 1 000 000 элементов требуется максимум 20 сравнений).
• Итеративная реализация через \`while\` использует O(1) памяти, не расходуя стек вызовов.`,

  js_while_7: `### Суть задачи
Итеративный обход односвязного списка (Linked List) при помощи указателя \`current\` в цикле \`while (current !== null)\` для вычисления суммы значений всех узлов.

### Пошаговые этапы решения:

1. **Структура узла односвязного списка**:
Каждый узел содержит значение \`value\` и ссылку на следующий узел \`next\` (либо \`null\` в хвосте):
\`\`\`js
// { value: 10, next: { value: 20, next: { value: 30, next: null } } }
\`\`\`

2. **Итеративный обход указателем \`current\`**:
Двигаем указатель по ссылкам \`.next\` до достижения конца списка:
\`\`\`js
const sumLinkedList = (head) => {
  let sum = 0;
  let current = head;

  while (current !== null) {
    sum += current.value;
    current = current.next;
  }

  return sum;
};
\`\`\`
**Разбор**:
- Инициализируем \`current = head\`.
- На каждой итерации прибавляем \`current.value\` к аккумулятору \`sum\`.
- Перемещаем указатель на следующий узел: \`current = current.next\`.
- Когда \`current\` становится равен \`null\` (хвост списка), цикл \`while\` завершается и возвращается \`sum\`.

### Ключевые выводы:
• Итеративный обход через \`while\` требует O(N) времени и строго O(1) памяти.
• Рекурсивный обход \`head.value + sumLinkedList(head.next)\` требует O(N) дополнительной памяти в Call Stack и приводит к ошибке \`RangeError: Maximum call stack size exceeded\` при списках длиной более 10 000 узлов.
• Проверка \`current !== null\` безопасна для пустых списков (\`head === null\` сразу вернет 0).`,

  js_while_8: `### Суть задачи
Эффективное объединение двух отсортированных по возрастанию массивов в один отсортированный массив за линейное время O(N + M) с помощью паттерна двух указателей в цикле \`while\`.

### Пошаговые этапы решения:

1. **Два указателя на начала массивов**:
Инициализируем индексы \`i = 0\` и \`j = 0\` для первого и второго массива:
\`\`\`js
let i = 0;
let j = 0;
const result = [];
\`\`\`

2. **Сравнение и вставка наименьшего элемента**:
В цикле \`while\` сравниваем текущие элементы \`arr1[i]\` и \`arr2[j]\`, продвигая вперед соответствующий указатель:
\`\`\`js
while (i < arr1.length && j < arr2.length) {
  if (arr1[i] <= arr2[j]) {
    result.push(arr1[i]);
    i++;
  } else {
    result.push(arr2[j]);
    j++;
  }
}
\`\`\`

3. **Добивка оставшихся элементов**:
После завершения одного из массивов оставшиеся элементы второго гарантированно упорядочены и дописываются в конец:
\`\`\`js
while (i < arr1.length) {
  result.push(arr1[i]);
  i++;
}

while (j < arr2.length) {
  result.push(arr2[j]);
  j++;
}
\`\`\`
**Разбор**:
- Алгоритм делает ровно N + M операций сравнения и вставки.
- В отличие от наивного подхода \`[...arr1, ...arr2].sort()\`, который тратит O((N + M) log(N + M)), алгоритм двух указателей полностью утилизирует уже имеющуюся отсортированность входных данных за строго O(N + M) времени.

### Ключевые выводы:
• Паттерн слияния двумя указателями — ключевой этап классического алгоритма сортировки слиянием (Merge Sort).
• Сложность: O(N + M) по времени и O(N + M) по памяти для результирующего массива.
• Добивающие циклы \`while\` гарантируют, что ни один элемент более длинного массива не будет потерян.`,

  js1: `### Суть задачи
Изучение базовой конструкции цикла \`for\` в JavaScript, его ключевых управляющих секций (инициализация, условие, шаг) и особенности создания бесконечного цикла при их опущении (\`for (;;) {}\`).

### Пошаговые этапы решения:

1. **Структура классического цикла \`for\`**:
Цикл \`for\` управляет итерациями с помощью трёх секций, разделенных точкой с запятой:
\`\`\`js
for (инициализация; условие; шаг) {
  // тело цикла
}
\`\`\`
**Разбор**: 
- **Инициализация** (\`let i = 0\`): выполняется один раз перед стартом цикла.
- **Условие** (\`i < N\`): проверяется перед каждой итерацией. Если вычисляется в \`true\`, выполняется тело цикла; при \`false\` — цикл завершается.
- **Шаг** (\`i++\`): выполняется в конце каждой итерации перед следующей проверкой условия.

2. **Опущение управляющих выражений (бесконечный цикл)**:
Все три секции цикла \`for\` являются необязательными:
\`\`\`js
for (;;) {
  // бесконечный цикл
}
\`\`\`
**Разбор**: Если выпустить все три выражения, циклу передаются только две точки с запятой \`(;;)\`. Отсутствующее условие трактуется интерпретатором JavaScript как постоянно истинное (\`true\`), что создает бесконечный цикл. Завершить такой цикл можно изнутри с помощью ключевых слов \`break\` или \`return\`.

### Ключевые выводы:
• Синтаксис \`for (инициализация; условие; шаг)\` требует ровно две точки с запятой внутри скобок.
• Конструкция \`for (;;) {}\` валидна и создает бесконечный цикл за счет автоматического приравнивания отсутствующего условия к \`true\`.
• Выход из бесконечного цикла осуществляется операторами \`break\` или \`return\`.`,

  js2: `### Суть задачи
Последовательный перебор чисел в заданном диапазоне от 1 до \`N\` включительно при помощи цикла \`for\` с выводом каждого значения в консоль.

### Пошаговые этапы решения:

1. **Инициализация и условие цикла**:
Устанавливаем счетчик \`let i = 1\` и ограничиваем выполнение условием \`i <= n\`.
\`\`\`js
for (let i = 1; i <= n; i++) {
  console.log(i);
}
\`\`\`
**Разбор**: Переменная \`i\` инициализируется единицей. На каждом шаге проверяется, не превышает ли \`i\` значение \`n\`. Метод \`console.log(i)\` выводит текущее число, после чего происходит инкремент \`i++\`.

### Ключевые выводы:
• Оператор \`<=\` гарантирует включение границы \`n\` в результат.
• Переменная счетчика объявляется через \`let\`, так как её значение мутирует на каждой итерации.`,

  js3: `### Суть задачи
Нахождение суммы арифметической прогрессии от 1 до \`N\` при помощи аккумулирующей переменной и цикла \`for\` либо по математической формуле.

### Варианты решения:

1. **Базовый вариант через цикл \`for\`**:
Инициализируем переменную аккумулятора \`sum\` нулем и прибавляем каждое число от 1 до \`n\`:
\`\`\`js
let sum = 0;
for (let i = 1; i <= n; i++) {
  sum += i;
}
return sum;
\`\`\`
• Временная сложность: O(N)
• Пространственная сложность: O(1)

2. **Оптимизированный вариант по формуле арифметической прогрессии**:
\`\`\`js
return (n * (n + 1)) / 2;
\`\`\`
• Временная сложность: O(1)
• Пространственная сложность: O(1)

### Как отвечать на собеседовании:
• Начните с классического цикла \`for\`, объяснив принцип работы аккумулятора.
• Сразу добавьте: «Сложность цикла O(N). Но так как мы суммируем непрерывный ряд от 1 до N, мы можем вычислить ответ за O(1) по формуле суммы арифметической прогрессии: \`n * (n + 1) / 2\`». Это демонстрирует широту кругозора и алгоритмическую зрелость.`,

  js4: `### Суть задачи
Фильтрация и вывод чётных чисел в диапазоне от 1 до \`N\` с использованием математической проверки остатка от деления (\`%\`).

### Пошаговые этапы решения:

1. **Проверка четности через остаток от деления**:
Используем оператор \`%\` (остаток от деления на 2).
\`\`\`js
for (let i = 1; i <= n; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}
\`\`\`
**Разбор**: Выражение \`i % 2 === 0\` истинно только для четных чисел. Внутри условного блока \`if\` производится вывод числа в консоль.

2. **Альтернативная оптимизация цикла**:
Инкремент счетчика на 2 вместо проверки каждого числа:
\`\`\`js
for (let i = 2; i <= n; i += 2) {
  console.log(i);
}
\`\`\`
**Разбор**: Шаг \`i += 2\` позволяет пропустить нечетные числа без лишних проверок \`if\`, сокращая количество итераций в 2 раза.

### Ключевые выводы:
• Оператор остатка от деления \`%\` — стандартный способ проверки чисел на четность/кратность.
• Изменение шага итерации (\`i += 2\`) оптимизирует выполнение цикла.`,

  js5: `### Суть задачи
Проверка, является ли строка палиндромом (читается одинаково слева направо и справа налево), с предварительным приведением регистра.

### Пошаговые этапы решения:

1. **Нормализация регистра и обратный цикл \`for\`**:
Приводим всю строку к нижнему регистру и обходим её с конца.
\`\`\`js
const isPalindrome = (str) => {
  let lowerStr = str.toLowerCase();
  let reverseString = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reverseString += lowerStr[i];
  }

  return reverseString === lowerStr;
};
\`\`\`
**Разбор**: Метод \`toLowerCase()\` сглаживает разницу между заглавными и строчными буквами ("Madam" -> "madam"). Цикл начинается с \`str.length - 1\` и идет до \`0\` включительно (\`i >= 0\`), формируя перевернутую строку.

2. **Альтернативное решение через методы массивов**:
\`\`\`js
const isPalindromeMethods = (str) => {
  const strLowerCase = str.toLowerCase();
  const reverse = [...strLowerCase].reverse().join("");
  return strLowerCase === reverse;
};
\`\`\`
**Разбор**: Оператор \`[...str]\` превращает строку в массив символов, метод \`reverse()\` меняет порядок элементов, а \`join("")\` собирает их обратно в строку.

### Ключевые выводы:
• При сравнении символов важно нормализовать регистр букв через \`toLowerCase()\`.
• Обратный цикл \`for (let i = str.length - 1; i >= 0; i--)\` — фундаментальный прием инверсии структур данных.`,

  js6: `### Суть задачи
Вычисление суммы всех элементов числового массива при помощи прохода по индексам в цикле \`for\` и сравнение с методом \`reduce\`.

### Пошаговые этапы решения:

1. **Итерация по массиву через цикл \`for\`**:
Обращаемся к каждому элементу по индексу \`arr[i]\`.
\`\`\`js
const sumNumbers = (arr) => {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum;
};
\`\`\`
**Разбор**: Цикл выполняется пока индекс \`i\` строго меньше длины массива \`arr.length\`. Значение \`arr[i]\` прибавляется к аккумулирующей переменной \`sum\`.

2. **Декларативное решение через \`reduce\`**:
\`\`\`js
const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);
\`\`\`
**Разбор**: Метод \`reduce()\` сворачивает массив к единому значению, принимая функцию-аккумулятор и начальное значение \`0\`.

### Ключевые выводы:
• Индексация массивов начинается с \`0\`, а последний элемент имеет индекс \`arr.length - 1\`.
• Использование циклов дает гибкий контроль над итерацией, тогда как \`reduce\` обеспечивает лаконичный декларативный код.`,

  js7: `### Суть задачи
Реализация базового алгоритма пузырьковой сортировки (Bubble Sort) с использованием двух вложенных циклов \`for\` и обмена значениями элементов.

### Пошаговые этапы решения:

1. **Внешний и внутренний циклы**:
Внешний цикл определяет количество проходов, а внутренний сравнивает соседние элементы.
\`\`\`js
const bubbleSort = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};
\`\`\`
**Разбор**: 
- Внутренний цикл идет до \`arr.length - 1 - i\`, так как после каждого прохода самый большой элемент «всплывает» в конец и его не нужно сравнивать заново.
- Если \`arr[j] > arr[j + 1]\`, происходит обмен значениями через временную переменную \`temp\`.

### Ключевые выводы:
• Временная сложность пузырьковой сортировки составляет O(N²), что делает её неэффективной на больших объемах данных.
• Вычитание \`- i\` во внутреннем цикле оптимизирует работу, исключая уже отсортированный хвост массива.`,

  js8: `### Суть задачи
Изучение специального оператора цикла \`for...of\` в JavaScript, предназначенного для прямого обхода значений любых итерируемых структур данных (массивов, Map, Set, строк).

### Пошаговые этапы решения:

1. **Синтаксис цикла \`for...of\`**:
\`\`\`js
for (const value of numbers) {
  console.log(value);
}
\`\`\`
**Разбор**: В каждой итерации переменная \`value\` получает значение очередного элемента итерируемого объекта. Использование ключевого слова \`const\` безопасно, так как для каждого элемента создается новая область видимости.

### Ключевые выводы:
• \`for...of\` итерируется по **значениям**, а \`for...in\` — по **ключам/индексам**.
• Синтаксис подходит для всех встроенных итерируемых сущностей в JS.`,

  js9: `### Суть задачи
Вычисление суммы всех элементов числового массива при помощи прямых значений элементов в цикле \`for...of\` и сравнение с \`reduce\`.

### Пошаговые этапы решения:

1. **Итерация по значениям в цикле \`for...of\`**:
\`\`\`js
const sumNumbers = (arr) => {
  let sum = 0;

  for (const num of arr) {
    sum += num;
  }

  return sum;
};
\`\`\`
**Разбор**: Переменная \`num\` последовательно принимает каждое число массива. К аккумулирующей переменной \`sum\` прибавляется значение \`num\`.

2. **Декларативное решение через \`reduce\`**:
\`\`\`js
const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);
\`\`\`
**Разбор**: Метод \`reduce()\` аккумулирует сумму элементов за один проход в лаконичном функциональном стиле.

### Ключевые выводы:
• Цикл \`for...of\` избавляет от явного обращения по индексам (\`arr[i]\`).
• На собеседовании предпочтителен \`reduce()\`, если нет прямого указания написать цикл.`,

  js10: `### Суть задачи
Фильтрация и вывод только положительных чисел из массива при помощи цикла \`for...of\` и условного оператора \`if\`.

### Пошаговые этапы решения:

1. **Проверка условия \`num > 0\`**:
\`\`\`js
const printPositives = (arr) => {
  for (const num of arr) {
    if (num > 0) {
      console.log(num);
    }
  }
};
\`\`\`
**Разбор**: В цикле \`for...of\` происходит последовательный перебор всех чисел. Если число строго больше нуля (\`num > 0\`), оно выводится в консоль.

### Ключевые выводы:
• Значение \`0\` не является строго положительным (\`0 > 0\` дает \`false\`).
• \`for...of\` читается чисто благодаря прямому доступу к переменной числа.`,

  js11: `### Суть задачи
Проверка присутствия заданного элемента в массиве (линейный поиск с помощью \`for...of\` и через метод \`includes\`).

### Пошаговые этапы решения:

1. **Линейный поиск с ранним возвратом**:
\`\`\`js
const getFindElement = (arr, element) => {
  for (const item of arr) {
    if (item === element) return true;
  }

  return false;
};
\`\`\`
**Разбор**: Как только находится элемент, равный искомому (\`item === element\`), функция мгновенно возвращает \`true\` (раннее завершение). Если цикл завершился без совпадений, возвращается \`false\`.

2. **Использование встроенного метода \`includes()\`**:
\`\`\`js
const hasElement = (arr, element) => arr.includes(element);
\`\`\`
**Разбор**: Метод \`Array.prototype.includes()\` выполняет ту же проверку нативно за время O(N).

### Ключевые выводы:
• Ранний возврат \`return true\` прерывает цикл сразу при первом совпадении.
• На собеседовании встроенный метод \`includes()\` является стандартом.`,

  js12: `### Суть задачи
Фильтрация элементов массива строк по длине символов с формированием нового массива (сравнение \`for...of\` и \`filter\`).

### Пошаговые этапы решения:

1. **Императивное накопление в результирующий массив**:
\`\`\`js
const filterStr = (arr, num) => {
  let result = [];

  for (let str of arr) {
    if (str.length > num) {
      result.push(str);
    }
  }
  return result;
};
\`\`\`
**Разбор**: На каждой итерации проверяется длина текущей строки \`str.length > num\`. При выполнении условия строка добавляется в итоговый массив \`result\` методом \`push()\`.

2. **Декларативное решение через \`filter()\`**:
\`\`\`js
const filterStr = (arr, num) => arr.filter((str) => str.length > num);
\`\`\`
**Разбор**: Метод \`filter()\` возвращает новый массив со всеми элементами, прошедшими условие предиката.

### Ключевые выводы:
• Метод \`filter()\` не меняет исходный массив, а возвращает новый.
• Свойство \`length\` возвращает количество символов в строке.`,

  js13: `### Суть задачи
Подсчёт количества совпадений конкретного слова в массиве строк при помощи аккумулятора в цикле \`for...of\` и метода \`reduce\`.

### Пошаговые этапы решения:

1. **Подсчет с помощью счетчика**:
\`\`\`js
const sumDoubleStr = (arr, str) => {
  let count = 0;

  for (const item of arr) {
    if (item === str) {
      count++;
    }
  }
  return count;
};
\`\`\`
**Разбор**: Переменная \`count\` хранит число найденных совпадений. При равенстве строки \`item === str\` происходит инкремент \`count++\`.

2. **Подсчет через \`reduce()\`**:
\`\`\`js
const countOccurrences = (array, word) =>
  array.reduce((count, item) => (item === word ? count + 1 : count), 0);
\`\`\`
**Разбор**: Метод \`reduce()\` начинает со стартового значения \`0\` и прибавляет \`1\` при совпадении текущего элемента \`item\` с искомым \`word\`.

### Ключевые выводы:
• Алгоритм подсчета имеет временную сложность O(N).
• Использование строгого равенства \`===\` предотвращает нежелательное приведение типов.`,

  js14: `### Суть задачи
Проверка наличия конкретной строки в массиве элементов при помощи нативного метода \`Array.prototype.includes()\`.

### Пошаговые этапы решения:

1. **Использование метода \`includes()\`**:
\`\`\`js
const fruits = ["banana", "apple", "cherry"];

const hasElem = (arr, el) => arr.includes(el);

console.log(hasElem(fruits, "apple")); // true
\`\`\`
**Разбор**: Метод \`arr.includes(el)\` проходит по массиву и возвращает \`true\`, если переданное значение найдено, иначе \`false\`.

2. **Оценка сложности и создание Set**:
- **Для разового поиска**: \`arr.includes(el)\` выполняет один проход за время O(N) в худшем случае и требует O(1) дополнительной памяти.
- Оборачивание в \`new Set(arr).has(el)\` внутри разовой функции не дает ускорения: создание самого объекта \`Set\` из массива занимает те же O(N) по времени и требует O(N) дополнительной памяти.
- Коллекция \`Set\` выгодна только тогда, когда она создается **один раз**, а затем по ней выполняется множество (M) поисков за O(1), обеспечивая суммарную сложность O(N + M) вместо O(N * M).

### Ключевые выводы:
• \`includes()\` — стандартный метод проверки наличия элемента за время O(N) и O(1) памяти.
• Создание Set для единственного поиска не имеет алгоритмического смысла.`,

  js15: `### Суть задачи
Использование второго параметра \`fromIndex\` метода \`includes()\` для ограничения начальной позиции поиска в массиве.

### Пошаговые этапы решения:

1. **Указание стартового индекса поиска**:
\`\`\`js
const arr = [1, 7, 3, 7, 5];

const hasElemFrom = (arr, el, fromIndex) => arr.includes(el, fromIndex);

console.log(hasElemFrom(arr, 7, 3)); // true
\`\`\`
**Разбор**: Передача индекса \`3\` заставляет \`includes()\` игнорировать первые 3 элемента (индексы 0, 1, 2). Поиск начинается с элемента \`arr[3]\` (который равен \`7\`), поэтому возвращается \`true\`.

### Ключевые выводы:
• Вдобавок к значению, \`includes(searchElement, fromIndex)\` принимает индекс старта.
• При отрицательном \`fromIndex\` поиск ведется с отступом от конца массива.`,

  js16: `### Суть задачи
Проверка вхождения подстроки в текстовую строку при помощи метода \`String.prototype.includes()\`.

### Пошаговые этапы решения:

1. **Поиск подстроки**:
\`\`\`js
const str = "hello world";

const hasSubstring = (str, substr) => str.includes(substr);

console.log(hasSubstring(str, "world")); // true
\`\`\`
**Разбор**: Метод \`str.includes(substr)\` производит поиск символов подстроки \`substr\` в строке \`str\` с учетом регистра.

### Ключевые выводы:
• Метод \`String.prototype.includes\` регистрозависим.
• Заменяет устаревший вызов \`str.indexOf(substr) !== -1\`.`,

  js17: `### Суть задачи
Разбор особенностей типов данных при использовании метода \`includes()\` и алгоритма строгого сравнения \`SameValueZero\`.

### Пошаговые этапы решения:

1. **Сравнение типов данных**:
\`\`\`js
const arr = [1, 2, 3];
console.log(arr.includes("1")); // false
\`\`\`
**Разбор**: Метод \`includes()\` выполняет проверку с учетом типов данных (алгоритм \`SameValueZero\` аналогичен строгому равенству \`===\`). Так как элемент массива имеет числовой тип \`1\` (Number), а поисковый аргумент является строкой \`"1"\` (String), сравнение \`1 === "1"\` вычисляется в \`false\`.

### Ключевые выводы:
• \`includes()\` **не производит** неявное приведение типов (type coercion).
• Число \`1\` и строка \`"1"\` являются разными значениями в JavaScript.`,

  js18: `### Суть задачи
Понимание параметров по умолчанию в JavaScript и поведения метода \`includes()\` при отсутствии переданных аргументов.

### Пошаговые этапы решения:

1. **Вызов без аргументов**:
\`\`\`js
console.log([undefined].includes()); // true
\`\`\`
**Разбор**: Если вызывать функцию или метод без аргументов, значение неопределенного параметра принимает \`undefined\`. Вызов \`[undefined].includes()\` эквивалентен \`[undefined].includes(undefined)\`. Поскольку массив содержит элемент \`undefined\`, метод возвращает \`true\`.

### Ключевые выводы:
• Опущенный аргумент в JavaScript неявно передается как \`undefined\`.
• \`includes()\` умеет корректно искать элементы со значением \`undefined\` и \`NaN\`.`,

  js19: `### Суть задачи
Поиск первого элемента в числовом массиве, удовлетворяющего математическому предикату чётности, при помощи метода \`Array.prototype.find()\`.

### Пошаговые этапы решения:

1. **Использование метода \`find()\` с предикатом**:
\`\`\`js
const numbers = [1, 3, 7, 8, 10];

const findFirstEven = (arr) => arr.find((num) => num % 2 === 0);

console.log(findFirstEven(numbers)); // 8
\`\`\`
**Разбор**: Функция-предикат \`num => num % 2 === 0\` проверяет каждый элемент. Как только встречается число \`8\` (первое чётное число в массиве), \`find()\` останавливает дальнейший перебор и возвращает значение \`8\`.

### Ключевые выводы:
• \`find()\` возвращает значение самого элемента (а не его индекс или массив).
• Поиск прекращается при первом возврате \`true\` из предиката.`,

  js20: `### Суть задачи
Поиск первой строки в массиве слов, длина которой превышает переданное значение \`num\`.

### Пошаговые этапы решения:

1. **Проверка длины строки в предикате**:
\`\`\`js
const words = ["cat", "dog", "apple", "hi"];

const findLongWord = (arr, num) => arr.find((word) => word.length > num);

console.log(findLongWord(words, 4)); // "apple"
\`\`\`
**Разбор**: Предикат \`word.length > num\` последовательно проверяет длины элементов: \`3 > 4\` (false), \`3 > 4\` (false), \`5 > 4\` (true). Функция сразу возвращает строку \`"apple"\`.

### Ключевые выводы:
• Свойство \`length\` возвращает число символов в строке.
• Позволяет быстро находить элементы по любым динамическим условиям.`,

  js21: `### Суть задачи
Поиск первого отрицательного числа в массиве при помощи предиката \`num < 0\`.

### Пошаговые этапы решения:

1. **Поиск по условию отрицательности**:
\`\`\`js
const numbers = [5, 7, 3, -2, -8, 4];

const findFirstNegative = (arr) => arr.find((num) => num < 0);

console.log(findFirstNegative(numbers)); // -2
\`\`\`
**Разбор**: Элементы \`5, 7, 3\` дают \`false\`. Первым отрицательным числом оказывается \`-2\`, поэтому возвращается именно оно, а последующее число \`-8\` игнорируется.

### Ключевые выводы:
• \`find()\` идеально подходит для задач поиска первого подходящего значения без полной фильтрации массива.`,

  js22: `### Суть задачи
Поиск объекта в массиве структур по значению его внутреннего свойства \`name\`.

### Пошаговые этапы решения:

1. **Сравнение свойств объекта**:
\`\`\`js
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jack" },
];

const findUserByName = (arr, name) => arr.find((user) => user.name === name);

console.log(findUserByName(users, "Jane")); // { id: 2, name: "Jane" }
\`\`\`
**Разбор**: В предикат поступает очередной объект \`user\`. Выражение \`user.name === name\` сравнивает имя пользователя с искомым значением. При совпадении возвращается весь объект \`{ id: 2, name: "Jane" }\`.

### Ключевые выводы:
• В отличие от \`indexOf()\`, метод \`find()\` позволяет производить предикатный поиск по глубоким свойствам объектов.`,

  js23: `### Суть задачи
Понимание базовой спецификации и возвращаемого значения метода \`Array.prototype.find()\`, когда ни один элемент не удовлетворил условию.

### Пошаговые этапы решения:

1. **Выполнение кода при отсутствии совпадений**:
\`\`\`js
const arr = [1, 3, 5, 7];
const result = arr.find((num) => num % 2 === 0);

console.log(result); // undefined
\`\`\`
**Разбор**: В массиве \`[1, 3, 5, 7]\` содержатся только нечётные числа. Ни для одного элемента условие \`num % 2 === 0\` не вернуло \`true\`. В соответствии со спецификацией ECMAScript, метод \`find()\` возвращает \`undefined\`.

### Ключевые выводы:
• Отсутствие результата в \`find()\` всегда равно \`undefined\`.
• Для получения индекса используйте \`findIndex()\` (возвращает \`-1\`), а для списка всех элементов — \`filter()\` (возвращает \`[]\`).`,

  js24: `### Суть задачи
Фильтрация числового массива методом \`Array.prototype.filter()\` по математическому условию чётности.

### Пошаговые этапы решения:

1. **Применение метода \`filter()\`**:
\`\`\`js
const numbers = [1, 2, 3, 4, 5, 6];

const filterEven = (arr) => arr.filter((num) => num % 2 === 0);

console.log(filterEven(numbers)); // [2, 4, 6]
\`\`\`
**Разбор**: Метод \`filter()\` вызывает колбэк-функцию для каждого элемента массива. В новый массив попадают только те числа, для которых предикат \`num % 2 === 0\` вернул \`true\`.

### Ключевые выводы:
• \`filter()\` не изменяет исходный массив, а создаёт новый.
• Исходный массив остаётся в первозданном виде.`,

  js25: `### Суть задачи
Фильтрация текстового массива по значению свойства \`length\` каждого строкового элемента.

### Пошаговые этапы решения:

1. **Сравнение длины строки**:
\`\`\`js
const words = ["hi", "hello", "cat", "dog"];

const filterLongWords = (arr, num) => arr.filter((word) => word.length > num);

console.log(filterLongWords(words, 3)); // ["hello"]
\`\`\`
**Разбор**: Предикат \`word.length > 3\` оставляет только те слова, длина которых строго больше 3. Слово \`"hello"\` (5 символов) проходит фильтр, слова \`"hi"\` (2), \`"cat"\` (3) и \`"dog"\` (3) отбрасываются.

### Ключевые выводы:
• Длина строки вычисляется свойства \`length\`.
• Если условию удовлетворяет только один элемент, результат всё равно возвращается в виде массива \`["hello"]\`.`,

  js26: `### Суть задачи
Очистка массива от любых ложных (falsy) значений при помощи встроенного функции-конструктора \`Boolean\` в качестве предиката.

### Пошаговые этапы решения:

1. **Короткая запись \`filter(Boolean)\`**:
\`\`\`js
const values = [0, 1, false, 2, "", 3, null, undefined, NaN, 4];

const filterTruthy = (arr) => arr.filter(Boolean);

console.log(filterTruthy(values)); // [1, 2, 3, 4]
\`\`\`
**Разбор**: Функция \`Boolean\` неявно приказывает каждому элементу приведение к логическому типу. Ложные значения (\`0\`, \`false\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`) возвращают \`false\` и исключаются.

### Ключевые выводы:
• Вызов \`arr.filter(Boolean)\` — идиоматичный стандарт для удаления falsy элементов в JS.`,

  js27: `### Суть задачи
Фильтрация массива объектов по числовому свойству возраста \`age >= minAge\`.

### Пошаговые этапы решения:

1. **Фильтрация по свойству объекта**:
\`\`\`js
const users = [
  { name: "John", age: 17 },
  { name: "Jane", age: 20 },
  { name: "Jack", age: 15 },
  { name: "Jill", age: 25 },
];

const filterAdults = (arr, minAge) => arr.filter((user) => user.age >= minAge);

console.log(filterAdults(users, 18));
// [{ name: "Jane", age: 20 }, { name: "Jill", age: 25 }]
\`\`\`
**Разбор**: Колбэк берет очередной объект \`user\` и проверяет его свойство \`user.age >= 18\`. В итоговую выборку попадают только объекты пользователей, возраст которых не менее 18 лет.

### Ключевые выводы:
• Новые элементы массива являются ссылками на исходные объекты.`,

  js28: `### Суть задачи
Отбор элементов объекта по булевому свойству активности \`active\`.

### Пошаговые этапы решения:

1. **Проверка логического свойства**:
\`\`\`js
const users = [
  { name: "John", active: true },
  { name: "Jane", active: false },
  { name: "Jack", active: true },
];

const filterActiveUsers = (arr, value) => arr.filter((user) => user.active === value);

console.log(filterActiveUsers(users, true));
// [{ name: "John", active: true }, { name: "Jack", active: true }]
\`\`\`
**Разбор**: Предикат оставляет пользователей, у которых логический флаг \`user.active\` равен \`true\`.

### Ключевые выводы:
• Выражение \`user.active === true\` можно сократить до \`user.active\`.`,

  js29: `### Суть задачи
Композиция методов массива \`filter()\` и метода строки \`includes()\` для поиска подстрок в элементах.

### Пошаговые этапы решения:

1. **Связка \`filter\` + \`includes\`**:
\`\`\`js
const words = ["apple", "dog", "banana", "cat"];

const filterWordsWithLetter = (arr, letter) =>
  arr.filter((word) => word.includes(letter));

console.log(filterWordsWithLetter(words, "a"));
// ["apple", "banana", "cat"]
\`\`\`
**Разбор**: На каждом слове вызывается \`word.includes("a")\`. Слово \`"dog"\` отбрасывается, так как не содержит буквы \`"a"\`.

### Ключевые выводы:
• Позволяет объединять строковые методы и методы массивов в предикатах.`,

  js30: `### Суть задачи
Фильтрация массива по двойному граничному условию вхождения в интервал чисел \`[min, max]\`.

### Пошаговые этапы решения:

1. **Проверка двух условий с логическим И (\`&&\`)**:
\`\`\`js
const numbers = [10, 25, 40, 60, 5, 70];

const filterRange = (arr, min, max) =>
  arr.filter((num) => num >= min && num <= max);

console.log(filterRange(numbers, 20, 50)); // [25, 40]
\`\`\`
**Разбор**: Числа \`25\` и \`40\` строго лежат между \`20\` и \`50\`. Элементы \`10\`, \`60\`, \`5\`, \`70\` отсеиваются.

### Ключевые выводы:
• Оператор \`&&\` требует одновременного выполнения левой и правой части условия.`,

  js31: `### Суть задачи
Фильтрация списка сотрудников по конкретной строковой профессии (Level 1).

### Пошаговые этапы решения:

1. **Точное равенство строк**:
\`\`\`js
const filterByProfession = (arr, profession) =>
  arr.filter((person) => person.profession === profession);
\`\`\`
**Разбор**: Сравнивает строку профессии каждого человека с искомой строкой \`"программист"\`.

### Ключевые выводы:
• Уровень 1 основан на прямом сравнении свойства через \`===\`.`,

  js32: `### Суть задачи
Фильтрация сотрудников по вхождению подстроки в название должности (Level 2).

### Пошаговые этапы решения:

1. **Частичный поиск по должности**:
\`\`\`js
const findDevelopers = (team) => {
  return team.filter((member) => member.position.includes("Developer"));
};
\`\`\`
**Разбор**: Позволяет отбирать и \`Frontend Developer\`, и \`Backend Developer\`, аргументируя единым фильтром \`"Developer"\`.

### Ключевые выводы:
• Подстрочный поиск через \`includes()\` делает фильтрацию гибок.`,

  js33: `### Суть задачи
Фильтрация массива элементов по списку допустимых состояний из эталонного массива (Level 3).

### Пошаговые этапы решения:

1. **Проверка вхождения статуса в список**:
\`\`\`js
const filterByStatuses = (arr, statuses) =>
  arr.filter((app) => statuses.includes(app.status));
\`\`\`
**Разбор**: Метод \`statuses.includes(app.status)\` проверяет, содержится ли текущий статус заявки в разрешённом массиве \`["review", "accepted"]\`.

### Ключевые выводы:
• Связка \`filter()\` + \`statuses.includes()\` — эффективный паттерн для множественного выбора в веб-приложениях.`,

  js34: `### Суть задачи
Фильтрация массива с использованием встроенной функции-конструктора \`Boolean\` в качестве предиката.

### Пошаговые этапы решения:

1. **Применение \`filter(Boolean)\`**:
\`\`\`js
const arr = [0, 1, false, 2, "", 3];
const result = arr.filter(Boolean);

console.log(result); // [1, 2, 3]
\`\`\`
**Разбор**: Функция \`Boolean\` вызывается для каждого элемента массива и преобразует его к логическому типу (\`true\` или \`false\`). Значения \`0\`, \`false\` и \`""\` являются ложными (*falsy*), поэтому отфильтровываются. В результирующий массив попадают только истинные (*truthy*) значения: \`1\`, \`2\` и \`3\`.

### Ключевые выводы:
• \`arr.filter(Boolean)\` — идиоматичный и компактный способ отфильтровать все *falsy*-значения (\`0\`, \`""\`, \`false\`, \`null\`, \`undefined\`, \`NaN\`) из массива.
• Метод \`filter()\` всегда возвращает новый массив.`,

  js35: `### Суть задачи
Трансформация числового массива путем возведения каждого элемента в квадрат при помощи метода \`Array.prototype.map()\`.

### Пошаговые этапы решения:

1. **Применение метода \`map()\`**:
\`\`\`js
const numbers = [1, 2, 3, 4];

const squareNumbers = (arr) => arr.map((num) => num * num);

console.log(squareNumbers(numbers)); // [1, 4, 9, 16]
\`\`\`
**Разбор**: Метод \`map()\` обходит каждый элемент массива \`numbers\` и возвращает результат вычисления \`num * num\` в новый результирующий массив.

### Ключевые выводы:
• \`map()\` всегда создает новый массив той же длины.
• Исходный массив не мутирует.`,

  js36: `### Суть задачи
Проекция массива строк в массив чисел, соответствующих длине каждой строки.

### Пошаговые этапы решения:

1. **Извлечение длины строки**:
\`\`\`js
const words = ["apple", "banana", "cat"];

const getStringLengths = (arr) => arr.map((word) => word.length);

console.log(getStringLengths(words)); // [5, 6, 3]
\`\`\`
**Разбор**: В колбэке метода \`map()\` происходит доступ к свойству \`word.length\`. Слово \`"apple"\` превращается в \`5\`, \`"banana"\` в \`6\`, \`"cat"\` в \`3\`.

### Ключевые выводы:
• \`map()\` позволяет легко менять тип элементов (строки -> числа).`,

  js38: `### Суть задачи
Извлечение единичного свойства из массива объектов (проекция свойства \`name\`).

### Пошаговые этапы решения:

1. **Извлечение свойства объекта**:
\`\`\`js
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Jack" },
];

const getNames = (arr) => arr.map((user) => user.name);

console.log(getNames(users)); // ["John", "Jane", "Jack"]
\`\`\`
**Разбор**: Из каждого объекта массива извлекается только значение \`user.name\`, в результате чего получается плоский массив строк.

### Ключевые выводы:
• Частая задача во Frontend-разработке для подготовки списка опций в выпадающих меню.`,

  js39: `### Суть задачи
Конструирование новых строковых значений на основе нескольких свойств объектов при помощи интерполяции шаблонов.

### Пошаговые этапы решения:

1. **Формирование полного имени**:
\`\`\`js
const users = [
  { firstName: "John", lastName: "Doe" },
  { firstName: "Jane", lastName: "Smith" },
];

const getFullNames = (arr) =>
  arr.map((user) => \`\${user.firstName} \${user.lastName}\`);

console.log(getFullNames(users)); // ["John Doe", "Jane Smith"]
\`\`\`
**Разбор**: Шаблонная строка \`\${user.firstName} \${user.lastName}\` объединяет имя и фамилию через пробел для каждого объекта.

### Ключевые выводы:
• \`map()\` умеет изменять структуру данных и форматировать нескольких полей одновременно.`,

  js42: `### Суть задачи
Преобразование числового массива в массив логических флагов по предикату чётности.

### Пошаговые этапы решения:

1. **Преобразование в булевы значения**:
\`\`\`js
const numbers = [1, 2, 3, 4, 5];

const checkEven = (arr) => arr.map((num) => num % 2 === 0);

console.log(checkEven(numbers)); // [false, true, false, true, false]
\`\`\`
**Разбор**: Выражение \`num % 2 === 0\` вычисляет логическое значение \`true\` или \`false\` и помещает его на соответствующую позицию в итоговом массиве.

### Ключевые выводы:
• Длина и порядок элементов в результирующем массиве строго соответствуют исходному.`,

  js43: `### Суть задачи
Разбор типичной ошибки неявного возврата \`undefined\` при попытке использовать \`map()\` в роли \`filter()\`.

### Пошаговые этапы решения:

1. **Анализ поведения неявного return**:
\`\`\`js
const arr = [1, 2, 3];

const result = arr.map((num) => {
  if (num % 2 === 0) return num;
});

console.log(result); // [undefined, 2, undefined]
\`\`\`
**Разбор**: Метод \`map()\` обязательно должен сформировать элемент на каждой позиции массива. Для чисел \`1\` и \`3\` ветка \`if\` не срабатывает, явный \`return\` отсутствует, поэтому функция по умолчанию возвращает \`undefined\`. В результате получаем \`[undefined, 2, undefined]\`.

### Ключевые выводы:
• \`map()\` **не предназначен** для фильтрации или уменьшения длины массива.
• Если нужно одновременно отфильтровать и трансформировать — комбинируйте \`arr.filter(...).map(...)\`.`,

  js44: `### Суть задачи
Сортировка числового массива по возрастанию при помощи метода \`Array.prototype.sort()\` с компаратором \`(a, b) => a - b\`.

### Пошаговые этапы решения:

1. **Передача числовой функции компаратора**:
\`\`\`js
const numbers = [5, 2, 9, 1, 7];

const sortAscending = (arr) => arr.sort((a, b) => a - b);

console.log(sortAscending(numbers)); // [1, 2, 5, 7, 9]
\`\`\`
**Разбор**: Если \`a - b < 0\`, элемент \`a\` ставится перед \`b\`. Если \`a - b > 0\`, элемент \`b\` ставится перед \`a\`. Это обеспечивает верную числовую сортировку.

### Ключевые выводы:
• Без компаратора числа сортируются как строки (например, \`10\` встанет раньше \`2\`).
• \`sort()\` мутирует исходный массив на месте (in-place).`,

  js45: `### Суть задачи
Сортировка строкового массива в лексикографическом (алфавитном) порядке по умолчанию.

### Пошаговые этапы решения:

1. **Сортировка по алфавиту без параметров**:
\`\`\`js
const fruits = ["banana", "apple", "cherry"];

const sortAlphabetically = (arr) => arr.sort();

console.log(sortAlphabetically(fruits)); // ["apple", "banana", "cherry"]
\`\`\`
**Разбор**: По умолчанию метод \`sort()\` сравнивает элементы как строки по их юникод-кодам символов, поэтому слова располагаются по алфавиту.

### Ключевые выводы:
• Алфавитная сортировка латинских строк корректно работает по умолчанию.`,

  js46: `### Суть задачи
Сортировка элементов в обратном алфавитном порядке путем комбинации методов \`sort()\` и \`reverse()\`.

### Пошаговые этапы решения:

1. **Композиция \`sort()\` + \`reverse()\`**:
\`\`\`js
const fruits = ["banana", "apple", "cherry"];

const sortReverseAlphabetically = (arr) => arr.sort().reverse();

console.log(sortReverseAlphabetically(fruits)); // ["cherry", "banana", "apple"]
\`\`\`
**Разбор**: Сначала метод \`sort()\` сортирует слова по алфавиту \`["apple", "banana", "cherry"]\`, а затем \`reverse()\` разворачивает порядок в противоположную сторону.

### Ключевые выводы:
• Оба метода мутируют исходный массив и возвращают ссылку на него.`,

  js47: `### Суть задачи
Сортировка массива объектов по значению числового свойства возраста \`age\` по возрастанию.

### Пошаговые этапы решения:

1. **Компаратор для объектов**:
\`\`\`js
const users = [
  { name: "John", age: 25 },
  { name: "Jane", age: 20 },
  { name: "Jack", age: 30 },
];

const sortByAge = (arr) => arr.sort((a, b) => a.age - b.age);

console.log(sortByAge(users));
// [{ name: "Jane", age: 20 }, { name: "John", age: 25 }, { name: "Jack", age: 30 }]
\`\`\`
**Разбор**: Функция компаратор получает два объекта \`a\` и \`b\` и сравнивает их свойства \`a.age - b.age\`.

### Ключевые выводы:
• Позволяет производить кастомную сортировку любых коллекций объектов.`,

  js48: `### Суть задачи
Сортировка массива строк по значению свойства \`length\` каждого элемента.

### Пошаговые этапы решения:

1. **Компаратор по длине**:
\`\`\`js
const words = ["apple", "hi", "banana", "cat"];

const sortByLength = (arr) => arr.sort((a, b) => a.length - b.length);

console.log(sortByLength(words)); // ["hi", "cat", "apple", "banana"]
\`\`\`
**Разбор**: Компаратор сравнивает длины слов \`a.length - b.length\`. Слово \`"hi"\` (2) встает первым, \`"cat"\` (3) следующим, \`"apple"\` (5) и \`"banana"\` (6) замыкают список.

### Ключевые выводы:
• В современных браузерах алгоритм \`sort()\` гарантирует стабильную (stable) сортировку.`,

  js49: `### Суть задачи
Группировка и составная сортировка (чётные числа перед нечётными, каждая группа отсортирована по возрастанию).

### Пошаговые этапы решения:

1. **Разделение массива и сортировка каждой группы**:
\`\`\`js
const rearrangeArray = (arr) => {
  const evens = arr.filter((x) => x % 2 === 0).sort((a, b) => a - b);
  const odds = arr.filter((x) => x % 2 !== 0).sort((a, b) => a - b);

  return [...evens, ...odds];
};

console.log(rearrangeArray([5, 3, 2, 8, 1, 4])); // [2, 4, 8, 1, 3, 5]
console.log(rearrangeArray([-1, 0, -5, 7, 2])); // [0, 2, -5, -1, 7]
console.log(rearrangeArray([])); // []
\`\`\`
**Разбор**: Сначала отбираются чётные элементы \`x % 2 === 0\` и сортируются по возрастанию. Затем нечётные элементы \`x % 2 !== 0\` сортируются аналогично. В конце обе группы объявляются в итоговом массиве оператором spread \`[...evens, ...odds]\`.

### Ключевые выводы:
• Проверка \`x % 2 !== 0\` корректно обрабатывает отрицательные нечетные числа (например, \`-1 % 2 === -1\`).
• Итоговый массив содержит элементы в требуемой спецификацией последовательности.`,

  js50: `### Суть задачи
Разбор особенности дефолтного поведения метода \`sort()\` без аргумента-компаратора на числовом массиве.

### Пошаговые этапы решения:

1. **Анализ работы строковой сортировки**:
\`\`\`js
const numbers = [1, 30, 4, 21, 100];
const result = numbers.sort();

console.log(result); // [1, 100, 21, 30, 4]
\`\`\`
**Разбор**: Вызов \`sort()\` без передачи компаратора приводит все элементы массива к строкам: \`"1"\`, \`"30"\`, \`"4"\`, \`"21"\`, \`"100"\`. Сравнение происходит по кодам символов Unicode. По этой причине строка \`"100"\` (начинается на \`"1"\`) идет раньше строки \`"21"\` (начинается на \`"2"\`), а \`"4"\` оказывается в самом конце.

### Ключевые выводы:
• Длинные числа без передаваемого компаратора сортируются неверно.
• Для математически корректной сортировки чисел **всегда** передавайте компаратор \`(a, b) => a - b\`.`,

  js51: `### Суть задачи
Базовый абстрактный синтаксис метода \`Array.prototype.reduce()\`.

### Пошаговые этапы решения:

1. **Абстрактный синтаксис \`reduce()\`**:
\`\`\`js
arr.reduce((acc, item) => {
  return acc;
}, initialValue);
\`\`\`
**Разбор**: Метод \`reduce()\` принимает функцию-колбэк и начальное значение \`initialValue\`. Колбэк вызывается для каждого элемента и принимает:
• \`acc\` (аккумулятор) — накопленный результат предыдущего шага или \`initialValue\` на первом шаге.
• \`item\` (текущий элемент) — значение текущего элемента массива.
• Дополнительно могут передаваться \`index\` (текущий индекс) и \`array\` (сам массив).

### Ключевые выводы:
• Всегда возвращайте обновлённый \`acc\` из тела функции редюсера.
• Передача \`initialValue\` защищает от ошибок при обработке пустых массивов.`,

  js52: `### Суть задачи
Подсчет общей суммы элементов числового массива с гарантиями безопасного поведения на пустых массивах.

### Пошаговые этапы решения:

1. **Сложительное аккумулирование**:
\`\`\`js
const sum = (arr) => arr.reduce((acc, num) => acc + num, 0);

console.log(sum([1, 2, 3, 4, 5])); // 15
console.log(sum([]));              // 0
\`\`\`
**Разбор**: Передача начального аргумента \`0\` гарантирует, что вызов \`sum([])\` вернет \`0\`, а не упадет с \`TypeError\`.

### Ключевые выводы:
• Явное начальное значение — важнейшее правило безопасного кода.`,

  js53: `### Суть задачи
Агрегация числового свойства объектов (цены \`price\`) из массива в единую стоимость.

### Пошаговые этапы решения:

1. **Суммирование свойства объекта**:
\`\`\`js
const cart = [
  { name: "Laptop", price: 1000 },
  { name: "Phone", price: 500 },
  { name: "Tablet", price: 800 },
];

const totalCartPrice = (cart) => cart.reduce((sum, item) => sum + item.price, 0);

console.log(sum(cart)); // 2300
\`\`\`
**Разбор**: Аккумулятор начинается с числа \`0\` и на каждом шаге увеличивается на значение \`prod.price\`.

### Ключевые выводы:
• Без начального значения \`0\` вычисление упадет из-за попытки прибавить число к первому объекту массива.`,

  js54: `### Суть задачи
Одновременное вычисление суммы и произведения чисел за один проход по массиву с использованием объекта-аккумулятора.

### Пошаговые этапы решения:

1. **Аккумуляция в объект**:
\`\`\`js
const numbers = [1, 2, 3, 4, 5];

const sumAndProduct = (arr) => {
  return arr.reduce((acc, num) => {
    acc.sum += num;
    acc.prod *= num;

    return acc;
  }, { sum: 0, prod: 1 });
};

console.log(sum(numbers)); // { sum: 15, prod: 120 }
\`\`\`
**Разбор**: Начальный аккумулятор — объект \`{ sum: 0, prod: 1 }\`. Внутри цикла обновляются оба поля объекта и возвращается объект-аккумулятор.

### Ключевые выводы:
• Для произведения стартовое значение должно равняться \`1\`.`,

  js55: `### Суть задачи
Подсчет количества повторяющихся элементов в массиве с формированием хэш-таблицы (объекта с частотами).

### Пошаговые этапы решения:

1. **Подсчет частот элементов**:
\`\`\`js
const countOccurrences = (arr) => {
  return arr.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});
};

console.log(countOccurrences(['a', 'b', 'a', 'c', 'b', 'a'])); // { a: 3, b: 2, c: 1 }
\`\`\`
**Разбор**: Выражение \`(acc[el] || 0)\` возвращает \`0\` для нового элемента и увеличивает счетчик на \`1\`.

### Ключевые выводы:
• Идиоматичный метод подсчета статистики в JS.`,

  js56: `### Суть задачи
Расчет суммарной стоимости корзины покупок с учетом количества единиц каждого товара (\`price * quantity\`).

### Пошаговые этапы решения:

1. **Деструктуризация полей объекта**:
\`\`\`js
const products = [
  { name: "Хлеб", price: 50, quantity: 2 },
  { name: "Молоко", price: 80, quantity: 1 },
  { name: "Яйца", price: 120, quantity: 3 },
];

const totalPrice = (cart) => {
  return cart.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
};

console.log(totalPrice(products)); // 540
\`\`\`
**Разбор**: Аргумент редюсера деструктурирует \`{ price, quantity }\` из очередного товара и прибавляет результат умножения к аккумулятору.

### Ключевые выводы:
• Деструктуризация параметров делает функции чистыми и сжатыми.`,

  js57: `### Суть задачи
Поиск экстремумов (минимума и максимума) в массиве чисел за единый проход.

### Пошаговые этапы решения:

1. **Обновление аккумулятора с Infinity**:
\`\`\`js
const numbers = [23, 4, 45, 2, 8, 16];

const findMinMax = (arr) => {
  return arr.reduce((acc, num) => {
    acc.min = Math.min(acc.min, num);
    acc.max = Math.max(acc.max, num);

    return acc;
  }, { min: Infinity, max: -Infinity });
};

console.log(findMinMax(numbers)); // { min: 2, max: 45 }
\`\`\`
**Разбор**: Начальные границы \`min: Infinity\` и \`max: -Infinity\` гарантируют корректную перезапись при первой же итерации для любого числа.

### Ключевые выводы:
• Вычислять оба экстремума за 1 проход выгоднее по времени, чем два раздельных вызова Math.min/Math.max.`,

  js58: `### Суть задачи
Разглаживание двухмерного массива (массива массивов) в плоский одномерный массив.

### Пошаговые этапы решения:

1. **Накопление элементов через push и spread**:
\`\`\`js
const flatten = (arr) => {
  return arr.reduce((acc, el) => {
    acc.push(...el);
    return acc;
  }, []);
};

console.log(flatten([[1, 2], [3, 4], [5]])); // [1, 2, 3, 4, 5]
\`\`\`
**Разбор**: Вызов \`acc.push(...el)\` раскладывает элементы подмассива и добавляет их в текущий результирующий массив \`acc\`.

### Ключевые выводы:
• Метод \`acc.push(...el)\` эффективнее по памяти, чем \`[...acc, ...el]\`.`,

  js59: `### Суть задачи
Группировка элементов массива в объект по значению динамически передаваемого ключа.

### Пошаговые этапы решения:

1. **Формирование списков по ключу**:
\`\`\`js
const people = [
  { age: 20, name: "Alice" },
  { age: 30, name: "Brat" },
  { age: 20, name: "Sem" },
];

const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = item[key];

    acc[groupKey] ??= [];
    acc[groupKey].push(item);

    return acc;
  }, {});
};

console.log(groupBy(people, "age"));
\`\`\`
**Разбор**: Оператор \`item[key]\` динамически вычисляет имя ключа (например, возраст \`20\` или \`30\`), а оператор \`??=\` создает массив под группу, если его ещё не было.

### Ключевые выводы:
• Двухбуквенный синтаксис \`??=\` делает инициализацию групп лаконичной.`,

  js60: `### Суть задачи
Группировка элементов с дополнительной сортировкой списков внутри каждой сформированной группы.

### Пошаговые этапы решения:

1. **Группировка и вызов sort()**:
\`\`\`js
const words = ["тест", "привет", "фoo", "бар"];

const groupByLength = (words) => {
  return arr.reduce((acc, word) => {
    acc[word.length] ??= [];
    acc[word.length].push(word);
    acc[word.length].sort();

    return acc;
  }, {});
};

console.log(groupBy(words)); // { '3': ['бар', 'фoo'], '4': ['тест'], '6': ['привет'] }
\`\`\`
**Разбор**: Элементы раскладываются по ключам длин слов (\`word.length\`) и после добавления упорядочиваются по алфавиту методом \`sort()\`.

### Ключевые выводы:
• Показывает возможности сочетания редюсеров с методами мутации массивов.`,

  js63: `### Суть задачи
Вычисление среднего арифметического значений числового массива с помощью метода \`reduce()\`.

### Варианты реализации:

1. **Вариант 1: Идиоматичный двухэтапный расчет (сумма через reduce / длина)**:
\`\`\`js
const average = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};
\`\`\`
**Разбор**: Наиболее читаемый и распространенный в продакшене подход. \`reduce\` отвечает строго за свертку суммы, а деление на общую длину выполняется один раз в конце за время O(1).

2. **Вариант 2: Однопроходный расчет внутри редюсера через 4-й аргумент (arr)**:
\`\`\`js
const averageSinglePass = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num, _, arr) => acc + num / arr.length, 0);
};
\`\`\`
**Разбор**: Использует 4-й аргумент колбэка \`reduce\` (ссылку на исходный массив \`arr\`), прибавляя к аккумулятору долю каждого элемента \`num / arr.length\`.

### Сложность:
• **Время**: O(N) — один линейный проход по элементам массива.
• **Память**: O(1) — константный расход памяти.
### Граничные случаи и ошибки:
- Пустой массив: проверка length === 0 предотвращает деление на 0 (дающее NaN).
### Что запомнить:
Двухэтапный расчет через сумму и деление на length — самый чистый и идиоматичный вариант на собеседовании.`,

  js64: `### Суть задачи
Преобразование массива пар [курс, часы] в ассоциативный объект.

### Пошаговые этапы решения:

1. **Наполнение объекта свойствами**:
\`\`\`js
const courses = [
  ["JavaScript", 40],
  ["React", 30],
  ["TypeScript", 25],
];

const coursesToObject = (courses) => {
  return courses.reduce((acc, [course, hours]) => {
    acc[course] = hours;
    return acc;
  }, {});
};

console.log(coursesToObject(courses));
\`\`\`
**Разбор**: Деструктурированные значения \`[course, hours]\` связываются в аккумулирующем объекте как ключ и значение.

### Ключевые выводы:
• Прямая запись \`acc[course] = hours\` работает за O(N) и эффективнее иммутабельного спреда внутри редюсера, дающего O(N²).
• В качестве альтернативы можно использовать встроенный метод \`Object.fromEntries(courses)\`.`,

  js65: `### Суть задачи
Суммирование расходов по категориям с помощью метода \`reduce()\`.

### Пошаговые этапы решения:

1. **Использование nullish-оператора для инициализации**:
\`\`\`js
const expenses = [
  { category: "Еда", amount: 500 },
  { category: "Транспорт", amount: 150 },
  { category: "Еда", amount: 300 },
  { category: "Развлечения", amount: 1000 },
  { category: "Транспорт", amount: 200 },
];

const sumByCategory = (expenses) => {
  return expenses.reduce((acc, { category, amount }) => {
    acc[category] ??= 0;
    acc[category] += amount;

    return acc;
  }, {});
};

console.log(sumByCategory(expenses));
// { "Еда": 800, "Транспорт": 350, "Развлечения": 1000 }
\`\`\`
**Разбор**: Оператор \`acc[category] ??= 0\` устанавливает начальный ноль для неизвестной категории при первом вхождении, после чего значение \`amount\` суммируется в аккумуляторе.

### Ключевые выводы:
• Оператор \`??=\` семантически точнее \`||\`, так как реагирует строго на \`null\` и \`undefined\`, не сбрасывая существующий нулевой баланс.
• Решение работает за O(N) времени и использует O(K) памяти по количеству уникальных категорий.`,

  js66: `### Суть задачи
Группировка названий продуктов по их категории с использованием метода \`reduce()\`.

### Пошаговые этапы решения:

1. **Группировка названий по категории**:
\`\`\`js
const groupProductsByCategory = (products) => {
  return products.reduce((acc, product) => {
    acc[product.category] ??= [];
    acc[product.category].push(product.name);
    return acc;
  }, {});
};
\`\`\`
**Разбор**: На каждой итерации проверяется наличие массива для \`product.category\`. В созданный массив добавляется название продукта (\`product.name\`).

### Ключевые выводы:
• \`reduce()\` позволяет извлекать конкретные поля объектов (например, \`name\`) и группировать их по значению другого поля (\`category\`).`,

  js67: `### Суть задачи
Построение многоуровневой структуры объектов (страна -> id пользователя -> данные) за 1 проход (Company X).

### Пошаговые этапы решения:

1. **Вложенная группировка по ключам**:
\`\`\`js
const groupCountries = (data) => {
  return data.reduce((acc, { id, age, name, country }) => {
    acc[country] ??= {};
    acc[country][id] = { age, name, country };

    return acc;
  }, {});
};
\`\`\`
**Разбор**: На 1 уровне создается объект страны \`acc[country] ??= {}\`. На 2 уровне объект пользователя привязывается к своему \`id\` внутри страны.

### Ключевые выводы:
• Алгоритм выполняется за время O(N) без вложенных циклов.`,

  js68: `### Суть задачи
Разбор поведения аккумулятора в методе \`reduce()\` при отсуствии начального значения \`initialValue\`.

### Пошаговые этапы решения:

1. **Анализ первого шага редюсера**:
\`\`\`js
const arr = [1, 2, 3];
const result = arr.reduce((acc, num) => acc + num);

console.log(result); // 6
\`\`\`
**Разбор**: Если \`initialValue\` не передан, редюсер берет в качестве начального аккумулятора перый элемент массива \`arr[0]\` (значение \`1\`), а итерация начинается сразу со второго элемента (индекс \`1\`, значение \`2\`). Результат вычисляется как \`1 + 2 + 3 = 6\`.

### Ключевые выводы:
• Для простых числовых массивов отсутствие \`initialValue\` работает, но на пустых массивах вызовет ошибку.`,

  js69: `### Суть задачи
Базовое использование функции \`setTimeout()\` для планирования асинхронного вызова функции через 1000мс.

### Пошаговые этапы решения:

1. **Вызов setTimeout**:
\`\`\`js
const timerId = setTimeout(() => {
  console.log('Прошла 1 секунда');
}, 1000);

console.log(timerId); // Выведет ID таймера (число в браузере или объект в Node.js)
\`\`\`
**Разбор**: Передаваемый колбэк регистрируется веб-окружением и сработает не ранее чем через указанное число миллисекунд.

### Ключевые выводы:
• Возвращаемый \`timerId\` позволяет при необходимости отменить запуск через \`clearTimeout(timerId)\`.`,

  js70: `### Суть задачи
Реализация популярного паттерна \`debounce\` (устранение дребезга) для оптимизации часто вызываемых событий (например, ввода в инпут).

### Пошаговые этапы решения:

1. **Замыкание идентификатора таймера**:
\`\`\`js
const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
\`\`\`
**Разбор**: При каждом новом вызове функции счетчик \`clearTimeout(timeoutId)\` сбрасывает прошлый таймер, а новый \`setTimeout\` запускает отсчет заново.

### Ключевые выводы:
• Вызов произойдет только 1 раз спустя \`delay\` мс ПОСЛЕ последнего события.`,

  js71: `### Суть задачи
Понимание порядка выполнения макрозадач и синхронного кода в Event Loop при задержке в 0мс.

### Пошаговые этапы решения:

1. **Анализ порядка работы Event Loop**:
\`\`\`js
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');
\`\`\`
**Разбор**:
• Выполняется синхронно: \`console.log('1')\` -> в консоль выводится **1**.
• Колбэк \`setTimeout\` уходит в очередь макрозадач (MacroTask Queue).
• Выполняется синхронно: \`console.log('3')\` -> в консоль выводится **3**.
• Стек синхронных вызовов опустел. Event Loop забирает таймаут -> выводится **2**.

### Ключевые выводы:
• Порядок вывода: **1, 3, 2**. Задержка \`0мс\` означает "выполнить при первой возможности после очистки главного стека".`,

  js72: `### Суть задачи
Анализ последовательности вывода сообщений при разнородных задержках и вложенных таймерах.

### Пошаговые этапы решения:

1. **Трассировка очереди вызовов**:
\`\`\`js
console.log('Start'); // 1. Синхронно

setTimeout(() => { ... }, 1000); // Таймер на 1000мс
setTimeout(() => { console.log('Timeout 2'); }, 500); // Таймер на 500мс

console.log('End'); // 2. Синхронно
\`\`\`
**Разбор**:
1. Синхронный код: сначала выведется **Start**, затем **End**.
2. Через 500мс раньше сработает второй таймер -> выведет **Timeout 2**.
3. Через 1000мс сработает первый таймер: выведет **Timeout 1**, зарегистрирует вложенный таймер с задержкой 0, синхронно выведет **Between timeouts**.
4. Вложенный таймер выполнится на следующем тике -> выведет **Nested Timeout**.

### Ключевые выводы:
• Порядок вывода: **Start → End → Timeout 2 → Timeout 1 → Between timeouts → Nested Timeout**.`,

  js75: `### Суть задачи
Анализ совместного использования \`setInterval()\`, \`clearInterval()\` и \`setTimeout()\`.

### Пошаговые этапы решения:

1. **Хронология работы**:
\`\`\`js
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log("Interval tick:", count);
  if (count === 3) {
    clearInterval(intervalId);
  }
}, 1000);

setTimeout(() => {
  console.log("Timeout finished");
}, 5000);
\`\`\`
**Разбор**:
• 1000мс: **Interval tick: 1**
• 2000мс: **Interval tick: 2**
• 3000мс: **Interval tick: 3**, условие \`count === 3\` выполняется и вызов \`clearInterval(intervalId)\` останавливает интервал.
• 5000мс: Срабатывает \`setTimeout\` и выводит **Timeout finished**.

### Ключевые выводы:
• Порядок вывода: **Interval tick: 1 → Interval tick: 2 → Interval tick: 3 → Timeout finished**.`,

  js76: `### Суть задачи
Базовое использование функции \`setInterval()\` для периодического повторения задач каждую секунду (1000мс).

### Пошаговые этапы решения:

1. **Запуск циклического интервала**:
\`\`\`js
const intervalId = setInterval(() => {
  console.log('Я выполняюсь каждую секунду');
}, 1000);

console.log(intervalId); // Выведет идентификатор интервала
\`\`\`
**Разбор**: Функция-колбэк передается в веб-окружение и будет вызываться с регулярным шагом в 1000мс до тех пор, пока не будет отменена через \`clearInterval(intervalId)\`.

### Ключевые выводы:
• \`setInterval\` возвращает идентификатор интервала, который необходимо сохранять для последующей очистки.`,

  js77: `### Суть задачи
Создание таймера обратного отсчета с автоматической самоочисткой интервала при достижении нуля.

### Пошаговые этапы решения:

1. **Реализация логики сброса**:
\`\`\`js
const createTimer = (seconds) => {
  let timeLeft = seconds;
  
  const intervalId = setInterval(() => {
    console.log(timeLeft);
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      console.log("Time's up!");
    }
  }, 1000);

  return intervalId;
};
\`\`\`
**Разбор**: На каждом шаге переданная секунда уменьшается на 1. Условие \`timeLeft <= 0\` вызывает \`clearInterval(intervalId)\`, предотвращая утечку памяти.

### Ключевые выводы:
• Всегда очищайте интервал внутри колбэка при достижении терминального условия.`,

  js78: `### Суть задачи
Анализ хронологии выполнения \`setInterval()\` и его остановки через \`clearInterval()\` после 3 срабатываний.

### Пошаговые этапы решения:

1. **Хронологический разбор вывода**:
\`\`\`js
let count = 0;

const intervalId = setInterval(() => {
    count++;
    console.log(count);
    if (count === 3) {
        clearInterval(intervalId);
    }
}, 1000);
\`\`\`
**Разбор**:
• Через 1000мс: \`count = 1\` -> выводится **1**.
• Через 2000мс: \`count = 2\` -> выводится **2**.
• Через 3000мс: \`count = 3\` -> выводится **3**, вызывается \`clearInterval(intervalId)\`.

### Ключевые выводы:
• Первая итерация происходит спустя 1000мс (а не моментально при запуске функции).`,

  js79: `### Суть задачи
Понимание относительного порядка срабатывания синхронного кода, \`setTimeout\` (500мс) и \`setInterval\` (1000мс).

### Пошаговые этапы решения:

1. **Трассировка таймеров**:
\`\`\`js
console.log("Start");

const intervalId = setInterval(() => {
  console.log("Interval 1000");
}, 1000);

setTimeout(() => {
  console.log("Timeout 500");
}, 500);

console.log("End");
\`\`\`
**Разбор**:
1. Сначала синхронно выводится **Start** и **End**.
2. Через 500мс у таймаута наступает срок исполнения раньше, чем у 1000мс интервала -> выводит **Timeout 500**.
3. Через 1000мс срабатывает первый тик интервала -> выводит **Interval 1000**.
4. Через 2000мс срабатывает второй тик интервала -> выводит **Interval 1000**.

### Ключевые выводы:
• Порядок вывода в первые 2 секунды: **Start → End → Timeout 500 (0.5s) → Interval 1000 (1s) → Interval 1000 (2s)**.`,

  js80: `### Суть задачи
Анализ взаимодействия двух параллельных интервалов, мутирующих одно и то же внешнее состояние.

### Пошаговые этапы решения:

1. **Хронология работы двух интервалов**:
\`\`\`js
let counter = 0;

function startInterval() {
  return setInterval(() => {
    counter++;
    console.log(\`Counter: \${counter}\`);
  }, 1000);
}

const id1 = startInterval();
const id2 = startInterval();

setTimeout(() => {
  clearInterval(id1);
  console.log("Stopped first interval");
}, 2500);
\`\`\`
**Разбор**:
• 1000мс: id1 делает \`counter++\` (1) и выводит **Counter: 1**. На том же тике id2 делает \`counter++\` (2) и выводит **Counter: 2**.
• 2000мс: id1 делает \`counter++\` (3) -> **Counter: 3**. id2 делает \`counter++\` (4) -> **Counter: 4**.
• 2500мс: Срабатывает \`setTimeout\`, вызывается \`clearInterval(id1)\` -> выводится **Stopped first interval**.
• 3000мс: id2 (единственный оставшийся) делает \`counter++\` (5) -> **Counter: 5**.

### Ключевые выводы:
• Несколько интервалов, изменяющих одну переменную, удваивают скорость инкремента.`,

  js81: `### Суть задачи
Написание функции \`getUnique(arr)\` для удаления повторов из массива с помощью структуры данных \`Set\` и разворачивания спред-оператором.

### Пошаговые этапы решения:

1. **Реализация функции через Set и spread**:
\`\`\`js
const getUnique = (arr) => {
  return [...new Set(arr)];
};

console.log(getUnique([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
console.log(getUnique(["a", "b", "a", "c"]));   // ["a", "b", "c"]
\`\`\`
**Разбор**: Конструктор \`new Set(arr)\` принимает итерируемый массив и фильтрует дубликаты, сохраняя только уникальные значения. Оператор спред \`[...]\` собирает элементы сета обратно в новый массив.

### Ключевые выводы:
• Самый эффективный и идиоматичный способ получения массива уникальных примитивов за O(N) по времени и O(N) по памяти.`,

  js82: `### Суть задачи
Написание функции \`getUniqueWords(text)\` для получения массива уникальных слов из строки в нижнем регистре.

### Пошаговые этапы решения:

1. **Приведение к нижнему регистру, разделение и дедупликация**:
\`\`\`js
const getUniqueWords = (text) => {
  return [...new Set(text.toLowerCase().split(" "))];
};

console.log(getUniqueWords("яблоко банан ЯБЛОКО груша Банан"));
// ["яблоко", "банан", "груша"]
\`\`\`
**Разбор**: Метод \`text.toLowerCase()\` приводит всю строку к нижнему регистру, \`split(" ")\` разбивает ее на массив слов, а \`new Set(...)\` удаляет повторы. Спред-оператор \`[...]\` собирает результат обратно в массив.

### Ключевые выводы:
• Коллекция \`Set\` чувствительна к регистру символов, поэтому приведение через \`toLowerCase()\` необходимо для корректной дедупликации слов без учета регистра.`,

  js83: `### Суть задачи
Поиск первого элемента, встречающегося в массиве более одного раза, с помощью множества \`Set\`. Если повторов нет, возвращается \`undefined\`.

### Пошаговые этапы решения:

1. **Итерация с Set.has()**:
\`\`\`js
const firstRepeated = (arr) => {
  const unique = new Set();

  for (const el of arr) {
    if (unique.has(el)) return el;
    unique.add(el);
  }

  return undefined;
};

console.log(firstRepeated([2, 5, 1, 2, 3, 5, 1])); // 2
console.log(firstRepeated([2, 1, 3, 5, 3, 2]));    // 3
console.log(firstRepeated([1, 2, 3, 4]));          // undefined
\`\`\`
**Разбор**: На каждом шагу проверяем \`unique.has(el)\`. Если элемент уже есть в множестве — это и есть первый повтор. Если цикл завершился без совпадений, возвращаем \`undefined\`.

### Ключевые выводы:
• Алгоритм работает за O(N) по времени и O(N) по памяти (в отличие от O(N²) с вложенными циклами).`,

  js84: `### Суть задачи
Удаление дубликатов из массива объектов с сохранением первого вхождения по уникальному значению свойства \`id\`.

### Пошаговые этапы решения:

1. **Фильтрация по Set встречавшихся ID**:
\`\`\`js
const users = [
  { id: 1, name: "Ann" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Ann 2" },
  { id: 3, name: "Kate" },
];

const getUniqueUsers = (users) => {
  const seenIds = new Set();
  return users.filter((user) => {
    if (seenIds.has(user.id)) return false;
    seenIds.add(user.id);
    return true;
  });
};

console.log(getUniqueUsers(users));
// [
//   { id: 1, name: "Ann" },
//   { id: 2, name: "Bob" },
//   { id: 3, name: "Kate" }
// ]
\`\`\`
**Разбор**: Прямой вызов \`new Set(users)\` не удалит дубликаты объектов, так как они сравниваются по ссылке. Отслеживание первичных ключей (\`user.id\`) в множестве \`seenIds\` позволяет отфильтровать дубликаты, сохраняя первое вхождение.

### Ключевые выводы:
• Классический прием отбора уникальных объектов по ID во фронтенд-разработке за O(N) времени.`,

  js85: `### Суть задачи
Анализ работы основных методов экземпляра \`Set\`: \`add()\`, \`has()\`, \`delete()\`, \`clear()\` и свойства \`size\`.

### Пошаговые этапы решения:

1. **Трассировка методов**:
\`\`\`js
const set = new Set();

set.add(1);
set.add(2);
set.add(2);
set.add(3);

console.log(set.size);   // 3 (дубликат 2 не добавлен)
console.log(set.has(2));  // true
set.delete(2);
console.log(set.has(2));  // false
set.clear();
console.log(set.size);   // 0
\`\`\`
**Разбор**: Свойство \`size\` возвращает число элементов. Повторный \`add(2)\` пропущен. Вызовы \`delete\` и \`clear\` удаляют элемент и очищают коллекцию соответственно.

### Ключевые выводы:
• Результат вывода: **3, true, false, 0**.`,

  js86: `### Суть задачи
Разбор механизма сравнения ссылочных типов данных (объектов) внутри коллекции \`Set\`.

### Пошаговые этапы решения:

1. **Проверка объектов на равенство по ссылке**:
\`\`\`js
const a = { x: 1 };
const b = { x: 1 };

const set = new Set();
set.add(a);
set.add(b);

console.log(set.size);          // 2
console.log(set.has(a));         // true
console.log(set.has({ x: 1 }));  // false
\`\`\`
**Разбор**:
• Объект \`a\` и объект \`b\` имеют разные ссылки в памяти, поэтому \`set.size\` равен 2.
• \`set.has(a)\` возвращает true, так как именно эта ссылка сохранена в сете.
• \`set.has({ x: 1 })\` создает совершенно новую ссылку, которой в сете нет.

### Ключевые выводы:
• Результат вывода: **2, true, false**.`,

  js88: `### Суть задачи
Анализ работы итератора \`for...of\` при вызове метода \`set.delete()\`.

### Пошаговые этапы решения:

1. **Итерация с удалением**:
\`\`\`js
const set = new Set([1, 2, 3, 4]);

for (const v of set) {
  console.log("iter", v);
  if (v % 2 === 0) {
    set.delete(v);
  }
}

console.log("final", [...set]);
\`\`\`
**Разбор**: Итератор \`Set\` устойчив к вызову \`delete()\` в процессе цикла. Он последовательно пройдет элементы 1, 2, 3, 4 и удалит 2 и 4.

### Ключевые выводы:
• В консоль выведутся все 4 итерации: **iter 1, iter 2, iter 3, iter 4**, а в конце в сете останутся **[1, 3]**.`,

  js89: `### Суть задачи
Базовое создание объекта \`Map\` и добавление элементов методом \`set()\`.

### Пошаговые этапы решения:

1. **Создание Map и вызовы set()**:
\`\`\`js
const map = new Map();
map.set("a", 1);
map.set("b", 2);
map.set("c", 3);

console.log(map);
\`\`\`
**Разбор**: В отличие от обычных объектов, добавление элементов в Map выполняется через метод \`set(key, value)\`.

### Ключевые выводы:
• \`map.set()\` можно вызывать по цепочке (чейнинг), так как он возвращает сам объект Map.`,

  js90: `### Суть задачи
Инициализация Map из готового массива пар ключ-значение.

### Пошаговые этапы решения:

1. **Инициализация в конструкторе**:
\`\`\`js
const map = new Map([
  ["name", "Иван"],
  ["age", 30],
  ["city", "Москва"],
]);

console.log(map.get("name")); // "Иван"
\`\`\`
**Разбор**: Конструктор \`new Map()\` принимает любой итерируемый объект с элементами \`[key, value]\`.

### Ключевые выводы:
• Удобный способ создания мгновенно заполненного словаря.`,

  js91: `### Суть задачи
Безопасное извлечение значения из Map с проверкой наличия ключа.

### Пошаговые этапы решения:

1. **Проверка ключа с помощью Map.has()**:
\`\`\`js
const getValue = (map, key) => {
  return map.has(key) ? map.get(key) : "not found";
};
\`\`\`
**Разбор**: Метод \`map.has(key)\` возвращает булево значение существования ключа.

### Ключевые выводы:
• Позволяет отличить отсутствие ключа в Map от ключа со значением \`undefined\`.`,

  js92: `### Суть задачи
Проверка существования ключа и его удаление методом \`delete()\`.

### Пошаговые этапы решения:

1. **Удаление элементов**:
\`\`\`js
const removeIfExists = (map, key) => {
  if (map.has(key)) {
    map.delete(key);
    return true;
  }
  return false;
};
\`\`\`
**Разбор**: Метод \`map.delete(key)\` удаляет пару и возвращает true/false.

### Ключевые выводы:
• \`map.delete()\` сам возвращает \`true\`, если элемент был удален.`,

  js93: `### Суть задачи
Перебор пар Map с помощью цикла \`for...of\` и деструктуризации массивов.

### Пошаговые этапы решения:

1. **Обход в цикле for...of**:
\`\`\`js
const printAll = (map) => {
  for (const [key, value] of map) {
    console.log(\`\${key}: \${value}\`);
  }
};
\`\`\`
**Разбор**: По умолчанию итератор Map возвращает пары \`[key, value]\`.

### Ключевые выводы:
• Порядок обхода гарантированно совпадает с порядком вставки элементов.`,

  js94: `### Суть задачи
Обход Map с помощью встроенного метода \`forEach()\`.

### Пошаговые этапы решения:

1. **Использование map.forEach**:
\`\`\`js
map.forEach((value, key) => {
  console.log(\`\${key}: \${value}\`);
});
\`\`\`
**Разбор**: Колбэк \`forEach\` принимает аргументы в порядке \`(value, key, map)\`.

### Ключевые выводы:
• Порядок параметров сделан по аналогии с \`Array.prototype.forEach((item, index) => ...)\`.`,

  js95: `### Суть задачи
Получение раздельных массивов ключей, значений и пар элементов Map.

### Пошаговые этапы решения:

1. **Преобразование итераторов в массивы**:
\`\`\`js
const keysArr = [...products.keys()];
const valuesArr = [...products.values()];
const entriesArr = [...products.entries()];
\`\`\`
**Разбор**: Итераторы \`keys()\`, \`values()\` и \`entries()\` раскладываются спредом в обычные массивы.

### Ключевые выводы:
• Итераторы Map легкие и не создают массивы в памяти, пока их не развернешь спредом.`,

  js96: `### Суть задачи
Построение частотного словаря произвольных элементов массива с помощью Map.

### Пошаговые этапы решения:

1. **Аккумуляция счетчика**:
\`\`\`js
const countFrequency = (arr) => {
  const map = new Map();
  for (const item of arr) {
    map.set(item, (map.get(item) || 0) + 1);
  }
  return map;
};
\`\`\`
**Разбор**: Берем текущее значение счетчика \`map.get(item) || 0\`, увеличиваем на 1 и перезаписываем.

### Ключевые выводы:
• Алгоритм подсчета частоты за O(N) по времени.`,

  js99: `### Суть задачи
Группировка анаграмм (слов с одинаковым набором букв) в отдельный массив массивов.

### Пошаговые этапы решения:

1. **Канонический ключ анаграммы**:
\`\`\`js
const groupAnagrams = (arr) => {
  const map = new Map();
  for (const str of arr) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
};
\`\`\`
**Разбор**: Сортировка букв слова в алфавитном порядке (\`str.split('').sort().join('')\`) создает общий уникальный ключ для всех его анаграмм.

### Ключевые выводы:
• Возврат \`[...map.values()]\` собирает итоговые группы слов без сохранения вспомогательных ключей.`,

  js100: `### Суть задачи
Реализация мемоизации с ограничением времени жизни кэша (TTL).

### Пошаговые этапы решения:

1. **Мемоизатор с TTL**:
\`\`\`js
const memoize = (fn, ms) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    if (cache.has(key)) {
      const { value, expiry } = cache.get(key);
      if (now < expiry) return value;
    }
    const result = fn(...args);
    cache.set(key, { value: result, expiry: now + ms });
    return result;
  };
};
\`\`\`
**Разбор**: Сохраняем в кэш объект с вычисленным значением и отметкой времени истечения \`expiry = now + ms\`.

### Ключевые выводы:
• Кэш не возвращается, если \`now >= expiry\`.`,

  js101: `### Суть задачи
Создание универсальной функции мемоизации для любого количества примитивных аргументов.

### Пошаговые этапы решения:

1. **Сохранение контекста и аргументов**:
\`\`\`js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
\`\`\`
**Разбор**: Сериализация \`JSON.stringify(args)\` превращает массив аргументов в уникальную строку с сохранением их порядка.

### Ключевые выводы:
• Использование \`fn.apply(this, args)\` сохраняет корректный контекст вызова \`this\`.`,

  js103: `### Суть задачи
Базовое создание Promise через конструктор \`new Promise((resolve, reject) => ...)\`.

### Пошаговые этапы решения:

1. **Создание промиса и отложенный resolve**:
\`\`\`js
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("done"), ms);
  });
};

delay(1000).then(console.log);
\`\`\`
**Разбор**: Функция-исполнитель (executor) мгновенно запускается при вызове \`new Promise\`. Функция \`resolve("done")\` вызывается внутри таймера.

### Ключевые выводы:
• \`new Promise\` принимает функцию-исполнитель с аргументами \`resolve\` и \`reject\`.`,

  js104: `### Суть задачи
Отклонение промиса при невыполнении условия и его обработка в \`.catch()\`.

### Пошаговые этапы решения:

1. **Условный reject**:
\`\`\`js
const checkAge = (age) => {
  return new Promise((resolve, reject) => {
    if (age >= 18) resolve("Доступ разрешён");
    else reject("Доступ запрещён");
  });
};

checkAge(15).then(console.log).catch(console.error);
\`\`\`
**Разбор**: Если условие ложно, вызывается \`reject()\`, переправляя поток в ближайший метод \`.catch()\`.

### Ключевые выводы:
• Вызов \`reject()\` переводит статус промиса из 'pending' в 'rejected'.`,

  js105: `### Суть задачи
Построение цепочки \`.then()\` для последовательного преобразования данных.

### Пошаговые этапы решения:

1. **Передача данных по цепочке**:
\`\`\`js
const getUser = () => Promise.resolve({ id: 42, name: "Alex" });

getUser()
  .then((user) => user.id)
  .then((id) => console.log(\`User id: \${id}\`));
\`\`\`
**Разбор**: Каждое значение, возвращаемое из колбэка \`.then()\`, автоматически оборачивается в новый резолвнутый Promise.

### Ключевые выводы:
• \`.then()\` возвращает новый Promise, позволяя строить цепочки обработки.`,

  js106: `### Суть задачи
Выполнение гарантированного завершающего кода с помощью метода \`.finally()\`.

### Пошаговые этапы решения:

1. **Завершающий блок finally**:
\`\`\`js
fetchData(true)
  .then(console.log)
  .catch(console.error)
  .finally(() => console.log("Запрос завершён"));
\`\`\`
**Разбор**: Блок \`.finally()\` вызывается всегда — как после перехвата ошибки в \`.catch()\`, так и при успешном вызове \`.then()\`.

### Ключевые выводы:
• Отлично подходит для сброса флагов загрузки (isSubmitting = false).`,

  js107: `### Суть задачи
Использование синтаксического сахара \`async/await\` вместо цепочек \`.then()\`.

### Пошаговые этапы решения:

1. **Преобразование в async/await**:
\`\`\`js
async function loadUser() {
  const user = await getUser();
  return \`Привет, \${user.name}\`;
}
\`\`\`
**Разбор**: Оператор \`await\` приостанавливает выполнение функции \`async\` до тех пор, пока промис не выполнится.

### Ключевые выводы:
• Синтаксис \`async/await\` делает асинхронный код визуально похожим на синхронный.`,

  js108: `### Суть задачи
Безопасная обработка асинхронных ошибок с помощью блоков \`try...catch\`.

### Пошаговые этапы решения:

1. **Оборачивание await в try/catch**:
\`\`\`js
async function safeLoad() {
  try {
    const data = await loadData();
    return data;
  } catch (err) {
    return \`Не удалось загрузить: \${err}\`;
  }
}
\`\`\`
**Разбор**: Если реджектится промис с \`await\`, в точке вызова выбрасывается исключение, перехватываемое блоком \`catch\`.

### Ключевые выводы:
• Стандартная конструкция \`try...catch\` — основной инструмент отлова ошибок в async/await.`,

  js109: `### Суть задачи
Последовательное выполнение асинхронных операций в цикле \`for...of\`.

### Пошаговые этапы решения:

1. **Последовательный обход**:
\`\`\`js
async function loadAllSequentially() {
  const names = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    names.push(user.name);
  }
  return names;
}
\`\`\`
**Разбор**: На каждой итерации цикла \`for...of\` выполнение приостанавливается на \`await\` до ответа \`fetchUser(id)\`.

### Ключевые выводы:
• Не используйте \`forEach\` с \`await\`, если вам нужно строго последовательное выполнение.`,

  js110: `### Суть задачи
Параллельное выполнение независимых асинхронных запросов через \`Promise.all\`.

### Пошаговые этапы решения:

1. **Параллельный запуск всех задач**:
\`\`\`js
async function totalParallel() {
  const prices = await Promise.all(items.map(fetchPrice));
  return prices.reduce((sum, p) => sum + p, 0);
}
\`\`\`
**Разбор**: \`items.map(fetchPrice)\` одновременно создает массив промисов, а \`Promise.all\` дожидается завершения всех из них.

### Ключевые выводы:
• Ускоряет выполнение за счет параллельной отправки сетевых запросов.`,

  js111: `### Суть задачи
Ожидание завершения всех промисов независимо от их успешности через \`Promise.allSettled\`.

### Пошаговые этапы решения:

1. **Фильтрация по статусам**:
\`\`\`js
async function splitResults() {
  const results = await Promise.allSettled(requests);
  const fulfilled = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  const rejected = results.filter((r) => r.status === "rejected").map((r) => r.reason);
  return { fulfilled, rejected };
}
\`\`\`
**Разбор**: \`Promise.allSettled\` никогда не падает с ошибкой, а возвращает массив описаний результатов каждого промиса.

### Ключевые выводы:
• Идеально для пакетной обработки, где падение одной задачи не должно ломать остальное.`,

  js112: `### Суть задачи
Ограничение максимального времени ожидания ответа с помощью комбинатора \`Promise.race\`.

### Пошаговые этапы решения:

1. **Гонка ответа и таймаут-промиса**:
\`\`\`js
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
};
\`\`\`
**Разбор**: Если исходный \`promise\` не успеет выполниться до срабатывания \`setTimeout\`, первенство возьмет реджект от \`timeout\`.

### Ключевые выводы:
• \`Promise.race\` разрешается/отклоняется самым первым выполнившимся промисом.`,

  js113: `### Суть задачи
Получение первого успешного результата из группы промисов через \`Promise.any\`.

### Пошаговые этапы решения:

1. **Игнорирование упавших зеркал**:
\`\`\`js
async function getFromAnyMirror() {
  try {
    return await Promise.any(mirrors);
  } catch (err) {
    return "Все зеркала недоступны";
  }
}
\`\`\`
**Разбор**: \`Promise.any\` игнорирует ошибки до тех пор, пока хотя бы один промис не выполнится успешно. При ошибке всех — выбрасывает \`AggregateError\`.

### Ключевые выводы:
• Отличается от \`Promise.race\` тем, что игнорирует реджекты, если есть успехи.`,

  js114: `### Суть задачи
Преобразование функции с callback-аргументом стандарта Node.js \`(err, result)\` в функцию, возвращающую Promise.

### Пошаговые этапы решения:

1. **Обертка в Promise**:
\`\`\`js
const promisify = (fn) => {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
};
\`\`\`
**Разбор**: В переданную колбэк-функцию последним аргументом передается замыкание, вызывающее \`resolve\` или \`reject\`.

### Ключевые выводы:
• Универсальный паттерн для адаптации старых библиотек под \`async/await\`.`,

  js115: `### Суть задачи
Реализация механизма повторных попыток (Retry) с паузами при неуспешных асинхронных вызовах.

### Пошаговые этапы решения:

1. **Цикл повторов с выдержкой задержки**:
\`\`\`js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retry = async (fn, attempts, delayMs) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await wait(delayMs);
    }
  }
  throw lastError;
};
\`\`\`
**Разбор**: При сбое запоминаем ошибку и ждем \`delayMs\`. Если попытки исчерпаны — выбрасываем последнюю сохраненную ошибку.

### Ключевые выводы:
• Повышает отказоустойчивость при нестабильном интернет-соединении.`,

  js116: `### Суть задачи
Реализация пула задач с ограничением максимального количества одновременно работающих асинхронных потоков.

### Пошаговые этапы решения:

1. **Пул воркеров с общим индексом задач**:
\`\`\`js
const runWithLimit = (tasks, limit) => {
  return new Promise((resolve) => {
    const results = new Array(tasks.length);
    let nextIndex = 0;
    let completed = 0;
    if (tasks.length === 0) return resolve([]);

    const runNext = () => {
      const currentIndex = nextIndex++;
      if (currentIndex >= tasks.length) return;

      tasks[currentIndex]()
        .then((res) => { results[currentIndex] = res; })
        .finally(() => {
          completed++;
          if (completed === tasks.length) resolve(results);
          else runNext();
        });
    };

    for (let i = 0; i < Math.min(limit, tasks.length); i++) runNext();
  });
};
\`\`\`
**Разбор**: Запускаем не более \`limit\` задач одновременно. Как только одна завершается, по рекурсивному вызовы \`runNext()\` берется следующая.

### Ключевые выводы:
• Защищает сервер от перегрузки (Rate Limiting).`,

  js117: `### Суть задачи
Кэширование асинхронного Promise для избежания повторных вызовов с теми же аргументами.

### Пошаговые этапы решения:

1. **Кэширование Promise в Map**:
\`\`\`js
const memoizeAsync = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const promise = fn(...args).catch((err) => {
      cache.delete(key);
      throw err;
    });

    cache.set(key, promise);
    return promise;
  };
};
\`\`\`
**Разбор**: Кэшируем именно сам объект \`Promise\`. При вызове во время полета запроса последующие вызовы подписываются на один и тот же промис.

### Ключевые выводы:
• Предотвращает дублирование параллельных одинаковых запросов.`,

  js118: `### Суть задачи
Понимание очередности вызова синхронных операций, микротасков (Promise.then) и макротасков (setTimeout) в Event Loop.

### Пошаговые этапы решения:

1. **Анализ очередности очереди макро/микрозадач**:
\`\`\`js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));
console.log("5");
\`\`\`
**Разбор**: 
1) Синхронный код выполняется первым: '1', затем '5'.
2) Очередь микрозадач (Promise.then) исполняется ДО перехода к макрозадачам: '3', '4'.
3) Макрозадача (setTimeout 0ms) запускается после опустошения всей очереди микрозадач: '2'.

### Ключевые выводы:
• Порядок вывода: 1, 5, 3, 4, 2.`,

  js120: `### Суть задачи
Реализация отменяемого асинхронного запроса \`fetchWithCancel(url, signal, customFetch = fetch)\` с поддержкой передачи внешнего \`AbortSignal\` и корректной обработкой отмены.

### Пошаговые этапы решения:

\`\`\`js
const fetchWithCancel = async (url, signal, customFetch = fetch) => {
  if (signal?.aborted) {
    throw signal.reason || new DOMException("This operation was aborted", "AbortError");
  }

  const response = await customFetch(url, { signal });
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json();
};
\`\`\`
**Разбор**:
1. **Быстрый выход**: Если сигнал уже был отменен до начала запроса (\`signal?.aborted\`), функция немедленно выбрасывает исключение с причиной отмены (\`signal.reason\` или \`DOMException AbortError\`), не совершая холостой сетевой вызов.
2. **Injected fetch**: Передача параметра \`customFetch\` обеспечивает возможность внедрения зависимостей (Dependency Injection), мокирования в тестах и поддержки альтернативных HTTP-клиентов.
3. **Проброс сигнала**: Объект \`signal\` передается в опции \`customFetch(url, { signal })\`, что позволяет нативному браузерному движку или Node.js сетевому стеку немедленно разорвать TCP/TLS соединение при вызове \`controller.abort()\`.

### Ключевые выводы:
• \`AbortController\` и \`AbortSignal\` — стандартный интерфейс отмены асинхронных операций в современном JavaScript/TypeScript.
• Проверка \`signal.aborted\` перед сетевым вызовом предотвращает создание нежелательных запросов.`,

  js121: `### Суть задачи
Создание очереди задач для гарантированного последовательного выполнения асинхронных функций.

### Пошаговые этапы решения:

1. **Цепочка связывания промисов**:
\`\`\`js
class TaskQueue {
  constructor() {
    this.queue = Promise.resolve();
  }

  add(taskFn) {
    this.queue = this.queue.then(() => taskFn()).catch((err) => {
      console.error("Ошибка в задаче:", err);
    });
    return this.queue;
  }
}
\`\`\`
**Разбор**: При вызове \`add(taskFn)\` текущий промис \`this.queue\` продлевается вызовом \`.then(() => taskFn())\`.

### Ключевые выводы:
• Позволяет последовательно выполнять асинхронные задачи без использования циклов.`,

  js122: `### Суть задачи
Реализация асинхронной функции \`debounceAsync(fn, ms)\`, которая при поступлении нового вызова отменяет не только отложенный таймер (pending timeout), но и прерывает уже выполняющуюся асинхронную операцию (in-flight operation).

### Пошаговые этапы решения:

\`\`\`js
const debounceAsync = (fn, ms) => {
  let timer = null;
  let activeController = null;
  let activeReject = null;

  return (...args) => {
    return new Promise((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      if (activeController) {
        activeController.abort();
        activeController = null;
      }

      if (activeReject) {
        activeReject(new DOMException("Aborted by new invocation", "AbortError"));
        activeReject = null;
      }

      activeReject = reject;

      timer = setTimeout(async () => {
        timer = null;
        const controller = new AbortController();
        activeController = controller;

        try {
          const result = await fn(...args, controller.signal);
          if (!controller.signal.aborted) {
            resolve(result);
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            reject(err);
          }
        } finally {
          if (activeController === controller) {
            activeController = null;
            activeReject = null;
          }
        }
      }, ms);
    });
  };
};
\`\`\`
**Разбор**:
1. **Отмена таймера**: \`clearTimeout(timer)\` сбрасывает ожидание дебаунса при каждом новом нажатии клавиши или вызове.
2. **Отмена запущенного запроса**: Если таймер уже сработал и асинхронная операция \`fn\` уже находится в процессе выполнения (\`await fn(...)\`), вызов \`activeController.abort()\` прерывает этот сетевой запрос и отклоняет промис предыдущего вызова с \`AbortError\`.
3. **Защита от race conditions**: Ответ устаревшего запроса никогда не запишется в стейт и не зарезолвится, предотвращая гонку ответов (stale data overwrite).

### Ключевые выводы:
• Полноценный async debounce должен отменять как период ожидания таймера, так и висящий сетевой запрос.`,

  js185: `### Суть задачи
Определить порядок вывода в консоль при параллельном выполнении двух цепочек промисов с методами \`.then()\` и \`.catch()\`.

**Ответ:** \`1, 2, 7, 4, 8\`

Разберём почему, шаг за шагом.

---

### Ключевые концепции

#### 1. Очередь микрозадач (Microtask Queue)
Колбэки \`.then()\` и \`.catch()\` никогда не выполняются синхронно — они всегда попадают в очередь микрозадач (microtask queue) и выполняются только после того, как весь синхронный стек вызовов завершился. Очередь работает по принципу **FIFO** (First In, First Out — «первый пришёл — первый ушёл»).

#### 2. Каждый \`.then()\` / \`.catch()\` создаёт новый промис
\`\`\`js
promise.then(cb1).then(cb2);
\`\`\`
Это не один промис — вызов \`.then(cb1)\` возвращает **новый промис**, а \`.then(cb2)\` подписывается уже на него. Поэтому \`cb2\` не может выполниться в тот же тик, что и \`cb1\` — он ждёт, пока предыдущий промис перейдёт в состояние *settled* (fulfilled или rejected), а постановка его колбэка происходит через отдельный шаг в очереди микрозадач.

#### 3. \`.then()\` и \`.catch()\` — это «прозрачные трубы» для чужого статуса
Это ключевой момент в этой задаче:
- \`.then(onFulfilled)\` — если у него нет \`onRejected\`, а промис перед ним отклонён (*rejected*), колбэк \`onFulfilled\` не вызывается, а ошибка (*reject*) просто «пробрасывается» дальше по цепочке к следующему обработчику.
- \`.catch(onRejected)\` — это синтаксический сахар для \`.then(undefined, onRejected)\`. Если промис перед ним выполнен (*fulfilled*), колбэк \`catch\` не вызывается, а успешное значение (*fulfilled*) без изменений пробрасывается дальше.

Это и создаёт «пропуски» в выводе — некоторые \`console.log\` вообще не сработают.

---

### Пошаговый разбор цепочек

#### Разбираем первую цепочку (Цепочка A)
\`\`\`js
Promise.resolve()
  .then(() => console.log(1))   // (A) 
  .then(() => console.log(2))   // (B)
  .catch(() => console.log(3))  // (C)
  .then(() => console.log(4))   // (D)
\`\`\`
1. \`Promise.resolve()\` — сразу *fulfilled*.
2. **(A)** сработает, так как промис fulfilled → печатает **\`1\`**. Возвращает \`undefined\` (*fulfilled*).
3. **(B)** сработает после (A), промис fulfilled → печатает **\`2\`**. Возвращает \`undefined\` (*fulfilled*).
4. **(C)** — это \`catch\`. Промис после (B) находится в состоянии *fulfilled*, а не *rejected* → колбэк \`() => console.log(3)\` пропускается, статус *fulfilled* прокидывается дальше.
5. **(D)** — снова \`then\`, промис *fulfilled* → печатает **\`4\`**.

**Итог цепочки A:** \`1\`, \`2\`, \`[3 пропущен]\`, \`4\`

#### Разбираем вторую цепочку (Цепочка B)
\`\`\`js
Promise.reject()
  .then(() => console.log(5))   // (E)
  .then(() => console.log(6))   // (F)
  .catch(() => console.log(7))  // (G)
  .then(() => console.log(8))   // (H)
\`\`\`
1. \`Promise.reject()\` — сразу *rejected*.
2. **(E)** — это \`then\`, у него нет \`onRejected\` обработчика, а промис *rejected* → колбэк \`() => console.log(5)\` пропускается, *reject* прокидывается дальше.
3. **(F)** — то же самое: \`then\` без \`onRejected\`, промис всё ещё *rejected* → \`console.log(6)\` пропускается.
4. **(G)** — это \`catch\`! Наконец-то есть обработчик для *rejected*-состояния → колбэк выполняется → печатает **\`7\`**. После успешного выполнения \`catch\` (без выброса новой ошибки) промис переходит в состояние *fulfilled*.
5. **(H)** — \`then\`, промис теперь *fulfilled* → печатает **\`8\`**.

**Итог цепочки B:** \`[5 пропущен]\`, \`[6 пропущен]\`, \`7\`, \`8\`

---

### ⏱ Пошаговая трассировка очереди микрозадач

>  **Почему именно такое чередование:** \`1, 2, 7, 4, 8\`  
> Пропуск обработчика не бесплатный — даже когда колбэк не вызывается, «проброс» статуса (*resolution/rejection*) на следующий промис в цепочке всё равно занимает один тик микрозадачи. Поэтому обе цепочки продвигаются параллельно, по одному шагу за раз, чередуясь в очереди микротасок.

| Тик | Что выполняется | Что печатается |
| :---: | :--- | :---: |
| **1** | Job A: cb1 из цепочки A | \`1\` |
| **2** | Job B: проброс reject в цепочке B (после .then(5)) | — |
| **3** | Job A: cb2 из цепочки A | \`2\` |
| **4** | Job B: проброс reject в цепочке B (после .then(6)) | — |
| **5** | Job A: проброс fulfilled в цепочке A (мимо .catch(3)) | — |
| **6** | Job B: cb7 из цепочки B (.catch сработал) | \`7\` |
| **7** | Job A: cb4 из цепочки A | \`4\` |
| **8** | Job B: cb8 из цепочки B | \`8\` |

Обе цепочки стартуют одновременно: сначала в очередь попадает первый Job цепочки A, затем первый Job цепочки B. Далее каждый шаг цепочки ставит следующий Job в конец очереди — отсюда и получается «гребёнка» из чередующихся шагов A и B, пока цепочка A не закончится на 4, а B чуть позже на 8.

---

### Главные выводы:
• **\`.then()\` / \`.catch()\` без подходящего обработчика не глотают статус молча** — статус (*resolved / rejected*) просто едет дальше по цепочке.
• **Транзитный проброс статуса стоит ровно один тик в очереди микротасок** — это и создаёт параллельное чередование вызовов.
• **\`.catch()\` «лечит» ошибку** — после успешного \`catch\` (без повторного \`throw\`) промис становится *fulfilled*, и дальше по цепочке выполняются именно \`.then()\`, а не \`.catch()\`.`,

  js126: `### Суть задачи
Демонстрация сохранения состояния локальной переменной между вызовами вложенной функции.

### Пошаговые этапы решения:

1. **Создание локальной переменной и возвращаемой функции**:
\`\`\`js
const createCounter = () => {
  let count = 0;
  return () => ++count;
};

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`
**Разбор**: Переменная \`count\` создается внутри \`createCounter\`. Возвращаемая стрелочная функция обращается к \`count\` и сохраняет к ней доступ через лексическое окружение.

### Ключевые выводы:
• Функция в JavaScript сохраняет доступ к переменным внешнего окружения даже после завершения работы внешней функции.`,

  js128: `### Суть задачи
Разбор классической ловушки асинхронного цикла с \`var\`: вывод 10 раз числа 10 из-за функциональной области видимости и отложенного выполнения колбэков в очереди макротасок Event Loop.

### Пошаговые этапы решения:

1. **Что выведется**:
\`\`\`text
10 (10 раз)
\`\`\`
Синхронный цикл \`for\` завершается до того, как Event Loop выполнит первую макротаску из \`setTimeout\`. Переменная \`var i\` является общей для всех итераций и к моменту вызова колбэков равна \`10\`.

2. **Варианты исправления**:

- **Вариант 1: Использование блочной области видимости \`let\` (рекомендуется)**:
\`\`\`js
for (let i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2, ..., 9
  });
}
\`\`\`

- **Вариант 2: Использование IIFE**:
\`\`\`js
for (var i = 0; i < 10; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // 0, 1, 2, ..., 9
    });
  })(i);
}
\`\`\`

- **Вариант 3: 3-й аргумент \`setTimeout\`**:
\`\`\`js
for (var i = 0; i < 10; i++) {
  setTimeout(function (j) {
    console.log(j); // 0, 1, 2, ..., 9
  }, 0, i);
}
\`\`\`

### Ключевые выводы:
• \`var\` разделяет одну переменную между всеми итерациями; \`let\` создает уникальное лексическое окружение для каждой итерации цикла.
• Колбэки таймеров выполняются строго после очистки синхронного стека вызовов.`,

  js129: `### Суть задачи
Различие между мгновенной фиксацией значения примитива (строки) и динамическим обращением по ссылке к переменной.

### Пошаговые этапы решения:

1. **Анализ фиксации значений**:
\`\`\`js
let number = 0;

const increment = () => {
  number += 1;
  const message = \`Incremented to \${number}\`;

  return () => {
    console.log(message);
    console.log(\`Number: \${number}\`);
  };
};

const log = increment(); // number = 1, message = "Incremented to 1"
increment(); // number = 2
increment(); // number = 3
log();
\`\`\`
**Разбор**: 
1) При вызове \`increment()\` строка \`message\` вычисляется как \`"Incremented to 1"\` и намертво замыкается в возвращаемой функции.
2) Переменная \`number\` меняется до значения \`3\`. Замыкание видит живую ссылку на \`number\`, поэтому выводит \`3\`.

### Ключевые выводы:
• Вывод: "Incremented to 1", "Number: 3".`,

  js130: `### Суть задачи
Диагностика и устранение проблемы устаревшего замыкания (Stale Closure).

### Пошаговые этапы решения:

1. **Перенос вычисления строки внутрь логирующей функции**:
\`\`\`js
function createIncrement() {
  let count = 0;

  function increment() {
    count++;
  }

  function log() {
    console.log(\`Count is \${count}\`); // вычисляем значение при вызове
  }

  return [increment, log];
}

const [increment, log] = createIncrement();
increment();
increment();
increment();
log(); // Count is 3
\`\`\`
**Разбор**: В исходном коде переменная \`message\` рассчитывалась один раз при вызове \`createIncrement()\`. Чтобы видеть актуальные изменения \`count\`, строку нужно вычислять прямо в моменте работы \`log()\`.

### Ключевые выводы:
• Состояние примитивных строк не обновляется автоматически при изменении исходных переменных.`,

  js131: `### Суть задачи
Предотвращение вылаза индекса массива за допустимый диапазон из-за мутации \`var\` в цикле.

### Пошаговые этапы решения:

1. **Использование let в цикле по массиву**:
\`\`\`js
const arr = [10, 12, 15, 21];

for (let i = 0; i < arr.length; i++) {
  setTimeout(function () {
    console.log("Index: " + i + ", element: " + arr[i]);
  }, 1000);
}
\`\`\`
**Разбор**: При вызове цикла с \`var\` к моменту старта срабатывания таймеров \`i === 4\`. Вызов \`arr[4]\` возвращал \`undefined\`. Замена на \`let\` гарантирует корректную привязку индексов 0, 1, 2, 3.

### Ключевые выводы:
• Защищает от получения значений \`undefined\` при обращении к массивам внутри асинхронных функций.`,

  js132: `### Суть задачи
Базовый концепт точки остановки рекурсии (Base Case) на примере обратного отсчета.

### Пошаговые этапы решения:

1. **Условие остановки и рекурсивный шаг**:
\`\`\`js
const countDown = (n) => {
  if (n <= 0) return; // база рекурсии — точка остановки
  console.log(n);
  countDown(n - 1); // рекурсивный вызов с уменьшением аргумента
};

countDown(3);
\`\`\`
**Разбор**: Без вызова \`if (n <= 0) return;\` функция уходила бы в бесконечные вызовы до падения с ошибкой переполнения стека.

### Ключевые выводы:
• База рекурсии — обязательное условие выхода из цепочки вызовов.`,

  js133: `### Суть задачи
Понимание разницы выполнения операций до вызова рекурсии (на спуске) и после (на подъеме).

### Пошаговые этапы решения:

1. **Печать при размотке стека**:
\`\`\`js
const countUp = (n) => {
  if (n <= 0) return;
  countUp(n - 1);
  console.log(n); // выполняется при "возврате" из рекурсии
};

countUp(3);
\`\`\`
**Разбор**: \`console.log(n)\` вызывается после \`countUp(n - 1)\`. Вызовы накапливаются в стеке до базового случая, а затем разматываются снизу вверх: 1, 2, 3.

### Ключевые выводы:
• Код после рекурсивного вызова выполняется в обратном порядке при разворачивании стека.`,

  js134: `### Суть задачи
Классическое рекурсивное вычисление факториала числа (n!).

### Пошаговые этапы решения:

1. **Формула n * factorial(n - 1)**:
\`\`\`js
const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

console.log(factorial(5)); // 120
\`\`\`
**Разбор**: Вычисление откладывается до наступления базы \`factorial(1) = 1\`, после чего происходит реверсивное перемножение накопленных множителей.

### Ключевые выводы:
• Смысл рекурсии — свести сложную задачу к цепочке шагов, где ответ на базовом шаге известен заведомо.`,

  js135: `### Суть задачи
Рекурсивное возведение числа в степень (base^{exp}).

### Пошаговые этапы решения:

1. **Умножение на основание на каждом шаге**:
\`\`\`js
const power = (base, exp) => {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
};

console.log(power(2, 5)); // 32
\`\`\`
**Разбор**: При \`exp === 0\` возвращается \`1\`, так как любое число в степени 0 равно 1. На обратном ходе полученная единица умножается на \`base\` 5 раз.

### Ключевые выводы:
• Базовый случай \`exp === 0\` гарантирует корректную остановку при вычислении любых положительных степеней.`,

  js136: `### Суть задачи
Рекурсивный поиск максимального элемента в массиве чисел.

### Пошаговые этапы решения:

1. **Сравнение первого элемента с максимумом оставшейся части**:
\`\`\`js
const findMax = (arr) => {
  if (arr.length === 1) return arr[0];
  const maxOfRest = findMax(arr.slice(1));
  return arr[0] > maxOfRest ? arr[0] : maxOfRest;
};

console.log(findMax([3, 7, 2, 9, 4])); // 9
\`\`\`
**Разбор**: Базовый случай — массив из 1 элемента (он сам свой максимум). На каждом уровне рекурсия сравнивает текущий \`arr[0]\` с лучшим результатом из укороченного среза.

### Ключевые выводы:
• Алгоритмически \`Math.max(...arr)\` предпочтительнее в реальных задачах, так как не создает доп. массивы срезами.`,

  js137: `### Суть задачи
Глубокое разворачивание вложенных массивов (Flatten) любой глубины без \`Array.prototype.flat\`.

### Пошаговые этапы решения:

1. **Рекурсивная сплющивающая сборка**:
\`\`\`js
const flatten = (arr) => {
  const result = [];
  for (const el of arr) {
    if (Array.isArray(el)) result.push(...flatten(el));
    else result.push(el);
  }
  return result;
};

console.log(flatten([1, [2, [3, [4, 5]], 6]])); // [1, 2, 3, 4, 5, 6]
\`\`\`
**Разбор**: Для каждого элемента проверяем \`Array.isArray(el)\`. Если это массив — рекурсивно раскладываем его спредом в итоговый массив.

### Ключевые выводы:
• Позволяет обойти массивы любой вложенности без ограничения по уровням.`,

  js138: `### Суть задачи
Написание функции глубокого клонирования объектов и массивов (Deep Clone).

### Пошаговые этапы решения:

1. **Рекурсивная репликация структуры**:
\`\`\`js
const deepClone = (value) => {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => deepClone(item));
  const result = {};
  for (const key in value) {
    result[key] = deepClone(value[key]);
  }
  return result;
};
\`\`\`
**Разбор**: Примитивы возвращаются как есть. Для массивов и объектов создаются новые коллекции с рекурсивно скопированными вложенными полями.

### Ключевые выводы:
• В современном стандарте для аналогичной задачи принято вызывать нативный \`structuredClone()\`.`,

  js139: `### Суть задачи
Подсчет суммы всех чисел во вложенном объекте произвольной структуры.

### Пошаговые этапы решения:

1. **Рекурсивное суммирование с проверкой типов**:
\`\`\`js
const deepSum = (obj) => {
  let sum = 0;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (typeof value === 'number') sum += value;
      if (typeof value === 'object' && value !== null) sum += deepSum(value);
    }
  }
  return sum;
};
\`\`\`
**Разбор**: Проверка \`typeof value === 'object' && value !== null\` позволяет обойти массивы и вложенные объекты одинаково успешно.

### Ключевые выводы:
• Защита от \`null\` предотвращает ошибки обращений к свойствам несуществующих объектов.`,

  js140: `### Суть задачи
Рекурсивный обход узлов бинарного дерева для вычисления их общей суммы.

### Пошаговые этапы решения:

1. **Рекурсия по левой и правой ветвям**:
\`\`\`js
const treeSum = (node) => {
  if (node === null) return 0;
  return node.value + treeSum(node.left) + treeSum(node.right);
};
\`\`\`
**Разбор**: Если дошли до пустого листа \`node === null\`, возвращаем 0. Иначе суммируем значение текущего узла со значениями левого и правого поддеревьев.

### Ключевые выводы:
• Деревья идеально обрабатываются рекурсивным обходом в глубину (DFS).`,

  js141: `### Суть задачи
Определение максимальной высоты (глубины) бинарного дерева.

### Пошаговые этапы решения:

1. **Сравнение глубины поддеревьев**:
\`\`\`js
const treeDepth = (node) => {
  if (node === null) return 0;
  return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
};
\`\`\`
**Разбор**: На каждом узле берём максимум из высот его левой и правой веток через \`Math.max\` и добавляем 1.

### Ключевые выводы:
• Позволяет быстро оценить сбалансированность древовидной структуры данных.`,

  js142: `### Суть задачи
Поиск узла/файла в древовидной структуре файловой системы.

### Пошаговые этапы решения:

1. **Рекурсивный метод \`.some()\`**:
\`\`\`js
const findFile = (node, name) => {
  if (!node) return false;
  if (node.name === name) return true;
  if (node.type === "folder" && Array.isArray(node.children)) {
    return node.children.some((child) => findFile(child, name));
  }
  return false;
};
\`\`\`
**Разбор**: Если текущий узел совпал по имени — возвращаем \`true\`. Если это папка — опрашиваем её детей до первого удачного совпадения.

### Ключевые выводы:
• \`Array.prototype.some\` оптимизирует поиск и прекращает обход при первом успехе.`,

  js144: `### Суть задачи
Рекурсивное извлечение плоского массива всех числовых примитивов из глубоко вложенного объекта произвольной структуры.

### Пошаговые этапы решения:

\`\`\`js
const getAllPrimitives = (obj) => {
  const arr = [];

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    const value = obj[key];

    if (typeof value === "number") {
      arr.push(value);
    } else if (typeof value === "object" && value !== null) {
      arr.push(...getAllPrimitives(value));
    }
  }
  return arr;
};
\`\`\`
**Разбор**:
1. Базовый случай: если значение свойства имеет тип \`"number"\`, оно добавляется в результирующий массив.
2. Шаг рекурсии: если значение — объект (\`typeof value === "object" && value !== null\`), функция рекурсивно вызывает сама себя и разворачивает полученные числа через spread \`...getAllPrimitives(value)\`.

### Ключевые выводы:
• Функция собирает только числовые примитивы, отсекая промежуточные объекты и нечисловые типы.
• Сложность: O(N) по времени (где N — общее число свойств во всех уровнях вложенности) и O(D) по глубине стека вызовов (D — максимальная глубина вложенности).`,

  js145: `### Суть задачи
Сбор свойств \`value\` со всех узлов дерева произвольной вложенности.

### Пошаговые этапы решения:

1. **Обход списка дочерних узлов**:
\`\`\`js
const recursionTree = (data) => {
  const arr = [data.value];
  if (data.children) {
    for (const el of data.children) {
      arr.push(...recursionTree(el));
    }
  }
  return arr;
};
\`\`\`
**Разбор**: Добавляем \`data.value\` текущего элемента, затем по очереди рекурсивно опрашиваем каждого потомка из \`data.children\`.

### Ключевые выводы:
• Порядок элементов в итоговом массиве соответствует обходу дерева в глубину (DFS).`,

  js146: `### Суть задачи
Подсчет общей суммы значений \`value\` всех узлов дерева.

### Пошаговые этапы решения:

1. **Накопление суммы потомков**:
\`\`\`js
const sumTree = (data) => {
  let sum = data.value;
  if (data.children) {
    for (const child of data.children) {
      sum += sumTree(child);
    }
  }
  return sum;
};
\`\`\`
**Разбор**: Начинаем сумму со значения родительского узла \`data.value\` и прибавляем к ней результаты рекурсивного обхода всех дочерних веток.

### Ключевые выводы:
• Простой и надежный способ агрегирования данных по всем веткам дерева.`,

  js147: `### Суть задачи
Вычисление n-го числа Фибоначчи с анализом рекурсивного и итеративного подходов.

### Пошаговые этапы решения:

1. **Формула Фибоначчи**:
\`\`\`js
function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}
\`\`\`
**Разбор**: Классическая формула разветвляется на два вызова. Из-за этого временная сложность составляет (O(2^N)). В продуктовой разработке лучше использовать цикл (O(N)).

### Ключевые выводы:
• Простая рекурсия чисел Фибоначчи служит демонстрацией экспоненциального роста стека вызовов.`,

  js148: `### Суть задачи
Разбор контекста \`this\` в обычном методе объекта и стрелочной функции-свойстве.

### Пошаговые этапы решения:

1. **Обычный метод \`user.regularMethod()\`**:
- Метод объявлен через стандартный синтаксис метода объекта (\`regularMethod() { return this.name; }\`).
- При вызове через точку \`user.regularMethod()\` контекст \`this\` динамически указывает на объект перед точкой, то есть на \`user\`.
- Возвращается \`user.name\` — строка \`"Анна"\`.

2. **Стрелочный метод \`user.arrowMethod()\`**:
- Стрелочные функции **не имеют собственного контекста \`this\`**.
- Они захватывают \`this\` лексически из окружающего контекста в момент создания объекта.
- Фигурные скобки литерала объекта \`{ ... }\` **не создают область видимости** для \`this\`.
- Окружающим контекстом является внешняя область (глобальный объект / модуль / \`undefined\` в строгом режиме), где свойства \`name\` нет.
- Возвращается \`undefined\`.

\`\`\`js
console.log(user.regularMethod()); // "Анна"
console.log(user.arrowMethod());   // undefined
\`\`\`

### Ключевые выводы:
• Обычные методы при вызове \`obj.method()\` привязывают \`this\` к вызывающему объекту.
• Стрелочные функции не имеют собственного \`this\` и не подходят в качестве методов объектов, если требуется доступ к свойствам этого объекта через \`this\`.`,

  js149: `### Суть задачи
Исследование поведения свойства \`F.prototype\` при его полной перезаписи новым объектом.

### Пошаговые этапы решения:

1. **Создание первого экземпляра \`anna\`**:
\`\`\`js
const anna = new Person("Анна");
\`\`\`
- Оператор \`new\` связывает внутреннее скрытое свойство \`anna.[[Prototype]]\` (\`__proto__\`) с текущим объектом \`Person.prototype\`, на котором уже задан метод \`greet\`:
\`\`\`js
Person.prototype.greet = function () { return \`Привет, я \${this.name}\`; };
\`\`\`

2. **Перезапись свойства \`Person.prototype\`**:
\`\`\`js
Person.prototype = {
  greet() { return \`Здравствуйте, я \${this.name}\`; },
};
\`\`\`
- Свойство \`Person.prototype\` теперь ссылается на совершенно **новый объект в памяти**.
- Однако ссылка \`anna.[[Prototype]]\` уже установлена на старый объект прототипа и **не меняется**.

3. **Создание второго экземпляра \`ivan\`**:
\`\`\`js
const ivan = new Person("Иван");
\`\`\`
- Экземпляр \`ivan.[[Prototype]]\` получает ссылку на **новый объект прототипа**.

4. **Вызов методов**:
\`\`\`js
console.log(anna.greet()); // "Привет, я Анна" (из старого прототипа)
console.log(ivan.greet()); // "Здравствуйте, я Иван" (из нового прототипа)
\`\`\`

### Ключевые выводы:
• Перезапись свойства \`Constructor.prototype\` не влияет на ранее созданные экземпляры, поскольку их внутренняя ссылка \`[[Prototype]]\` уже зафиксирована.
• Все последующие экземпляры будут наследовать от нового объекта прототипа.`,

  js150: `### Суть задачи
Классический случай потери контекста \`this\` при извлечении метода объекта в отдельную переменную и способ его сохранения с помощью \`.bind()\`.

### Пошаговые этапы решения:

1. **Потеря контекста при извлечении ссылки**:
\`\`\`js
const inc = counter.increment;
inc();
\`\`\`
- При присваивании \`const inc = counter.increment\` в переменную копируется только ссылка на саму функцию.
- При последующем вызове \`inc()\` функция вызывается без объекта перед точкой (standalone call).
- В строгом режиме (\`"use strict"\`) значение \`this\` равно \`undefined\`, что приведет к \`TypeError: Cannot read properties of undefined (reading 'count')\`.
- В нестрогом режиме \`this\` указывает на глобальный объект (\`window\` / \`global\`), где свойство \`count\` отсутствует, и операция \`undefined++\` дает \`NaN\`.

2. **Исправление потери контекста через \`.bind()\`**:
\`\`\`js
const inc = counter.increment.bind(counter);
console.log(inc()); // 11
\`\`\`
- Метод \`.bind(counter)\` возвращает новую связанную функцию (bound function), навсегда привязывая \`this\` к объекту \`counter\`.
- При вызове \`inc()\` корректно инкрементируется \`counter.count\` (с 10 до 11) и возвращается \`11\`.

### Ключевые выводы:
• При передаче метода в переменную или как колбэк связь с исходным объектом теряется.
• Для явной фиксации контекста используется метод \`.bind(targetObject)\` или стрелочная функция-обертка \`() => counter.increment()\`.`,

  js151: `### Суть задачи
Анализ цепочки вызовов метода \`.bind()\` на одной и той же функции.

### Пошаговые этапы решения:

1. **Неизменяемость первого \`bind\`**:
\`\`\`js
function getInfo() {
  return this.title;
}

const obj1 = { title: "Книга 1" };
const obj2 = { title: "Книга 2" };

const bound1 = getInfo.bind(obj1);
const bound2 = bound1.bind(obj2);

console.log(bound2()); // "Книга 1"
\`\`\`

2. **Механизм Bound Function Exotic Object**:
- Первый вызов \`getInfo.bind(obj1)\` возвращает связанную функцию (\`bound1\`), в которой согласно спецификации ECMAScript внутреннее свойство \`[[BoundThis]]\` жестко зафиксировано на объекте \`obj1\`.
- Второй вызов \`bound1.bind(obj2)\` создает новую обертку (\`bound2\`), у которой \`[[BoundTargetFunction]]\` — это \`bound1\`, а \`[[BoundThis]]\` — \`obj2\`.
- Когда \`bound2()\` вызывается, управление передается в \`bound1\`, которая безусловно подставляет свой собственный \`[[BoundThis]]\` (\`obj1\`).
- Контекст \`obj2\` полностью игнорируется.

### Ключевые выводы:
• Контекст функции, привязанный через \`.bind()\`, невозможно переопределить ни повторным вызовом \`.bind()\`, ни через \`.call()\` / \`.apply()\`.`,

  js152: `### Суть задачи
Понимание ссылочной модели данных при хранении мутабельных структур (массивов/объектов) в прототипе конструктора.

### Пошаговый разбор:

\`\`\`js
function User(name) {
  this.name = name;
}

User.prototype.skills = [];

const u1 = new User("Иван");
const u2 = new User("Ольга");

u1.skills.push("JS");

console.log(u2.skills); // ["JS"]
\`\`\`
**Разбор**:
1. Свойство \`skills\` объявлено на \`User.prototype\`, а не в теле конструктора.
2. При вызове \`u1.skills.push("JS")\` интерпретатор не находит собственного свойства \`skills\` на объекте \`u1\` и поднимается по цепочке прототипов к \`User.prototype.skills\`.
3. Метод \`push\` мутирует единственный общий массив в памяти, на который ссылаются прототипы всех созданных экземпляров.
4. При обращении \`u2.skills\` считывается тот же самый разделяемый массив \`["JS"]\`.

### Ключевые выводы:
• Ссылочные мутабельные данные (массивы, объекты) нельзя размещать в прототипе, если они должны быть уникальными для каждого экземпляра.
• Индивидуальные свойства должны инициализироваться в теле конструктора: \`this.skills = [];\`.`,

  js153: `### Суть задачи
Определение лексического контекста \`this\` в стрелочных функциях, вложенных в методы объекта.

### Пошаговый разбор:

\`\`\`js
const timer = {
  seconds: 0,
  start() {
    setTimeout(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 100);
  },
};

timer.start();
\`\`\`
**Разбор**:
1. Метод \`timer.start()\` вызывается как метод объекта \`timer\`, поэтому внутри \`start\` значение \`this\` указывает на объект \`timer\`.
2. Внутри \`start\` передается стрелочная функция в \`setTimeout\`.
3. Стрелочные функции не имеют собственного \`this\` и захватывают его из окружающего лексического контекста (функции \`start\`).
4. Когда через 100 мс колбэк выполняется, \`this\` по-прежнему указывает на \`timer\`, \`this.seconds\` инкрементируется с 0 до 1, и в консоль выводится \`1\`.

### Ключевые выводы:
• Стрелочные функции связывают \`this\` лексически на этапе создания, что делает их идеальными для колбэков таймеров и обработчиков событий внутри методов объектов.`,

  js154: `### Суть задачи
Сравнение поведения оператора \`in\` и метода \`Object.hasOwn()\` при проверке свойств в объекте и его прототипе.

### Пошаговые этапы решения:

1. **Проверка по прототипной цепочке (оператор \`in\`)**:
\`\`\`js
const proto = { inherited: true };
const obj = Object.create(proto);
obj.own = 123;

console.log("own" in obj);       // true
console.log("inherited" in obj); // true
\`\`\`
- Оператор \`in\` проверяет наличие свойства не только в самом объекте, но и рекурсивно поднимается по всей цепочке его прототипов (\`[[Prototype]]\`).
- Свойство \`"own"\` находится непосредственно в объекте \`obj\` -> \`true\`.
- Свойство \`"inherited"\` найдено в прототипе \`proto\` -> \`true\`.

2. **Проверка собственных свойств (\`Object.hasOwn\`)**:
\`\`\`js
console.log(Object.hasOwn(obj, "own"));       // true
console.log(Object.hasOwn(obj, "inherited")); // false
\`\`\`
- Статический метод \`Object.hasOwn(obj, prop)\` (ES2022, современная безопасная альтернатива \`Object.prototype.hasOwnProperty\`) проверяет **только собственные** свойства объекта.
- Метод не осуществляет поиск по цепочке прототипов.
- Свойство \`"own"\` является собственным свойством \`obj\` -> \`true\`.
- Свойство \`"inherited"\` принадлежит прототипу, а не объекту \`obj\` -> \`false\`.

### Ключевые выводы:
• Оператор \`in\` ищет свойство в объекте и во всех его прототипах.
• \`Object.hasOwn(obj, prop)\` проверяет только собственные свойства объекта, игнорируя цепочку прототипов.`,

  js155: `### Суть задачи
Каррирование функции сложения двух чисел с возможностью вызова \`sum(1, 2)\` и \`sum(1)(2)\`.

### Пошаговые этапы решения:

1. **Проверка наличия второго аргумента**:
\`\`\`js
const sum = (val1, val2) => {
  if (val2 !== undefined) return val1 + val2;
  return (num) => val1 + num;
};

console.log(sum(1, 2)); // 3
console.log(sum(1)(2)); // 3
\`\`\`
**Разбор**: Если \`val2\` передан, функция сразу возвращает результат сложения. Если не передан (\`undefined\`), возвращается замыкание, принимающее второй параметр \`num\`.

### Ключевые выводы:
• Позволяет объединить обычный вызов с частичным применением аргументов.`,

  js156: `### Суть задачи
Реализация бесконечного каррирования для вычисления суммы произвольного количества слагаемых.

### Пошаговые этапы решения:

1. **Терминальное условие при вызове без аргумента**:
\`\`\`js
function curry_sum(x) {
  const fn = (y) => {
    if (y === undefined) {
      return x;
    }
    return curry_sum(x + y);
  };
  return fn;
}

console.log(curry_sum(1)()); // 1
console.log(curry_sum(1)(2)(3)()); // 6
\`\`\`
**Разбор**: На каждом шаге функция возвращает внутреннюю стрелочную функцию. Если следующий вызов происходит без аргументов (\`y === undefined\`), цепочка прерывается и возвращается накопительное значение \`x\`.

### Ключевые выводы:
• Накопление результата происходит в замыкании рекурсивного вызова.`,

  js157: `### Суть задачи
Реализация цепочечного каррирования с произвольным числом вызовов и автоматическим приведением к числу через \`Symbol.toPrimitive\` / \`valueOf\`.

### Пошаговые этапы решения:

\`\`\`js
function sum(a) {
  let currentSum = a;

  function f(b) {
    currentSum += b;
    return f;
  }

  f[Symbol.toPrimitive] = () => currentSum;
  f.valueOf = () => currentSum;

  return f;
}

console.log(Number(sum(1)(2)(3))); // 6
console.log(+sum(2)(4));           // 6
\`\`\`
**Разбор**:
1. Функция \`sum(a)\` сохраняет накопленную сумму в замыкании \`currentSum\` и возвращает функцию \`f\`.
2. Каждый последующий вызов \`f(b)\` увеличивает \`currentSum\` и возвращает саму функцию \`f\` для продолжения цепочки.
3. Чтобы функция могла вести себя как число при числовом приведении (\`Number(fn)\`, унарный плюс \`+fn\`, операторы сравнения), переопределяются \`Symbol.toPrimitive\` и \`valueOf\`.

### Ключевые выводы:
• Использование методов \`Symbol.toPrimitive\` и \`valueOf\` позволяет функции возвращать как вызываемый объект, так и примитивное числовое значение в выражениях.`,

  js158: `### Суть задачи
Реализация собственного полифила \`Promise.all(promises)\`.

### Пошаговые этапы решения:
1. Создать новый \`Promise\`.
2. Сохранять результаты во внешний массив по индексам.
3. Учитывать счётчик завершённых промисов и вызывать \`reject\` при первой же ошибке.

### Ключевые выводы:
• \`Promise.all\` возвращает единый массив результатов только после выполнения всех элементов.`,

  js159: `### Суть задачи
Реализация полифила \`Promise.allSettled(promises)\`.

### Пошаговые этапы решения:
1. Завершить промис всегда со статусом успеха.
2. Для каждого элемента формировать объект \`{ status: 'fulfilled', value }\` или \`{ status: 'rejected', reason }\`.

### Ключевые выводы:
• \`Promise.allSettled\` не прерывает работу при отклонении отдельных промисов.`,

  js160: `### Суть задачи
Реализация полифилов \`Promise.race\` и \`Promise.any\`.

### Пошаговые этапы решения:
1. \`Promise.race\` возвращает первый завершившийся (успех/ошибка).
2. \`Promise.any\` возвращает первый успешный; при неудаче всех формирует \`AggregateError\`.

### Ключевые выводы:
• Различие в критерии завершения: быстрый любой отклик против первого успешного.`,

  js165: `### Суть задачи
Реализация декоратора \`throttle(fn, limit)\` для ограничения частоты вызовов.

### Пошаговые этапы решения:
1. Использовать флаг \`inThrottle\` в замыкании.
2. Вызывать целевую функцию сразу же при первом вызове и устанавливать \`inThrottle = true\`.
3. По истечении \`limit\` миллисекунд через \`setTimeout\` сбрасывать флаг \`inThrottle = false\`.

### Ключевые выводы:
• Оптимизирует непрерывные события скролла и движения мыши.`,

  js166: `### Суть задачи
Реализация композиции функций \`pipe\` и \`compose\`.

### Пошаговые этапы решения:
1. \`pipe\` применяет массивы функций слева направо через \`Array.prototype.reduce\`.
2. \`compose\` применяет функции справа налево.

### Ключевые выводы:
• Фундаментальный паттерн функционального программирования.`,

  js168: `### Суть задачи
Реализация рекурсивного глубокого сравнения объектов \`deepEqual(a, b)\`.

### Пошаговые этапы решения:
1. Проверить строгое равенство и \`NaN\`.
2. Сравнить количества ключей и рекурсивно проверить значения всех свойств.

### Ключевые выводы:
• Позволяет сравнивать сложные состояния компонентов без лишних перерисовок.`,

  js169: `### Суть задачи
Преобразование вложенного объекта в плоский объект с ключами через точку \`flattenObject\`.

### Пошаговые этапы решения:
1. Рекурсивно накапливать составной ключ вида \`"user.address.city"\`.
2. Записывать значения в итоговый плоский объект.

### Ключевые выводы:
• Удобно для сериализации форм и работы с поисковыми индексами.`,

  js170: `### Суть задачи
Реализация глубокой заморозки объекта \`deepFreeze(obj)\`.

### Пошаговые этапы решения:
1. Применить \`Object.freeze(obj)\`.
2. Рекурсивно вызвать \`deepFreeze\` для всех вложенных объектов.

### Ключевые выводы:
• Гарантирует абсолютную неизменяемость (immutability) данных.`,

  js171: `### Суть задачи
Реализация паттерна Шина событий (\`EventEmitter\` / \`PubSub\`).

### Пошаговые этапы решения:
1. Хранить массивы колбэков в коллекции \`Map\` или объекте \`events\`.
2. Метод \`on(event, callback)\` подписывает слушатель и возвращает объект \`{ unsubscribe: () => this.off(...) }\`.
3. Метод \`off(event, callback)\` отписывает конкретный колбэк.
4. Метод \`emit(event, ...args)\` вызывает всех зарегистрированных слушателей с переданными аргументами.
5. Метод \`once(event, callback)\` выполняет одноразовую подписку, вызывая отписку перед исполнением.

### Ключевые выводы:
• Основной паттерн событийной архитектуры в браузерах и Node.js.`,

  js173: `### Суть задачи
Реализация простейшей реактивной переменной \`createSignal(initialValue)\`.

### Пошаговые этапы решения:
1. Хранить значение и множество подписчиков \`Set\` в замыкании.
2. Возвращать кортеж \`[get, set, subscribe]\`.
3. \`get()\` возвращает актуальное значение.
4. \`set(nextValue)\` обновляет значение (поддерживая функцию-апдейтер) и оповещает всех подписчиков.
5. \`subscribe(fn)\` регистрирует подписчика и возвращает функцию отписки.

### Ключевые выводы:
• Лежит в основе современной реактивности (SolidJS, Vue, Signals).`,

  js174: `### Суть задачи
Разбор очередности вывода синхронного кода, исполнителя конструктора Promise, микрозадач \`.then\` и макрозадачи \`setTimeout\`.

### Пошаговые этапы решения:
1. Выполняется синхронный код: \`console.log(1)\` → выводится **\`1\`**.
2. \`setTimeout(..., 0)\` планирует макрозадачу для \`console.log(2)\`.
3. Конструктор \`new Promise((resolve) => ...)\` выполняется синхронно: \`console.log(3)\` → выводится **\`3\`**, а вызов \`resolve()\` планирует микрозадачу \`.then\`.
4. Выполняется синхронный код: \`console.log(5)\` → выводится **\`5\`**.
5. Event Loop опустошает очередь микрозадач: срабатывает колбэк \`.then\`: \`console.log(4)\` → выводится **\`4\`**.
6. Переход к очереди макрозадач: выполняется колбэк из таймера: \`console.log(2)\` → выводится **\`2\`**.

### Ключевые выводы:
• Итоговый порядок: **1, 3, 5, 4, 2**.
• Исполнитель конструктора \`new Promise\` запускается синхронно. Микрозадачи выполняются строго до перехода к макрозадачам \`setTimeout\`.`,

  js175: `### Суть задачи
Разбор выполнения синхронного кода, конструктора Promise, немедленно вызываемой функции (IIFE) и вызова \`.then\`.

### Пошаговые этапы решения:
1. Синхронно выполняется \`console.log(1)\` → выводится **\`1\`**.
2. Создается \`prom1 = new Promise(...)\`. Конструктор промиса выполняется синхронно: \`console.log(3)\` → выводится **\`3\`**, промис переходит в состояние fulfilled со значением \`4\`.
3. Синхронно выполняется \`console.log(2)\` → выводится **\`2\`**.
4. Вызов \`prom1.then(...)\` регистрирует микрозадачу с выводом значения \`4\`.
5. IIFE \`(function () { console.log(5); })()\` выполняется синхронно в основном потоке → выводится **\`5\`**.
6. Основной синхронный стек вызовов завершен. Event Loop переходит к очереди микрозадач: выполняется обработчик \`.then\` → выводится **\`4\`**.

### Ключевые выводы:
• Итоговый порядок: **1, 3, 2, 5, 4**.
• IIFE исполняются синхронно на месте вызова, а колбэки \`.then\` уходят в очередь микрозадач.`,

  js179: `### Суть задачи
Разбор взаимодействия асинхронной функции \`async/await\` и возврата \`Promise.resolve()\` из метода \`.then()\`.

### Пошаговые этапы решения:
1. Синхронно выводятся \`1\` и \`6\`.
2. В первой микрозадаче первого \`.then\` выводится \`3\` и возвращается \`Promise.resolve('4')\`. Возврат промиса требует дополнительных тиков очереди микрозадач.
3. Функция с \`await Promise.resolve('5')\` завершает ожидание резолва на 1-м тике микрозадач и выводит \`5\`.
4. Разрешившийся возвращенный промис передает значение \`4\` в последующий \`.then(console.log)\`.
5. Макрозадача выводит \`2\`.

### Ключевые выводы:
• Возврат объектов Promise из колбэка \`.then\` генерирует дополнительную микрозадачу задержки.`,

  js180: `### Суть задачи
Перекрестное создание микрозадач и макрозадач.

### Пошаговые этапы решения:
1. Синхронно выводится \`«Начало»\`.
2. Создается микрозадача \`Промис 1\` и макрозадача \`Таймер 1\`.
3. Синхронно выводится \`«Конец»\`.
4. Выполняется микрозадача \`Промис 1\`: выводит \`«Промис 1»\` и создает макрозадачу \`Таймер 2\`.
5. Выполняется первая макрозадача \`Таймер 1\`: выводит \`«Таймер 1»\` и создает микрозадачу \`Промис 2\`.
6. До перехода к следующей макрозадаче Event Loop опустошает возникшую микрозадачу \`Промис 2\`: выводит \`«Промис 2»\`.
7. Выполняется макрозадача \`Таймер 2\`: выводит \`«Таймер 2»\`.

### Ключевые выводы:
• Каждая макрозадача проверяет и полностью опустошает очередь микрозадач перед переходом к следующей макрозадаче.`,

  js181: `### Суть задачи
Анализ взаимодействия синхронного кода, микрозадач (\`Promise\`), макрозадач таймеров (\`setTimeout\`) и анимационных колбэков рендеринга (\`requestAnimationFrame\`) в цикле событий (Event Loop) браузера.

### Пошаговый разбор:

\`\`\`js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

requestAnimationFrame(() => {
  console.log("C");
});

Promise.resolve().then(() => {
  console.log("D");
});

console.log("E");
\`\`\`

 **Разбор фаз выполнения**:
1. **Синхронный стек вызовов**:
   - Выполняется \`console.log("A")\` → выводится **\`A\`**.
   - \`setTimeout(..., 0)\` регистрирует макрозадачу в таймерной очереди.
   - \`requestAnimationFrame(...)\` регистрирует колбэк перед фазой перерисовки кадра (Rendering Pipeline).
   - \`Promise.resolve().then(...)\` помещает микрозадачу в очередь \`Microtask Queue\`.
   - Выполняется \`console.log("E")\` → выводится **\`E\`**.

2. **Очистка микрозадач (Microtask Queue)**:
   - Сразу после опустошения синхронного стека Event Loop обязан полностью исчерпать очередь микрозадач перед любыми другими действиями.
   - Выполняется микрозадача промиса: \`console.log("D")\` → выводится **\`D\`**.

3. **Негарантированный порядок между \`setTimeout\` и \`requestAnimationFrame\`**:
   - Порядок между \`B\` (\`setTimeout\`) и \`C\` (\`requestAnimationFrame\`) **не является универсально фиксированным** и зависит от браузера, текущей частоты обновления дисплея (60Hz / 120Hz) и того, когда запланирован следующий шаг отрисовки (rendering opportunity).
   - Если браузер выполняет шаг рендеринга до следующей макрозадачи таймера: вывод будет \`A, E, D, C, B\`.
   - Если макрозадача таймера успевает выполниться до начала шага рендеринга: вывод будет \`A, E, D, B, C\`.

### Ключевые выводы:
• Синхронный код (\`A, E\`) и микрозадачи (\`D\`) гарантированно выполняются первыми.
• Относительный порядок \`setTimeout(0)\` и \`rAF\` не детерминирован спецификацией и зависит от фазы планировщика браузера.`,

  js182: `### Суть задачи
Сложная комбинация вложенных \`setTimeout\` в конструкторе и цепочке \`.then\`.

### Пошаговые этапы решения:
1. Синхронно выводится \`begins\` и \`promise 2\` (внутри конструктора).
2. Зарегистрированы две макрозадачи: \`setTimeout 1\` и \`setTimeout 2\`.
3. В первой макрозадаче выводится \`setTimeout 1\` и создается микрозадача \`promise 1\`, которая выполняется немедленно после нее.
4. Во второй макрозадаче выводится \`setTimeout 2\` и вызывается \`resolve("resolve 1")\`.
5. Вызов \`resolve\` активирует обработчик \`.then\`, который выводит \`dot then 1\` и планирует третью макрозадачу для вывода значения \`resolve 1\`.

### Ключевые выводы:
• Состояние промиса сменится только при непосредственном вызове функции \`resolve()\`.`,

  js176: `### Суть задачи
Реализация мини-шаблонизатора строк \`renderTemplate(template, data)\`.

### Пошаговые этапы решения:
1. Использовать регулярное выражение \`/{{\\s*([\\w.]+)\\s*}}/g\` для поиска плейсхолдеров вида \`{{ path.to.prop }}\`.
2. Извлекать значения по вложенному пути, разбивая \`path\` по точке (\`path.split('.')\`).
3. Подставлять полученное значение в строку (или пустую строку, если значение \`null\` или \`undefined\`).

### Ключевые выводы:
• Позволяет подставлять глубоко вложенные данные в шаблон без сторонних библиотек.`,

  js177: `### Суть задачи
Парсинг и сериализация URL Query String (\`parseQueryString\` / \`stringifyQuery\`).

### Пошаговые этапы решения:
1. Декодировать спецсимволы через \`decodeURIComponent\`.
2. Формировать массив при наличии одинаковых ключей.

### Ключевые выводы:
• Базовая утилита для работы с маршрутизацией и поисковыми параметрами.`,

  js178: `### Суть задачи
Реализация утилиты условного объединения CSS-классов \`classNames(...args)\`.

### Пошаговые этапы решения:
1. Рекурсивно обрабатывать строки, объекты и массивы.
2. Фильтровать ключи объектов по истинности значений.

### Ключевые выводы:
• Полный аналог популярных библиотек \`clsx\` и \`classnames\`.`,

  js186: `### Суть задачи
Определить результаты базовых операций с типами данных в JavaScript: поведение \`typeof\`, строгого (\`===\`) и нестрогого (\`==\`) сравнения, ссылочного сравнения массивов и неявного приведения при бинарных операциях \`+\` и \`-\`.

### Подробный построчный разбор:

1. **\`typeof null\` $\\rightarrow$ \`'object'\`**
   - **Результат:** \`'object'\`
   - **Объяснение:** Это известная историческая ошибка первой версии JavaScript. Значения кодировались 32-битными словами, где первые биты обозначали тип (\`000\` — тип \`object\`). Значение \`null\` представлялось как нулевой указатель (\`0x00\`), из-за чего оператор \`typeof\` ошибочно идентифицировал его как объект. Баг сохранён в стандарте ECMAScript ради обратной совместимости.

2. **\`typeof NaN\` $\\rightarrow$ \`'number'\`**
   - **Результат:** \`'number'\`
   - **Объяснение:** По стандарту IEEE 754 значение \`NaN\` (*Not a Number*) является специальным числовым значением, обозначающим неопределённый или недопустимый результат математической операции (например, \`0 / 0\` или \`Number('abc')\`).

3. **\`null === undefined\` $\\rightarrow$ \`false\`**
   - **Результат:** \`false\`
   - **Объяснение:** Строгое равенство (\`===\`) сравнивает типы данных без приведения. Тип \`null\` — это \`Null\`, а тип \`undefined\` — это \`Undefined\`. Разные типы возвращают \`false\`.

4. **\`null == undefined\` $\\rightarrow$ \`true\`**
   - **Результат:** \`true\`
   - **Объяснение:** По спецификации ECMAScript для нестрогого равенства (\`==\`) действует специальное правило: \`null\` и \`undefined\` равны друг другу и не равны ни одному другому значению в JavaScript.

5. **\`[] === []\` $\\rightarrow$ \`false\`**
   - **Результат:** \`false\`
   - **Объяснение:** Массивы — это ссылочный тип данных (объекты). Каждый литерал \`[]\` создаёт новый объект в оперативной памяти с уникальным адресом ссылки. Поскольку адреса разные, результат сравнения — \`false\`.

6. **\`[] == ![]\` $\\rightarrow$ \`true\`**
   - **Результат:** \`true\`
   - **Пошаговая цепочка приведения типов:**
     1. Оператор логического отрицания \`!\` имеет наивысший приоритет: \`![]\` вычисляет отрицание объекта. Любой объект в JS — это *truthy*, поэтому \`![]\` $\\rightarrow$ \`false\`.
     2. Выражение принимает вид \`[] == false\`.
     3. При нестрогом сравнении объекта и примитива массив приводится к строке через метод \`[].toString()\` $\\rightarrow$ \`""\`.
     4. Получаем \`"" == false\`.
     5. При сравнении строки и boolean оба операнда приводятся к числам: \`Number("")\` $\\rightarrow$ \`0\` и \`Number(false)\` $\\rightarrow$ \`0\`.
     6. \`0 == 0\` даёт \`true\`.

7. **\`'5' + 3\` $\\rightarrow$ \`'53'\`**
   - **Результат:** \`'53'\`
   - **Объяснение:** Если хотя бы один из операндов бинарного плюса \`+\` является строкой, JavaScript выполняет строковую конкатенацию. Число \`3\` неявно приводится к строке \`'3'\`.

8. **\`'5' - 3\` $\\rightarrow$ \`2\`**
   - **Результат:** \`2\`
   - **Объяснение:** Оператор вычитания \`-\` не определён для строк, поэтому он всегда выполняет числовое приведение: \`Number('5') - 3\` $\\rightarrow$ \`5 - 3 = 2\`.

### Ключевые выводы:
• Оператор \`+\` при наличии строки конкатенирует, а \`-\`, \`*\`, \`/\` всегда приводят операнды к числам.  
• Объекты и массивы всегда сравниваются по ссылке в памяти, а не по значению.  
• Нестрогое равенство \`null == undefined\` даёт \`true\`, но строгое \`null === undefined\` — \`false\`.`,

  js187: `### Суть задачи
Разобрать алгоритм преобразования объектов в примитивы (\`ToPrimitive\`) при операциях сложения, поведение унарного плюса и краевые случаи сравнения \`null\` с нулём (\`>\`, \`==\`, \`>=\`).

### Подробный построчный разбор:

1. **\`[] + []\` $\\rightarrow$ \`""\`**
   - **Результат:** \`""\` (пустая строка)
   - **Объяснение:** Бинарный плюс при работе с объектами вызывает алгоритм \`ToPrimitive(hint: "default")\`. Для массивов вызывается метод \`valueOf()\` (возвращает сам массив), затем метод \`toString()\`, возвращающий пустую строку \`""\`. В итоге: \`"" + "" = ""\`.

2. **\`[] + {}\` $\\rightarrow$ \`"[object Object]"\`**
   - **Результат:** \`"[object Object]"\`
   - **Объяснение:** \`ToPrimitive\` преобразует \`[]\` в \`""\`, а объект \`{}\` — в строку \`"[object Object]"\`. Сложение строк даёт \`"" + "[object Object]" = "[object Object]"\`.

3. **\`{} + []\` $\\rightarrow$ \`"[object Object]"\` (в выражении) / \`0\` (в начале строки)**
   - **Результат:** \`"[object Object]"\`
   - **Объяснение:** Внутри выражения \`console.log({} + [])\` движок парсит \`{}\` как объектный литерал. (Внимание: если \`{} + []\` записать в начале отдельной строки в DevTools консоли без скобок, \`{}\` будет воспринят как пустой блок кода, а \`+[]\` выполнит унарный плюс над массивом: \`+""\` $\\rightarrow$ \`0\`).

4. **\`+true\` $\\rightarrow$ \`1\` и \`+false\` $\\rightarrow$ \`0\`**
   - **Результат:** \`1\` и \`0\`
   - **Объяснение:** Унарный плюс производит операцию \`ToNumber\`: \`Number(true) === 1\`, \`Number(false) === 0\`.

5. **\`+null\` $\\rightarrow$ \`0\`**
   - **Результат:** \`0\`
   - **Объяснение:** По спецификации ECMAScript \`Number(null)\` равен \`0\`.

6. **\`+undefined\` $\\rightarrow$ \`NaN\`**
   - **Результат:** \`NaN\`
   - **Объяснение:** В отличие от \`null\`, приведение \`undefined\` к числу (\`Number(undefined)\`) возвращает \`NaN\`.

7. **\`+"   "\` $\\rightarrow$ \`0\`**
   - **Результат:** \`0\`
   - **Объяснение:** Строка, состоящая исключительно из пробельных символов (пробелы, табы, переводы строк), при числовом преобразовании даёт \`0\`.

8. **\`null > 0\` $\\rightarrow$ \`false\`**
   - **Результат:** \`false\`
   - **Объяснение:** Реляционные операторы сравнения (\`<\`, \`>\`, \`<=\`, \`>=\`) приводят операнды к числам: \`Number(null)\` $\\rightarrow$ \`0\`. Сравнение \`0 > 0\` возвращает \`false\`.

9. **\`null == 0\` $\\rightarrow$ \`false\`**
   - **Результат:** \`false\`
   - **Объяснение:** Алгоритм нестрогого равенства (\`==\`) не приводит \`null\` к числу. По спецификации \`null\` равен только \`undefined\`.

10. **\`null >= 0\` $\\rightarrow$ \`true\` (Парадокс сравнения)**
    - **Результат:** \`true\`
    - **Объяснение:** По стандарту ECMAScript оператор \`>=\` вычисляется через отрицание строго меньше: выражение \`a >= b\` определяется как \`!(a < b)\`. Поскольку \`null < 0\` даёт \`0 < 0\` $\\rightarrow$ \`false\`, отрицание \`!(false)\` возвращает \`true\`!

### Ключевые выводы:
• Алгоритм \`ToPrimitive\` для обычных объектов по умолчанию вызывает метод \`valueOf()\`, а затем \`toString()\`.  
• Выражение \`null >= 0\` возвращает \`true\`, хотя \`null > 0\` и \`null == 0\` оба возвращают \`false\`.  
• \`Number(null) === 0\`, тогда как \`Number(undefined) === NaN\`.`,

  js188: `### Суть задачи
Освоить строгие методы проверки типов, алгоритм \`SameValue\` в \`Object.is\`, различие между \`isNaN\` и \`Number.isNaN\`, а также работу логических операторов \`||\` и \`??\` на falsy-значениях.

### Подробный построчный разбор:

1. **\`NaN === NaN\` $\\rightarrow$ \`false\`, но \`Object.is(NaN, NaN)\` $\\rightarrow$ \`true\`**
   - По стандарту IEEE 754 значение \`NaN\` не равно ничему, включая самого себя.
   - Метод \`Object.is\` реализует алгоритм \`SameValue\`, который считает два значения \`NaN\` абсолютно идентичными.

2. **\`+0 === -0\` $\\rightarrow$ \`true\`, но \`Object.is(+0, -0)\` $\\rightarrow$ \`false\`**
   - Строгое равенство (\`===\`) считает положительный и отрицательный ноль равными.
   - \`Object.is\` различает \`+0\` и \`-0\` (это критично в математических расчётах: \`1 / +0 === Infinity\`, а \`1 / -0 === -Infinity\`).

3. **\`isNaN("hello")\` $\\rightarrow$ \`true\` vs \`Number.isNaN("hello")\` $\\rightarrow$ \`false\`**
   - Глобальная функция \`isNaN\` сначала выполняет неявное приведение к числу: \`Number("hello")\` $\\rightarrow$ \`NaN\`, затем \`isNaN(NaN)\` даёт \`true\`.
   - Метод \`Number.isNaN\` проверяет строго без приведения: тип значения должен быть \`number\` И значение должно быть \`NaN\`. Поскольку \`typeof "hello"\` — это \`string\`, результат — \`false\`.

4. **\`0 || 42\` $\\rightarrow$ \`42\` vs \`0 ?? 42\` $\\rightarrow$ \`0\`**
   - Оператор \`||\` ищет первое *truthy* значение. Число \`0\` является *falsy*, поэтому возвращается \`42\`.
   - Оператор нулевого слияния \`??\` проверяет значение только на \`null\` и \`undefined\` (*nullish*). Поскольку \`0\` определено, возвращается \`0\`.

5. **\`"" || "default"\` $\\rightarrow$ \`"default"\` vs \`"" ?? "default"\` $\\rightarrow$ \`""\`**
   - Пустая строка \`""\` является *falsy*, поэтому \`||\` возвращает \`"default"\`.
   - Для оператора \`??\` пустая строка — это валидное определённое значение, поэтому возвращается \`""\`.

6. **\`typeof [] === 'object'\` vs \`Array.isArray([]) === true\`**
   - В JavaScript массивы и функции относятся к объектам. \`typeof []\` возвращает \`'object'\`.
   - Для проверки массивов используется метод \`Array.isArray()\`, который надёжно определяет массив даже между разными фреймами (\`iframe\`).

7. **\`Object.prototype.toString.call(null) === '[object Null]'\`**
   - Встроенный метод считывает внутренний тег \`[[Class]]\` или \`Symbol.toStringTag\`.
   - Это самый универсальный и надёжный метод определения любых встроенных типов данных (\`[object Null]\`, \`[object Array]\`, \`[object Date]\`, \`[object RegExp]\`).

### Ключевые выводы:
• \`Number.isNaN\` надёжнее глобального \`isNaN\`, так как не выполняет неявных преобразований типов.  
• Оператор \`??\` позволяет задавать значения по умолчанию, не затирая валидные \`0\`, \`""\` и \`false\`.  
• \`Object.is\` используется для точного сравнения краевых случаев (\`NaN\` и \`-0\`).`,

  js189: `### Суть задачи
Освоить синтаксис цикла \`for...in\` для обхода перечислимых строковых ключей объекта JavaScript.

### Пошаговые этапы решения:
1. Использовать конструкцию \`for (const key in obj)\`.
2. На каждой итерации получать значение по динамическому ключу через \`obj[key]\`.
3. Вывести результат в формате \`\${key}: \${obj[key]}\`.

### Ключевые выводы:
• В отличие от \`for...of\`, цикл \`for...in\` возвращает имена свойств (ключи), а не их значения.  
• Для массивов \`for...in\` использовать не рекомендуется из-за накладных расходов и обхода нечисловых свойств.`,

  js190: `### Суть задачи
Суммирование числовых значений свойств объекта (зарплат) с помощью цикла \`for...in\`.

### Пошаговые этапы решения:
1. Инициализировать переменную-аккумулятор \`let sum = 0\`.
2. Перебрать ключи объекта циклом \`for...in\` и прибавить значение \`sum += salaries[key]\`.
3. Вернуть итоговую сумму (для пустого объекта вернется \`0\`).

### Ключевые выводы:
• Если объект пуст, цикл \`for...in\` не делает ни одной итерации.  
• Альтернативное решение в функциональном стиле: \`Object.values(salaries).reduce((a, b) => a + b, 0)\`.`,

  js191: `### Суть задачи
Подсчет общего количества свойств объекта через цикл \`for...in\`.

### Пошаговые этапы решения:
1. Завести счетчик \`let count = 0\`.
2. В теле цикла \`for (const _ in obj)\` увеличивать счетчик \`count++\`.
3. Вернуть число \`count\`.

### Ключевые выводы:
• Цикл \`for...in\` удобен для прямого подсчета свойств.  
• В современном JS количество собственных ключей также можно получить через \`Object.keys(obj).length\`.`,

  js192: `### Суть задачи
Модификация объекта: умножение всех числовых свойств на \`2\` с сохранением нечисловых значений без изменений.

### Пошаговые этапы решения:
1. Обойти объект циклом \`for...in\`.
2. Проверить тип значения через \`typeof obj[key] === 'number'\`.
3. Если значение числовое — умножить его на 2 (\`obj[key] *= 2\`).
4. Вернуть модифицированный объект \`obj\`.

### Ключевые выводы:
• Проверка \`typeof obj[key] === 'number'\` защищает от конкатенации строк при умножении.`,

  js193: `### Суть задачи
Получение значений только собственных (non-inherited) свойств объекта с игнорированием прототипной цепочки.

### Варианты решения:
1. **Production-вариант (Рекомендуемый)**: \`const getOwnValues = (obj) => Object.values(obj)\`. Нативный метод ES2017 возвращает массив значений только собственных перечислимых свойств, оптимизирован движком на C++ и не требует ручных циклов.
2. **Учебный вариант через \`for...in\`**: Цикл \`for...in\` обходит как собственные, так и унаследованные свойства прототипов. Для отсечения прототипа используется \`Object.hasOwn(obj, key)\`.

### Как отвечать на собеседовании:
• **Идеальный ответ сеньора**: сразу сказать: «В проде я напишу \`Object.values(obj)\`, так как он нативно забирает только собственные свойства и оптимизирован движком».
• **Демонстрация базы**: добавить: «Но если задача проверяет понимание работы \`for...in\` и прототипного наследования, то \`for...in\` потянет за собой унаследованные перечислимые свойства из прототипов, и их нужно отсекать через \`Object.hasOwn(obj, key)\`».`,

  js194: `### Суть задачи
Реализация функции \`isEmpty(obj)\` для проверки объекта на отсутствие собственных перечислимых свойств.

### Пошаговые этапы решения:

1. **Обход через цикл \`for...in\` с проверкой \`Object.hasOwn\`**:
\`\`\`js
const isEmpty = (obj) => {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      return false;
    }
  }
  return true;
};
\`\`\`
**Разбор**: При нахождении первого же собственного свойства функция выполняет ранний возврат \`false\` (\`O(1)\` в лучшем случае). Если цикл завершился без нахождения собственных свойств — возвращается \`true\`.

2. **Почему обязательна проверка \`Object.hasOwn\`**:
Цикл \`for...in\` обходит не только собственные свойства объекта, но и унаследованные перечислимые свойства из всей цепочки прототипов. Без проверки \`Object.hasOwn(obj, key)\` объект с унаследованными свойствами (например \`Object.create({ a: 1 })\`) ошибочно посчитался бы непустым.

### Анализ сложности:
• **Время**: \`O(1)\` в лучшем случае (когда первое же свойство собственное), \`O(N + P)\` в худшем случае (когда объект пуст или содержит унаследованные свойства цепочки прототипов). Утверждение об \`O(1)\` в худшем случае ошибочно.
• **Память**: \`O(1)\` дополнительной памяти (в отличие от \`Object.keys(obj).length === 0\`, который аллоцирует массив всех ключей \`O(N)\`).`,

  js195: `### Суть задачи
Инверсия объекта: создание нового объекта, где значения исходного объекта становятся ключами, а ключи — значениями.

### Пошаговые этапы решения:
1. Создать новый пустой объект \`const inverted = {}\`.
2. Обойти исходный объект циклом \`for...in\`.
3. Записать в новый объект \`inverted[obj[key]] = key\`.
4. Вернуть \`inverted\`.

### Ключевые выводы:
• При наличии дублирующихся значений в исходном объекте последнее обработанное свойство перезапишет предыдущие.  
• Альтернатива: \`Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))\`.`,

  js196: `# Разбор задачи: «Преобразование списка категорий»

## 1. Что дано

Есть плоский (не вложенный) массив объектов. У каждого объекта есть:

- \`title\` — название категории;
- \`parent\` — название родительской категории, или \`null\`, если категория корневая (у неё нет родителя).

\`\`\`js
const categories = [
  { title: "Приготовление напитков", parent: "Техника для кухни" },
  { title: "Техника для дома", parent: "Бытовая техника" },
  { title: "Варочные панели", parent: "Встраиваемая техника" },
  { title: "Бытовая техника", parent: null },
  { title: "Встраиваемая техника", parent: "Бытовая техника" },
  { title: "Духовые шкафы", parent: "Встраиваемая техника" },
  { title: "Продукты питания", parent: null },
  { title: "Электрочайники и термопоты", parent: "Техника для кухни" },
  { title: "Вытяжки", parent: "Встраиваемая техника" },
  { title: "Техника для кухни", parent: "Бытовая техника" },
];
\`\`\`

Каждый элемент "знает" только про своего родителя, но не знает про своих детей. Это стандартный способ хранить иерархию в базе данных (плоская таблица со ссылкой на \`parent_id\`), и часто такие данные нужно превратить в удобную для отображения структуру — **дерево**.

## 2. Что нужно получить

Вложенную структуру, где у каждого объекта появляется массив \`children\` с его "детьми":

\`\`\`js
[
  {
    title: "Бытовая техника",
    children: [
      {
        title: "Встраиваемая техника",
        children: [
          { title: "Варочные панели" },
          { title: "Духовые шкафы" },
          { title: "Вытяжки" },
        ],
      },
      {
        title: "Техника для кухни",
        children: [
          { title: "Электрочайники и термопоты" },
          { title: "Приготовление напитков" },
        ],
      },
      { title: "Техника для дома" },
    ],
  },
  { title: "Продукты питания", children: [] },
]
\`\`\`

Важные детали формата (легко упустить):

- У **корневых** элементов (\`parent: null\`) поле \`children\` есть всегда — даже если оно пустое (см. "Продукты питания").
- У **листьев** (у кого нет своих детей) поля \`children\` вообще нет. Это не баг, а осознанное требование к формату вывода.

## 3. Первая идея (и почему она не лучшая)

Самый очевидный вариант — рекурсивная функция, которая для каждого узла ищет его детей через \`filter\`:

\`\`\`js
const createCategoryTree = (list, parent = null) => {
  return list
    .filter(item => item.parent === parent)
    .map(item => {
      const children = list.filter(child => child.parent === item.title);
      const node = { title: item.title };
      if (parent === null || children.length) {
        node.children = createCategoryTree(list, item.title);
      }
      return node;
    });
};
\`\`\`

Это работает, но имеет проблему: для **каждого** элемента мы заново проходим **весь** массив (\`filter\`). Если в списке \`n\` элементов, то в худшем случае мы делаем \`n\` проходов по \`n\` элементам — то есть \`O(n²)\`.

Для 10 элементов из примера это неважно. Но если категорий 10 000 (интернет-магазин, каталог с тысячами позиций), это уже 100 000 000 операций — заметно медленнее, чем нужно.

**Вывод для джуна:** рекурсия с \`filter\`/\`find\` внутри — рабочее, но не оптимальное решение. Стоит знать более быстрый подход.

## 4. Оптимальный подход: два прохода вместо вложенных

Идея в том, чтобы не искать детей каждый раз заново, а **один раз** создать "быстрый доступ" к любому узлу по имени, а потом просто разложить связи.

### Шаг 1 — Map для мгновенного доступа

\`Map\` — это структура данных вроде объекта, но с O(1) доступом по ключу (в среднем). Мы кладём туда каждый элемент списка под ключом \`title\`:

\`\`\`js
const nodeMap = new Map();

list.forEach(({ title }) => {
  nodeMap.set(title, { title });
});
\`\`\`

После этого шага у нас есть "склад" узлов. Пока это просто плоский набор объектов \`{ title }\` — без всяких связей друг с другом. Но зато любой узел по его названию можно достать мгновенно: \`nodeMap.get("Бытовая техника")\`.

Важный трюк здесь: значения в \`Map\` — это **объекты**, и \`Map\` хранит на них ссылки. Значит, если позже мы найдём \`nodeMap.get("Бытовая техника")\` и допишем ему \`children\`, то это изменение сразу "увидят" все, кто ссылается на этот же объект.

### Шаг 2 — расставляем связи parent → children

Теперь второй проход по тому же списку. На этот раз для каждого элемента мы:

1. достаём его уже готовый узел из \`nodeMap\` (по \`title\`);
2. смотрим на его \`parent\`;
3. если \`parent === null\` — это корень, кладём в итоговый массив \`roots\`;
4. если \`parent\` — это название другой категории, находим родительский узел в \`nodeMap\` и добавляем в его \`children\` наш узел.

\`\`\`js
const roots = [];

list.forEach(({ title, parent }) => {
  const node = nodeMap.get(title);

  if (parent === null) {
    node.children = node.children || [];
    roots.push(node);
    return;
  }

  const parentNode = nodeMap.get(parent);
  if (!parentNode) return; // на случай "битых" данных

  if (!parentNode.children) parentNode.children = [];
  parentNode.children.push(node);
});

return roots;
\`\`\`

### Полный код

\`\`\`js
const createCategoryTree = (list) => {
  const nodeMap = new Map();

  // 1. Создаём "пустой" узел для каждого элемента
  list.forEach(({ title }) => {
    nodeMap.set(title, { title });
  });

  const roots = [];

  // 2. Раскладываем связи parent -> children
  list.forEach(({ title, parent }) => {
    const node = nodeMap.get(title);

    if (parent === null) {
      node.children = node.children || [];
      roots.push(node);
      return;
    }

    const parentNode = nodeMap.get(parent);
    if (!parentNode) return;

    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push(node);
  });

  return roots;
};
\`\`\`

## 5. Разбор по шагам "вживую"

Проследим на маленьком примере — 4 элемента:

\`\`\`js
[
  { title: "A", parent: null },
  { title: "B", parent: "A" },
  { title: "C", parent: "A" },
  { title: "D", parent: "B" },
]
\`\`\`

**После шага 1** (\`nodeMap\` заполнена "пустыми" узлами):

\`\`\`
nodeMap = {
  "A" -> { title: "A" },
  "B" -> { title: "B" },
  "C" -> { title: "C" },
  "D" -> { title: "D" },
}
\`\`\`

**Шаг 2**, проходим по списку по порядку:

- \`A\`, \`parent: null\` → это корень. \`A.children = []\`. Кладём \`A\` в \`roots\`.
- \`B\`, \`parent: "A"\` → находим узел \`A\` в \`nodeMap\`, у него ещё нет \`children\` (там \`[]\`, уже есть с прошлого шага) — добавляем \`B\` в \`A.children\`. Теперь \`A.children = [B]\`.
- \`C\`, \`parent: "A"\` → снова находим \`A\`, добавляем \`C\`. Теперь \`A.children = [B, C]\`.
- \`D\`, \`parent: "B"\` → находим узел \`B\` в \`nodeMap\`. У него ещё нет \`children\` — создаём \`B.children = []\`, добавляем \`D\`. Теперь \`B.children = [D]\`.

**Итог:**

\`\`\`js
[
  {
    title: "A",
    children: [
      { title: "B", children: [{ title: "D" }] },
      { title: "C" },
    ],
  },
]
\`\`\`

Обратите внимание: у \`C\` нет \`children\`, потому что у него не оказалось детей — мы никогда не заходили в ветку \`if (!parentNode.children)\` для \`C\` как для родителя.

## 6. Почему это быстрее

- **Шаг 1** — один проход по списку: \`O(n)\`.
- **Шаг 2** — тоже один проход по списку, а поиск родителя через \`nodeMap.get()\` занимает \`O(1)\`, а не \`O(n)\`, как было бы с \`.find()\` по массиву.

Итоговая сложность: **O(n)** по времени и **O(n)** по памяти (на саму \`Map\` и узлы).

Сравните с наивным рекурсивным решением из раздела 3, где на каждый элемент тратился ещё один проход по всему массиву — там получалось \`O(n²)\`.

**Правило, которое стоит запомнить:** если видите вложенные \`filter\`/\`find\`/\`map\` по одному и тому же массиву (когда для каждого элемента снова перебирается весь список) — это сигнал, что, скорее всего, можно ускорить решение через \`Map\` или объект-словарь.

## 7. Важные детали реализации (частые ошибки junior)

### 7.1 Почему \`children\` не всегда есть

Задание требует, чтобы у "листьев" (категорий без потомков) поля \`children\` не было вообще, а не было равно \`[]\`. Поэтому в коде мы **не** создаём \`children\` заранее для всех узлов — оно появляется только:

- у корневых элементов (явно, в блоке \`if (parent === null)\`);
- у любого узла в тот момент, когда для него в первый раз нашёлся ребёнок (\`if (!parentNode.children) parentNode.children = []\`).

Частая ошибка — сразу дать всем узлам \`children: []\` на шаге 1. Тогда результат не будет соответствовать формату из условия (у листьев появится лишнее пустое поле).

### 7.2 Защита от "битых" данных

\`\`\`js
const parentNode = nodeMap.get(parent);
if (!parentNode) return;
\`\`\`

Что если в \`parent\` указано название категории, которой в списке нет вообще (опечатка, категория удалена, но ссылки на неё остались)? Без этой проверки \`nodeMap.get(parent)\` вернёт \`undefined\`, а следующая строка (\`parentNode.children = ...\`) упадёт с ошибкой \`Cannot set properties of undefined\`.

Проверка \`if (!parentNode) return\` просто "выбрасывает" такой элемент из дерева, вместо того чтобы уронить всю функцию. Это осознанный выбор поведения при плохих данных — на собеседовании стоит явно проговорить эту деталь и уточнить, какое поведение ожидается (молча пропустить / бросить ошибку / положить в отдельный список "потерянных" узлов).

### 7.3 Почему используется \`Map\`, а не обычный объект \`{}\`

Можно было бы использовать обычный объект вместо \`Map\`:

\`\`\`js
const nodeMap = {};
nodeMap[title] = { title };
\`\`\`

Это тоже сработает и тоже даст \`O(1)\` доступ. \`Map\` предпочтительнее по паре причин:

- не путает \`title\` с зарезервированными именами вроде \`constructor\`, \`toString\` и т.п. (в обычном объекте эти имена уже заняты прототипом);
- явно предназначен именно для "ключ → значение" и читается понятнее по смыслу кода.

Для этой конкретной задачи разница не критична, но \`Map\` — более безопасный дефолт, когда ключи приходят из внешних данных (а не захардкожены в коде).

### 7.4 Порядок детей в результате

Дети добавляются в \`children\` в том порядке, в котором они встречаются в исходном массиве (\`push\` в конец). Это естественное и предсказуемое поведение. Если нужен какой-то другой порядок (например, по алфавиту) — это отдельный шаг сортировки уже после построения дерева, не стоит смешивать его с логикой самого построения.

## 8. Как проверить решение

Простой способ — вывести результат через \`console.log(JSON.stringify(result, null, 2))\` и сверить с ожидаемой структурой из условия. Более надёжный способ на будущее — написать пару unit-тестов:

\`\`\`js
// 1. Корень с пустыми children, если детей нет
// 2. Обычная многоуровневая вложенность (2-3 уровня)
// 3. Список с "битым" parent, который ссылается на несуществующий title
// 4. Пустой список на входе -> должен вернуться пустой массив
\`\`\`

## 9. Итоговые выводы

- Задача — классический пример превращения "плоского списка с ссылками на родителя" в дерево. Такой паттерн часто встречается в реальных проектах: категории каталога, комментарии с ответами, оргструктура сотрудников, файловая система.
- Наивное решение через рекурсию и \`filter\` работает, но неэффективно на больших объёмах данных (\`O(n²)\`).
- Эффективное решение — в два прохода через \`Map\`: сначала создать все узлы, потом расставить связи. Сложность \`O(n)\`.
- Важно точно соблюдать формат вывода (когда \`children\` есть, а когда его быть не должно) — это то, что легко упустить при быстром решении "в лоб".
- Стоит защищаться от некорректных входных данных (несуществующий \`parent\`), чтобы функция не падала с ошибкой.
`,

  a4: `### Суть задачи
Разбор порядка выполнения фаз жизненного цикла в React 19: фаза рендеринга (Render Phase — синхронное выполнение тела функционального компонента), фаза фиксации (Commit Phase — синхронный вызов Ref Callback при привязке к реальному DOM-узлу) и фаза после фиксации (Post-Commit Phase — асинхронный вызов useEffect после того, как браузер отрисовал кадр на экране).

### Пошаговые этапы и фазы выполнения:

1. **Фаза 1: Render Phase (Синхронно)**:
   - React вызывает функцию компонента \`App()\`.
   - Выполняется синхронный код тела функции: \`console.log(0)\`.
   - Вызов \`useEffect(...)\` регистрирует эффект в списке эффектов fiber-узла, но колбэк эффекта на этой фазе НЕ вызывается.
   - Функция возвращает виртуальное JSX-дерево.

2. **Фаза 2: Commit Phase (Синхронно в DOM)**:
   - React создает реальный DOM-элемент \`div\` и монтирует его в документ.
   - Срабатывает Ref Callback: \`ref={(node) => { console.log(2); }}\`.
   - В React 19 Ref Callback вызывается синхронно при привязке узла. Также в React 19 Ref Callback может возвращать функцию очистки (cleanup), которая будет вызвана при размонтировании DOM-узла: \`ref={(node) => () => { cleanup(); }}\`.

3. **Фаза 3: Browser Paint & Post-Commit (Асинхронно)**:
   - Браузер выполняет отрисовку кадра (Paint/Layout) на экране пользователя.
   - После завершения отрисовки React асинхронно запускает зарегистрированные колбэки \`useEffect\`: \`console.log(1)\`.

### Порядок вывода (React 19, Production):
\`\`\`
0
2
1
\`\`\`

### Важные нюансы окружения:
- **Production vs Development StrictMode**: В продакшене монтирование происходит один раз: \`0, 2, 1\`. В режиме разработки под \`<React.StrictMode>\` React намеренно выполняет двойное монтирование для проверки идемпотентности эффектов: рендер, ref, эффект, затем cleanup и повторный mount.
- **Среда выполнения**: Задача выполняется в среде Browser DOM (Client-side rendering). В серверном рендеринге (SSR / RSC) эффекты и ref-колбэки не запускаются вовсе.`,

  a5: `### Суть задачи
Глубокий анализ порядка выполнения синхронных хуков макета (\`useLayoutEffect\`), асинхронных эффектов (\`useEffect\`) и их функций очистки (\`cleanup\`) при первичном монтировании и последующем обновлении состояния в React 19.

### Пошаговый разбор фаз:

1. **Фаза 1: Первичное монтирование (Mount, state = 0)**:
   - **Render Phase**: Вызывается тело компонента \`App()\`, печатается \`"App"\`. Регистрируются эффекты \`useEffect\` и \`useLayoutEffect\`.
   - **Commit Phase (DOM Mutation)**: React фиксирует разметку в DOM.
   - **useLayoutEffect (Синхронно до отрисовки)**: Срабатывает \`useLayoutEffect\`, печатается \`"useLayoutEffect"\`.
   - **Browser Paint**: Браузер отрисовывает экран.
   - **useEffect (Асинхронно после отрисовки)**:
     - Срабатывает первый \`useEffect\`, вызывая \`setState((state) => state + 1)\` (планирует обновление со значением 1).
     - Срабатывает \`useEffect 1\`, печатается \`"useEffect 1"\`.
     - Срабатывает \`useEffect 2\`, печатается \`"useEffect 2"\`.

2. **Фаза 2: Рендер обновления состояния (Update, state = 1)**:
   - **Render Phase**: Вызывается тело компонента \`App()\` с новым \`state = 1\`, печатается \`"App"\`.
   - **Commit Phase (DOM Mutation)**: React обновляет DOM.
   - **useLayoutEffect Cleanup & Execution (Синхронно до Paint)**:
     - Сначала вызывается очистка старого layout-эффекта: \`"useLayoutEffect cleanup"\`.
     - Затем вызывается новый layout-эффект: \`"useLayoutEffect"\`.
   - **Browser Paint**: Браузер отрисовывает обновленный кадр.
   - **useEffect Cleanup & Execution (Асинхронно после Paint)**:
     - Вызывается очистка первого эффекта: \`"useEffect 1 cleanup"\`.
     - Вызывается очистка второго эффекта: \`"useEffect 2 cleanup"\`.
     - Вызывается новый первый эффект: \`"useEffect 1"\`.
     - Вызывается новый второй эффект: \`"useEffect 2"\`.

### Итоговый порядок вывода (React 19, Production):
\`\`\`
App
useLayoutEffect
useEffect 1
useEffect 2
App
useLayoutEffect cleanup
useLayoutEffect
useEffect 1 cleanup
useEffect 2 cleanup
useEffect 1
useEffect 2
\`\`\`

### Ключевые выводы:
- \`useLayoutEffect\` блокирует отрисовку браузера и выполняется синхронно сразу после мутации DOM (предназначен для синхронного чтения размеров/позиций элементов и предотвращения мерцания layout shift).
- \`useEffect\` выполняется асинхронно после того, как браузер завершил отрисовку экрана.
- Очистки (\`cleanup\`) эффектов предыдущего рендера всегда вызываются ПЕРЕД запуском соответствующих эффектов нового рендера.`,

  js197: `### Суть задачи\nБазовый синтаксис объектов: CRUD операций и вычисляемые свойства.`,
  js198: `### Суть задачи\nПроверка существования свойств: in vs Object.hasOwn vs hasOwnProperty.`,
  js199: `### Суть задачи\nМетоды трансформации объектов: Object.keys, values, entries, fromEntries.`,
  js200: `### Суть задачи\nДеструктуризация объектов: алиасы, дефолты и rest-оператор.`,
  js201: `### Суть задачи\nПоверхностное копирование и слияние: spread vs Object.assign.`,
  js204: `### Суть задачи\nВыборка заданных свойств объекта: pick(obj, keys).`,
  js205: `### Суть задачи\nИсключение заданных свойств объекта: omit(obj, keys).`,
  js206: `### Суть задачи\nГлубокое сравнение объектов: deepEqual(a, b).`,
  js207: `### Суть задачи\nБезопасное получение значения по пути: get(obj, path, defaultValue).`,
  js208: `### Суть задачи\nУстановка значения по глубокому пути: set(obj, path, value).`,
  js209: `### Суть задачи\nПреобразование вложенного объекта в плоский путь: flattenObject(obj).`,
  js210: `### Суть задачи\nГлубокое клонирование с циклическими ссылками: deepClone(value).`,
  js211: `### Суть задачи\nГлубокое слияние объектов: deepMerge(target, ...sources).`,
};

export const TASK_EXPLANATIONS = enrichJavaScriptExplanations(BASE_TASK_EXPLANATIONS);
