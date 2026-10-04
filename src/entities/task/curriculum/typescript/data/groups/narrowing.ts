import { NO_SUPPRESSION_CHECK, type TypeScriptTaskGroup } from "../task-meta";

export const NARROWING_GROUP: TypeScriptTaskGroup = {
  name: "Type Narrowing",
  tasks: [
    {
      id: "typescript-5",
      title: "Что за тип у переменной",
      desc: "Функция должна корректно обрабатывать оба варианта входных данных, не вызывая ошибок типизации внутри своего тела.",
      difficulty: "easy",
      tags: ["typeof", "narrowing", "union"],
      filepath: "02_narrowing/typeof-narrowing.ts",
      checklist: [
        "Обрабатываются строковый и числовой аргументы.",
        "Методы вызываются только после сужения типа.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему во второй ветке доступен toFixed?",
          answer:
            "Строковый вариант уже завершил выполнение через return. Анализ потока управления оставляет в этой ветке только number.",
        },
        {
          question: "Какие значения может вернуть typeof и какая с ним ловушка?",
          answer:
            "\"string\", \"number\", \"bigint\", \"boolean\", \"symbol\", \"undefined\", \"object\" и \"function\". Ловушка: typeof null === \"object\", поэтому проверка на объект без value !== null пропускает null.",
        },
        {
          question: "Сохраняется ли сужение внутри колбэка?",
          answer:
            "Для const-переменных и параметров, которые не переприсваиваются, — да. Для let раньше нет, потому что колбэк мог выполниться после изменения; с TypeScript 5.4 сужение сохраняется, если после колбэка переменная больше не меняется.",
        },
      ],
      articles: [
        {
          title: "Сужение типа через typeof и анализ веток",
          url: "https://scriptdev.ru/guide/036/",
          urlTitle: "ScriptDev — защитники типа",
        },
        {
          title: "Объединение string | number",
          url: "https://metanit.com/web/typescript/2.13.php",
          urlTitle: "METANIT — объединения union",
        },
      ],
    },
    {
      id: "typescript-31",
      title: "Сужение через in и instanceof",
      desc: "Типизируйте функции так, чтобы внутри каждой ветки были доступны только допустимые для неё свойства и методы: рыба плавает, птица летает, дата форматируется независимо от того, пришла она объектом Date или ISO-строкой.",
      difficulty: "easy",
      tags: ["in", "instanceof", "narrowing"],
      filepath: "02_narrowing/in-instanceof.ts",
      checklist: [
        "move различает Fish и Bird через оператор in.",
        "formatDate различает Date и string через instanceof.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему нельзя написать animal instanceof Fish?",
          answer:
            "Fish — интерфейс, он существует только при проверке типов и стирается при компиляции. instanceof проверяет цепочку прототипов, поэтому работает только с классами и функциями-конструкторами.",
        },
        {
          question: "Как сужает in, если поле необязательное?",
          answer:
            "Если swim? есть и в Bird как необязательное поле, \"swim\" in animal не отбросит Bird: в ветке true останутся оба типа. Поэтому для надёжного разделения лучше обязательное поле или дискриминатор.",
        },
        {
          question: "Чем опасно сужение по истинности: if (value)?",
          answer:
            "Оно отбрасывает не только null и undefined, но и 0, пустую строку, false и NaN. Для чисел и строк это часто ошибка логики.",
        },
      ],
      articles: [
        {
          title: "Сужение через in, instanceof и истинность",
          url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing",
          urlTitle: "TypeScript Handbook — Narrowing",
        },
        {
          title: "Защитники типа",
          url: "https://scriptdev.ru/guide/036/",
          urlTitle: "ScriptDev — защитники типа",
        },
      ],
    },
    {
      id: "typescript-18",
      title: "Разные формы события",
      desc: "Опишите типы для событий разных видов так, чтобы TypeScript мог сужать тип внутри обработчика в зависимости от вида события.",
      difficulty: "easy",
      tags: ["discriminated-union", "narrowing"],
      filepath: "02_narrowing/discriminated-events.ts",
      checklist: [
        "click требует координаты, keypress требует key.",
        "В обработчике поля доступны после проверки type.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему поле type должно быть литеральным?",
          answer:
            "Так TypeScript связывает значение дискриминатора с конкретным участником объединения и его набором полей.",
        },
        {
          question: "Почему не один интерфейс с необязательными x, y и key?",
          answer:
            "Такой тип разрешает бессмысленные сочетания: click без координат или с key. Каждое обращение к полю потребует проверки на undefined. Дискриминируемое объединение описывает только допустимые формы.",
        },
        {
          question: "Работает ли сужение после деструктуризации const { type, ...rest } = event?",
          answer:
            "С TypeScript 4.6 — да, если поля деструктурированы в const из параметра или константы: проверка type сужает и связанные переменные. С let или после переприсваивания связь теряется.",
        },
      ],
      articles: [
        {
          title: "Связь поля type с формой события",
          url: "https://scriptdev.ru/guide/033/",
          urlTitle: "ScriptDev — дискриминантное объединение",
        },
        {
          title: "Как проверки сужают объектный тип в ветке",
          url: "https://scriptdev.ru/guide/036/",
          urlTitle: "ScriptDev — защитники типа",
        },
      ],
    },
    {
      id: "typescript-32",
      title: "Проверка полноты через never",
      desc: "Сделайте так, чтобы при добавлении нового вида фигуры TypeScript сразу указывал на getArea, если новый вид в ней не обработан. Затем добавьте треугольник и обработайте его.",
      difficulty: "medium",
      tags: ["never", "exhaustiveness", "switch", "discriminated-union"],
      filepath: "02_narrowing/exhaustive-never.ts",
      checklist: [
        "В ветке default значение передаётся в функцию с параметром never.",
        "Добавлен вариант triangle, и его площадь вычисляется.",
        "Удаление любого case приводит к ошибке компиляции в getArea.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему в ветке default тип значения — never?",
          answer:
            "Каждый case исключает один вариант объединения. Когда обработаны все, не остаётся ни одного возможного типа, то есть never. Если вариант пропущен, в default останется он, и передача в параметр never станет ошибкой.",
        },
        {
          question: "Зачем assertNever бросает исключение, если тип и так проверен?",
          answer:
            "Данные во время выполнения могут не соответствовать типам: старая версия API прислала новый kind, а код ещё не обновлён. Исключение с понятным сообщением лучше молчаливого undefined.",
        },
        {
          question: "Какие ещё способы проверки полноты существуют?",
          answer:
            "const check: never = shape; выражение shape satisfies never; объект-обработчик типа Record<Shape[\"kind\"], ...>, который требует ключ для каждого варианта; правило ESLint switch-exhaustiveness-check.",
        },
      ],
      articles: [
        {
          title: "Проверка полноты и тип never",
          url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking",
          urlTitle: "TypeScript Handbook — Exhaustiveness checking",
        },
        {
          title: "Дискриминантное объединение",
          url: "https://scriptdev.ru/guide/033/",
          urlTitle: "ScriptDev — дискриминантное объединение",
        },
      ],
    },
    {
      id: "typescript-33",
      title: "Пользовательский type guard",
      desc: "Напишите функцию-предикат isUser, которая проверяет произвольное значение и сообщает TypeScript его тип. Затем отфильтруйте список людей так, чтобы результат имел тип Admin[].",
      difficulty: "medium",
      tags: ["type-predicate", "unknown", "filter"],
      filepath: "02_narrowing/type-predicates.ts",
      checklist: [
        "isUser принимает unknown и возвращает value is User.",
        "Проверяются наличие и типы всех полей User.",
        "admins имеет тип Admin[] без приведения типов.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что будет, если предикат «соврёт»?",
          answer:
            "TypeScript поверит: тело предиката не проверяется на соответствие объявленному типу. Если isUser вернёт true для объекта без name, ошибка появится во время выполнения. Предикат — такая же ответственность, как утверждение as.",
        },
        {
          question: "Чем value is User отличается от возвращаемого типа boolean?",
          answer:
            "boolean ничего не сообщает компилятору, и после if (isUser(x)) тип x не изменится. Предикат связывает true-результат с сужением аргумента до User, а false — с исключением User.",
        },
        {
          question: "Что изменилось в TypeScript 5.5?",
          answer:
            "Появились выведенные предикаты: стрелка (x) => x !== null автоматически получает тип x is NonNullable<...>, поэтому list.filter((x) => x !== null) сразу даёт массив без null. Для сложных проверок явный предикат по-прежнему нужен.",
        },
      ],
      articles: [
        {
          title: "Предикаты типа value is Type",
          url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
          urlTitle: "TypeScript Handbook — Type Predicates",
        },
        {
          title: "Защитники типа",
          url: "https://scriptdev.ru/guide/036/",
          urlTitle: "ScriptDev — защитники типа",
        },
      ],
    },
    {
      id: "typescript-34",
      title: "Функции-утверждения",
      desc: "Напишите функции assert и assertIsString, после вызова которых TypeScript сужает тип значения в оставшейся части функции без обёртки if.",
      difficulty: "medium",
      tags: ["asserts", "narrowing", "control-flow"],
      filepath: "02_narrowing/assertion-functions.ts",
      checklist: [
        "assert объявлена с типом asserts condition, assertIsString — с asserts value is string.",
        "Функции объявлены так, чтобы анализ потока управления учитывал вызов.",
        "getApiUrl и shout компилируются без дополнительных проверок и приведений.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем asserts value is T отличается от value is T?",
          answer:
            "Предикат возвращает boolean и сужает тип внутри if. Функция-утверждение ничего не возвращает: она либо бросает исключение, либо сужает тип во всём последующем коде.",
        },
        {
          question: "Почему стрелочная функция-утверждение без аннотации переменной вызывает ошибку?",
          answer:
            "TS2775: «Assertions require every name in the call target to be declared with an explicit type annotation». Нужна function-декларация или const с явным типом: const assert: (c: unknown, m: string) => asserts c = ...",
        },
        {
          question: "Где встречаются функции-утверждения?",
          answer:
            "assert из node:assert, invariant в React и библиотеках, проверки окружения при старте приложения, хелперы тестов, а также валидаторы вроде zod с методом parse.",
        },
      ],
      articles: [
        {
          title: "Функции-утверждения asserts",
          url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions",
          urlTitle: "TypeScript 3.7 — Assertion Functions",
        },
        {
          title: "Анализ потока управления",
          url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#control-flow-analysis",
          urlTitle: "TypeScript Handbook — Control flow analysis",
        },
      ],
    },
  ],
};
