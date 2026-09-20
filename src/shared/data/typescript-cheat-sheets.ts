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
      "title": "Литералы и сужение типов",
      "desc": "Проверка typeof отделяет варианты объединения.",
      "code": "type Role = \"admin\" | \"user\";\nfunction formatId(id: string | number): string {\n  return typeof id === \"string\"\n    ? id.toUpperCase()\n    : id.toFixed(2);\n}",
      "tip": "После проверки TypeScript знает, какие операции допустимы в каждой ветке.",
      "language": "typescript"
    },
    {
      "title": "Перечисления",
      "desc": "Обычный enum создаёт и тип, и объект со значениями.",
      "code": "enum OrderStatus {\n  Pending = \"pending\",\n  Shipped = \"shipped\",\n  Delivered = \"delivered\",\n  Cancelled = \"cancelled\",\n}\nconst status: OrderStatus = OrderStatus.Pending;",
      "tip": "Объединение строковых литералов существует только при проверке типов, enum доступен и в рантайме.",
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
  ]
};
