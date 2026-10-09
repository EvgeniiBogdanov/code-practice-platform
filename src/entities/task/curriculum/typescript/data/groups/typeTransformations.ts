import { NO_SUPPRESSION_CHECK, linked, type TypeScriptTaskGroup } from "../taskMeta";

export const TYPE_TRANSFORMATIONS_GROUP: TypeScriptTaskGroup = {
  name: "Mapped и Conditional Types",
  tasks: [
    {
      id: "typescript-40",
      title: "Свои Readonly, Partial и Required",
      desc: "Не используя встроенные утилиты, реализуйте аналоги Readonly, Partial и Required, а также тип Mutable, который снимает readonly со всех полей.",
      difficulty: "medium",
      tags: ["mapped-types", "readonly", "optional", "modifiers"],
      filepath: "05_type_transformations/mapped-modifiers.ts",
      checklist: [
        "Все четыре типа построены через отображаемый тип [K in keyof T].",
        linked("MyRequired использует -?, Mutable использует -readonly.", "делает все поля обязательными", "Mutable снимает readonly со всех полей"),
        "Встроенные Readonly, Partial и Required не используются.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что такое гомоморфный отображаемый тип?",
          answer:
            "Тип вида { [K in keyof T]: ... }, который обходит ключи существующего типа. Он сохраняет модификаторы readonly и ? исходных полей и корректно работает с массивами и кортежами, возвращая массив или кортеж.",
        },
        {
          question: "Что делают -? и -readonly?",
          answer:
            "Снимают модификатор. -? делает поле обязательным и убирает undefined, добавленный необязательностью; -readonly разрешает запись. Модификатор без знака или с + добавляет его.",
        },
        {
          question: "Как сделать глубокий Readonly?",
          answer:
            "Рекурсивно: { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }. На практике отдельно обрабатывают функции, чтобы не превращать их в объекты без сигнатуры вызова.",
        },
      ],
      articles: [
        {
          title: "Отображаемые типы и модификаторы",
          url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers",
          urlTitle: "TypeScript Handbook — Mapped Types",
        },
        {
          title: "Обход свойств типа и изменение их обязательности",
          url: "https://scriptdev.ru/guide/042/",
          urlTitle: "ScriptDev — отображаемые типы",
        },
      ],
    },
    {
      id: "typescript-41",
      title: "Свои Pick и Omit",
      desc: "Реализуйте аналоги Pick и Omit без встроенных утилит Pick и Omit, а также StrictOmit, который не позволяет исключить несуществующий ключ.",
      difficulty: "medium",
      tags: ["mapped-types", "keyof", "Pick", "Omit"],
      filepath: "05_type_transformations/pick-omit-implementation.ts",
      checklist: [
        linked("MyPick ограничивает ключи через K extends keyof T.", "принимает только существующие ключи"),
        linked("MyOmit исключает ключи и сохраняет модификаторы полей.", "убирает перечисленные ключи и сохраняет модификаторы"),
        linked("StrictOmit с несуществующим ключом — ошибка.", "отклоняет несуществующие ключи"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему у встроенного Omit ограничение K extends keyof any, а не keyof T?",
          answer:
            "Так задумано, чтобы Omit работал с типами, ключи которых заранее неизвестны, например с параметрами типов. Цена — опечатка в ключе не обнаруживается. Отсюда популярный StrictOmit.",
        },
        {
          question: "Сохраняет ли MyPick модификаторы readonly и ?",
          answer:
            "Да. Отображаемый тип вида { [P in K]: T[P] }, где K extends keyof T, TypeScript считает гомоморфным и копирует модификаторы исходных полей.",
        },
        {
          question: "Как Omit ведёт себя с объединением типов?",
          answer:
            "Не распределяется: keyof (A | B) — только общие ключи, поэтому Omit<A | B, \"x\"> теряет уникальные поля вариантов. Для объединений пишут распределяющий вариант: T extends unknown ? Omit<T, K> : never.",
        },
      ],
      articles: [
        {
          title: "Отображаемые типы",
          url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html",
          urlTitle: "TypeScript Handbook — Mapped Types",
        },
        {
          title: "Утилиты Pick и Omit",
          url: "https://scriptdev.ru/guide/045/",
          urlTitle: "ScriptDev — утилита Omit",
        },
      ],
    },
    {
      id: "typescript-15",
      title: "Общий шаблон API",
      desc: "Напишите типизацию, подходящую для двух объектов API. Необходимо сохранить строгую типизацию ключей внутри endpoints: слишком общие типы для ключей не подходят. Набор ключей каждого объекта должен выводиться из него самого, без ручного дублирования.",
      difficulty: "medium",
      tags: ["mapped-types", "generics", "inference", "literal"],
      filepath: "05_type_transformations/typed-api-template.ts",
      checklist: [
        linked("Для каждого API задан свой точный набор ключей.", "ключи endpoints выводятся из объекта", "у каждого объекта только свои endpoint"),
        linked("method ограничен допустимыми HTTP-методами.", "method — не произвольная строка"),
        "Имена операций не дублируются вручную в типах.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему Record<string, Endpoint> не решает эту задачу?",
          answer:
            "Он допускает произвольные строковые ключи и не требует конкретных имён. Record<K, Endpoint> с конечным объединением K подходит.",
        },
        {
          question: "Как TypeScript выводит K из { [P in K]: Endpoint }?",
          answer:
            "Это обратный вывод через отображаемый тип: если аргумент сопоставляется с { [P in K]: X }, K выводится как объединение ключей переданного объекта, а каждое значение проверяется по X.",
        },
        {
          question: "Чем решение с функцией-фабрикой отличается от satisfies?",
          answer:
            "satisfies ApiObject<string> тоже сохранит точные ключи переменной. Фабрика дополнительно даёт именованный тип ApiObject<K> с известным K, который можно передавать в другие обобщённые функции.",
        },
      ],
      articles: [
        {
          title: "Создание обязательных полей по набору ключей",
          url: "https://scriptdev.ru/guide/042/",
          urlTitle: "ScriptDev — отображаемые типы",
        },
        {
          title: "Record с конечным объединением ключей",
          url: "https://scriptdev.ru/guide/044/",
          urlTitle: "ScriptDev — утилита Record",
        },
      ],
    },
    {
      id: "typescript-42",
      title: "Условные типы",
      desc: "Реализуйте типы-помощники на основе условных типов без infer: IsString, MyNonNullable и TypeName, который по аналогии с оператором typeof возвращает строковое имя типа.",
      difficulty: "medium",
      tags: ["conditional-types", "extends"],
      filepath: "05_type_transformations/conditional-types.ts",
      checklist: [
        linked("IsString возвращает литералы true или false.", "true для строк, false для остальных типов"),
        linked("MyNonNullable убирает null и undefined без встроенного NonNullable.", "убирает null и undefined", "не трогает остальные типы"),
        linked("TypeName различает строки, числа, логические значения, функции и объекты.", "называет примитивы и функции", "массивы и объекты — object"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что означает extends в условном типе?",
          answer:
            "Проверку совместимости: «можно ли присвоить левый тип правому». Это не наследование классов. \"a\" extends string — истина, string extends \"a\" — ложь.",
        },
        {
          question: "Что вернёт IsString<string | number>?",
          answer:
            "boolean, то есть true | false. Условный тип с голым параметром распределяется по вариантам объединения: для string получится true, для number — false.",
        },
        {
          question: "Почему порядок проверок в TypeName важен?",
          answer:
            "Ветки проверяются по очереди, выбирается первая подходящая. Функции и массивы тоже являются object, поэтому проверку на функцию нужно поставить до общей ветки object.",
        },
      ],
      articles: [
        {
          title: "Условные типы",
          url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
          urlTitle: "TypeScript Handbook — Conditional Types",
        },
        {
          title: "Условные типы",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы",
        },
      ],
    },
    {
      id: "typescript-16",
      title: "Условный выбор с infer",
      desc: "Опишите тип-помощник, который извлекает тип элемента массива, а для типа, не являющегося массивом, возвращает сам этот тип без изменений.",
      difficulty: "medium",
      tags: ["conditional-types", "infer"],
      filepath: "05_type_transformations/conditional-element-type.ts",
      checklist: [
        linked("Из number[] извлекается number.", "извлекает тип элемента массива"),
        linked("Не являющийся массивом тип string остаётся string.", "не массив возвращается без изменений"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что означает infer в условном типе?",
          answer:
            "Он вводит переменную типа, которую TypeScript выводит из совпавшей структуры в проверяемом условии.",
        },
        {
          question: "Совпадёт ли readonly string[] с (infer U)[]?",
          answer:
            "Нет: readonly-массив не совместим с изменяемым, потому что у него нет push. Чтобы поддержать оба вида, пишут T extends readonly (infer U)[].",
        },
        {
          question: "Как извлечь элемент из массива любой вложенности?",
          answer:
            "Рекурсией: type DeepElement<T> = T extends readonly (infer U)[] ? DeepElement<U> : T. Для number[][][] получится number.",
        },
      ],
      articles: [
        {
          title: "Извлечение части типа через условие и infer",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы и infer",
        },
        {
          title: "Получение типа элемента через индексированный доступ",
          url: "https://scriptdev.ru/guide/042/",
          urlTitle: "ScriptDev — Lookup Types",
        },
      ],
    },
    {
      id: "typescript-43",
      title: "Свои ReturnType, Parameters и Awaited",
      desc: "Реализуйте через infer аналоги ReturnType, Parameters и Awaited, а также FirstArg — тип первого параметра функции.",
      difficulty: "hard",
      tags: ["infer", "conditional-types", "recursion"],
      filepath: "05_type_transformations/infer-utilities.ts",
      checklist: [
        linked("MyReturnType и MyParameters принимают только функции.", "принимает только функции"),
        linked("MyAwaited рекурсивно снимает вложенные Promise.", "MyAwaited разворачивает вложенные Promise"),
        linked("FirstArg возвращает тип первого параметра.", "FirstArg возвращает тип первого параметра"),
        "Встроенные утилиты и any не используются.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему в ограничении функции используется never[] для аргументов, а не unknown[]?",
          answer:
            "Параметры функций контравариантны. Функция (x: string) => void не совместима с (...args: unknown[]) => unknown, потому что не может принять любой аргумент. С never[] совместима любая функция.",
        },
        {
          question: "Почему MyAwaited рекурсивен?",
          answer:
            "await снимает все уровни вложенности: результат await Promise<Promise<number>> — number. Тип должен повторять это поведение, иначе остался бы Promise<number>.",
        },
        {
          question: "Что вернёт MyReturnType для перегруженной функции?",
          answer:
            "Результат последней сигнатуры перегрузки. Сопоставление с infer при перегрузках использует только последнюю сигнатуру, как и встроенный ReturnType.",
        },
      ],
      articles: [
        {
          title: "Вывод типов внутри условных типов",
          url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types",
          urlTitle: "TypeScript Handbook — infer",
        },
        {
          title: "Условные типы и infer",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы",
        },
      ],
    },
    {
      id: "typescript-44",
      title: "Распределение по объединению",
      desc: "Реализуйте ToArrayNonDist без распределения по объединению, исправьте наивный IsNever и напишите IsUnion, который определяет, является ли тип объединением.",
      difficulty: "hard",
      tags: ["distributive-conditional-types", "never", "union"],
      filepath: "05_type_transformations/distributive-conditionals.ts",
      checklist: [
        linked("ToArrayNonDist<string | number> — (string | number)[].", "не распределяется по объединению"),
        linked("IsNever<never> — true, IsNever<string> — false.", "true только для never", "false для остальных типов"),
        linked("IsUnion<string | number> — true, IsUnion<string> и IsUnion<never> — false.", "true для объединения нескольких типов", "false для одного типа и для never"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Когда условный тип распределяется по объединению?",
          answer:
            "Когда проверяемый тип слева от extends — голый параметр типа, например T extends U. Тогда условие применяется к каждому варианту T отдельно, и результаты объединяются.",
        },
        {
          question: "Почему наивный IsNever<never> возвращает never?",
          answer:
            "never — пустое объединение. Распределение по нулю вариантов даёт пустой результат, то есть never. Обёртка [T] extends [never] отключает распределение.",
        },
        {
          question: "Почему IsUnion<boolean> — true?",
          answer:
            "boolean — это объединение true | false. Так же ведёт себя enum: его тип — объединение членов.",
        },
      ],
      articles: [
        {
          title: "Распределяющие условные типы",
          url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types",
          urlTitle: "TypeScript Handbook — Distributive Conditional Types",
        },
        {
          title: "Почему условный тип обрабатывает варианты объединения",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы",
        },
      ],
    },
    {
      id: "typescript-17",
      title: "Шаблонные строки",
      desc: "Опишите тип для названий обработчиков событий вида \"on\" + название события с большой буквы, например: onClick, onFocus, onHover — на основе списка исходных названий событий.",
      difficulty: "medium",
      tags: ["template-literal", "Capitalize"],
      filepath: "05_type_transformations/template-event-names.ts",
      checklist: [
        linked("Имена обработчиков выводятся из EventName.", "EventHandlerName — onИмяСобытия для каждого события"),
        linked("Неверный регистр и неизвестные события отвергаются.", "остальные строки отклоняются"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Изменяет ли Capitalize строку во время выполнения?",
          answer:
            "Нет, он преобразует тип строкового литерала. Реальное преобразование строки требует JavaScript-кода.",
        },
        {
          question: "Как получить имя события обратно из \"onClick\"?",
          answer:
            "Сопоставлением с шаблоном и infer: T extends `on${infer E}` ? Uncapitalize<E> : never.",
        },
        {
          question: "Что получится из `${A}-${B}`, если A и B — объединения?",
          answer:
            "Декартово произведение: все комбинации вариантов. Для объединений из 3 и 4 строк — 12 литералов. При больших объединениях это может резко замедлить проверку типов.",
        },
      ],
      articles: [
        {
          title: "Построение строкового типа из объединения событий",
          url: "https://scriptdev.ru/guide/018/",
          urlTitle: "ScriptDev — шаблонные литеральные типы",
        },
        {
          title: "Изменение регистра строковых типов через Capitalize",
          url: "https://habr.com/ru/articles/730906/",
          urlTitle: "Хабр — утилиты строковых типов",
        },
      ],
    },
    {
      id: "typescript-45",
      title: "Переименование и фильтрация ключей",
      desc: "С помощью переименования ключей в отображаемых типах опишите Getters (getName: () => string), PickByValue (только поля заданного типа) и ChangeHandlers (onNameChange: (value: string) => void).",
      difficulty: "hard",
      tags: ["mapped-types", "key-remapping", "template-literal"],
      filepath: "05_type_transformations/key-remapping.ts",
      checklist: [
        linked("Getters и ChangeHandlers строят имена ключей через as и шаблонные строки.", "Getters добавляет get и делает имя поля заглавным", "ChangeHandlers создаёт onИмяChange с типом значения поля"),
        linked("PickByValue отбрасывает ключи через as never.", "PickByValue оставляет только поля с подходящим значением"),
        "Нестроковые ключи не ломают Capitalize.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Зачем писать Capitalize<string & K>?",
          answer:
            "keyof T может содержать number и symbol, а Capitalize принимает только строки. Пересечение со string оставляет строковые ключи; для остальных результат — never, и такой ключ исчезает.",
        },
        {
          question: "Как as never удаляет ключ?",
          answer:
            "Если выражение после as даёт never, отображаемый тип не создаёт для него поле. Так фильтруют ключи по любому условию.",
        },
        {
          question: "Сохраняются ли модификаторы при переименовании ключей?",
          answer:
            "Да, если тип по-прежнему обходит keyof T: { [K in keyof T as ...]: ... } остаётся гомоморфным и переносит readonly и ? на новые ключи.",
        },
      ],
      articles: [
        {
          title: "Переименование ключей через as",
          url: "https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as",
          urlTitle: "TypeScript Handbook — Key Remapping",
        },
        {
          title: "Шаблонные литеральные типы",
          url: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
          urlTitle: "TypeScript Handbook — Template Literal Types",
        },
      ],
    },
  ],
};
