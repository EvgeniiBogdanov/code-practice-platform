export const CHEAT_SHEET_DATA = {
  // === REACT SECTION ===
  hooks: [
    {
      title: "1. useState: Функциональное обновление",
      code: `// Опасность багов устаревшего замыкания (stale closure):
setCount(count + 1);

// Правильно: всегда используйте колбэк при отталкивании от предыдущего стейта:
setCount(prev => prev + 1);`,
      tip: "Особенно критично при вызовах внутри асинхронных таймаутов или обработчиков событий.",
    },
    {
      title: "2. useEffect: Очистка таймеров и подписок (Cleanup)",
      code: `useEffect(() => {
  const timerId = setTimeout(() => {
    setIsVisible(false);
  }, hideTimeoutMs);

  // Обязательная очистка при отмонтировании или смене зависимостей:
  return () => clearTimeout(timerId);
}, [isVisible, password, hideTimeoutMs]);`,
      tip: "Паттерн из задачи Password. Защищает от утечек памяти и обновления отмонтированного компонента.",
    },
    {
      title: "3. useRef: Хранение значений без перерендера",
      code: `const timerRef = useRef(null);

// Запись без провоцирования ререндера:
timerRef.current = setTimeout(...);

// Очистка таймера по рефу:
if (timerRef.current) clearTimeout(timerRef.current);`,
      tip: "useRef идеален для ID таймеров, предыдущих значений пропсов и флагов монтирования.",
    },
    {
      title: "4. useCallback & useMemo: Ссылочная стабильность",
      code: `// Мемоизация функции-хэндлера для передачи в memo-компоненты:
const handleClick = useCallback((id) => {
  setSelectedId(id);
}, []);

// Мемоизация тяжёлых вычислений или отфильтрованного массива:
const filteredUsers = useMemo(() => {
  return users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
}, [users, query]);`,
      tip: "useCallback спасает от дочерних ререндеров только если дочерний компонент обёрнут в React.memo.",
    },
    {
      title: "5. useReducer: Комплексный стейт (Loading / Error / Data)",
      code: `const initialState = { data: null, loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { data: action.payload, loading: false, error: null };
    case 'FETCH_ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}`,
      tip: "Заменяет множество разрозненных useState на единый конечный автомат (State Machine).",
    },
    {
      title: "6. forwardRef & useImperativeHandle: Проброс методов",
      code: `const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focusInput: () => inputRef.current.focus(),
  }));
  return <input ref={inputRef} {...props} />;
});`,
      tip: "Позволяет родителю безопасно вызывать методы внутри дочернего компонента без раскрытия всего DOM-узла.",
    },
  ],
  array: [
    {
      title: "1. Иммутабельные операции с массивами",
      code: `// Добавление в начало:
setList(prev => [newItem, ...prev]);

// Удаление по ID:
setList(prev => prev.filter(item => item.id !== targetId));

// Обновление элемента:
setList(prev => prev.map(item => item.id === id ? { ...item, completed: true } : item));`,
      tip: "Запомните: методы .push(), .pop(), .splice(), .sort(), .reverse() МУТИРУЮТ исходный массив и ломают React!",
    },
    {
      title: "2. Array.prototype.reduce: Создание O(1) словарей",
      code: `const usersMap = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});

// Доступ по ключу O(1):
const currentUser = usersMap[selectedId];`,
      tip: "Заменяет медленный поиск .find() внутри циклов с O(N^2) на O(N).",
    },
    {
      title: "3. Вложенное копирование сложных объектов стейта",
      code: `// Обновление вложенного массива в объекте:
setTasks(prev => ({
  ...prev,
  today: [...prev.today, newTask]
}));`,
      tip: "При обновлении вложенного объекта нужно делать spread и на верхнем уровне, и на вложенном массиве.",
    },
  ],
  async: [
    {
      title: "1. Race Condition Flag в useEffect",
      code: `useEffect(() => {
  let isCurrent = true;
  fetchData(query).then(res => {
    if (isCurrent) setData(res);
  });
  return () => { isCurrent = false; };
}, [query]);`,
      tip: "Защищает от бага, когда медленный старый запрос приходит позже нового и перезаписывает свежие данные.",
    },
    {
      title: "2. Debounce для поиска (Задержка вызова)",
      code: `useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 300);
  return () => clearTimeout(handler);
}, [searchQuery]);`,
      tip: "Необходим при разработке автокомплитов для снижения нагрузки на сервер при печати.",
    },
    {
      title: "3. Освобождение памяти: URL.revokeObjectURL",
      code: `useEffect(() => {
  const objectUrl = URL.createObjectURL(blobData);
  setImageSrc(objectUrl);

  // Освобождаем память браузера при смене картинки:
  return () => URL.revokeObjectURL(objectUrl);
}, [blobData]);`,
      tip: "Blob-ссылки не очищаются сборщиком мусора автоматически. Забытый revokeObjectURL приводит к утечке RAM.",
    },
    {
      title: "4. Проверка статус-кодов Fetch (HTTP 404 / 500)",
      code: `try {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(\`Ошибка сервера: \${res.status}\`);
  }
  const data = await res.json();
} catch (err) {
  setError(err.message);
}`,
      tip: "Метод fetch() НЕ бросает ошибку при 404 или 500. Проверять res.ok нужно вручную!",
    },
  ],
  ts: [
    {
      title: "1. Generic List Component Props",
      code: `interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => React.Key;
}

export function List<T>({ items, renderItem, getKey }: ListProps<T>) {
  return <div>{items.map(item => <React.Fragment key={getKey(item)}>{renderItem(item)}</React.Fragment>)}</div>;
}`,
      tip: "Дженерик компоненты обеспечивают строгую типизацию без использования any.",
    },
    {
      title: "2. Utility Types (Partial, Pick, Omit, Record)",
      code: `type User = { id: number; name: string; email: string };

// Точечные обновления:
type UpdateUser = Partial<User>;

// Исключение полей:
type UserPreview = Omit<User, 'email'>;

// Карта объектов по ID:
type UserDict = Record<number, User>;`,
      tip: "Позволяет быстро транформировать существующие интерфейсы без дублирования кода.",
    },
  ],

  // === JAVASCRIPT SECTION ===
  js_async: [
    {
      title: "1. Event Loop: Микрозадачи vs Макрозадачи",
      code: `console.log('1');
setTimeout(() => console.log('2 (Макрозадача)'), 0);
Promise.resolve().then(() => console.log('3 (Микрозадача)'));
console.log('4');

// Порядок вывода: 1, 4, 3, 2`,
      tip: "Микрозадачи (Promise.then, await, queueMicrotask) всегда полностью опустошаются перед переходом к следующей макрозадаче (setTimeout, setInterval).",
    },
    {
      title: "2. Полифил Promise.all (Параллельное выполнение)",
      code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    if (list.length === 0) return resolve([]);
    
    const results = new Array(list.length);
    let completed = 0;
    
    list.forEach((item, index) => {
      Promise.resolve(item)
        .then((val) => {
          results[index] = val;
          completed += 1;
          if (completed === list.length) resolve(results);
        })
        .catch(reject);
    });
  });
}`,
      tip: "Promise.all завершается неуспехом (reject) моментально при первой же ошибке любого из промисов.",
    },
    {
      title: "3. Ограничение параллелизма (Async Concurrency Limit)",
      code: `function asyncLimit(tasks, limit) {
  return new Promise((resolve, reject) => {
    const results = new Array(tasks.length);
    let active = 0, completed = 0, index = 0;

    function runNext() {
      if (completed === tasks.length) return resolve(results);

      while (active < limit && index < tasks.length) {
        const currentIndex = index++;
        active++;
        tasks[currentIndex]()
          .then(val => { results[currentIndex] = val; })
          .catch(reject)
          .finally(() => {
            active--; completed++; runNext();
          });
      }
    }
    runNext();
  });
}`,
      tip: "Паттерн контроля пула асинхронных задач предотвращает перегрузку браузера и сервера.",
    },
    {
      title: "4. Повторные попытки с задержкой (Retry with Delay)",
      code: `function retryWithDelay(fn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(left) {
      fn()
        .then(resolve)
        .catch(err => {
          if (left <= 0) return reject(err);
          setTimeout(() => attempt(left - 1), delay);
        });
    }
    attempt(retries);
  });
}`,
      tip: "Повышает устойчивость приложения при нестабильном сетевом соединении.",
    },
    {
      title: "5. Преобразование Callback в Promise (Promisify)",
      code: `function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };
}`,
      tip: "Адаптирует унаследованные функции формата Node.js callback (err, data) к современному async/await.",
    },
  ],

  js_closures: [
    {
      title: "1. Замыкание (Closure) и Приватное Состояние",
      code: `function createCounter() {
  let count = 0;
  return {
    increment() { return ++count; },
    getValue() { return count; }
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getValue());  // 1`,
      tip: "Замыкание позволяет функции сохранять доступ к лексическому окружению внешней функции даже после её завершения.",
    },
    {
      title: "2. Бесконечное Каррирование (Infinite Currying)",
      code: `function currySum(x) {
  const fn = (y) => {
    if (y === undefined) return x;
    return currySum(x + y);
  };
  return fn;
}
console.log(currySum(1)(2)(3)()); // 6`,
      tip: "Финальный вызов без аргументов () служит терминальным условием для возврата накопительной суммы.",
    },
    {
      title: "3. Гибридный вызов sum(a, b) и sum(a)(b)",
      code: `const sum = (a, b) => {
  if (b === undefined) {
    return (num) => a + num;
  }
  return a + b;
};
console.log(sum(1, 2)); // 3
console.log(sum(1)(2)); // 3`,
      tip: "Классическая задача с собеседований для создания гибких функциональных API.",
    },
  ],

  js_proto: [
    {
      title: "1. Потеря контекста this и Починка (bind / arrow)",
      code: `const user = {
  name: 'Alex',
  greet() { console.log(\`Привет, \${this.name}\`); }
};

// Потеря контекста при колбэке:
setTimeout(user.greet, 100); // Привет, undefined

// Решение 1: Стрелочная функция
setTimeout(() => user.greet(), 100);

// Решение 2: Явное связывание .bind()
setTimeout(user.greet.bind(user), 100);`,
      tip: "Стрелочные функции не имеют своего контекста this и берут его из внешнего лексического окружения.",
    },
    {
      title: "2. Цепочка прототипов (__proto__ и hasOwnProperty)",
      code: `const animal = { eats: true };
const rabbit = { jumps: true, __proto__: animal };

console.log(rabbit.hasOwnProperty('jumps')); // true (собственное свойство)
console.log(rabbit.hasOwnProperty('eats'));  // false (свойство прототипа)
console.log('eats' in rabbit);                // true (ищет по всей цепочке)`,
      tip: "hasOwnProperty проверяет только сам объект, а оператор in дополнительно ищет по всей цепочке __proto__.",
    },
  ],

  js_object_utils: [
    {
      title: "1. Глубокое клонирование (Deep Clone с WeakMap)",
      code: `function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);

  const copy = Array.isArray(obj) ? [] : {};
  map.set(obj, copy);

  for (const key of Object.keys(obj)) {
    copy[key] = deepClone(obj[key], map);
  }
  return copy;
}`,
      tip: "WeakMap предотвращает бесконечное зацикливание и переполнение стека вызовов при наличии рекурсивных цикличных ссылок.",
    },
    {
      title: "2. Глубокое сравнение объектов (Deep Equal)",
      code: `function deepEqual(a, b) {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]));
}`,
      tip: "Учитывает специфику сравнения NaN === NaN через Number.isNaN или Object.is.",
    },
    {
      title: "3. Преобразование вложенного объекта в плоский путь",
      code: `function flattenObject(obj, prefix = '') {
  const result = {};
  for (const key in obj) {
    const propName = prefix ? \`\${prefix}.\${key}\` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenObject(obj[key], propName));
    } else {
      result[propName] = obj[key];
    }
  }
  return result;
}`,
      tip: "Преобразует вложенную структуру { a: { b: 1 } } в точечный ключ {'a.b': 1}.",
    },
  ],

  js_control_flow: [
    {
      title: "1. Продвинутый Debounce с leading/trailing и .cancel()",
      code: `function debounce(fn, ms, options = { leading: false, trailing: true }) {
  let timerId = null, lastArgs = null, lastThis = null;
  
  function debounced(...args) {
    lastArgs = args; lastThis = this;
    const isFirst = !timerId;
    if (timerId) clearTimeout(timerId);

    if (isFirst && options.leading) fn.apply(lastThis, lastArgs);
    timerId = setTimeout(() => {
      if (options.trailing && (!isFirst || !options.leading)) fn.apply(lastThis, lastArgs);
      timerId = null;
    }, ms);
  }
  debounced.cancel = () => { clearTimeout(timerId); timerId = null; };
  return debounced;
}`,
      tip: "Предотвращает частые паразитные вызовы функций при быстром вводе текста или кликах.",
    },
    {
      title: "2. Композиция функций (Pipe и Compose)",
      code: `// Pipe: выполнение слева направо (f -> g -> h)
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

// Compose: выполнение справа налево (h <- g <- f)
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);`,
      tip: "Фундаментальные операции конвейерной обработки данных в функциональном программировании.",
    },
    {
      title: "3. Шина событий (EventEmitter / PubSub)",
      code: `class EventEmitter {
  #events = {};
  on(event, fn) {
    (this.#events[event] = this.#events[event] || []).push(fn);
  }
  off(event, fn) {
    if (this.#events[event]) {
      this.#events[event] = this.#events[event].filter(cb => cb !== fn);
    }
  }
  emit(event, ...args) {
    if (this.#events[event]) {
      this.#events[event].forEach(cb => cb(...args));
    }
  }
}`,
      tip: "Паттерн «Наблюдатель» обеспечивают слабую связность модулей приложения.",
    },
  ],

  js_string_array: [
    {
      title: "1. Мини-шаблонизатор строк (Template Engine)",
      code: `function renderTemplate(template, data) {
  return template.replace(/\\{([\\w.]+)\\}/g, (_, path) => {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), data) ?? '';
  });
}
console.log(renderTemplate("Hello {user.name}", { user: { name: "Alex" } }));`,
      tip: "Динамическая замена шаблонов вида {user.profile.name} на значения объекта по составным путям.",
    },
    {
      title: "2. Парсер URL Query String",
      code: `function parseQueryString(url) {
  const query = url.split('?')[1] || '';
  return query.split('&').reduce((acc, pair) => {
    if (!pair) return acc;
    const [key, val] = pair.split('=').map(decodeURIComponent);
    acc[key] = val !== undefined ? val : true;
    return acc;
  }, {});
}`,
      tip: "Декодирует спецсимволы URI и превращает URL параметры в объекты JavaScript.",
    },
    {
      title: "3. Хелпер условных CSS-классов (ClassNames / Clsx)",
      code: `function classNames(...args) {
  const classes = [];
  args.forEach(arg => {
    if (!arg) return;
    if (typeof arg === 'string' || typeof arg === 'number') classes.push(arg);
    else if (Array.isArray(arg)) classes.push(classNames(...arg));
    else if (typeof arg === 'object') {
      Object.keys(arg).forEach(k => { if (arg[k]) classes.push(k); });
    }
  });
  return classes.join(' ');
}`,
      tip: "Удобный инструмент для динамического соединения имён CSS-классов.",
    },
  ],

  // === ALGORITHMS SECTION ===
  algo_twopointers: [
    {
      title: "1. Два указателя: Палиндром (Two Pointers)",
      code: `function isPalindrome(str) {
  let left = 0, right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++; right--;
  }
  return true;
}`,
      tip: "Сокращает временную сложность решения с O(N^2) до O(N) без дополнительной памяти O(1).",
    },
    {
      title: "2. Поиск пары с заданной суммой в отсортированном массиве",
      code: `function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
      tip: "Работает за O(N) время и O(1) память для отсортированных данных.",
    },
  ],
  algo_slidingwindow: [
    {
      title: "1. Скользящее окно: Максимальная сумма подмассива K",
      code: `function maxSubarraySum(arr, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
      tip: "Паттерн Sliding Window заменяет вложенные циклы O(N*K) на линейный проход O(N).",
    },
  ],
  algo_binarysearch: [
    {
      title: "1. Бинарный поиск (Binary Search O(log N))",
      code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      tip: "Применяется ТОЛЬКО на отсортированных массивах. Делит область поиска пополам на каждом шаге.",
    },
  ],
  algo_ds: [
    {
      title: "1. Стек (Stack LIFO) на чистом массиве",
      code: `class Stack {
  #items = [];
  push(element) { this.#items.push(element); }
  pop() { return this.#items.pop(); }
  peek() { return this.#items[this.#items.length - 1]; }
  isEmpty() { return this.#items.length === 0; }
}`,
      tip: "Применяется в задачах на валидацию скобочных последовательностей и стек вызовов.",
    },
    {
      title: "2. Очередь (Queue FIFO)",
      code: `class Queue {
  #items = [];
  enqueue(element) { this.#items.push(element); }
  dequeue() { return this.#items.shift(); }
  isEmpty() { return this.#items.length === 0; }
}`,
      tip: "Применяется в алгоритме обхода графа в ширину (BFS).",
    },
  ],
};

export const SECTION_CHEAT_SHEETS = {
  react: {
    title: "Шпаргалка React & TypeScript",
    categories: [
      { id: "hooks", name: "React Hooks" },
      { id: "array", name: "JS & Массивы" },
      { id: "async", name: "Async & Opt" },
      { id: "ts", name: "TypeScript" },
    ],
    defaultCategory: "hooks",
  },
  javascript: {
    title: "Шпаргалка JavaScript Core & Async",
    categories: [
      { id: "js_async", name: "Async & Event Loop" },
      { id: "js_closures", name: "Замыкания & Каррирование" },
      { id: "js_proto", name: "Прототипы & Контекст" },
      { id: "js_object_utils", name: "Объекты & Утилиты" },
      { id: "js_control_flow", name: "Контроль частоты & Паттерны" },
      { id: "js_string_array", name: "Строки, URL & Массивы" },
    ],
    defaultCategory: "js_async",
  },
  algorithms: {
    title: "Шпаргалка по Алгоритмам",
    categories: [
      { id: "algo_twopointers", name: "Два указателя" },
      { id: "algo_slidingwindow", name: "Скользящее окно" },
      { id: "algo_binarysearch", name: "Бинарный поиск" },
      { id: "algo_ds", name: "Структуры данных" },
    ],
    defaultCategory: "algo_twopointers",
  },
  home: {
    title: "Общая Шпаргалка",
    categories: [
      { id: "hooks", name: "React Hooks" },
      { id: "js_async", name: "JavaScript Core" },
      { id: "algo_twopointers", name: "Алгоритмы" },
      { id: "ts", name: "TypeScript" },
    ],
    defaultCategory: "hooks",
  },
};
