export const TYPESCRIPT_CHEAT_SHEETS = {
  "ts_basics": [
    {
      "title": "Аннотации и кортежи",
      "desc": "Указывайте тип значения после имени; кортеж фиксирует типы позиций.",
      "code": "let name: string = \"Alice\";\nconst scores: number[] = [10, 20];\ntype Entry = [name: string, age: number];\nconst entry: Entry = [name, 30];",
      "tip": "TypeScript умеет выводить типы из значений. Аннотации полезны на границах функций и моделей.",
      "language": "typescript"
    },
    {
      "title": "Необязательные и неизменяемые поля",
      "desc": "Интерфейс описывает структуру объекта.",
      "code": "interface Person {\n  readonly id: number;\n  name: string;\n  middleName?: string;\n}\nconst person: Person = { id: 1, name: \"Alice\" };",
      "tip": "readonly действует при проверке типов, но не замораживает объект в рантайме.",
      "language": "typescript"
    },
    {
      "title": "any, unknown и never",
      "desc": "unknown — безопасная замена any: сначала проверка, потом использование.",
      "code": "const data: unknown = JSON.parse(text);\nif (typeof data === \"object\" && data !== null && \"name\" in data) {\n  console.log(data.name);\n}\nfunction fail(message: string): never {\n  throw new Error(message);\n}",
      "tip": "Функция с never прерывает поток управления, только если объявлена с явным типом: function или const с аннотацией.",
      "language": "typescript"
    },
    {
      "title": "Литералы и as const",
      "desc": "as const отключает расширение литералов и делает данные readonly.",
      "code": "const routes = [\"/home\", \"/about\"] as const;\ntype Route = (typeof routes)[number]; // \"/home\" | \"/about\"\n\nconst OrderStatus = { Pending: \"pending\", Shipped: \"shipped\" } as const;\ntype OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];",
      "tip": "Объект as const вместо enum: принимает литералы из API и не генерирует лишний JavaScript.",
      "language": "typescript"
    }
  ],
  "ts_narrowing": [
    {
      "title": "typeof, in, instanceof",
      "desc": "Выбор проверки зависит от того, что существует во время выполнения.",
      "code": "function format(value: string | number): string {\n  return typeof value === \"string\" ? value.toUpperCase() : value.toFixed(2);\n}\nfunction move(animal: Fish | Bird): void {\n  if (\"swim\" in animal) animal.swim();\n  else animal.fly();\n}\nconst date = value instanceof Date ? value : new Date(value);",
      "tip": "Интерфейсы стираются при компиляции, поэтому instanceof работает только с классами.",
      "language": "typescript"
    },
    {
      "title": "Проверка полноты через never",
      "desc": "Пропущенный вариант объединения становится ошибкой компиляции.",
      "code": "const assertNever = (value: never): never => {\n  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);\n};\nswitch (shape.kind) {\n  case \"circle\": return Math.PI * shape.radius ** 2;\n  case \"square\": return shape.side ** 2;\n  default: return assertNever(shape);\n}",
      "tip": "default: return 0 отключает проверку: новые варианты молча получат неверный результат.",
      "language": "typescript"
    },
    {
      "title": "Предикаты и функции-утверждения",
      "desc": "value is T сужает в if, asserts — во всём последующем коде.",
      "code": "const isUser = (value: unknown): value is User =>\n  typeof value === \"object\" && value !== null &&\n  \"name\" in value && typeof value.name === \"string\";\n\nfunction assert(condition: unknown, message: string): asserts condition {\n  if (!condition) throw new Error(message);\n}",
      "tip": "TypeScript не проверяет тело предиката: если он «врёт», ошибка появится во время выполнения.",
      "language": "typescript"
    }
  ],
  "ts_generics": [
    {
      "title": "keyof и индексный доступ",
      "desc": "Связывайте ключ с типом возвращаемого свойства через K.",
      "code": "function getValue<T extends object, K extends keyof T>(\n  obj: T, key: K\n): T[K] {\n  return obj[key];\n}\nconst name = getValue({ id: 1, name: \"Alice\" }, \"name\");",
      "tip": "T[keyof T] возвращает объединение всех свойств, а T[K] сохраняет точный выбранный тип.",
      "language": "typescript"
    },
    {
      "title": "Композиция интерфейсов",
      "desc": "extends расширяет модель, пересечение объединяет возможности.",
      "code": "interface User { name: string; age: number }\ninterface Admin extends User { role: \"admin\" }\ninterface Serializable { serialize: () => string }\ninterface Loggable { log: () => void }\ntype Entity = Serializable & Loggable;",
      "tip": "Пересечение требует соблюсти оба контракта. Несовместимые поля могут получить тип never.",
      "language": "typescript"
    },
    {
      "title": "satisfies",
      "desc": "Проверяет значение по типу, но сохраняет точный выведенный тип.",
      "code": "const routes = {\n  home: { path: \"/\" },\n  profile: { path: \"/profile\", auth: true },\n} satisfies Record<string, { path: string; auth?: boolean }>;\n\nroutes.profile.path; // ок\n// routes.profle;     // ошибка",
      "tip": "Аннотация расширяет тип до объявленного, as не проверяет, satisfies — проверяет и не расширяет.",
      "language": "typescript"
    },
    {
      "title": "const-параметры и NoInfer",
      "desc": "Управляйте тем, как и откуда выводится параметр типа.",
      "code": "const createMachine = <S extends string>(\n  states: readonly S[],\n  initial: NoInfer<S>\n) => ({ states, initial });\ncreateMachine([\"idle\", \"loading\"], \"idle\");\n\nconst defineConfig = <const T extends object>(config: T): T => config;",
      "tip": "Ограничение-примитив сохраняет литералы, NoInfer исключает позицию из вывода, const даёт эффект as const.",
      "language": "typescript"
    }
  ],
  "ts_utilities": [
    {
      "title": "Pick, Omit и Partial",
      "desc": "Стройте новые контракты из существующих моделей.",
      "code": "interface User { id: number; name: string; password: string }\ntype PublicUser = Omit<User, \"password\">;\ntype Registration = Pick<User, \"name\" | \"password\">;\ntype UserPatch = Partial<User>;",
      "tip": "Omit не удаляет данные из объекта: для этого нужна отдельная операция JavaScript.",
      "language": "typescript"
    },
    {
      "title": "Record: словарь значений",
      "desc": "Record связывает набор ключей с одним типом значения.",
      "code": "type Stock = Record<string, number>;\nconst stock: Stock = {};\nfunction addStock(sku: string, amount: number): void {\n  stock[sku] = (stock[sku] ?? 0) + amount;\n}\ntype Flags = Record<\"darkMode\" | \"beta\", boolean>;",
      "tip": "Record с конечным набором ключей требует каждый ключ; строковый словарь не гарантирует наличие конкретной записи.",
      "language": "typescript"
    },
    {
      "title": "Exclude и Extract",
      "desc": "Отбирайте варианты объединения типов.",
      "code": "type Permission = \"read\" | \"create\" | \"update\" | \"banned\";\ntype Active = Exclude<Permission, \"banned\">;\ntype Write = Extract<Permission, \"create\" | \"update\">;",
      "tip": "Эти утилиты работают с вариантами объединения, а Pick и Omit — с ключами объекта.",
      "language": "typescript"
    },
    {
      "title": "ReturnType и Parameters",
      "desc": "Извлекайте типы из сигнатуры функции.",
      "code": "function log(data: string[], count: number): boolean {\n  console.log(data, count);\n  return true;\n}\ntype Result = ReturnType<typeof log>;\ntype SecondArgument = Parameters<typeof log>[1];",
      "tip": "typeof в позиции типа получает тип значения функции; Parameters возвращает кортеж.",
      "language": "typescript"
    }
  ],
  "ts_transformations": [
    {
      "title": "Отображаемые типы",
      "desc": "Mapped type создаёт поле для каждого ключа объединения.",
      "code": "interface Endpoint {\n  method: \"GET\" | \"POST\" | \"PUT\" | \"DELETE\";\n  url: string;\n}\ntype Endpoints<K extends string> = { [P in K]: Endpoint };\ntype Reports = Endpoints<\"getReports\" | \"putReports\">;",
      "tip": "Задайте конечное объединение ключей, чтобы сохранить обязательные имена endpoints.",
      "language": "typescript"
    },
    {
      "title": "Условные типы и infer",
      "desc": "Извлекайте часть типа при совпадении с шаблоном.",
      "code": "type ElementType<T> = T extends readonly (infer U)[] ? U : T;\ntype A = ElementType<number[]>; // number\ntype B = ElementType<string>; // string",
      "tip": "Условный тип с параметром T слева от extends распределяется по вариантам объединения.",
      "language": "typescript"
    },
    {
      "title": "Шаблонные строковые типы",
      "desc": "Комбинируйте строковые литералы на уровне типов.",
      "code": "type EventName = \"click\" | \"focus\" | \"hover\";\ntype HandlerName = `on${Capitalize<EventName>}`;\nconst handler: HandlerName = \"onClick\";",
      "tip": "Capitalize не меняет реальные строки во время выполнения программы.",
      "language": "typescript"
    },
    {
      "title": "Дискриминируемое объединение",
      "desc": "Литеральное поле определяет форму остальных данных.",
      "code": "type AppEvent =\n  | { type: \"click\"; x: number; y: number }\n  | { type: \"keypress\"; key: string };\nfunction handle(event: AppEvent): void {\n  if (event.type === \"click\") console.log(event.x, event.y);\n  else console.log(event.key);\n}",
      "tip": "Раздельные варианты не допускают бессмысленных сочетаний необязательных полей.",
      "language": "typescript"
    },
    {
      "title": "Модификаторы и переименование ключей",
      "desc": "-? и -readonly снимают модификаторы, as переименовывает и фильтрует ключи.",
      "code": "type Mutable<T> = { -readonly [K in keyof T]: T[K] };\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\ntype PickByValue<T, V> = {\n  [K in keyof T as T[K] extends V ? K : never]: T[K];\n};",
      "tip": "Ключ, для которого выражение после as даёт never, исчезает из результата.",
      "language": "typescript"
    },
    {
      "title": "Распределение по объединению",
      "desc": "Голый параметр типа распределяет условие, обёртка [T] — отключает.",
      "code": "type ToArray<T> = T extends unknown ? T[] : never;\ntype A = ToArray<string | number>; // string[] | number[]\n\ntype IsNever<T> = [T] extends [never] ? true : false;",
      "tip": "never — пустое объединение: распределение по нему всегда даёт never.",
      "language": "typescript"
    }
  ],
  "ts_patterns": [
    {
      "title": "Внешние данные: unknown и type guard",
      "desc": "Аннотация не проверяет JSON — проверяйте структуру значения.",
      "code": "interface ApiComment { id: number; email: string }\nconst isComment = (value: unknown): value is ApiComment =>\n  typeof value === \"object\" && value !== null &&\n  \"id\" in value && typeof value.id === \"number\" &&\n  \"email\" in value && typeof value.email === \"string\";\n\nasync function getData(url: string): Promise<ApiComment[]> {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(\"HTTP error\");\n  const data: unknown = await response.json();\n  if (!Array.isArray(data) || !data.every(isComment)) {\n    throw new Error(\"Invalid response\");\n  }\n  return data;\n}",
      "tip": "Promise<ApiComment[]> описывает результат, но без проверки не подтверждает формат ответа сервера.",
      "language": "typescript"
    },
    {
      "title": "Абстрактные классы",
      "desc": "abstract требует реализации метода, protected открывает поле наследникам.",
      "code": "abstract class Employee {\n  constructor(public name: string, protected salary: number) {}\n  abstract calculateBonus(): number;\n}\nclass Manager extends Employee {\n  calculateBonus(): number { return this.salary * 0.2; }\n}",
      "tip": "Создать экземпляр абстрактного класса напрямую нельзя.",
      "language": "typescript"
    },
    {
      "title": "Перегрузки функций",
      "desc": "Специфичная сигнатура определяет точный тип результата вызова.",
      "code": "function createElement(tag: \"img\"): { tag: \"img\"; src: string };\nfunction createElement(tag: string): { tag: string };\nfunction createElement(tag: string): { tag: string; src?: string } {\n  return tag === \"img\" ? { tag, src: \"\" } : { tag };\n}\nconst image = createElement(\"img\");\nimage.src = \"photo.jpg\";",
      "tip": "Размещайте узкие перегрузки перед общей сигнатурой.",
      "language": "typescript"
    },
    {
      "title": "Типизированные события",
      "desc": "Один параметр K связывает событие, подписчика и payload.",
      "code": "class EventEmitter<Events extends object> {\n  private listeners: {\n    [K in keyof Events]?: Array<(payload: Events[K]) => void>;\n  } = {};\n  on<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void): void {\n    (this.listeners[event] ??= []).push(callback);\n  }\n  emit<K extends keyof Events>(event: K, payload: Events[K]): void {\n    this.listeners[event]?.forEach((callback) => callback(payload));\n  }\n}",
      "tip": "Не требуйте строковую индексную сигнатуру от интерфейса с заранее известными событиями.",
      "language": "typescript"
    },
    {
      "title": "Рекурсивный Partial",
      "desc": "Рекурсия делает необязательными поля вложенных объектов.",
      "code": "type DeepPartial<T> = {\n  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];\n};\ninterface Config { theme: { color: string; fontSize: number } }\nconst patch: DeepPartial<Config> = { theme: { color: \"blue\" } };",
      "tip": "Этот вариант предназначен для обычных объектов конфигурации. Глубокое слияние данных реализуется отдельно.",
      "language": "typescript"
    },
    {
      "title": "Брендированные идентификаторы",
      "desc": "Различайте значения с одинаковым базовым типом.",
      "code": "type Brand<T, B extends string> = T & { readonly __brand: B };\ntype UserId = Brand<string, \"UserId\">;\ntype OrderId = Brand<string, \"OrderId\">;\nconst toUserId = (id: string): UserId => id as UserId;\nfunction getUser(id: UserId): void { console.log(id); }\ngetUser(toUserId(\"user-1\"));",
      "tip": "Бренд не проверяет формат строки. Проверку недоверенных данных добавляют в фабрику.",
      "language": "typescript"
    }
  ],
  "ts_advanced": [
    {
      "title": "Разбор строк через infer",
      "desc": "Шаблонные строки с infer извлекают данные из строковых литералов.",
      "code": "type ParamNames<P extends string> =\n  P extends `${string}:${infer Param}/${infer Rest}`\n    ? Param | ParamNames<Rest>\n    : P extends `${string}:${infer Param}` ? Param : never;\n\ntype Params = ParamNames<\"/users/:id/posts/:postId\">; // \"id\" | \"postId\"",
      "tip": "Каждая позиция перед следующим литералом захватывает минимальную подстроку.",
      "language": "typescript"
    },
    {
      "title": "Кортежи и рекурсия",
      "desc": "[infer F, ...infer Rest] разбирает кортеж, [...A, ...B] собирает.",
      "code": "type Reverse<T extends readonly unknown[]> =\n  T extends readonly [infer F, ...infer Rest] ? [...Reverse<Rest>, F] : [];\n\ntype Curried<A extends unknown[], R> = A extends [infer F, ...infer Rest]\n  ? (arg: F) => Rest extends [] ? R : Curried<Rest, R>\n  : R;",
      "tip": "Глубина рекурсии условных типов ограничена; при ошибке «excessively deep» нужен счётчик.",
      "language": "typescript"
    },
    {
      "title": "Вариантность",
      "desc": "Результаты ковариантны, параметры контравариантны.",
      "code": "interface Handler {\n  onEvent: (animal: Animal) => void; // строгая проверка\n  // onEvent(animal: Animal): void;   // метод — бивариантно\n}\ninterface Box<out T> {\n  readonly value: T;\n}",
      "tip": "Колбэки в интерфейсах описывайте свойствами: методы проверяются бивариантно даже в strict.",
      "language": "typescript"
    },
    {
      "title": "UnionToIntersection",
      "desc": "Вывод из позиции параметра объединяет кандидатов пересечением.",
      "code": "type UnionToIntersection<U> =\n  (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void\n    ? I\n    : never;\n\ntype All = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }",
      "tip": "Для примитивов результат — never: string & number пуст.",
      "language": "typescript"
    }
  ]
};
