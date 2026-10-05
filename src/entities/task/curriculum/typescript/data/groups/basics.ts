import { NO_SUPPRESSION_CHECK, type TypeScriptTaskGroup } from "../taskMeta";

export const BASICS_GROUP: TypeScriptTaskGroup = {
  name: "Основы TypeScript",
  tasks: [
    {
      id: "typescript-1",
      title: "Первые аннотации",
      desc: "Добавьте типы к переменным, чтобы код был безопасным.",
      difficulty: "easy",
      tags: ["string", "number", "boolean", "array"],
      filepath: "01_basics/first-annotations.ts",
      checklist: [
        "Переменные имеют типы string, number и boolean.",
        "scores принимает только числовые элементы; userName не принимает число.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Нужна ли аннотация, если переменная уже инициализирована?",
          answer:
            "Обычно TypeScript выведет тип сам. Явные аннотации полезны на границах: параметры и результат функций, публичные модели. Здесь они нужны для практики синтаксиса.",
        },
        {
          question: "Какой тип получат const age = 30 и let age = 30?",
          answer:
            "const получит литеральный тип 30, потому что значение не может измениться. let получит расширенный тип number, потому что переменной можно присвоить другое число.",
        },
        {
          question: "Чем number[] отличается от Array<number>?",
          answer:
            "Ничем, это две записи одного типа. Для неизменяемого массива есть readonly number[] или ReadonlyArray<number>: у них нет push, splice и других изменяющих методов.",
        },
      ],
      articles: [
        {
          title: "Аннотации примитивных типов: string, number, boolean",
          url: "https://metanit.com/web/typescript/2.5.php",
          urlTitle: "METANIT — типы данных",
        },
        {
          title: "Массивы чисел и запись number[]",
          url: "https://metanit.com/web/typescript/2.9.php",
          urlTitle: "METANIT — массивы",
        },
      ],
    },
    {
      id: "typescript-25",
      title: "Сигнатуры функций",
      desc: "Типизируйте функции с необязательным параметром, значением по умолчанию, остаточными параметрами и функцией-колбэком.",
      difficulty: "easy",
      tags: ["function", "optional", "rest", "callback", "void"],
      filepath: "01_basics/function-signatures.ts",
      checklist: [
        "greeting необязателен и по умолчанию равен «Привет».",
        "sum принимает любое количество чисел через rest-параметр.",
        "Колбэк applyToAll описан типом функции, logMessage возвращает void.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем параметр greeting?: string отличается от greeting = \"Привет\"?",
          answer:
            "Оба делают аргумент необязательным. В первом случае внутри функции тип string | undefined, во втором — string, потому что undefined заменяется значением по умолчанию. Одновременно ? и значение по умолчанию указать нельзя.",
        },
        {
          question: "Почему функцию, возвращающую число, можно передать туда, где ожидается () => void?",
          answer:
            "void в типе колбэка означает «результат будет проигнорирован», а не «функция обязана вернуть undefined». Поэтому arr.forEach((x) => list.push(x)) компилируется, хотя push возвращает число.",
        },
        {
          question: "Можно ли передать колбэк с меньшим числом параметров, чем в его типе?",
          answer:
            "Да. Функция, которая игнорирует часть аргументов, безопасна. Поэтому в map можно передать (value) => ..., хотя map вызывает колбэк с value, index и array.",
        },
      ],
      articles: [
        {
          title: "Типы параметров и результата функции",
          url: "https://scriptdev.ru/guide/020/",
          urlTitle: "ScriptDev — типизация функций",
        },
        {
          title: "Необязательные и остаточные параметры, тип функции",
          url: "https://www.typescriptlang.org/docs/handbook/2/functions.html",
          urlTitle: "TypeScript Handbook — More on Functions",
        },
      ],
    },
    {
      id: "typescript-2",
      title: "Составные значения",
      desc: "Опишите тип для пары [имя, возраст], где количество элементов, их порядок и типы строго фиксированы.",
      difficulty: "easy",
      tags: ["tuple", "void"],
      filepath: "01_basics/tuple-values.ts",
      checklist: [
        "Пара описана кортежем [string, number].",
        "Переставленные элементы и лишние значения не подходят под тип Entry.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем кортеж отличается от массива (string | number)[]?",
          answer:
            "Массив допускает любую длину и любой порядок этих значений. Кортеж описывает конкретные позиции и длину при присваивании.",
        },
        {
          question: "Зачем метки в записи [name: string, age: number]?",
          answer:
            "Метки не влияют на проверку типов. Они документируют позиции и видны в подсказках редактора, особенно когда кортеж используется как список параметров функции.",
        },
        {
          question: "Почему useState в React возвращает кортеж, а не объект?",
          answer:
            "Элементы кортежа при деструктуризации можно назвать как угодно: const [count, setCount] = useState(0). С объектом пришлось бы переименовывать поля при каждом вызове.",
        },
        {
          question: "Защищает ли кортеж от push?",
          answer:
            "Нет: у обычного кортежа есть методы массива, и push не вызывает ошибку типов. Чтобы запретить изменение, нужен readonly [string, number].",
        },
      ],
      articles: [
        {
          title: "Кортеж: тип каждой позиции и фиксированная структура",
          url: "https://metanit.com/web/typescript/2.10.php",
          urlTitle: "METANIT — кортежи",
        },
        {
          title: "Типы параметров и результата функции",
          url: "https://scriptdev.ru/guide/020/",
          urlTitle: "ScriptDev — типизация функций",
        },
      ],
    },
    {
      id: "typescript-3",
      title: "Опциональные и неизменяемые поля",
      desc: "Поле middleName может отсутствовать у пользователя. Поле id не должно изменяться после создания объекта.",
      difficulty: "easy",
      tags: ["interface", "readonly", "optional"],
      filepath: "01_basics/optional-readonly-fields.ts",
      checklist: [
        "middleName можно пропустить при создании Person.",
        "Присваивание нового id вызывает ошибку типов.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Замораживает ли readonly объект в JavaScript?",
          answer:
            "Нет. readonly ограничивает операции при проверке типов. Для ограничения изменений во время выполнения нужен отдельный механизм, например Object.freeze.",
        },
        {
          question: "Чем middleName?: string отличается от middleName: string | undefined?",
          answer:
            "Во втором случае ключ обязателен: объект без middleName не подойдёт, нужно явно написать middleName: undefined. Опциональное поле можно просто не указывать.",
        },
        {
          question: "Чем readonly отличается от const?",
          answer:
            "const запрещает переприсваивать переменную, но не мешает менять поля объекта. readonly запрещает менять конкретное свойство.",
        },
      ],
      articles: [
        {
          title: "Необязательные свойства интерфейса",
          url: "https://metanit.com/web/typescript/3.3.php",
          urlTitle: "METANIT — интерфейсы",
        },
        {
          title: "Ограничения readonly и отличие от const",
          url: "https://scriptdev.ru/guide/027/",
          urlTitle: "ScriptDev — модификатор readonly",
        },
      ],
    },
    {
      id: "typescript-26",
      title: "any, unknown и never",
      desc: "Сделайте разбор JSON безопасным и объясните компилятору, что функция fail никогда не возвращает управление.",
      difficulty: "easy",
      tags: ["any", "unknown", "never"],
      filepath: "01_basics/any-unknown-never.ts",
      checklist: [
        "parseJson возвращает unknown, а не any.",
        "Поле name используется только после проверки структуры значения.",
        "fail объявлена с возвращаемым типом never так, что после её вызова функция компилируется без return.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем any отличается от unknown?",
          answer:
            "any отключает проверку: с ним разрешена любая операция, и он «заражает» всё, к чему прикасается. unknown означает «тип неизвестен»: присвоить в него можно что угодно, но использовать значение можно только после сужения.",
        },
        {
          question: "Где тип never появляется сам, без явного объявления?",
          answer:
            "В ветке, где все варианты объединения уже исключены; в пересечении несовместимых типов, например string & number; как результат функции, которая всегда бросает исключение.",
        },
        {
          question: "Почему стрелочная функция fail с типом never не помогает анализу потока управления?",
          answer:
            "Вызов считается «невозвратным», только если имя функции объявлено с явным типом: function fail(...): never или const fail: (m: string) => never. Тип, выведенный из инициализатора стрелки, для этого не подходит.",
        },
        {
          question: "Почему JSON.parse возвращает any, а не unknown?",
          answer:
            "Так исторически объявлено в стандартной библиотеке: unknown появился только в TypeScript 3.0. Безопасный вариант — сразу сохранить результат в переменную типа unknown или обернуть вызов.",
        },
      ],
      articles: [
        {
          title: "unknown и never в системе типов",
          url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown",
          urlTitle: "TypeScript Handbook — unknown и never",
        },
        {
          title: "Проверка значения перед использованием",
          url: "https://scriptdev.ru/guide/036/",
          urlTitle: "ScriptDev — защитники типа",
        },
      ],
    },
    {
      id: "typescript-27",
      title: "null и undefined",
      desc: "В strict-режиме поиск может не найти пользователя, а у пользователя может не быть адреса или ника. Исправьте функции без оператора «!» и приведений типов.",
      difficulty: "easy",
      tags: ["strictNullChecks", "optional-chaining", "nullish"],
      filepath: "01_basics/null-undefined.ts",
      checklist: [
        "Отсутствующий пользователь, адрес и ник обрабатываются значениями по умолчанию.",
        "Не используются оператор ! и утверждения типа as.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему non-null оператор ! опасен?",
          answer:
            "Он ничего не проверяет во время выполнения, а только убеждает компилятор, что значения null и undefined нет. Если это неправда, ошибка просто переедет из компиляции в рантайм.",
        },
        {
          question: "Чем ?? отличается от ||?",
          answer:
            "|| подставляет значение по умолчанию для любого ложного значения, включая 0, пустую строку и false. ?? срабатывает только для null и undefined.",
        },
        {
          question: "Что изменится, если выключить strictNullChecks?",
          answer:
            "null и undefined станут допустимыми значениями любого типа, и find(...).name будет компилироваться. Ошибки «Cannot read properties of undefined» перестанут ловиться на этапе проверки типов.",
        },
      ],
      articles: [
        {
          title: "Проверки на null и undefined",
          url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined",
          urlTitle: "TypeScript Handbook — null и undefined",
        },
        {
          title: "Оператор нулевого слияния ??",
          url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing",
          urlTitle: "MDN на русском — оператор нулевого слияния",
        },
      ],
    },
    {
      id: "typescript-4",
      title: "Роль пользователя",
      desc: "Улучшите типизацию представленного кода. Поле role должно принимать только допустимые значения.",
      difficulty: "easy",
      tags: ["extends", "union", "literal"],
      filepath: "01_basics/user-role.ts",
      checklist: [
        "UserWithRole переиспользует поля User.",
        "role принимает только admin или user.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему тип string слишком широк для роли?",
          answer:
            "Он разрешает любую строку, включая опечатки. Литеральное объединение отражает конечный набор допустимых ролей.",
        },
        {
          question: "Чем interface extends отличается от пересечения User & { role: Role }?",
          answer:
            "extends сразу проверяет совместимость переопределяемых полей и сообщает об ошибке в объявлении. Пересечение несовместимых полей молча даёт never, и ошибка всплывёт позже, в месте использования.",
        },
        {
          question: "Почему const role = \"admin\" подходит к Role, а let role = \"admin\" — нет?",
          answer:
            "У const выводится литеральный тип \"admin\". У let тип расширяется до string, потому что переменную можно переприсвоить, а string не совместим с \"admin\" | \"user\".",
        },
      ],
      articles: [
        {
          title: "Расширение интерфейсов через extends",
          url: "https://metanit.com/web/typescript/3.3.php",
          urlTitle: "METANIT — интерфейсы",
        },
        {
          title: "Строковые литералы для конечного набора ролей",
          url: "https://scriptdev.ru/guide/018/",
          urlTitle: "ScriptDev — литеральные типы",
        },
      ],
    },
    {
      id: "typescript-28",
      title: "type или interface",
      desc: "Опишите модель фигуры, расширьте интерфейс «библиотеки», не меняя его исходное объявление, и опишите фигуру с цветом. Для каждой части выберите type или interface.",
      difficulty: "easy",
      tags: ["type", "interface", "declaration-merging", "union"],
      filepath: "01_basics/type-vs-interface.ts",
      checklist: [
        "Shape — объединение через type: interface не умеет описывать объединения.",
        "Theme расширена повторным объявлением интерфейса (declaration merging).",
        "ColoredShape построен из Shape без дублирования полей.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Какие различия между type и interface спрашивают чаще всего?",
          answer:
            "type умеет описывать объединения, кортежи, примитивы, mapped и conditional types. interface умеет слияние объявлений и наследование через extends с ранней проверкой конфликтов. Для обычных объектных моделей подходят оба.",
        },
        {
          question: "Может ли класс реализовать type, а интерфейс — расширить type?",
          answer:
            "Да, если type описывает объектную форму. Если это объединение, implements и extends невозможны: неясно, какой вариант реализовывать.",
        },
        {
          question: "Когда слияние объявлений опасно?",
          answer:
            "Когда имя случайно совпадает с уже существующим глобальным интерфейсом, например Event или Window в скрипте без import/export. Поля молча добавятся в чужой тип.",
        },
      ],
      articles: [
        {
          title: "Различия между type и interface",
          url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces",
          urlTitle: "TypeScript Handbook — type aliases и interfaces",
        },
        {
          title: "Слияние объявлений интерфейсов",
          url: "https://www.typescriptlang.org/docs/handbook/declaration-merging.html",
          urlTitle: "TypeScript Handbook — Declaration Merging",
        },
      ],
    },
    {
      id: "typescript-29",
      title: "Структурная типизация",
      desc: "Разберитесь, почему переменная с лишним полем проходит проверку, а такой же литерал — нет. Затем сделайте так, чтобы температура в Фаренгейтах не принималась вместо Цельсия.",
      difficulty: "easy",
      tags: ["structural-typing", "excess-property-check", "discriminant"],
      filepath: "01_basics/structural-typing.ts",
      checklist: [
        "printPoint принимает и переменные, и литералы точек с дополнительными полями, не ослабляя типы x и y.",
        "Celsius и Fahrenheit структурно различаются, и saveCelsius не принимает Fahrenheit.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что такое структурная типизация?",
          answer:
            "Совместимость определяется формой значения, а не именем типа. Объект подходит к Point, если у него есть x и y нужных типов, даже если он объявлен как совсем другой интерфейс.",
        },
        {
          question: "Когда срабатывает проверка лишних свойств?",
          answer:
            "Только для «свежего» объектного литерала, который сразу присваивается в переменную или параметр с известным типом. Лишнее поле в литерале чаще всего означает опечатку, поэтому TypeScript сообщает об ошибке.",
        },
        {
          question: "Почему пустой интерфейс {} принимает почти любое значение?",
          answer:
            "У {} нет обязательных полей, поэтому ему структурно соответствует всё, кроме null и undefined, включая строки и числа.",
        },
      ],
      articles: [
        {
          title: "Совместимость типов по структуре",
          url: "https://www.typescriptlang.org/docs/handbook/type-compatibility.html",
          urlTitle: "TypeScript Handbook — Type Compatibility",
        },
        {
          title: "Проверка лишних свойств объектного литерала",
          url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks",
          urlTitle: "TypeScript Handbook — Excess Property Checks",
        },
      ],
    },
    {
      id: "typescript-30",
      title: "Литералы и as const",
      desc: "TypeScript расширяет значения до string, и вызовы request не компилируются. Исправьте объявления, не меняя сигнатуру request и не приводя значения к HttpMethod. Тип Route выведите из массива маршрутов.",
      difficulty: "easy",
      tags: ["literal", "widening", "as const", "typeof"],
      filepath: "01_basics/literal-widening.ts",
      checklist: [
        "Оба вызова request компилируются без as HttpMethod.",
        "Route выводится из массива routes и равен \"/home\" | \"/about\".",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что делает as const?",
          answer:
            "Запрещает расширение типов: строки и числа остаются литералами, массивы становятся readonly-кортежами, все поля объекта — readonly. Действует рекурсивно на весь литерал.",
        },
        {
          question: "Чем as const отличается от as HttpMethod?",
          answer:
            "as const только сохраняет точный тип значения. as HttpMethod — утверждение: компилятор поверит, даже если значение \"PATCH\" не входит в HttpMethod.",
        },
        {
          question: "Почему поле объекта расширяется даже в const-объекте?",
          answer:
            "const защищает только привязку переменной. Поле options.method можно переприсвоить, поэтому его тип расширяется до string.",
        },
        {
          question: "Чем as const отличается от Object.freeze?",
          answer:
            "as const действует только при проверке типов и не меняет объект. Object.freeze работает во время выполнения, но только на верхнем уровне.",
        },
      ],
      articles: [
        {
          title: "Литеральные типы и вывод литералов",
          url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-inference",
          urlTitle: "TypeScript Handbook — Literal Inference",
        },
        {
          title: "Строковые литеральные типы",
          url: "https://scriptdev.ru/guide/018/",
          urlTitle: "ScriptDev — литеральные типы",
        },
      ],
    },
    {
      id: "typescript-6",
      title: "Статусы заказа",
      desc: "Опишите набор допустимых статусов заказа так, чтобы его можно было использовать и как тип на этапе компиляции, и как объект со значениями во время выполнения программы. changeStatus должна принимать и значение из этого объекта, и строковый литерал, пришедший из API.",
      difficulty: "easy",
      tags: ["as const", "enum", "keyof", "typeof"],
      filepath: "01_basics/order-status.ts",
      checklist: [
        "Статусы описаны один раз и доступны как объект во время выполнения.",
        "Тип OrderStatus выводится из объекта, а не дублируется вручную.",
        "changeStatus принимает и OrderStatus.Pending, и строку \"shipped\", но не \"lost\".",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему здесь не подходит строковый enum?",
          answer:
            "Строковый enum номинален: параметр типа OrderStatus не примет литерал \"shipped\", даже если значение совпадает. Данные из API пришлось бы приводить или сопоставлять вручную.",
        },
        {
          question: "Какие ещё недостатки у enum?",
          answer:
            "Это не стираемый синтаксис: enum генерирует JavaScript-код и несовместим с флагом erasableSyntaxOnly и «вырезанием типов» в Node.js. У числовых enum есть обратное отображение, а const enum плохо работает с isolatedModules.",
        },
        {
          question: "Как прочитать тип (typeof OrderStatus)[keyof typeof OrderStatus]?",
          answer:
            "typeof OrderStatus — тип объекта, keyof — объединение его ключей, а индексный доступ по этому объединению даёт объединение всех значений: \"pending\" | \"shipped\" | ...",
        },
        {
          question: "Когда enum всё же оправдан?",
          answer:
            "Когда в кодовой базе уже принято их использовать, и номинальность — желаемое свойство: значение можно получить только через сам enum.",
        },
      ],
      articles: [
        {
          title: "Перечисления и объекты с as const",
          url: "https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums",
          urlTitle: "TypeScript Handbook — Objects vs Enums",
        },
        {
          title: "Перечисления и строковые значения статусов",
          url: "https://metanit.com/web/typescript/2.11.php",
          urlTitle: "METANIT — enum",
        },
      ],
    },
  ],
};
