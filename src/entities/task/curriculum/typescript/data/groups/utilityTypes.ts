import { NO_SUPPRESSION_CHECK, linked, type TypeScriptTaskGroup } from "../taskMeta";

export const UTILITY_TYPES_GROUP: TypeScriptTaskGroup = {
  name: "Utility Types",
  tasks: [
    {
      id: "typescript-10",
      title: "Выборочная сборка",
      desc: "На основе интерфейса User создайте два новых типа: один — только с публичными полями (без пароля), второй — только с полями, нужными для формы регистрации (имя и пароль).",
      difficulty: "medium",
      tags: ["Pick", "Omit"],
      filepath: "04_utility_types/pick-and-omit.ts",
      checklist: [
        linked("PublicUser не содержит password в контракте.", "PublicUser — все поля, кроме пароля"),
        linked("RegistrationForm содержит только name и password.", "RegistrationForm — только имя и пароль"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Удаляет ли Omit пароль из объекта?",
          answer:
            "Нет. Omit преобразует только тип. Чтобы не передать пароль наружу, нужно отдельно построить объект без этого поля, например через деструктуризацию const { password, ...publicUser } = user.",
        },
        {
          question: "Проверяет ли Omit, что исключаемый ключ существует?",
          answer:
            "Нет: второй параметр Omit ограничен keyof any, поэтому Omit<User, \"pasword\"> с опечаткой молча вернёт User целиком. Pick, наоборот, требует K extends keyof T. Строгий вариант: type StrictOmit<T, K extends keyof T> = Omit<T, K>.",
        },
        {
          question: "Как описать данные для обновления: id обязателен, остальное необязательно?",
          answer:
            "Pick<User, \"id\"> & Partial<Omit<User, \"id\">>. Утилиты комбинируются, потому что каждая принимает и возвращает обычный объектный тип.",
        },
      ],
      articles: [
        {
          title: "Выбор полей формы через Pick",
          url: "https://scriptdev.ru/guide/044/",
          urlTitle: "ScriptDev — утилита Pick",
        },
        {
          title: "Исключение полей модели через Omit",
          url: "https://scriptdev.ru/guide/045/",
          urlTitle: "ScriptDev — утилита Omit",
        },
      ],
    },
    {
      id: "typescript-11",
      title: "Карта записей",
      desc: "Опишите тип для объекта, который хранит количество товаров на складе по их артикулу (строка), где значение — всегда число.",
      difficulty: "medium",
      tags: ["Record", "index-signature"],
      filepath: "04_utility_types/stock-record.ts",
      checklist: [
        linked("Склад имеет строковые ключи и числовые значения.", "Stock хранит числа по строковым артикулам", "значения Stock — только числа"),
        "Новый артикул начинается с нуля, существующий увеличивается.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Гарантирует ли Record<string, number> наличие любого ключа?",
          answer:
            "Нет. Это контракт значений словаря. При noUncheckedIndexedAccess чтение по произвольному ключу также учитывает undefined.",
        },
        {
          question: "Чем Record<string, number> отличается от { [sku: string]: number }?",
          answer:
            "Для строковых ключей это одно и то же. Индексная сигнатура позволяет дать ключу говорящее имя и добавить известные поля рядом, а Record короче и работает с объединением ключей.",
        },
        {
          question: "Чем Record<\"a\" | \"b\", number> отличается от Record<string, number>?",
          answer:
            "С конечным объединением ключей Record требует каждый ключ и запрещает остальные. Это полезно для проверки полноты: добавили вариант в объединение — объект требует новое поле.",
        },
        {
          question: "Когда вместо объекта лучше Map<string, number>?",
          answer:
            "Когда ключи добавляются и удаляются динамически, важен порядок вставки или размер. У Map get честно возвращает number | undefined, а ключи не пересекаются с полями прототипа.",
        },
      ],
      articles: [
        {
          title: "Словарь со строковыми ключами через Record",
          url: "https://scriptdev.ru/guide/044/",
          urlTitle: "ScriptDev — утилита Record",
        },
        {
          title: "Начальное значение для отсутствующего артикула: ??",
          url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing",
          urlTitle: "MDN на русском — оператор нулевого слияния",
        },
      ],
    },
    {
      id: "typescript-12",
      title: "Исключение лишнего",
      desc: "На основе типа допустимых прав доступа создайте: тип без права \"banned\", и отдельный тип, содержащий только права, связанные с изменением данных (\"create\", \"update\").",
      difficulty: "medium",
      tags: ["Exclude", "Extract", "union"],
      filepath: "04_utility_types/exclude-and-extract.ts",
      checklist: [
        linked("ActivePermission не допускает banned.", "ActivePermission — все права, кроме banned"),
        linked("WritePermission допускает только create и update.", "WritePermission — только create и update"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "В чём различие Omit и Exclude?",
          answer: "Omit убирает ключи объекта. Exclude убирает варианты объединения типов.",
        },
        {
          question: "Как устроен Exclude внутри?",
          answer:
            "type Exclude<T, U> = T extends U ? never : T. Условный тип распределяется по вариантам объединения: каждый вариант, совместимый с U, превращается в never и исчезает из результата.",
        },
        {
          question: "Что вернёт Extract<Shape, { kind: \"circle\" }> для дискриминируемого объединения?",
          answer:
            "Вариант объединения, совместимый с { kind: \"circle\" }, то есть сам тип круга со всеми полями. Это удобный способ получить один вариант по значению дискриминатора.",
        },
      ],
      articles: [
        {
          title: "Фильтрация объединений через Exclude и Extract",
          url: "https://scriptdev.ru/guide/045/",
          urlTitle: "ScriptDev — Exclude и Extract",
        },
        {
          title: "Почему условный тип обрабатывает варианты объединения",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы",
        },
      ],
    },
    {
      id: "typescript-38",
      title: "Partial, Required, Readonly и NonNullable",
      desc: "Функция дополняет частичные настройки значениями по умолчанию. Опишите типы так, чтобы на вход можно было передать любые поля, результат гарантировал наличие всех полей и не изменялся, а ключ кеша не допускал null и undefined.",
      difficulty: "medium",
      tags: ["Partial", "Required", "Readonly", "NonNullable"],
      filepath: "04_utility_types/partial-required-readonly.ts",
      checklist: [
        linked("resolveOptions принимает Partial<Options>.", "принимает любой набор полей Options, в том числе пустой", "не принимает чужие поля и неверные типы"),
        linked("Результат имеет тип Readonly<Options>, и его поля нельзя изменять.", "результат содержит все поля и защищён от изменений"),
        linked("LegacyOptions превращён в тип со всеми обязательными полями через Required.", "StrictLegacyOptions делает все поля обязательными"),
        linked("CacheKey получен через NonNullable.", "CacheKey исключает null и undefined"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Readonly и Partial действуют на вложенные объекты?",
          answer:
            "Нет, только на поля верхнего уровня. Для вложенных объектов нужны рекурсивные варианты DeepReadonly и DeepPartial.",
        },
        {
          question: "Безопасен ли { ...DEFAULTS, ...options } при Partial<Options>?",
          answer:
            "Не полностью: Partial разрешает явное { timeout: undefined }, и спред перезапишет значение по умолчанию на undefined, хотя тип результата — number. Флаг exactOptionalPropertyTypes запрещает явный undefined в необязательных полях.",
        },
        {
          question: "Как реализован NonNullable?",
          answer:
            "Сейчас как T & {}. Пересечение с {} убирает null и undefined, потому что они несовместимы с {}, а остальные типы не меняет. Раньше использовался условный тип T extends null | undefined ? never : T.",
        },
      ],
      articles: [
        {
          title: "Partial, Required, Readonly, NonNullable",
          url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype",
          urlTitle: "TypeScript Handbook — Utility Types",
        },
        {
          title: "Утилиты Partial и Readonly",
          url: "https://scriptdev.ru/guide/044/",
          urlTitle: "ScriptDev — служебные типы",
        },
      ],
    },
    {
      id: "typescript-13",
      title: "Результат валидации",
      desc: "Функция проверяет данные регистрации. Если всё корректно — возвращает готового пользователя, иначе — ошибки по каждому некорректному полю. Вызывающий код должен получать доступ к user только после проверки успеха, а к errors — только после проверки неудачи.",
      difficulty: "medium",
      tags: ["Partial", "Record", "discriminated-union", "result"],
      filepath: "04_utility_types/validated-user.ts",
      checklist: [
        "Результат описан дискриминируемым объединением по полю ok.",
        "Ошибки описаны как Partial<Record<keyof User, string>>.",
        linked("user доступен только в ветке ok: true, errors — только в ветке ok: false.", "user доступен только после проверки успеха", "errors доступны только после проверки неудачи"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему не вернуть Partial<User>?",
          answer:
            "Тогда вызывающий код не знает, прошла ли проверка, и должен сам проверять каждое поле. Неполный пользователь может случайно уйти дальше как настоящий. Объединение явно разделяет успех и ошибку.",
        },
        {
          question: "Почему ошибки — Partial<Record<keyof User, string>>, а не Record<string, string>?",
          answer:
            "Ключи ошибок совпадают с полями модели: опечатка errors.nmae будет ошибкой. Partial нужен, потому что ошибка есть не у каждого поля.",
        },
        {
          question: "Чем результат-объединение лучше исключений?",
          answer:
            "Ошибка валидации — ожидаемый исход, а не сбой. Тип результата заставляет вызывающий код обработать оба случая, тогда как throw не виден в сигнатуре функции.",
        },
      ],
      articles: [
        {
          title: "Частично заполненный объект через Partial",
          url: "https://scriptdev.ru/guide/044/",
          urlTitle: "ScriptDev — утилита Partial",
        },
        {
          title: "Дискриминантное объединение",
          url: "https://scriptdev.ru/guide/033/",
          urlTitle: "ScriptDev — дискриминантное объединение",
        },
      ],
    },
    {
      id: "typescript-14",
      title: "Разбор функции",
      desc: "Как получить возвращаемый тип функции и тип её второго параметра?",
      difficulty: "medium",
      tags: ["ReturnType", "Parameters", "typeof"],
      filepath: "04_utility_types/function-introspection.ts",
      checklist: [
        linked("Возвращаемый тип получен через ReturnType.", "LogReturnType — тип результата log"),
        linked("Тип второго параметра получен из Parameters по индексу 1.", "LogSecondParam — тип второго параметра log"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему перед ReturnType нужен typeof log?",
          answer:
            "log — значение функции. typeof в позиции типа превращает это значение в его тип, который и принимает утилита.",
        },
        {
          question: "Что вернёт ReturnType для перегруженной функции?",
          answer:
            "Результат последней перегрузки: условный тип с infer сопоставляется с последней сигнатурой. Для конкретной перегрузки нужен отдельный тип или выбор по аргументам.",
        },
        {
          question: "Как получить тип элементов массива из первого параметра?",
          answer:
            "Parameters<typeof log>[0][number]: сначала кортеж параметров, затем первый элемент string[], затем тип элемента по числовому индексу.",
        },
      ],
      articles: [
        {
          title: "Извлечение результата и кортежа аргументов",
          url: "https://scriptdev.ru/guide/045/",
          urlTitle: "ScriptDev — ReturnType и Parameters",
        },
        {
          title: "Получение типа существующей функции через typeof",
          url: "https://scriptdev.ru/guide/017/",
          urlTitle: "ScriptDev — запросы типов",
        },
      ],
    },
    {
      id: "typescript-39",
      title: "Awaited и типы асинхронного кода",
      desc: "Не дублируя описания вручную, получите тип пользователя после await, тип результата loadDashboard и тип аргументов конструктора ApiClient.",
      difficulty: "medium",
      tags: ["Awaited", "ReturnType", "ConstructorParameters", "Promise.all"],
      filepath: "04_utility_types/awaited-results.ts",
      checklist: [
        linked("User выведен через Awaited<ReturnType<typeof fetchUser>>.", "User — результат fetchUser после await"),
        linked("Dashboard — кортеж из пользователя и массива заказов.", "Dashboard — пользователь и список его заказов"),
        linked("ClientOptions получен через ConstructorParameters.", "ClientOptions — первый аргумент конструктора ApiClient"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему ReturnType<typeof fetchUser> недостаточно?",
          answer:
            "async-функция возвращает Promise<...>, а нужен тип значения после await. Awaited снимает обёртку Promise, причём рекурсивно: Awaited<Promise<Promise<number>>> — это number.",
        },
        {
          question: "Почему Promise.all возвращает кортеж, а не массив объединения?",
          answer:
            "Его параметр объявлен как T extends readonly unknown[] | [], и для литерала массива выводится кортеж. Результат — { -readonly [P in keyof T]: Awaited<T[P]> }, то есть тип каждой позиции сохраняется.",
        },
        {
          question: "Когда выводить тип из функции, а когда описывать вручную?",
          answer:
            "Выводят, когда функция — источник истины, например клиент API или фабрика. Если тип — публичный контракт, который не должен меняться вслед за реализацией, его лучше описать явно, а функцию аннотировать им.",
        },
      ],
      articles: [
        {
          title: "Awaited, ReturnType, ConstructorParameters, InstanceType",
          url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype",
          urlTitle: "TypeScript Handbook — Utility Types",
        },
        {
          title: "Ожидание промиса и ошибки асинхронной функции",
          url: "https://learn.javascript.ru/async-await",
          urlTitle: "Современный учебник JavaScript — async/await",
        },
      ],
    },
  ],
};
