import { NO_SUPPRESSION_CHECK, linked, type TypeScriptTaskGroup } from "../taskMeta";

export const ADVANCED_TYPES_GROUP: TypeScriptTaskGroup = {
  name: "Advanced Types",
  tasks: [
    {
      id: "typescript-49",
      title: "Пути к вложенным полям",
      desc: "Реализуйте Paths<T> — объединение всех путей к полям объекта через точку, PathValue<T, P> — тип значения по пути, и функцию get(obj, path), которая принимает только существующие пути и возвращает значение точного типа.",
      difficulty: "hard",
      tags: ["recursive-types", "template-literal", "infer"],
      filepath: "07_advanced_types/object-paths.ts",
      checklist: [
        linked("Paths<Settings> содержит все промежуточные и конечные пути.", "перечисляет все пути к полям через точку"),
        linked("PathValue разбирает путь рекурсивно через шаблон с infer.", "возвращает тип значения по пути"),
        linked("get с несуществующим путём — ошибка, результат имеет точный тип.", "возвращает значение точного типа", "принимает только существующие пути"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Есть ли предел глубины рекурсивных типов?",
          answer:
            "Да. Обычная рекурсия условных типов ограничена примерно 50 уровнями, хвостовая — 1000. При превышении появляется ошибка «Type instantiation is excessively deep». Для очень глубоких или циклических структур глубину ограничивают счётчиком-кортежем.",
        },
        {
          question: "Что будет с массивами в Paths?",
          answer:
            "Массив — объект, поэтому keyof добавит \"length\" и имена методов. На практике массивы обрабатывают отдельной веткой: T extends readonly (infer U)[] ? `${number}` | `${number}.${Paths<U>}` : ...",
        },
        {
          question: "Почему в реализации get допустимо утверждение типа?",
          answer:
            "Обход пути во время выполнения работает с unknown, и компилятор не может связать split(\".\") с типом PathValue. Типобезопасен публичный фасад, а утверждение изолировано в одной точке реализации. Так устроены lodash.get и Path в react-hook-form.",
        },
      ],
      articles: [
        {
          title: "Рекурсивные условные типы и шаблонные строки",
          url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types",
          urlTitle: "TypeScript 4.1 — Recursive Conditional Types",
        },
        {
          title: "Шаблонные литеральные типы",
          url: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
          urlTitle: "TypeScript Handbook — Template Literal Types",
        },
      ],
    },
    {
      id: "typescript-50",
      title: "Параметры маршрута из строки",
      desc: "Типизируйте buildUrl так, чтобы объект params требовал ровно те параметры, которые указаны в шаблоне маршрута через двоеточие: пропущенный или лишний параметр — ошибка типизации.",
      difficulty: "hard",
      tags: ["template-literal", "infer", "recursive-types"],
      filepath: "07_advanced_types/route-params.ts",
      checklist: [
        "ParamNames извлекает имена параметров из шаблона рекурсивно.",
        linked("Пропущенный параметр — ошибка, лишний — ошибка.", "пропущенный параметр — ошибка", "лишний параметр или значение не строка — ошибка"),
        linked("Маршрут без параметров принимает пустой объект.", "принимает ровно те параметры, что указаны в шаблоне"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Как TypeScript сопоставляет `${string}:${infer Param}/${infer Rest}`?",
          answer:
            "Слева направо, и каждая позиция до следующего литерала захватывает минимально возможную подстроку. ${string} доходит до первого двоеточия, Param — до первого слеша после него, а Rest забирает остаток.",
        },
        {
          question: "Как поддержать необязательный параметр /users/:id?",
          answer:
            "Отдельной веткой для имён, оканчивающихся на ?: Param extends `${infer Name}?` и построить объект, где такие ключи необязательны, например пересечением Record обязательных и Partial<Record> необязательных.",
        },
        {
          question: "Где это используется в реальных библиотеках?",
          answer:
            "React Router, Hono, Express 5 и tRPC выводят типы параметров маршрутов из строковых шаблонов тем же приёмом.",
        },
      ],
      articles: [
        {
          title: "Вывод из шаблонных строк через infer",
          url: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#inference-with-template-literals",
          urlTitle: "TypeScript Handbook — Inference with Template Literals",
        },
        {
          title: "Условные типы и infer",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы",
        },
      ],
    },
    {
      id: "typescript-51",
      title: "Операции с кортежами",
      desc: "Реализуйте типы First, Last, Length, Concat и Reverse для кортежей и типизируйте функцию concat, возвращающую кортеж точного вида.",
      difficulty: "hard",
      tags: ["tuple", "variadic-tuple", "infer", "recursion"],
      filepath: "07_advanced_types/tuple-operations.ts",
      checklist: [
        linked("First и Last используют infer в шаблоне кортежа, для пустого кортежа — never.", "возвращают крайние элементы кортежа", "для пустого кортежа дают never"),
        linked("Length возвращает числовой литерал.", "Length возвращает длину кортежа как литерал"),
        linked("Reverse реализован рекурсивно.", "Reverse разворачивает кортеж"),
        "concat возвращает [...A, ...B] без утверждений типа.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем T[\"length\"] у кортежа отличается от массива?",
          answer:
            "У кортежа длина — числовой литерал, например 3. У массива — number. На этом основаны вычисления на уровне типов: счётчики делают кортежами и читают их length.",
        },
        {
          question: "Что такое variadic tuple types?",
          answer:
            "Возможность раскрывать параметр-кортеж в любой позиции другого кортежа: [...A, ...B], [First, ...Rest]. Появилась в TypeScript 4.0 и позволяет типизировать concat, curry, pipe и обёртки функций.",
        },
        {
          question: "Зачем const у параметров concat?",
          answer:
            "Без него литерал [1, \"a\"] выведется как (string | number)[], и позиции потеряются. const-параметр выводит readonly-кортеж [1, \"a\"].",
        },
      ],
      articles: [
        {
          title: "Variadic Tuple Types",
          url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types",
          urlTitle: "TypeScript 4.0 — Variadic Tuple Types",
        },
        {
          title: "Кортежи",
          url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types",
          urlTitle: "TypeScript Handbook — Tuple Types",
        },
      ],
    },
    {
      id: "typescript-52",
      title: "Каррирование",
      desc: "Типизируйте функцию curry, которая превращает функцию от нескольких аргументов в цепочку функций от одного аргумента. Типы каждого шага и итоговый результат должны выводиться из исходной функции.",
      difficulty: "hard",
      tags: ["curry", "variadic-tuple", "recursion", "infer"],
      filepath: "07_advanced_types/curry.ts",
      checklist: [
        "Curried рекурсивно строит цепочку функций по кортежу аргументов.",
        linked("Тип каждого шага совпадает с типом соответствующего параметра.", "каждый шаг принимает один аргумент", "итог имеет тип результата исходной функции"),
        linked("Неверный тип аргумента на любом шаге — ошибка.", "неверный тип аргумента на любом шаге — ошибка"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему реализация curry всё равно содержит утверждение типа?",
          answer:
            "Во время выполнения функция собирает аргументы в массив переменной длины, и компилятор не может доказать, что результат совпадает с рекурсивным типом Curried. Типобезопасен фасад, а утверждение изолировано в реализации.",
        },
        {
          question: "Почему fn.length ненадёжен?",
          answer:
            "Он не учитывает rest-параметры и параметры со значениями по умолчанию: у (a, b = 1) => ... length равен 1. Для таких функций каррирование по length закончится раньше.",
        },
        {
          question: "Как типизировать каррирование с несколькими аргументами за шаг?",
          answer:
            "Принимать префикс кортежа: <P extends Partial<Args>>(...args: P) и вычислять оставшиеся аргументы через Drop<Args, P[\"length\"]>. Это заметно сложнее, поэтому чаще встречается пошаговый вариант.",
        },
      ],
      articles: [
        {
          title: "Variadic Tuple Types",
          url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types",
          urlTitle: "TypeScript 4.0 — Variadic Tuple Types",
        },
        {
          title: "Каррирование",
          url: "https://learn.javascript.ru/currying-partials",
          urlTitle: "Современный учебник JavaScript — каррирование",
        },
      ],
    },
    {
      id: "typescript-53",
      title: "Вариантность функций",
      desc: "Объясните, почему присваивание обработчика собак в обработчик животных не вызывает ошибку, хотя приводит к падению во время выполнения. Измените интерфейс так, чтобы TypeScript ловил эту ошибку, и добавьте к Box явную аннотацию вариантности.",
      difficulty: "hard",
      tags: ["variance", "covariance", "contravariance", "strictFunctionTypes"],
      filepath: "07_advanced_types/function-variance.ts",
      checklist: [
        linked("AnimalHandler описывает onEvent как свойство-функцию, и небезопасное присваивание — ошибка.", "обработчик собак нельзя использовать как обработчик животных"),
        "Box объявлен с аннотацией out T.",
        "Box<Dog> присваивается в Box<Animal>, обратное — ошибка.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что такое ковариантность и контравариантность?",
          answer:
            "Ковариантность: если Dog подтип Animal, то Box<Dog> подтип Box<Animal> — так ведут себя значения «на выходе». Контравариантность — обратное направление: (a: Animal) => void подтип (d: Dog) => void — так ведут себя параметры «на входе».",
        },
        {
          question: "Почему методы проверяются бивариантно даже со strictFunctionTypes?",
          answer:
            "Ради совместимости с огромным количеством существующего кода: например, Array<Dog> должен оставаться совместимым с Array<Animal>, хотя push принимает T. Флаг strictFunctionTypes ужесточает только типы, записанные как свойства-функции.",
        },
        {
          question: "Безопасна ли ковариантность массивов?",
          answer:
            "Нет. const animals: Animal[] = dogs; animals.push(cat) компилируется, и в массиве собак окажется кошка. TypeScript сознательно жертвует строгостью ради удобства; readonly-массивы этой проблемы лишены.",
        },
        {
          question: "Зачем аннотации in и out?",
          answer:
            "Они документируют намерение и проверяются: out T запрещает использовать T в позиции входа. Кроме того, компилятору не нужно вычислять вариантность структурно, что ускоряет проверку сложных рекурсивных типов.",
        },
      ],
      articles: [
        {
          title: "Аннотации вариантности in и out",
          url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations",
          urlTitle: "TypeScript Handbook — Variance Annotations",
        },
        {
          title: "Флаг strictFunctionTypes",
          url: "https://www.typescriptlang.org/tsconfig/#strictFunctionTypes",
          urlTitle: "TSConfig Reference — strictFunctionTypes",
        },
      ],
    },
    {
      id: "typescript-54",
      title: "Объединение в пересечение",
      desc: "Функция combine принимает несколько объектов-плагинов и возвращает объект со всеми их методами. Типизируйте её так, чтобы тип результата был пересечением типов всех переданных плагинов.",
      difficulty: "hard",
      tags: ["UnionToIntersection", "contravariance", "infer"],
      filepath: "07_advanced_types/union-to-intersection.ts",
      checklist: [
        "UnionToIntersection реализован через вывод из контравариантной позиции.",
        linked("combine возвращает пересечение типов всех плагинов.", "результат содержит методы всех плагинов с их типами"),
        linked("Методы каждого плагина доступны с точными сигнатурами.", "методы вызываются только с аргументами своего типа"),
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему вывод из параметра функции даёт пересечение?",
          answer:
            "Параметр — контравариантная позиция. Если одна функция должна подходить сразу под (a: A) => void и (b: B) => void, её параметр обязан принимать и A, и B, то есть A & B. Поэтому несколько кандидатов infer в такой позиции объединяются пересечением.",
        },
        {
          question: "Что вернёт UnionToIntersection<string | number>?",
          answer:
            "never, потому что string & number — пустой тип. Приём полезен для объектов и функций, а не для примитивов.",
        },
        {
          question: "Где применяется этот тип?",
          answer:
            "В объединении плагинов и middleware, слиянии слайсов стора, построении перегрузок из объединения функций, а также как шаг в UnionToTuple.",
        },
      ],
      articles: [
        {
          title: "Вывод типов внутри условных типов",
          url: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types",
          urlTitle: "TypeScript Handbook — infer",
        },
        {
          title: "Совместимость функций и параметры",
          url: "https://www.typescriptlang.org/docs/handbook/type-compatibility.html#comparing-two-functions",
          urlTitle: "TypeScript Handbook — Comparing two functions",
        },
      ],
    },
  ],
};
