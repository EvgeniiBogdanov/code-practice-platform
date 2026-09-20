import type { Task } from "../../../types";
import candidate1 from "../tasks/1_basics/01-first-annotations.ts?raw";
import solution1 from "../solutions/1_basics/01-first-annotations.ts?raw";
import candidate2 from "../tasks/1_basics/02-tuple-values.ts?raw";
import solution2 from "../solutions/1_basics/02-tuple-values.ts?raw";
import candidate3 from "../tasks/1_basics/03-optional-readonly-fields.ts?raw";
import solution3 from "../solutions/1_basics/03-optional-readonly-fields.ts?raw";
import candidate4 from "../tasks/1_basics/04-user-role.ts?raw";
import solution4 from "../solutions/1_basics/04-user-role.ts?raw";
import candidate5 from "../tasks/1_basics/05-type-narrowing.ts?raw";
import solution5 from "../solutions/1_basics/05-type-narrowing.ts?raw";
import candidate6 from "../tasks/1_basics/06-order-status.ts?raw";
import solution6 from "../solutions/1_basics/06-order-status.ts?raw";
import candidate7 from "../tasks/2_generics_and_composition/07-indexed-value.ts?raw";
import solution7 from "../solutions/2_generics_and_composition/07-indexed-value.ts?raw";
import candidate8 from "../tasks/2_generics_and_composition/08-generic-object-access.ts?raw";
import solution8 from "../solutions/2_generics_and_composition/08-generic-object-access.ts?raw";
import candidate9 from "../tasks/2_generics_and_composition/09-intersection-capabilities.ts?raw";
import solution9 from "../solutions/2_generics_and_composition/09-intersection-capabilities.ts?raw";
import candidate10 from "../tasks/3_utility_types/10-pick-and-omit.ts?raw";
import solution10 from "../solutions/3_utility_types/10-pick-and-omit.ts?raw";
import candidate11 from "../tasks/3_utility_types/11-stock-record.ts?raw";
import solution11 from "../solutions/3_utility_types/11-stock-record.ts?raw";
import candidate12 from "../tasks/3_utility_types/12-exclude-and-extract.ts?raw";
import solution12 from "../solutions/3_utility_types/12-exclude-and-extract.ts?raw";
import candidate13 from "../tasks/3_utility_types/13-validated-user.ts?raw";
import solution13 from "../solutions/3_utility_types/13-validated-user.ts?raw";
import candidate14 from "../tasks/3_utility_types/14-function-introspection.ts?raw";
import solution14 from "../solutions/3_utility_types/14-function-introspection.ts?raw";
import candidate15 from "../tasks/4_type_transformations/15-typed-api-template.ts?raw";
import solution15 from "../solutions/4_type_transformations/15-typed-api-template.ts?raw";
import candidate16 from "../tasks/4_type_transformations/16-conditional-element-type.ts?raw";
import solution16 from "../solutions/4_type_transformations/16-conditional-element-type.ts?raw";
import candidate17 from "../tasks/4_type_transformations/17-template-event-names.ts?raw";
import solution17 from "../solutions/4_type_transformations/17-template-event-names.ts?raw";
import candidate18 from "../tasks/4_type_transformations/18-discriminated-events.ts?raw";
import solution18 from "../solutions/4_type_transformations/18-discriminated-events.ts?raw";
import candidate19 from "../tasks/5_application_patterns/19-fetch-comments.ts?raw";
import solution19 from "../solutions/5_application_patterns/19-fetch-comments.ts?raw";
import candidate20 from "../tasks/5_application_patterns/20-employee-hierarchy.ts?raw";
import solution20 from "../solutions/5_application_patterns/20-employee-hierarchy.ts?raw";
import candidate21 from "../tasks/5_application_patterns/21-element-overloads.ts?raw";
import solution21 from "../solutions/5_application_patterns/21-element-overloads.ts?raw";
import candidate22 from "../tasks/5_application_patterns/22-typed-event-emitter.ts?raw";
import solution22 from "../solutions/5_application_patterns/22-typed-event-emitter.ts?raw";
import candidate23 from "../tasks/5_application_patterns/23-deep-partial-config.ts?raw";
import solution23 from "../solutions/5_application_patterns/23-deep-partial-config.ts?raw";
import candidate24 from "../tasks/5_application_patterns/24-branded-identifiers.ts?raw";
import solution24 from "../solutions/5_application_patterns/24-branded-identifiers.ts?raw";

export const TYPESCRIPT_TASKS: Task[] = [
{
  "id": "typescript-1",
  "title": "1. Первые аннотации",
  "desc": "Добавьте типы к переменным, чтобы код был безопасным.",
  "section": "typescript",
  "group": "Основы типизации",
  "difficulty": "easy",
  "tags": [
    "string",
    "number",
    "boolean",
    "array"
  ],
  "isRaw": true,
  "filepath": "1_basics/01-first-annotations.ts",
  "explanation": "## Разбор решения\n\nЯвные аннотации описывают допустимые значения переменных. Массив number[] содержит только числа. TypeScript уже выводит эти типы из инициализаторов, поэтому присваивание числа в userName ошибочно и без аннотации. Удалите или закомментируйте намеренно неверное присваивание после того, как увидите ошибку.",
  "checklist": [
    "Переменные имеют типы string, number и boolean.",
    "scores принимает только числовые элементы; userName не принимает число.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Нужна ли аннотация, если переменная уже инициализирована?",
      "answer": "Обычно TypeScript выведет тип сам. Здесь явные аннотации нужны для практики синтаксиса и документирования контракта."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate1,
  "rawSolution": solution1
},
{
  "id": "typescript-2",
  "title": "2. Составные значения",
  "desc": "Опишите тип для пары [имя, возраст], где количество элементов, их порядок и типы строго фиксированы.",
  "section": "typescript",
  "group": "Основы типизации",
  "difficulty": "easy",
  "tags": [
    "tuple",
    "void"
  ],
  "isRaw": true,
  "filepath": "1_basics/02-tuple-values.ts",
  "explanation": "## Разбор решения\n\nКортеж задаёт тип каждой позиции и фиксированную структуру пары. Именованные элементы name и age помогают читать подсказки редактора. printEntry принимает этот кортеж и возвращает void, потому что только выводит данные.",
  "checklist": [
    "Пара описана кортежем [string, number].",
    "Переставленные элементы и лишние значения не подходят под тип Entry.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Чем кортеж отличается от массива (string | number)[]?",
      "answer": "Массив допускает любую длину и любой порядок этих значений. Кортеж описывает конкретные позиции и длину при присваивании."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate2,
  "rawSolution": solution2
},
{
  "id": "typescript-3",
  "title": "3. Опциональные и неизменяемые поля",
  "desc": "Поле middleName может отсутствовать у пользователя. Поле id не должно изменяться после создания объекта.",
  "section": "typescript",
  "group": "Основы типизации",
  "difficulty": "easy",
  "tags": [
    "interface",
    "readonly",
    "optional"
  ],
  "isRaw": true,
  "filepath": "1_basics/03-optional-readonly-fields.ts",
  "explanation": "## Разбор решения\n\nЗнак ? делает middleName необязательным. Модификатор readonly запрещает присваивание person.id через этот тип. Это ограничение проверки типов: оно не замораживает объект во время выполнения.",
  "checklist": [
    "middleName можно пропустить при создании Person.",
    "Присваивание нового id вызывает ошибку типов.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Замораживает ли readonly объект в JavaScript?",
      "answer": "Нет. readonly ограничивает операции при проверке типов. Для ограничения изменений во время выполнения нужен отдельный механизм, например Object.freeze."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate3,
  "rawSolution": solution3
},
{
  "id": "typescript-4",
  "title": "4. Роль пользователя",
  "desc": "Улучшите типизацию представленного кода. Поле role должно принимать только допустимые значения.",
  "section": "typescript",
  "group": "Основы типизации",
  "difficulty": "easy",
  "tags": [
    "extends",
    "union",
    "literal"
  ],
  "isRaw": true,
  "filepath": "1_basics/04-user-role.ts",
  "explanation": "## Разбор решения\n\nОбщие поля остаются в User, а UserWithRole расширяет его через extends. Литеральное объединение Role перечисляет допустимые значения и не допускает произвольную строку. Так общие поля не приходится дублировать.",
  "checklist": [
    "UserWithRole переиспользует поля User.",
    "role принимает только admin или user.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему тип string слишком широк для роли?",
      "answer": "Он разрешает любую строку, включая опечатки. Литеральное объединение отражает конечный набор допустимых ролей."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate4,
  "rawSolution": solution4
},
{
  "id": "typescript-5",
  "title": "5. Что за тип у переменной",
  "desc": "Функция должна корректно обрабатывать оба варианта входных данных, не вызывая ошибок типизации внутри своего тела.",
  "section": "typescript",
  "group": "Основы типизации",
  "difficulty": "easy",
  "tags": [
    "typeof",
    "narrowing",
    "union"
  ],
  "isRaw": true,
  "filepath": "1_basics/05-type-narrowing.ts",
  "explanation": "## Разбор решения\n\nПроверка typeof сужает string | number до string в первой ветке. После возврата в этой ветке оставшийся путь работает с number. Оба метода возвращают строку, поэтому возвращаемый тип функции — string.",
  "checklist": [
    "Обрабатываются строковый и числовой аргументы.",
    "Методы вызываются только после сужения типа.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему во второй ветке доступен toFixed?",
      "answer": "Строковый вариант уже завершил выполнение через return. Анализ потока управления оставляет в этой ветке только number."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate5,
  "rawSolution": solution5
},
{
  "id": "typescript-6",
  "title": "6. Перечисление способов",
  "desc": "Опишите набор допустимых статусов заказа так, чтобы его можно было использовать и как тип на этапе компиляции, и как объект со значениями во время выполнения программы.",
  "section": "typescript",
  "group": "Основы типизации",
  "difficulty": "easy",
  "tags": [
    "enum",
    "runtime"
  ],
  "isRaw": true,
  "filepath": "1_basics/06-order-status.ts",
  "explanation": "## Разбор решения\n\nСтроковый enum задаёт именованный набор статусов и создаёт объект во время выполнения. Аннотация OrderStatus ограничивает параметры функции значениями перечисления. В отличие от type, обычный enum не исчезает полностью при компиляции.",
  "checklist": [
    "Перечислены все четыре статуса заказа.",
    "changeStatus принимает OrderStatus и возвращает void.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Чем enum отличается от объединения строковых литералов?",
      "answer": "Обычный enum существует как объект со значениями во время выполнения. Объединение — только описание типа, которое стирается при компиляции."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate6,
  "rawSolution": solution6
},
{
  "id": "typescript-7",
  "title": "7. Значение по ключу",
  "desc": "Типизируйте функцию getValue. Функция должна позволять получать значение из объекта obj по существующему ключу. TypeScript должен корректно определять тип возвращаемого значения.",
  "section": "typescript",
  "group": "Обобщённые и составные типы",
  "difficulty": "medium",
  "tags": [
    "generics",
    "keyof",
    "indexed-access"
  ],
  "isRaw": true,
  "filepath": "2_generics_and_composition/07-indexed-value.ts",
  "explanation": "## Разбор решения\n\nПараметр T сохраняет структуру переданного значения, K ограничивается его ключами через keyof T. Возвращаемый тип T[K] связывает результат с выбранным ключом, поэтому a даёт number, а c — string.",
  "checklist": [
    "Несуществующий ключ нельзя передать в getValue.",
    "Для разных ключей сохраняется точный тип результата.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему недостаточно возвращать T[keyof T]?",
      "answer": "Такой результат объединяет типы всех полей. Отдельный параметр K позволяет сохранить связь с конкретным переданным ключом."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate7,
  "rawSolution": solution7
},
{
  "id": "typescript-8",
  "title": "8. Универсальный доступ",
  "desc": "Типизируйте функцию getValue, чтобы можно было получать значение из любого объекта по его ключу.",
  "section": "typescript",
  "group": "Обобщённые и составные типы",
  "difficulty": "medium",
  "tags": [
    "generics",
    "object",
    "keyof"
  ],
  "isRaw": true,
  "filepath": "2_generics_and_composition/08-generic-object-access.ts",
  "explanation": "## Разбор решения\n\nДополнительное ограничение T extends object исключает примитивы из первого аргумента. Остальной контракт сохраняет связь ключа с типом свойства. Функция применима к разным объектам без ручного перечисления их полей.",
  "checklist": [
    "Первый аргумент ограничен объектами.",
    "Новые структуры работают без изменения сигнатуры функции.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Что добавляет ограничение extends object?",
      "answer": "Оно запрещает примитивные значения в качестве объекта и явно описывает назначение функции."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate8,
  "rawSolution": solution8
},
{
  "id": "typescript-9",
  "title": "9. Пересечение возможностей",
  "desc": "Объедините два независимых набора возможностей объекта в один тип, не создавая дублирования полей.",
  "section": "typescript",
  "group": "Обобщённые и составные типы",
  "difficulty": "medium",
  "tags": [
    "intersection",
    "interface"
  ],
  "isRaw": true,
  "filepath": "2_generics_and_composition/09-intersection-capabilities.ts",
  "explanation": "## Разбор решения\n\nПересечение Serializable & Loggable требует реализации обеих возможностей. Исходные интерфейсы остаются независимыми. Объект подходит под итоговый тип только при наличии serialize и log с правильными сигнатурами.",
  "checklist": [
    "Итоговый тип построен пересечением интерфейсов.",
    "Объект реализует оба метода с указанными результатами.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Что произойдёт при пересечении несовместимых типов одного поля?",
      "answer": "Тип такого поля должен удовлетворять обоим ограничениям. Например, string & number превращается в never, и обычное значение присвоить нельзя."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate9,
  "rawSolution": solution9
},
{
  "id": "typescript-10",
  "title": "10. Выборочная сборка",
  "desc": "На основе интерфейса User создайте два новых типа: один — только с публичными полями (без пароля), второй — только с полями, нужными для формы регистрации (имя и пароль).",
  "section": "typescript",
  "group": "Служебные типы",
  "difficulty": "medium",
  "tags": [
    "Pick",
    "Omit"
  ],
  "isRaw": true,
  "filepath": "3_utility_types/10-pick-and-omit.ts",
  "explanation": "## Разбор решения\n\nOmit исключает password из публичной модели, а Pick выбирает name и password для формы. Оба типа выводятся из User и следуют изменениям его полей. Эти утилиты не удаляют свойства из реального объекта во время выполнения.",
  "checklist": [
    "PublicUser не содержит password в контракте.",
    "RegistrationForm содержит только name и password.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Удаляет ли Omit пароль из объекта?",
      "answer": "Нет. Omit преобразует только тип. Чтобы не передать пароль наружу, нужно отдельно построить объект без этого поля."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate10,
  "rawSolution": solution10
},
{
  "id": "typescript-11",
  "title": "11. Карта записей",
  "desc": "Опишите тип для объекта, который хранит количество товаров на складе по их артикулу (строка), где значение — всегда число.",
  "section": "typescript",
  "group": "Служебные типы",
  "difficulty": "medium",
  "tags": [
    "Record",
    "index-signature"
  ],
  "isRaw": true,
  "filepath": "3_utility_types/11-stock-record.ts",
  "explanation": "## Разбор решения\n\nRecord<string, number> описывает словарь с числовыми значениями. Оператор ?? подставляет ноль для ещё отсутствующего артикула. Такой тип не гарантирует, что конкретный ключ действительно присутствует в объекте.",
  "checklist": [
    "Склад имеет строковые ключи и числовые значения.",
    "Новый артикул начинается с нуля, существующий увеличивается.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Гарантирует ли Record<string, number> наличие любого ключа?",
      "answer": "Нет. Это контракт значений словаря. При noUncheckedIndexedAccess чтение по произвольному ключу также учитывает undefined."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate11,
  "rawSolution": solution11
},
{
  "id": "typescript-12",
  "title": "12. Исключение лишнего",
  "desc": "На основе типа допустимых прав доступа создайте: тип без права \"banned\", и отдельный тип, содержащий только права, связанные с изменением данных (\"create\", \"update\").",
  "section": "typescript",
  "group": "Служебные типы",
  "difficulty": "medium",
  "tags": [
    "Exclude",
    "Extract",
    "union"
  ],
  "isRaw": true,
  "filepath": "3_utility_types/12-exclude-and-extract.ts",
  "explanation": "## Разбор решения\n\nExclude удаляет варианты из объединения, а Extract оставляет только совместимые варианты. Здесь операции применяются к строковым правам доступа, а не к полям объекта.",
  "checklist": [
    "ActivePermission не допускает banned.",
    "WritePermission допускает только create и update.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "В чём различие Omit и Exclude?",
      "answer": "Omit убирает ключи объекта. Exclude убирает варианты объединения типов."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate12,
  "rawSolution": solution12
},
{
  "id": "typescript-13",
  "title": "13. Проверенный пользователь",
  "desc": "Типизируйте функцию createAndValidate. Функция создаёт объект пользователя и добавляет в него только поля, которые прошли соответствующую проверку.",
  "section": "typescript",
  "group": "Служебные типы",
  "difficulty": "medium",
  "tags": [
    "Partial",
    "validation"
  ],
  "isRaw": true,
  "filepath": "3_utility_types/13-validated-user.ts",
  "explanation": "## Разбор решения\n\nPartial<User> делает поля результата необязательными: каждое появляется только после своей проверки. Локальный newUser тоже получает этот тип, иначе пустой объект не позволяет добавлять поля. Возраст добавляется строго при age > 18, как указано в исходной задаче.",
  "checklist": [
    "Пустое имя не попадает в результат.",
    "Возраст 18 и меньше не добавляется; остальные прошедшие проверки поля сохраняются.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему результат нельзя объявить как User?",
      "answer": "В User оба поля обязательны, а проверки могут отклонить одно или оба значения. Partial честно описывает возможность их отсутствия."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate13,
  "rawSolution": solution13
},
{
  "id": "typescript-14",
  "title": "14. Разбор функции",
  "desc": "Как получить возвращаемый тип функции и тип её второго параметра?",
  "section": "typescript",
  "group": "Служебные типы",
  "difficulty": "medium",
  "tags": [
    "ReturnType",
    "Parameters",
    "typeof"
  ],
  "isRaw": true,
  "filepath": "3_utility_types/14-function-introspection.ts",
  "explanation": "## Разбор решения\n\ntypeof log получает тип функции. ReturnType извлекает её результат, Parameters строит кортеж параметров, а индекс 1 выбирает второй элемент. Полученные типы автоматически следуют изменениям сигнатуры log.",
  "checklist": [
    "Возвращаемый тип получен через ReturnType.",
    "Тип второго параметра получен из Parameters по индексу 1.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему перед ReturnType нужен typeof log?",
      "answer": "log — значение функции. typeof в позиции типа превращает это значение в его тип, который и принимает утилита."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate14,
  "rawSolution": solution14
},
{
  "id": "typescript-15",
  "title": "15. Общий шаблон API",
  "desc": "Напишите типизацию, подходящую для двух объектов.  Необходимо сохранить строгую типизацию ключей внутри endpoints. Использование слишком общих типов для ключей не подходит.  Считайте, что набор ключей endpoints известен на этапе типизации каждого конкретного объекта.",
  "section": "typescript",
  "group": "Преобразования типов",
  "difficulty": "medium",
  "tags": [
    "mapped-types",
    "generics",
    "literal"
  ],
  "isRaw": true,
  "filepath": "4_type_transformations/15-typed-api-template.ts",
  "explanation": "## Разбор решения\n\nПараметр K задаёт конечный набор имён endpoints. Отображаемый тип [P in K] создаёт по одному полю на каждый ключ. В отличие от словаря с произвольными строковыми ключами, такой контракт сохраняет обязательные имена методов конкретного API.",
  "checklist": [
    "Для каждого API задан свой точный набор ключей.",
    "method ограничен допустимыми HTTP-методами.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему Record<string, Endpoint> не решает эту задачу?",
      "answer": "Он допускает произвольные строковые ключи и не требует конкретных имён. Record<K, Endpoint> с конечным объединением K подходит."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate15,
  "rawSolution": solution15
},
{
  "id": "typescript-16",
  "title": "16. Условный выбор",
  "desc": "Опишите тип-помощник, который извлекает тип элемента массива, а для типа, не являющегося массивом, возвращает сам этот тип без изменений.",
  "section": "typescript",
  "group": "Преобразования типов",
  "difficulty": "medium",
  "tags": [
    "conditional-types",
    "infer"
  ],
  "isRaw": true,
  "filepath": "4_type_transformations/16-conditional-element-type.ts",
  "explanation": "## Разбор решения\n\nУсловный тип проверяет, является ли T массивом. infer U вводит тип его элемента в истинной ветке; иначе возвращается исходный T. Для readonly-массивов условие можно расширить до readonly (infer U)[].",
  "checklist": [
    "Из number[] извлекается number.",
    "Не являющийся массивом тип string остаётся string.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Что означает infer в условном типе?",
      "answer": "Он вводит переменную типа, которую TypeScript выводит из совпавшей структуры в проверяемом условии."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate16,
  "rawSolution": solution16
},
{
  "id": "typescript-17",
  "title": "17. Шаблонные строки",
  "desc": "Опишите тип для названий обработчиков событий вида \"on\" + название события с большой буквы, например: onClick, onFocus, onHover — на основе списка исходных названий событий.",
  "section": "typescript",
  "group": "Преобразования типов",
  "difficulty": "medium",
  "tags": [
    "template-literal",
    "Capitalize"
  ],
  "isRaw": true,
  "filepath": "4_type_transformations/17-template-event-names.ts",
  "explanation": "## Разбор решения\n\nCapitalize преобразует первую букву каждого варианта EventName. Шаблонный строковый тип добавляет префикс on. Результат — конечное объединение onClick, onFocus и onHover, а не произвольная строка.",
  "checklist": [
    "Имена обработчиков выводятся из EventName.",
    "Неверный регистр и неизвестные события отвергаются.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Изменяет ли Capitalize строку во время выполнения?",
      "answer": "Нет, он преобразует тип строкового литерала. Реальное преобразование строки требует JavaScript-кода."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate17,
  "rawSolution": solution17
},
{
  "id": "typescript-18",
  "title": "18. Разные формы события",
  "desc": "Опишите типы для событий разных видов так, чтобы TypeScript мог сужать тип внутри обработчика в зависимости от вида события.",
  "section": "typescript",
  "group": "Преобразования типов",
  "difficulty": "medium",
  "tags": [
    "discriminated-union",
    "narrowing"
  ],
  "isRaw": true,
  "filepath": "4_type_transformations/18-discriminated-events.ts",
  "explanation": "## Разбор решения\n\nУ каждой формы события своё литеральное поле type. Проверка этого поля выбирает конкретный интерфейс, после чего доступны только его данные. Это позволяет описать допустимые сочетания полей без необязательных x, y и key в одном общем объекте.",
  "checklist": [
    "click требует координаты, keypress требует key.",
    "В обработчике поля доступны после проверки type.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему одно поле type должно быть литеральным?",
      "answer": "Так TypeScript связывает значение дискриминатора с конкретным участником объединения и его набором полей."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate18,
  "rawSolution": solution18
},
{
  "id": "typescript-19",
  "title": "19. Получение данных",
  "desc": "Напишите и типизируйте функцию, выполняющую запрос за данными по переданному URL.  После получения данных выведите их в консоль в формате: \"ID: id, Email: email\".",
  "section": "typescript",
  "group": "Прикладные паттерны",
  "difficulty": "hard",
  "tags": [
    "Promise",
    "async"
  ],
  "isRaw": true,
  "filepath": "5_application_patterns/19-fetch-comments.ts",
  "explanation": "## Разбор решения\n\nФункция getData объявлена как async и возвращает Promise с массивом комментариев (Promise<Comment[]>). Статус ответа проверяется через response.ok до извлечения данных. Вызов response.json() возвращает разобранные данные, которые затем выводятся в консоль для каждого комментария в заданном формате.",
  "checklist": [
    "Функция типизирована возвращаемым типом Promise<Comment[]>.",
    "Выполняется проверка успешности запроса через response.ok.",
    "Каждый комментарий выводится в формате ID: id, Email: email.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему возвращаемый тип функции — Promise<Comment[]>?",
      "answer": "Асинхронные функции (async) всегда возвращают Promise, оборачивающий тип возвращаемого значения."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate19,
  "rawSolution": solution19
},
{
  "id": "typescript-20",
  "title": "20. Иерархия сотрудников",
  "desc": "Создайте структуру классов для сотрудников компании. У каждого сотрудника есть имя и зарплата (доступна только внутри класса и его наследников). Метод расчёта премии должен быть обязательным для реализации в каждом конкретном виде сотрудника, но сам базовый класс нельзя создавать напрямую.",
  "section": "typescript",
  "group": "Прикладные паттерны",
  "difficulty": "hard",
  "tags": [
    "abstract",
    "protected",
    "class"
  ],
  "isRaw": true,
  "filepath": "5_application_patterns/20-employee-hierarchy.ts",
  "explanation": "## Разбор решения\n\nabstract запрещает создавать Employee напрямую и требует реализацию calculateBonus в конкретном наследнике. protected открывает salary самому классу и его наследникам. Параметры-свойства конструктора сокращают повторяющиеся объявления и присваивания.",
  "checklist": [
    "Базовый класс абстрактный, salary защищено.",
    "Manager рассчитывает премию в размере 20% зарплаты.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Чем protected отличается от private?",
      "answer": "protected доступен классу и наследникам. private доступен только объявившему его классу; оба модификатора TypeScript задают ограничения проверки типов."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate20,
  "rawSolution": solution20
},
{
  "id": "typescript-21",
  "title": "21. Перегрузка обработчика",
  "desc": "Функция createElement должна возвращать разный тип объекта в зависимости от переданной строки тега: \"img\" -> объект с полем src, \"a\" -> объект с полем href, любой другой тег -> объект без дополнительных полей.  Тип результата должен определяться уже на этапе вызова функции, а не через объединение всех возможных вариантов.",
  "section": "typescript",
  "group": "Прикладные паттерны",
  "difficulty": "hard",
  "tags": [
    "overloads",
    "literal"
  ],
  "isRaw": true,
  "filepath": "5_application_patterns/21-element-overloads.ts",
  "explanation": "## Разбор решения\n\nСначала объявляются специфичные перегрузки для img и a, затем общий строковый вариант. Реализация покрывает все допустимые случаи. Вызывающий код видит сигнатуры перегрузок и получает точный тип по переданному литералу.",
  "checklist": [
    "img возвращает тип с src, a — с href.",
    "Общий тег возвращает базовый объект; реализация совместима со всеми перегрузками.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему конкретные перегрузки ставят перед общей?",
      "answer": "При подборе подходящей сигнатуры порядок может влиять на результат. Узкие варианты нужно объявлять до широкого, принимающего любую строку."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate21,
  "rawSolution": solution21
},
{
  "id": "typescript-22",
  "title": "22. Подписка на события",
  "desc": "Реализуйте типизированный EventEmitter, который для каждого события из заранее известной карты событий передаёт подписчику аргумент строго определённого типа, соответствующего этому событию. Попытка подписаться на несуществующее событие или использовать в обработчике аргумент неверного типа должна быть ошибкой типизации.",
  "section": "typescript",
  "group": "Прикладные паттерны",
  "difficulty": "hard",
  "tags": [
    "generics",
    "mapped-types",
    "keyof",
    "events"
  ],
  "isRaw": true,
  "filepath": "5_application_patterns/22-typed-event-emitter.ts",
  "explanation": "## Разбор решения\n\nКарта Events связывает каждое имя события с типом payload. on и emit используют один и тот же параметр K, сохраняя эту связь. Хранилище слушателей — отображаемый тип с необязательными массивами. Ограничение Events extends object принимает интерфейс EventMap без лишней строковой индексной сигнатуры.",
  "checklist": [
    "Неизвестное событие и неверный payload не проходят типизацию.",
    "Подписчик получает точный тип данных своего события.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему недостаточно использовать keyof Events и Events[keyof Events] отдельно?",
      "answer": "Так теряется связь конкретного события с его данными. Параметр K связывает выбранный ключ с Events[K]."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate22,
  "rawSolution": solution22
},
{
  "id": "typescript-23",
  "title": "23. Глубокая настройка",
  "desc": "Функция обновления конфигурации должна принимать объект, в котором можно указать произвольные поля на любом уровне вложенности, не указывая при этом остальные поля — как на верхнем уровне, так и внутри вложенных объектов.",
  "section": "typescript",
  "group": "Прикладные паттерны",
  "difficulty": "hard",
  "tags": [
    "recursive-types",
    "DeepPartial",
    "merge"
  ],
  "isRaw": true,
  "filepath": "5_application_patterns/23-deep-partial-config.ts",
  "explanation": "## Разбор решения\n\nDeepPartial рекурсивно делает поля необязательными. Одного поверхностного spread недостаточно: обновление theme заменило бы весь вложенный объект. Поэтому updateConfig отдельно объединяет каждую известную ветку AppConfig, сохраняя остальные значения.",
  "checklist": [
    "Можно передать частичное обновление на любой глубине.",
    "Неуказанные вложенные поля остаются в итоговой конфигурации.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Почему Partial<AppConfig> недостаточно?",
      "answer": "Partial меняет только верхний уровень. Вложенные theme и features сохраняют обязательность своих полей, поэтому нужна рекурсия."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate23,
  "rawSolution": solution23
},
{
  "id": "typescript-24",
  "title": "24. Единица измерения",
  "desc": "В системе есть идентификаторы пользователей и идентификаторы заказов, оба являются строками. Сделайте так, чтобы TypeScript не позволял случайно передать идентификатор заказа туда, где ожидается идентификатор пользователя, и наоборот — даже если оба значения на этапе выполнения являются обычными строками.",
  "section": "typescript",
  "group": "Прикладные паттерны",
  "difficulty": "hard",
  "tags": [
    "brand",
    "intersection",
    "nominal"
  ],
  "isRaw": true,
  "filepath": "5_application_patterns/24-branded-identifiers.ts",
  "explanation": "## Разбор решения\n\nBrand добавляет к строке различающий признак на уровне типов. UserId и OrderId перестают быть взаимозаменяемыми, хотя при выполнении оба остаются строками. Утверждение типа сосредоточено в функциях создания; при необходимости именно там проверяют формат идентификатора.",
  "checklist": [
    "UserId и OrderId имеют разные бренды.",
    "Функции принимают только идентификатор нужного вида.",
    "Решение не скрывает ошибки через any или подавляющие директивы."
  ],
  "questions": [
    {
      "question": "Проверяет ли приведение к бренду формат идентификатора?",
      "answer": "Нет. Утверждение типа не выполняет проверку. Если вход недоверенный, фабрика должна сначала проверить значение и только потом создавать бренд."
    }
  ],
  "articles": [
    {
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/2/classes.html",
      "urlTitle": "Официальная документация"
    }
  ],
  "rawCandidate": candidate24,
  "rawSolution": solution24
}
];
