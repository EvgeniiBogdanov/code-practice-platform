import { NO_SUPPRESSION_CHECK, type TypeScriptTaskGroup } from "../taskMeta";

export const APPLICATION_PATTERNS_GROUP: TypeScriptTaskGroup = {
  name: "Практические паттерны",
  tasks: [
    {
      id: "typescript-19",
      title: "Получение данных",
      desc: "Напишите и типизируйте функцию, выполняющую запрос за данными по переданному URL. Ответ сервера — внешние данные: убедитесь, что он соответствует ожидаемой структуре. После получения данных выведите их в консоль в формате: \"ID: id, Email: email\".",
      difficulty: "medium",
      tags: ["Promise", "async", "unknown", "type-guard"],
      filepath: "06_application_patterns/fetch-comments.ts",
      checklist: [
        "Функция возвращает Promise<ApiComment[]>.",
        "Проверяется response.ok.",
        "Результат response.json() сохраняется как unknown и проверяется type guard'ом перед возвратом.",
        "Каждый комментарий выводится в формате ID: id, Email: email.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему недостаточно написать return response.json() с типом Promise<ApiComment[]>?",
          answer:
            "response.json() возвращает Promise<any>, и any молча превращается в ApiComment[]. Компилятор ничего не проверил: если сервер пришлёт другую структуру, ошибка проявится далеко от места запроса.",
        },
        {
          question: "Чем generic-обёртка fetchJson<T>(url): Promise<T> опасна?",
          answer:
            "Это замаскированное утверждение типа: вызывающий код сам выбирает T, а проверки нет. Безопаснее принимать функцию-валидатор (value: unknown) => value is T или схему.",
        },
        {
          question: "Как проверяют ответы API в реальных проектах?",
          answer:
            "Библиотеками схем: zod, valibot, io-ts. Схема описывается один раз, из неё выводится тип через z.infer, а parse проверяет данные во время выполнения.",
        },
      ],
      articles: [
        {
          title: "HTTP-статус и чтение JSON из ответа",
          url: "https://learn.javascript.ru/fetch",
          urlTitle: "Современный учебник JavaScript — Fetch",
        },
        {
          title: "Ожидание промиса и ошибки асинхронной функции",
          url: "https://learn.javascript.ru/async-await",
          urlTitle: "Современный учебник JavaScript — async/await",
        },
        {
          title: "Проверка структуры внешних данных",
          url: "https://scriptdev.ru/guide/036/",
          urlTitle: "ScriptDev — защитники типа",
        },
      ],
    },
    {
      id: "typescript-20",
      title: "Иерархия сотрудников",
      desc: "Создайте структуру классов для сотрудников компании. У каждого сотрудника есть имя и зарплата (доступна только внутри класса и его наследников). Метод расчёта премии должен быть обязательным для реализации в каждом конкретном виде сотрудника, но сам базовый класс нельзя создавать напрямую.",
      difficulty: "medium",
      tags: ["abstract", "protected", "class"],
      filepath: "06_application_patterns/employee-hierarchy.ts",
      checklist: [
        "Базовый класс абстрактный, salary защищено.",
        "Manager рассчитывает премию в размере 20% зарплаты.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Чем protected отличается от private?",
          answer:
            "protected доступен классу и наследникам. private доступен только объявившему его классу; оба модификатора TypeScript задают ограничения проверки типов.",
        },
        {
          question: "Чем abstract class отличается от interface?",
          answer:
            "Интерфейс — только контракт, он исчезает при компиляции. Абстрактный класс существует во время выполнения, может содержать реализацию, поля и конструктор, но наследоваться можно только от одного класса.",
        },
        {
          question: "Чем private отличается от #salary?",
          answer:
            "private проверяется только компилятором: в JavaScript поле доступно, например через obj[\"salary\"]. Поле #salary — настоящее приватное поле JavaScript, недоступное снаружи и во время выполнения.",
        },
      ],
      articles: [
        {
          title: "Обязательная реализация метода в наследнике",
          url: "https://metanit.com/web/typescript/3.12.php",
          urlTitle: "METANIT — абстрактные классы и методы",
        },
        {
          title: "Доступ к зарплате через protected",
          url: "https://metanit.com/web/typescript/3.4.php",
          urlTitle: "METANIT — модификаторы доступа",
        },
      ],
    },
    {
      id: "typescript-46",
      title: "Обобщённый репозиторий",
      desc: "Опишите контракт хранилища Repository и реализуйте его обобщённым классом InMemoryRepository, который работает с любыми сущностями. Данные хранилища должны быть недоступны снаружи и во время выполнения, а create — присваивать сущности id.",
      difficulty: "medium",
      tags: ["class", "generics", "implements", "private-fields"],
      filepath: "06_application_patterns/generic-repository.ts",
      checklist: [
        "Интерфейс Repository<T> описывает create, findById и findAll.",
        "InMemoryRepository<T> реализует его через implements.",
        "Хранилище и счётчик — приватные поля JavaScript (#).",
        "create возвращает сущность с id без утверждений типа.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Что проверяет implements?",
          answer:
            "Только то, что класс совместим с интерфейсом. implements не меняет тип класса и не задаёт контекстные типы параметрам методов: их всё равно нужно аннотировать.",
        },
        {
          question: "Почему параметр типа объявлен у класса, а не у методов?",
          answer:
            "Один экземпляр хранит сущности одного типа. Параметр класса связывает все методы: create принимает T, а findAll возвращает те же T. С параметрами у методов каждый вызов мог бы использовать свой тип.",
        },
        {
          question: "Почему create принимает данные без id, а возвращает WithId<T>?",
          answer:
            "id назначает хранилище, поэтому вызывающий код не должен его передавать. Спред generic-объекта даёт пересечение T & { id: number }, и TypeScript проверяет это без утверждения as.",
        },
      ],
      articles: [
        {
          title: "Классы: implements, модификаторы и обобщённые классы",
          url: "https://www.typescriptlang.org/docs/handbook/2/classes.html",
          urlTitle: "TypeScript Handbook — Classes",
        },
        {
          title: "Приватные поля #",
          url: "https://learn.javascript.ru/private-protected-properties-methods",
          urlTitle: "Современный учебник JavaScript — приватные свойства",
        },
      ],
    },
    {
      id: "typescript-47",
      title: "Расширение глобальных типов",
      desc: "Скрипт аналитики добавляет в window объект analytics, а сервер встраивает в страницу начальное состояние. Опишите эти поля так, чтобы обращение к ним было типобезопасным во всём проекте без приведения window к any.",
      difficulty: "medium",
      tags: ["declare global", "declaration-merging", "d.ts"],
      filepath: "06_application_patterns/global-augmentation.ts",
      checklist: [
        "Интерфейс Window расширен через declare global.",
        "analytics и __INITIAL_STATE__ описаны отдельными интерфейсами.",
        "Обращения к window компилируются без приведений типов.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему declare global работает только в модуле?",
          answer:
            "В файле без import и export все объявления и так глобальные, и interface Window {...} сливается с глобальным Window напрямую. В модуле объявления локальны, поэтому для выхода в глобальную область нужен declare global.",
        },
        {
          question: "Как расширить типы сторонней библиотеки?",
          answer:
            "Аугментацией модуля: declare module \"express\" { interface Request { user?: User } }. Модуль должен существовать, а расширяемый интерфейс — экспортироваться из него.",
        },
        {
          question: "Как типизировать import.meta.env в Vite?",
          answer:
            "Расширить интерфейс ImportMetaEnv в файле vite-env.d.ts: interface ImportMetaEnv { readonly VITE_API_URL: string }. Это то же слияние объявлений.",
        },
      ],
      articles: [
        {
          title: "Слияние объявлений и глобальная аугментация",
          url: "https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation",
          urlTitle: "TypeScript Handbook — Global augmentation",
        },
        {
          title: "Файлы объявлений .d.ts",
          url: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html",
          urlTitle: "TypeScript Handbook — Declaration Files",
        },
      ],
    },
    {
      id: "typescript-21",
      title: "Перегрузка обработчика",
      desc: "Функция createElement должна возвращать разный тип объекта в зависимости от переданной строки тега: \"img\" -> объект с полем src, \"a\" -> объект с полем href, любой другой тег -> объект без дополнительных полей. Тип результата должен определяться уже на этапе вызова функции, а не через объединение всех возможных вариантов.",
      difficulty: "hard",
      tags: ["overloads", "literal"],
      filepath: "06_application_patterns/element-overloads.ts",
      checklist: [
        "img возвращает тип с src, a — с href.",
        "Общий тег возвращает базовый объект; реализация совместима со всеми перегрузками.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему конкретные перегрузки ставят перед общей?",
          answer:
            "При подборе подходящей сигнатуры порядок может влиять на результат. Узкие варианты нужно объявлять до широкого, принимающего любую строку.",
        },
        {
          question: "Что произойдёт при вызове createElement(tag), где tag: \"img\" | \"a\"?",
          answer:
            "Ни одна узкая перегрузка не примет объединение, и выберется общая сигнатура для string. Перегрузки выбираются целиком для аргумента, а не распределяются по вариантам объединения.",
        },
        {
          question: "Чем можно заменить перегрузки?",
          answer:
            "Картой типов и дженериком, как у document.createElement: <K extends keyof ElementMap>(tag: K): ElementMap[K]. Такой вариант масштабируется лучше и работает с объединениями тегов.",
        },
      ],
      articles: [
        {
          title: "Несколько сигнатур и одна реализация функции",
          url: "https://code-basics.com/ru/languages/typescript/lessons/function-overloads",
          urlTitle: "CodeBasics — перегрузка функций",
        },
        {
          title: "Контракт параметров и возвращаемого значения",
          url: "https://scriptdev.ru/guide/020/",
          urlTitle: "ScriptDev — типы функций",
        },
      ],
    },
    {
      id: "typescript-22",
      title: "Подписка на события",
      desc: "Реализуйте типизированный EventEmitter, который для каждого события из заранее известной карты событий передаёт подписчику аргумент строго определённого типа, соответствующего этому событию. Попытка подписаться на несуществующее событие или использовать в обработчике аргумент неверного типа должна быть ошибкой типизации.",
      difficulty: "hard",
      tags: ["generics", "mapped-types", "keyof", "events"],
      filepath: "06_application_patterns/typed-event-emitter.ts",
      checklist: [
        "Неизвестное событие и неверный payload не проходят типизацию.",
        "Подписчик получает точный тип данных своего события.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему недостаточно использовать keyof Events и Events[keyof Events] отдельно?",
          answer:
            "Так теряется связь конкретного события с его данными. Параметр K связывает выбранный ключ с Events[K].",
        },
        {
          question: "Почему Events extends object, а не Record<string, unknown>?",
          answer:
            "У интерфейса нет неявной индексной сигнатуры, поэтому interface EventMap не совместим с Record<string, unknown>. Ограничение object принимает и интерфейсы, и псевдонимы типов.",
        },
        {
          question: "Как добавить отписку?",
          answer:
            "Пусть on возвращает функцию () => void, которая удаляет callback из массива этого события. Тип callback уже известен через Events[K], поэтому отписка типизируется без изменений карты.",
        },
      ],
      articles: [
        {
          title: "Связь имени события с payload через keyof и T[K]",
          url: "https://scriptdev.ru/guide/042/",
          urlTitle: "ScriptDev — ключи и отображаемые типы",
        },
        {
          title: "Механика подписки, отправки событий и отписки",
          url: "https://learn.javascript.ru/mixins#eventmixin",
          urlTitle: "Современный учебник JavaScript — EventMixin",
        },
      ],
    },
    {
      id: "typescript-23",
      title: "Глубокая настройка",
      desc: "Функция обновления конфигурации должна принимать объект, в котором можно указать произвольные поля на любом уровне вложенности, не указывая при этом остальные поля — как на верхнем уровне, так и внутри вложенных объектов.",
      difficulty: "hard",
      tags: ["recursive-types", "DeepPartial", "merge"],
      filepath: "06_application_patterns/deep-partial-config.ts",
      checklist: [
        "Можно передать частичное обновление на любой глубине.",
        "Неуказанные вложенные поля остаются в итоговой конфигурации.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему Partial<AppConfig> недостаточно?",
          answer:
            "Partial меняет только верхний уровень. Вложенные theme и features сохраняют обязательность своих полей, поэтому нужна рекурсия.",
        },
        {
          question: "Что DeepPartial сделает с массивом и функцией?",
          answer:
            "Массив — объект, поэтому станет массивом необязательных элементов. Функция тоже объект: отображаемый тип потеряет сигнатуру вызова. В библиотечных версиях функции и массивы обрабатывают отдельными ветками.",
        },
        {
          question: "Почему updateConfig не написана как обобщённый deepMerge<T>?",
          answer:
            "Типизировать произвольное глубокое слияние сложно: на каждом уровне нужно различать объекты, массивы и примитивы, и реализация потребует утверждений типов. Для известной формы конфигурации явное слияние проще и надёжнее.",
        },
      ],
      articles: [
        {
          title: "Условное преобразование вложенного типа",
          url: "https://scriptdev.ru/guide/043/",
          urlTitle: "ScriptDev — условные типы",
        },
        {
          title: "Обход свойств типа и изменение их обязательности",
          url: "https://scriptdev.ru/guide/042/",
          urlTitle: "ScriptDev — отображаемые типы",
        },
        {
          title: "Поверхностное копирование и вложенные объекты",
          url: "https://learn.javascript.ru/object-copy",
          urlTitle: "Современный учебник JavaScript — копирование объектов",
        },
      ],
    },
    {
      id: "typescript-24",
      title: "Брендированные идентификаторы",
      desc: "В системе есть идентификаторы пользователей и идентификаторы заказов, оба являются строками. Сделайте так, чтобы TypeScript не позволял случайно передать идентификатор заказа туда, где ожидается идентификатор пользователя, и наоборот — даже если оба значения на этапе выполнения являются обычными строками.",
      difficulty: "hard",
      tags: ["brand", "intersection", "nominal"],
      filepath: "06_application_patterns/branded-identifiers.ts",
      checklist: [
        "UserId и OrderId имеют разные бренды.",
        "Функции принимают только идентификатор нужного вида.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Проверяет ли приведение к бренду формат идентификатора?",
          answer:
            "Нет. Утверждение типа не выполняет проверку. Если вход недоверенный, фабрика должна сначала проверить значение и только потом создавать бренд.",
        },
        {
          question: "Чем бренд отличается от литерального поля kind из задачи о структурной типизации?",
          answer:
            "Поле kind существует во время выполнения и занимает память. Бренд существует только в типах: значение остаётся обычной строкой и передаётся в любые строковые API без преобразований.",
        },
        {
          question: "Зачем иногда используют unique symbol вместо строкового __brand?",
          answer:
            "declare const brand: unique symbol; type UserId = string & { [brand]: \"UserId\" }. Ключ-символ невозможно случайно создать или прочитать снаружи модуля, и он не появляется в автодополнении как обычное поле.",
        },
      ],
      articles: [
        {
          title: "Брендированные идентификаторы и моделирование бизнес-ограничений",
          url: "https://habr.com/ru/companies/lanit/articles/908642/",
          urlTitle: "Хабр — практическое применение branded types",
        },
        {
          title: "Что утверждение типа делает и чего не проверяет",
          url: "https://scriptdev.ru/guide/035/",
          urlTitle: "ScriptDev — утверждение типов",
        },
      ],
    },
    {
      id: "typescript-48",
      title: "Типобезопасный builder",
      desc: "Реализуйте FormBuilder с методом field(name, initialValue), который вызывается цепочкой. Метод build() должен возвращать объект, тип которого точно отражает все добавленные поля. Повторное добавление уже существующего поля должно быть ошибкой типизации.",
      difficulty: "hard",
      tags: ["builder", "generics", "intersection", "fluent-api"],
      filepath: "06_application_patterns/typed-builder.ts",
      checklist: [
        "Каждый вызов field расширяет тип накопленных полей.",
        "build() возвращает объект с точными типами всех полей.",
        "Повторное имя поля — ошибка типизации.",
        "Утверждение типа используется только там, где TypeScript не может вывести тип вычисляемого ключа, и это объяснено.",
        NO_SUPPRESSION_CHECK,
      ],
      questions: [
        {
          question: "Почему field возвращает новый экземпляр, а не this?",
          answer:
            "Тип this фиксирован для экземпляра, а каждому шагу цепочки нужен новый тип FormBuilder<Fields & Record<Name, Value>>. Возврат нового объекта честно отражает это и делает builder неизменяемым.",
        },
        {
          question: "Почему для вычисляемого ключа { [name]: value } нужно утверждение типа?",
          answer:
            "Для ключа обобщённого типа Name TypeScript выводит индексную сигнатуру { [x: string]: Value }, а не Record<Name, Value>. Это известное ограничение компилятора, поэтому точный тип записи указывают вручную в одном изолированном месте.",
        },
        {
          question: "Где встречаются такие builder'ы?",
          answer:
            "В построителях запросов (Kysely, Drizzle), схемах (zod: z.object().extend()), роутерах tRPC. Тип накапливается при каждом вызове и даёт точный результат без ручных аннотаций.",
        },
      ],
      articles: [
        {
          title: "Обобщённые классы",
          url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes",
          urlTitle: "TypeScript Handbook — Generic Classes",
        },
        {
          title: "Пересечение типов",
          url: "https://scriptdev.ru/guide/016/",
          urlTitle: "ScriptDev — Union и Intersection",
        },
      ],
    },
  ],
};
