import { NO_SUPPRESSION_CHECK, linked, type TypeScriptTaskGroup } from "../taskMeta";

export const GENERICS_GROUP: TypeScriptTaskGroup = {
  name: "Generics",
  tasks: [
    {
      id: "typescript-35",
      title: "Первый дженерик",
      desc: "Функции работают с массивами любых элементов, но тип элемента теряется. Типизируйте их так, чтобы результат сохранял тип элементов исходного массива.",
      difficulty: "easy",
      tags: ["generics", "inference", "readonly"],
      filepath: "03_generics/first-generic.ts",
      checklist: [
        linked("first и last возвращают T | undefined для массива T[].", "first сохраняет тип элементов", "last сохраняет тип элементов"),
        linked("wrapInArray сохраняет тип переданного значения.", "wrapInArray оборачивает значение с сохранением типа"),
        "Функции принимают и обычные, и readonly-массивы.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем дженерик отличается от any и unknown в параметре?",
          answer:
            "any отключает проверку, unknown теряет информацию: результат придётся снова проверять. Параметр типа T связывает вход и выход: что пришло, то и вернулось, с точным типом.",
        },
        {
          question: "Когда параметр типа указывают явно: first<number>(...)?",
          answer:
            "Когда вывести его не из чего или вывод даёт не тот тип: пустой массив, значение из JSON, желаемый более широкий тип. В остальных случаях TypeScript выводит T из аргументов.",
        },
        {
          question: "Зачем писать <T,> в .tsx-файле?",
          answer:
            "В TSX запись <T>(x: T) => ... парсер может принять за JSX-тег. Запятая или ограничение <T extends unknown> снимают неоднозначность.",
        },
      ],
      articles: [
        {
          title: "Параметры типов и их вывод из аргументов",
          url: "https://metanit.com/web/typescript/3.5.php",
          urlTitle: "METANIT — обобщения",
        },
        {
          title: "Generics: Hello World дженериков",
          url: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
          urlTitle: "TypeScript Handbook — Generics",
        },
      ],
    },
    {
      id: "typescript-7",
      title: "Значение по ключу",
      desc: "Типизируйте функцию getValue. Функция должна позволять получать значение из объекта obj по существующему ключу. TypeScript должен корректно определять тип возвращаемого значения.",
      difficulty: "medium",
      tags: ["generics", "keyof", "indexed-access"],
      filepath: "03_generics/indexed-value.ts",
      checklist: [
        linked("Несуществующий ключ нельзя передать в getValue.", "getValue принимает только существующие ключи"),
        linked("Для разных ключей сохраняется точный тип результата.", "getValue возвращает тип поля по ключу", "getValue не подменяет тип поля другим"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему недостаточно возвращать T[keyof T]?",
          answer:
            "Такой результат объединяет типы всех полей. Отдельный параметр K позволяет сохранить связь с конкретным переданным ключом.",
        },
        {
          question: "Как типизировать парную функцию setValue(obj, key, value)?",
          answer:
            "<T, K extends keyof T>(obj: T, key: K, value: T[K]): void. Тот же K связывает ключ с типом значения, поэтому setValue(obj, \"a\", \"text\") будет ошибкой.",
        },
        {
          question: "Что вернёт keyof для типа с индексной сигнатурой { [key: string]: number }?",
          answer:
            "string | number, потому что в JavaScript числовые ключи объекта приводятся к строкам, и obj[0] равно obj[\"0\"].",
        },
      ],
      articles: [
        {
          title: "Связь ключа объекта и типа значения: keyof и T[K]",
          url: "https://scriptdev.ru/guide/042/",
          urlTitle: "ScriptDev — keyof и индексированный доступ",
        },
        {
          title: "Параметры типов и их вывод из аргументов",
          url: "https://metanit.com/web/typescript/3.5.php",
          urlTitle: "METANIT — обобщения",
        },
      ],
    },
    {
      id: "typescript-8",
      title: "Ограничения и значения по умолчанию",
      desc: "Типизируйте findById для любых сущностей с числовым id, сделайте параметр ответа сервера необязательным со значением unknown по умолчанию и напишите функцию longest, которая возвращает более длинное из двух значений с полем length.",
      difficulty: "medium",
      tags: ["generics", "constraints", "default-type-parameter"],
      filepath: "03_generics/generic-constraints.ts",
      checklist: [
        linked("findById ограничивает T сущностями с id и возвращает исходный тип элемента.", "возвращает элемент исходного типа со всеми полями", "не принимает сущности без числового id"),
        linked("ApiResponse без параметра имеет data: unknown.", "без параметра data имеет тип unknown"),
        linked("longest принимает массивы и строки, но не числа.", "возвращает тип переданных значений", "не принимает значения без length"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему findById возвращает T, а не Identifiable?",
          answer:
            "Если вернуть Identifiable, у результата останется только id, а title и price пропадут. Ограничение описывает минимум требований, а T сохраняет полный тип элемента.",
        },
        {
          question: "Какие правила у параметров типа по умолчанию?",
          answer:
            "Параметры со значением по умолчанию должны идти после обязательных. Значение по умолчанию должно удовлетворять ограничению. Если тип выводится из аргументов, значение по умолчанию не используется.",
        },
        {
          question: "Чем T extends object отличается от T extends {} и T без ограничения?",
          answer:
            "Без ограничения T может быть чем угодно, включая null. {} исключает только null и undefined, примитивы подходят. object допускает только объекты, массивы и функции.",
        },
      ],
      articles: [
        {
          title: "Ограничения параметров типа через extends",
          url: "https://scriptdev.ru/guide/032/",
          urlTitle: "ScriptDev — обобщения и ограничения",
        },
        {
          title: "Generic Constraints и Generic Parameter Defaults",
          url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints",
          urlTitle: "TypeScript Handbook — Generic Constraints",
        },
      ],
    },
    {
      id: "typescript-9",
      title: "Пересечение возможностей",
      desc: "Объедините два независимых набора возможностей объекта в один тип, не создавая дублирования полей.",
      difficulty: "easy",
      tags: ["intersection", "interface"],
      filepath: "03_generics/intersection-capabilities.ts",
      checklist: [
        linked("Итоговый тип построен пересечением интерфейсов.", "SerializableAndLoggable требует обе возможности"),
        "Объект реализует оба метода с указанными результатами.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что произойдёт при пересечении несовместимых типов одного поля?",
          answer:
            "Тип такого поля должен удовлетворять обоим ограничениям. Например, string & number превращается в never, и обычное значение присвоить нельзя.",
        },
        {
          question: "Почему пересечение A & B имеет больше полей, а объединение A | B — меньше?",
          answer:
            "Пересечение — значения, которые одновременно A и B, поэтому у них есть поля обоих типов. Объединение — значения, которые A или B, поэтому без сужения безопасно читать только общие поля.",
        },
        {
          question: "Чем пересечение отличается от interface Entity extends Serializable, Loggable {}?",
          answer:
            "Результат почти одинаков, но extends проверяет конфликты полей сразу в объявлении и кешируется компилятором. Пересечение работает с любыми типами, включая объединения и параметры типов.",
        },
      ],
      articles: [
        {
          title: "Пересечение требований и отличие от объединения",
          url: "https://scriptdev.ru/guide/016/",
          urlTitle: "ScriptDev — Union и Intersection",
        },
        {
          title: "Контракты объектов и сигнатуры методов",
          url: "https://metanit.com/web/typescript/3.3.php",
          urlTitle: "METANIT — интерфейсы",
        },
      ],
    },
    {
      id: "typescript-36",
      title: "Оператор satisfies",
      desc: "Конфигурация маршрутов должна соответствовать типу Routes, но при этом сохранять точные ключи: обращение к существующему маршруту — без проверок, опечатка в имени — ошибка.",
      difficulty: "medium",
      tags: ["satisfies", "inference", "index-signature"],
      filepath: "03_generics/satisfies-config.ts",
      checklist: [
        "Объект routes проверяется на соответствие Routes.",
        linked("routes.profile.path доступен, а routes.profle — ошибка.", "маршруты доступны по своим ключам", "опечатка в ключе маршрута — ошибка"),
        "Лишнее поле или неверный тип в описании маршрута — ошибка.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем различаются аннотация, satisfies и as?",
          answer:
            "Аннотация проверяет значение и заменяет его тип объявленным. satisfies проверяет значение, но оставляет выведенный тип. as ничего не проверяет по существу, а только утверждает тип.",
        },
        {
          question: "Когда satisfies не подходит?",
          answer:
            "Когда переменной нужен именно широкий тип: например, в объект потом будут добавляться новые ключи. С satisfies тип остаётся точным, и routes.newPage = ... будет ошибкой.",
        },
        {
          question: "Зачем писать as const satisfies Routes?",
          answer:
            "as const сохраняет литералы и делает поля readonly, а satisfies проверяет форму. Получаются и точные значения, например path: \"/profile\", и гарантия соответствия контракту.",
        },
      ],
      articles: [
        {
          title: "Оператор satisfies",
          url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator",
          urlTitle: "TypeScript 4.9 — The satisfies Operator",
        },
        {
          title: "Индексные сигнатуры",
          url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures",
          urlTitle: "TypeScript Handbook — Index Signatures",
        },
      ],
    },
    {
      id: "typescript-37",
      title: "Управление выводом типов",
      desc: "Сделайте так, чтобы createMachine выводила объединение состояний из массива, а начальное состояние проверялось по этому списку, не расширяя его. defineConfig должна сохранять точные литеральные значения без as const на стороне вызова.",
      difficulty: "hard",
      tags: ["inference", "const-type-parameter", "NoInfer"],
      filepath: "03_generics/inference-control.ts",
      checklist: [
        linked("Тип состояния выводится как объединение литералов из массива states.", "состояния выводятся из переданного массива"),
        linked("Опечатка в initial — ошибка, а не новое состояние.", "начальное состояние проверяется по списку"),
        linked("defineConfig сохраняет литеральные типы значений.", "defineConfig сохраняет точные литеральные типы"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему <S extends string> сохраняет литералы, а <S> — нет?",
          answer:
            "Если ограничение параметра — примитивный тип, TypeScript считает, что важны точные значения, и не расширяет литералы. Без ограничения \"idle\" из изменяемого массива расширится до string.",
        },
        {
          question: "Что делает модификатор const у параметра типа?",
          answer:
            "Выводит тип аргумента так, как если бы на стороне вызова было написано as const: литералы не расширяются, массивы становятся readonly-кортежами. Модификатор появился в TypeScript 5.0.",
        },
        {
          question: "Как работал NoInfer до TypeScript 5.4?",
          answer:
            "Использовали трюки, откладывающие вывод: отдельный параметр типа <S, I extends S> или запись [S][S extends any ? 0 : never]. NoInfer делает то же явно: позиция не участвует в выводе, а только проверяется.",
        },
      ],
      articles: [
        {
          title: "const-параметры типов",
          url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters",
          urlTitle: "TypeScript 5.0 — const Type Parameters",
        },
        {
          title: "Утилита NoInfer",
          url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype",
          urlTitle: "TypeScript Handbook — NoInfer",
        },
      ],
    },
  ],
};
