/**
 * typeSignatures.js
 * База знаний сигнатур типов, JSDoc-описаний и параметров (TypeScript Language Service / Monaco Hover & Signature Help).
 */

export const TYPE_SIGNATURES = {
  // ==========================================
  // 1. React Hooks
  // ==========================================
  useState: {
    signature: "function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>]",
    description: "Возвращает кортеж из значения состояния и функции для его обновления. Поддерживает ленивую инициализацию через функцию.",
    module: "react",
    parameters: [
      { name: "initialState", type: "S | (() => S)", doc: "Начальное состояние или фабричная функция для его вычисления при первом рендере." },
    ],
    returns: "[S, Dispatch<SetStateAction<S>>]",
  },
  useEffect: {
    signature: "function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void",
    description: "Принимает функцию эффекта, выполняемую после рендера и отрисовки DOM. Функция может возвращать cleanup-функцию для очистки ресурсов.",
    module: "react",
    parameters: [
      { name: "effect", type: "() => void | (() => void)", doc: "Императивная функция эффекта (может возвращать деструктор очистки)." },
      { name: "deps", type: "React.DependencyList", doc: "Опциональный массив зависимостей. Если передан пустой массив [], эффект выполняется только при монтировании." },
    ],
    returns: "void",
  },
  useCallback: {
    signature: "function useCallback<T extends Function>(callback: T, deps: React.DependencyList): T",
    description: "Возвращает мемоизированную версию колбэка, которая сохраняет ссылку между рендерами, пока не изменятся зависимости.",
    module: "react",
    parameters: [
      { name: "callback", type: "T", doc: "Функция, которую требуется мемоизировать." },
      { name: "deps", type: "React.DependencyList", doc: "Массив зависимостей, при изменении которых колбэк будет пересоздан." },
    ],
    returns: "T",
  },
  useMemo: {
    signature: "function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T",
    description: "Возвращает мемоизированное вычисленное значение. Выполняет фабрику только тогда, когда изменяется хотя бы одна зависимость.",
    module: "react",
    parameters: [
      { name: "factory", type: "() => T", doc: "Функция без аргументов, вычисляющая требуемое значение." },
      { name: "deps", type: "React.DependencyList", doc: "Массив зависимостей для инвалидации мемоизированного кэша." },
    ],
    returns: "T",
  },
  useRef: {
    signature: "function useRef<T>(initialValue: T): React.MutableRefObject<T>",
    description: "Возвращает мутабельный ref-объект, свойство .current которого сохраняется на протяжении всего жизненного цикла компонента без вызова повторного рендера.",
    module: "react",
    parameters: [
      { name: "initialValue", type: "T", doc: "Начальное значение свойства current." },
    ],
    returns: "React.MutableRefObject<T>",
  },
  useContext: {
    signature: "function useContext<T>(context: React.Context<T>): T",
    description: "Принимает объект контекста (возвращенный из createContext) и возвращает текущее значение контекста для данного провайдера.",
    module: "react",
    parameters: [
      { name: "context", type: "React.Context<T>", doc: "Объект контекста, созданный с помощью React.createContext()." },
    ],
    returns: "T",
  },
  useReducer: {
    signature: "function useReducer<R extends React.Reducer<any, any>, I>(reducer: R, initializerArg: I, initializer?: (arg: I) => React.ReducerState<R>): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>]",
    description: "Альтернатива useState для управления сложным состоянием с помощью reducer функции (по аналогии с Redux).",
    module: "react",
    parameters: [
      { name: "reducer", type: "(state: S, action: A) => S", doc: "Чистая функция редьюсера, принимающая предыдущее состояние и действие." },
      { name: "initializerArg", type: "I", doc: "Начальное состояние или аргумент функции инициализации." },
      { name: "initializer", type: "(arg: I) => S", doc: "Опциональная функция ленивой инициализации начального состояния." },
    ],
    returns: "[state, dispatch]",
  },
  useLayoutEffect: {
    signature: "function useLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList): void",
    description: "Сигнатура идентична useEffect, но срабатывает синхронно после всех изменений DOM, до того, как браузер выполнит отрисовку (paint).",
    module: "react",
    parameters: [
      { name: "effect", type: "() => void | (() => void)", doc: "Функция синхронного эффекта." },
      { name: "deps", type: "React.DependencyList", doc: "Массив зависимостей." },
    ],
    returns: "void",
  },
  useId: {
    signature: "function useId(): string",
    description: "Хук для генерации уникальных ID, стабильных между сервером и клиентом (доступность a11y, связывание label и input).",
    module: "react",
    parameters: [],
    returns: "string",
  },
  useTransition: {
    signature: "function useTransition(): [boolean, (callback: () => void) => void]",
    description: "Позволяет помечать обновления состояния как неблокирующие переходы (transitions), сохраняя отзывчивость интерфейса при тяжелых операциях.",
    module: "react",
    parameters: [],
    returns: "[isPending, startTransition]",
  },
  useDeferredValue: {
    signature: "function useDeferredValue<T>(value: T): T",
    description: "Принимает значение и возвращает его отложенную копию, обновление которой может быть отложено ради приоритетных пользовательских событий ввода.",
    module: "react",
    parameters: [
      { name: "value", type: "T", doc: "Значение, обновление которого требуется отложить." },
    ],
    returns: "T",
  },

  // ==========================================
  // 2. React APIs & Components
  // ==========================================
  createContext: {
    signature: "function createContext<T>(defaultValue: T): React.Context<T>",
    description: "Создает объект Context для передачи данных через дерево компонентов без необходимости прокидывать пропсы вручную.",
    module: "react",
    parameters: [
      { name: "defaultValue", type: "T", doc: "Значение по умолчанию, используемое если компонент находится вне Provider." },
    ],
    returns: "React.Context<T>",
  },
  memo: {
    signature: "function memo<T extends React.ComponentType<any>>(Component: T, propsAreEqual?: (prevProps: Readonly<React.ComponentProps<T>>, nextProps: Readonly<React.ComponentProps<T>>) => boolean): T",
    description: "Компонент высшего порядка (HOC) для мемоизации рендера компонента при неизменных входных пропсах.",
    module: "react",
    parameters: [
      { name: "Component", type: "React.ComponentType", doc: "React компонент для мемоизации." },
      { name: "propsAreEqual", type: "(prev, next) => boolean", doc: "Опциональная функция кастомного сравнения пропсов." },
    ],
    returns: "React.MemoExoticComponent<T>",
  },
  forwardRef: {
    signature: "function forwardRef<T, P = {}>(render: (props: P, ref: React.ForwardedRef<T>) => React.ReactNode): React.ForwardRefExoticComponent<P & React.RefAttributes<T>>",
    description: "Позволяет компоненту пробрасывать полученный ref дальше к дочернему DOM-элементу.",
    module: "react",
    parameters: [
      { name: "render", type: "(props, ref) => ReactNode", doc: "Функция рендера компонента, принимающая пропсы и ref." },
    ],
    returns: "React.ForwardRefExoticComponent",
  },
  createPortal: {
    signature: "function createPortal(children: React.ReactNode, container: Element | DocumentFragment, key?: string | null): React.ReactPortal",
    description: "Рендерит дочерние React-элементы в DOM-узел, находящийся вне иерархии родительского DOM-компонента (модальные окна, тултипы).",
    module: "react-dom",
    parameters: [
      { name: "children", type: "React.ReactNode", doc: "React элементы, которые необходимо отрендерить." },
      { name: "container", type: "Element", doc: "Целевой DOM-контейнер (например, document.body или document.getElementById('modal'))." },
      { name: "key", type: "string", doc: "Опциональный React ключ портала." },
    ],
    returns: "React.ReactPortal",
  },

  // ==========================================
  // 3. State Management (Redux Toolkit & Zustand)
  // ==========================================
  createSlice: {
    signature: "function createSlice<State, CaseReducers, Name>(options: CreateSliceOptions<State, CaseReducers, Name>): Slice<State, CaseReducers, Name>",
    description: "Функция Redux Toolkit, объединяющая создание action creators, action types и Immer-редьюсера в единую декларативную структуру.",
    module: "@reduxjs/toolkit",
    parameters: [
      { name: "options", type: "{ name: string, initialState: State, reducers: CaseReducers }", doc: "Конфигурация слайса: имя, начальное состояние и набор функций-мутаторов." },
    ],
    returns: "Slice",
  },
  configureStore: {
    signature: "function configureStore<S, A, M>(options: ConfigureStoreOptions<S, A, M>): EnhancedStore<S, A, M>",
    description: "Создает настроенное хранилище Redux с автоматическим подключением Redux Thunk, DevTools Extension и middleware проверок мутаций.",
    module: "@reduxjs/toolkit",
    parameters: [
      { name: "options", type: "{ reducer: Reducer | ReducersMapObject, middleware?: Middleware[] }", doc: "Конфигурация корневого редьюсера и middleware." },
    ],
    returns: "EnhancedStore",
  },
  useSelector: {
    signature: "function useSelector<TState, TSelected>(selector: (state: TState) => TSelected, equalityFn?: (left: TSelected, right: TSelected) => boolean): TSelected",
    description: "Хук React-Redux для извлечения данных из состояния Redux store с автоматической подпиской на обновления.",
    module: "react-redux",
    parameters: [
      { name: "selector", type: "(state: RootState) => TSelected", doc: "Чистая функция селектора для извлечения нужной ветки состояния." },
      { name: "equalityFn", type: "(prev, next) => boolean", doc: "Опциональная функция сравнения (например, shallowEqual)." },
    ],
    returns: "TSelected",
  },
  useDispatch: {
    signature: "function useDispatch<AppDispatch = Dispatch>(): AppDispatch",
    description: "Возвращает функцию dispatch из Redux store для отправки экшенов.",
    module: "react-redux",
    parameters: [],
    returns: "AppDispatch",
  },
  create: {
    signature: "function create<T>(initializer: StateCreator<T>): UseBoundStore<StoreApi<T>>",
    description: "Создает реактивный хук хранилища Zustand с поддержкой селекторов и кастомных экшенов.",
    module: "zustand",
    parameters: [
      { name: "initializer", type: "(set: SetState, get: GetState) => T", doc: "Функция инициализации состояния и методов хранилища." },
    ],
    returns: "UseBoundStore",
  },

  // ==========================================
  // 4. JavaScript Standard Built-ins
  // ==========================================
  map: {
    signature: "Array<T>.prototype.map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[]",
    description: "Создает новый массив с результатом вызова указанной функции для каждого элемента массива.",
    module: "built-in",
    parameters: [
      { name: "callbackfn", type: "(value: T, index: number, array: T[]) => U", doc: "Функция, вызываемая для каждого элемента массива." },
      { name: "thisArg", type: "any", doc: "Значение, используемое в качестве this при вызове callbackfn." },
    ],
    returns: "U[]",
  },
  filter: {
    signature: "Array<T>.prototype.filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[]",
    description: "Создает новый массив со всеми элементами, прошедшими проверку, задаваемую передаваемой функцией.",
    module: "built-in",
    parameters: [
      { name: "predicate", type: "(value: T, index: number, array: T[]) => boolean", doc: "Функция-предикат, возвращающая true для сохранения элемента." },
    ],
    returns: "T[]",
  },
  reduce: {
    signature: "Array<T>.prototype.reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U",
    description: "Применяет функцию-аккумулятор к каждому значению массива (слева направо), сводя его к одному результирующему значению.",
    module: "built-in",
    parameters: [
      { name: "callbackfn", type: "(acc: U, cur: T, idx: number, arr: T[]) => U", doc: "Функция, выполняемая для каждого элемента." },
      { name: "initialValue", type: "U", doc: "Начальное значение аккумулятора." },
    ],
    returns: "U",
  },
  find: {
    signature: "Array<T>.prototype.find(predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined",
    description: "Возвращает значение первого найденного в массиве элемента, которое удовлетворяет условию предиката.",
    module: "built-in",
    parameters: [
      { name: "predicate", type: "(value: T, index: number, obj: T[]) => boolean", doc: "Функция проверки каждого элемента." },
    ],
    returns: "T | undefined",
  },
  includes: {
    signature: "Array<T>.prototype.includes(searchElement: T, fromIndex?: number): boolean",
    description: "Определяет, содержит ли массив определенный элемент, возвращая в зависимости от этого true или false.",
    module: "built-in",
    parameters: [
      { name: "searchElement", type: "T", doc: "Искомый элемент." },
      { name: "fromIndex", type: "number", doc: "Позиция в массиве, с которой начинать поиск." },
    ],
    returns: "boolean",
  },
  slice: {
    signature: "Array<T>.prototype.slice(start?: number, end?: number): T[]",
    description: "Возвращает неглубокую копию части массива в новый объект массива, выбранную от start до end (end не включается).",
    module: "built-in",
    parameters: [
      { name: "start", type: "number", doc: "Индекс начала выборки." },
      { name: "end", type: "number", doc: "Индекс конца выборки (не включая его)." },
    ],
    returns: "T[]",
  },
  setTimeout: {
    signature: "function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number",
    description: "Устанавливает таймер, который выполняет функцию или указанный фрагмент кода после истечения времени задержки в миллисекундах.",
    module: "built-in",
    parameters: [
      { name: "handler", type: "(...args: any[]) => void", doc: "Функция, которая будет выполнена по истечении времени." },
      { name: "timeout", type: "number", doc: "Время задержки в миллисекундах (по умолчанию 0)." },
    ],
    returns: "number (TimerID)",
  },
  setInterval: {
    signature: "function setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number",
    description: "Циклически вызывает функцию или фрагмент кода через заданный фиксированный интервал времени в миллисекундах.",
    module: "built-in",
    parameters: [
      { name: "handler", type: "(...args: any[]) => void", doc: "Функция, вызываемая каждые timeout мс." },
      { name: "timeout", type: "number", doc: "Интервал между вызовами в миллисекундах." },
    ],
    returns: "number (IntervalID)",
  },
  fetch: {
    signature: "function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>",
    description: "Запускает процесс асинхронного HTTP-запроса к ресурсу по сети и возвращает промис с объектом Response.",
    module: "built-in",
    parameters: [
      { name: "input", type: "string | URL | Request", doc: "URL адрес или объект Request для запроса." },
      { name: "init", type: "RequestInit", doc: "Опции запроса (method, headers, body, credentials, etc.)." },
    ],
    returns: "Promise<Response>",
  },

  // ==========================================
  // 5. TypeScript Utility Types
  // ==========================================
  Partial: {
    signature: "type Partial<T> = { [P in keyof T]?: T[P]; }",
    description: "Создает тип со всеми свойствами T, установленными как необязательные (optional).",
    module: "typescript",
  },
  Required: {
    signature: "type Required<T> = { [P in keyof T]-?: T[P]; }",
    description: "Создает тип со всеми свойствами T, установленными как обязательные (убирает ?).",
    module: "typescript",
  },
  Readonly: {
    signature: "type Readonly<T> = { readonly [P in keyof T]: T[P]; }",
    description: "Создает тип со всеми свойствами T, помеченными как только для чтения (readonly).",
    module: "typescript",
  },
  Record: {
    signature: "type Record<K extends keyof any, T> = { [P in K]: T; }",
    description: "Создает тип объекта, ключи которого являются K, а значения — T.",
    module: "typescript",
  },
  Pick: {
    signature: "type Pick<T, K extends keyof T> = { [P in K]: T[P]; }",
    description: "Конструирует тип, выбирая набор свойств K из типа T.",
    module: "typescript",
  },
  Omit: {
    signature: "type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>",
    description: "Конструирует тип, выбирая все свойства из T и удаляя ключи K.",
    module: "typescript",
  },
  ReactNode: {
    signature: "type ReactNode = ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined",
    description: "Представляет собой любой допустимый узел, который может быть отрендерен в JSX.",
    module: "react",
  },
  FC: {
    signature: "type FC<P = {}> = React.FunctionComponent<P>",
    description: "Тип для функциональных компонентов React, принимающих пропсы P.",
    module: "react",
  },
  CSSProperties: {
    signature: "interface CSSProperties extends CSS.Properties<string | number>",
    description: "Объект стилей для инлайнового пропса style={{ ... }} в React компонентах.",
    module: "react",
  },
};

/**
 * Извлекает информацию для Hover Tooltip при наведении на слово
 * @param {string} word
 * @param {string} code
 * @param {number} cursorIndex
 * @param {object} [context]
 * @returns {object | null}
 */
export const getHoverInfo = (word, code, cursorIndex, context = {}) => {
  if (!word || typeof word !== "string") return null;

  const cleanWord = word.trim();
  if (TYPE_SIGNATURES[cleanWord]) {
    return {
      symbol: cleanWord,
      ...TYPE_SIGNATURES[cleanWord],
    };
  }

  // Проверка: может это локальная функция или переменная задачи?
  if (code) {
    const fnRegex = new RegExp(`(?:function\\s+${cleanWord}\\s*\\(([^)]*)\\)|const\\s+${cleanWord}\\s*=\\s*(?:\\(([^)]*)\\)|([a-zA-Z0-9_$]+))\\s*=>)`);
    const fnMatch = fnRegex.exec(code);
    if (fnMatch) {
      const params = fnMatch[1] || fnMatch[2] || fnMatch[3] || "";
      return {
        symbol: cleanWord,
        signature: `function ${cleanWord}(${params}): any`,
        description: `Локальная функция, объявленная в текущем файле.`,
        module: "local",
        parameters: params ? params.split(",").map((p) => ({ name: p.trim(), type: "any", doc: "" })) : [],
      };
    }
  }

  return null;
};

/**
 * Определяет активную функцию и индекс аргумента для Parameter Hints (Signature Help)
 * @param {string} code Полный исходный код
 * @param {number} cursorIndex Позиция курсора в редакторе
 * @returns {{ functionName: string, signature: string, parameters: Array, activeParameter: number, description: string } | null}
 */
export const getSignatureHelp = (code, cursorIndex) => {
  if (!code || cursorIndex <= 0 || cursorIndex > code.length) return null;

  const textBefore = code.substring(0, cursorIndex);

  // Ищем начало текущей логической строки / инструкции (до 300 символов назад)
  const searchStart = Math.max(0, textBefore.lastIndexOf("\n", Math.max(0, cursorIndex - 300)));
  const relevantText = textBefore.substring(searchStart);

  const callStack = [];
  let inString = null;
  let inComment = false;

  for (let i = 0; i < relevantText.length; i++) {
    const ch = relevantText[i];
    const nextCh = relevantText[i + 1];
    const prevCh = i > 0 ? relevantText[i - 1] : "";

    if (inComment) {
      if (ch === "*" && nextCh === "/") {
        inComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (ch === "\\" && nextCh) {
        i++;
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === "/" && nextCh === "/") {
      // Однострочный комментарий - пропускаем до конца строки
      const nl = relevantText.indexOf("\n", i);
      if (nl === -1) break;
      i = nl;
      continue;
    }

    if (ch === "/" && nextCh === "*") {
      inComment = true;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }

    // Проверка вызова функции: identifier( или identifier<(
    if (ch === "(") {
      const beforeParen = relevantText.substring(0, i).trimEnd();
      const fnMatch = beforeParen.match(/([a-zA-Z0-9_$]+)(?:<[^>]*>)?$/);
      const isControlFlow = fnMatch && ["if", "for", "while", "switch", "catch"].includes(fnMatch[1]);

      if (fnMatch && !isControlFlow) {
        callStack.push({
          name: fnMatch[1],
          parenDepth: 1,
          braceDepth: 0,
          bracketDepth: 0,
          commaCount: 0,
        });
      } else if (callStack.length > 0) {
        callStack[callStack.length - 1].parenDepth++;
      }
      continue;
    }

    if (callStack.length === 0) continue;

    const currentCall = callStack[callStack.length - 1];

    if (ch === ")") {
      currentCall.parenDepth--;
      if (currentCall.parenDepth === 0) {
        callStack.pop();
      }
    } else if (ch === "{") {
      currentCall.braceDepth++;
    } else if (ch === "}") {
      if (currentCall.braceDepth > 0) currentCall.braceDepth--;
    } else if (ch === "[") {
      currentCall.bracketDepth++;
    } else if (ch === "]") {
      if (currentCall.bracketDepth > 0) currentCall.bracketDepth--;
    } else if (ch === ",") {
      if (currentCall.parenDepth === 1 && currentCall.braceDepth === 0 && currentCall.bracketDepth === 0) {
        currentCall.commaCount++;
      }
    }
  }

  if (callStack.length === 0) return null;

  const activeCall = callStack[callStack.length - 1];
  const functionName = activeCall.name;
  const typeInfo = TYPE_SIGNATURES[functionName];
  if (!typeInfo || !Array.isArray(typeInfo.parameters)) return null;

  return {
    functionName,
    signature: typeInfo.signature,
    description: typeInfo.description,
    module: typeInfo.module,
    parameters: typeInfo.parameters,
    activeParameter: activeCall.commaCount,
    returns: typeInfo.returns,
  };
};
