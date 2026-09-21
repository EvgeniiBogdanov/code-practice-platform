import type { Task } from "../../../types";
import candidate1 from "../tasks/1_basics/01-first-annotations.ts?raw";
import solution1 from "../solutions/1_basics/01-first-annotations.ts?raw";
import explanation1 from "../explanations/1_basics/01-first-annotations.md?raw";
import candidate2 from "../tasks/1_basics/02-tuple-values.ts?raw";
import solution2 from "../solutions/1_basics/02-tuple-values.ts?raw";
import explanation2 from "../explanations/1_basics/02-tuple-values.md?raw";
import candidate3 from "../tasks/1_basics/03-optional-readonly-fields.ts?raw";
import solution3 from "../solutions/1_basics/03-optional-readonly-fields.ts?raw";
import explanation3 from "../explanations/1_basics/03-optional-readonly-fields.md?raw";
import candidate4 from "../tasks/1_basics/04-user-role.ts?raw";
import solution4 from "../solutions/1_basics/04-user-role.ts?raw";
import explanation4 from "../explanations/1_basics/04-user-role.md?raw";
import candidate5 from "../tasks/1_basics/05-type-narrowing.ts?raw";
import solution5 from "../solutions/1_basics/05-type-narrowing.ts?raw";
import explanation5 from "../explanations/1_basics/05-type-narrowing.md?raw";
import candidate6 from "../tasks/1_basics/06-order-status.ts?raw";
import solution6 from "../solutions/1_basics/06-order-status.ts?raw";
import explanation6 from "../explanations/1_basics/06-order-status.md?raw";
import candidate7 from "../tasks/2_generics_and_composition/07-indexed-value.ts?raw";
import solution7 from "../solutions/2_generics_and_composition/07-indexed-value.ts?raw";
import explanation7 from "../explanations/2_generics_and_composition/07-indexed-value.md?raw";
import candidate8 from "../tasks/2_generics_and_composition/08-generic-object-access.ts?raw";
import solution8 from "../solutions/2_generics_and_composition/08-generic-object-access.ts?raw";
import explanation8 from "../explanations/2_generics_and_composition/08-generic-object-access.md?raw";
import candidate9 from "../tasks/2_generics_and_composition/09-intersection-capabilities.ts?raw";
import solution9 from "../solutions/2_generics_and_composition/09-intersection-capabilities.ts?raw";
import explanation9 from "../explanations/2_generics_and_composition/09-intersection-capabilities.md?raw";
import candidate10 from "../tasks/3_utility_types/10-pick-and-omit.ts?raw";
import solution10 from "../solutions/3_utility_types/10-pick-and-omit.ts?raw";
import explanation10 from "../explanations/3_utility_types/10-pick-and-omit.md?raw";
import candidate11 from "../tasks/3_utility_types/11-stock-record.ts?raw";
import solution11 from "../solutions/3_utility_types/11-stock-record.ts?raw";
import explanation11 from "../explanations/3_utility_types/11-stock-record.md?raw";
import candidate12 from "../tasks/3_utility_types/12-exclude-and-extract.ts?raw";
import solution12 from "../solutions/3_utility_types/12-exclude-and-extract.ts?raw";
import explanation12 from "../explanations/3_utility_types/12-exclude-and-extract.md?raw";
import candidate13 from "../tasks/3_utility_types/13-validated-user.ts?raw";
import solution13 from "../solutions/3_utility_types/13-validated-user.ts?raw";
import explanation13 from "../explanations/3_utility_types/13-validated-user.md?raw";
import candidate14 from "../tasks/3_utility_types/14-function-introspection.ts?raw";
import solution14 from "../solutions/3_utility_types/14-function-introspection.ts?raw";
import explanation14 from "../explanations/3_utility_types/14-function-introspection.md?raw";
import candidate15 from "../tasks/4_type_transformations/15-typed-api-template.ts?raw";
import solution15 from "../solutions/4_type_transformations/15-typed-api-template.ts?raw";
import explanation15 from "../explanations/4_type_transformations/15-typed-api-template.md?raw";
import candidate16 from "../tasks/4_type_transformations/16-conditional-element-type.ts?raw";
import solution16 from "../solutions/4_type_transformations/16-conditional-element-type.ts?raw";
import explanation16 from "../explanations/4_type_transformations/16-conditional-element-type.md?raw";
import candidate17 from "../tasks/4_type_transformations/17-template-event-names.ts?raw";
import solution17 from "../solutions/4_type_transformations/17-template-event-names.ts?raw";
import explanation17 from "../explanations/4_type_transformations/17-template-event-names.md?raw";
import candidate18 from "../tasks/4_type_transformations/18-discriminated-events.ts?raw";
import solution18 from "../solutions/4_type_transformations/18-discriminated-events.ts?raw";
import explanation18 from "../explanations/4_type_transformations/18-discriminated-events.md?raw";
import candidate19 from "../tasks/5_application_patterns/19-fetch-comments.ts?raw";
import solution19 from "../solutions/5_application_patterns/19-fetch-comments.ts?raw";
import explanation19 from "../explanations/5_application_patterns/19-fetch-comments.md?raw";
import candidate20 from "../tasks/5_application_patterns/20-employee-hierarchy.ts?raw";
import solution20 from "../solutions/5_application_patterns/20-employee-hierarchy.ts?raw";
import explanation20 from "../explanations/5_application_patterns/20-employee-hierarchy.md?raw";
import candidate21 from "../tasks/5_application_patterns/21-element-overloads.ts?raw";
import solution21 from "../solutions/5_application_patterns/21-element-overloads.ts?raw";
import explanation21 from "../explanations/5_application_patterns/21-element-overloads.md?raw";
import candidate22 from "../tasks/5_application_patterns/22-typed-event-emitter.ts?raw";
import solution22 from "../solutions/5_application_patterns/22-typed-event-emitter.ts?raw";
import explanation22 from "../explanations/5_application_patterns/22-typed-event-emitter.md?raw";
import candidate23 from "../tasks/5_application_patterns/23-deep-partial-config.ts?raw";
import solution23 from "../solutions/5_application_patterns/23-deep-partial-config.ts?raw";
import explanation23 from "../explanations/5_application_patterns/23-deep-partial-config.md?raw";
import candidate24 from "../tasks/5_application_patterns/24-branded-identifiers.ts?raw";
import solution24 from "../solutions/5_application_patterns/24-branded-identifiers.ts?raw";
import explanation24 from "../explanations/5_application_patterns/24-branded-identifiers.md?raw";

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
  "explanation": explanation1,
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
      "title": "Аннотации примитивных типов: string, number, boolean",
      "url": "https://metanit.com/web/typescript/2.5.php",
      "urlTitle": "METANIT — типы данных"
    },
    {
      "title": "Массивы чисел и запись number[]",
      "url": "https://metanit.com/web/typescript/2.9.php",
      "urlTitle": "METANIT — массивы"
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
  "explanation": explanation2,
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
      "title": "Кортеж: тип каждой позиции и фиксированная структура",
      "url": "https://metanit.com/web/typescript/2.10.php",
      "urlTitle": "METANIT — кортежи"
    },
    {
      "title": "Типы параметров и результата функции",
      "url": "https://scriptdev.ru/guide/020/",
      "urlTitle": "ScriptDev — типизация функций"
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
  "explanation": explanation3,
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
      "title": "Необязательные свойства интерфейса",
      "url": "https://metanit.com/web/typescript/3.3.php",
      "urlTitle": "METANIT — интерфейсы"
    },
    {
      "title": "Ограничения readonly и отличие от const",
      "url": "https://scriptdev.ru/guide/027/",
      "urlTitle": "ScriptDev — модификатор readonly"
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
  "explanation": explanation4,
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
      "title": "Расширение интерфейсов через extends",
      "url": "https://metanit.com/web/typescript/3.3.php",
      "urlTitle": "METANIT — интерфейсы"
    },
    {
      "title": "Строковые литералы для конечного набора ролей",
      "url": "https://scriptdev.ru/guide/018/",
      "urlTitle": "ScriptDev — литеральные типы"
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
  "explanation": explanation5,
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
      "title": "Сужение типа через typeof и анализ веток",
      "url": "https://scriptdev.ru/guide/036/",
      "urlTitle": "ScriptDev — защитники типа"
    },
    {
      "title": "Объединение string | number",
      "url": "https://metanit.com/web/typescript/2.13.php",
      "urlTitle": "METANIT — объединения union"
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
  "explanation": explanation6,
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
      "title": "Перечисления и строковые значения статусов",
      "url": "https://metanit.com/web/typescript/2.11.php",
      "urlTitle": "METANIT — enum"
    },
    {
      "title": "Литеральные типы и члены перечислений",
      "url": "https://scriptdev.ru/guide/018/",
      "urlTitle": "ScriptDev — строковые литералы и enum"
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
  "explanation": explanation7,
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
      "title": "Связь ключа объекта и типа значения: keyof и T[K]",
      "url": "https://scriptdev.ru/guide/042/",
      "urlTitle": "ScriptDev — keyof и индексированный доступ"
    },
    {
      "title": "Параметры типов и их вывод из аргументов",
      "url": "https://metanit.com/web/typescript/3.5.php",
      "urlTitle": "METANIT — обобщения"
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
  "explanation": explanation8,
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
      "title": "Ограничения параметров типа через extends",
      "url": "https://scriptdev.ru/guide/032/",
      "urlTitle": "ScriptDev — обобщения и ограничения"
    },
    {
      "title": "Типобезопасный доступ к свойству по ключу",
      "url": "https://scriptdev.ru/guide/042/",
      "urlTitle": "ScriptDev — keyof и T[K]"
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
  "explanation": explanation9,
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
      "title": "Пересечение требований и отличие от объединения",
      "url": "https://scriptdev.ru/guide/016/",
      "urlTitle": "ScriptDev — Union и Intersection"
    },
    {
      "title": "Контракты объектов и сигнатуры методов",
      "url": "https://metanit.com/web/typescript/3.3.php",
      "urlTitle": "METANIT — интерфейсы"
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
  "explanation": explanation10,
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
      "title": "Выбор полей формы через Pick",
      "url": "https://scriptdev.ru/guide/044/",
      "urlTitle": "ScriptDev — утилита Pick"
    },
    {
      "title": "Исключение полей модели через Omit",
      "url": "https://scriptdev.ru/guide/045/",
      "urlTitle": "ScriptDev — утилита Omit"
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
  "explanation": explanation11,
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
      "title": "Словарь со строковыми ключами через Record",
      "url": "https://scriptdev.ru/guide/044/",
      "urlTitle": "ScriptDev — утилита Record"
    },
    {
      "title": "Начальное значение для отсутствующего артикула: ??",
      "url": "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing",
      "urlTitle": "MDN на русском — оператор нулевого слияния"
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
  "explanation": explanation12,
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
      "title": "Фильтрация объединений через Exclude и Extract",
      "url": "https://scriptdev.ru/guide/045/",
      "urlTitle": "ScriptDev — Exclude и Extract"
    },
    {
      "title": "Почему условный тип обрабатывает варианты объединения",
      "url": "https://scriptdev.ru/guide/043/",
      "urlTitle": "ScriptDev — условные типы"
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
  "explanation": explanation13,
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
      "title": "Частично заполненный объект через Partial",
      "url": "https://scriptdev.ru/guide/044/",
      "urlTitle": "ScriptDev — утилита Partial"
    },
    {
      "title": "Обязательные и необязательные свойства пользователя",
      "url": "https://metanit.com/web/typescript/3.3.php",
      "urlTitle": "METANIT — свойства интерфейсов"
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
  "explanation": explanation14,
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
      "title": "Извлечение результата и кортежа аргументов",
      "url": "https://scriptdev.ru/guide/045/",
      "urlTitle": "ScriptDev — ReturnType и Parameters"
    },
    {
      "title": "Получение типа существующей функции через typeof",
      "url": "https://scriptdev.ru/guide/017/",
      "urlTitle": "ScriptDev — запросы типов"
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
  "explanation": explanation15,
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
      "title": "Создание обязательных полей по набору ключей",
      "url": "https://scriptdev.ru/guide/042/",
      "urlTitle": "ScriptDev — отображаемые типы"
    },
    {
      "title": "Record с конечным объединением ключей",
      "url": "https://scriptdev.ru/guide/044/",
      "urlTitle": "ScriptDev — утилита Record"
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
  "explanation": explanation16,
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
      "title": "Извлечение части типа через условие и infer",
      "url": "https://scriptdev.ru/guide/043/",
      "urlTitle": "ScriptDev — условные типы и infer"
    },
    {
      "title": "Получение типа элемента через индексированный доступ",
      "url": "https://scriptdev.ru/guide/042/",
      "urlTitle": "ScriptDev — Lookup Types"
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
  "explanation": explanation17,
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
      "title": "Построение строкового типа из объединения событий",
      "url": "https://scriptdev.ru/guide/018/",
      "urlTitle": "ScriptDev — шаблонные литеральные типы"
    },
    {
      "title": "Изменение регистра строковых типов через Capitalize",
      "url": "https://habr.com/ru/articles/730906/",
      "urlTitle": "Хабр — утилиты строковых типов"
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
  "explanation": explanation18,
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
      "title": "Связь поля type с формой события",
      "url": "https://scriptdev.ru/guide/033/",
      "urlTitle": "ScriptDev — дискриминантное объединение"
    },
    {
      "title": "Как проверки сужают объектный тип в ветке",
      "url": "https://scriptdev.ru/guide/036/",
      "urlTitle": "ScriptDev — защитники типа"
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
  "explanation": explanation19,
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
      "title": "HTTP-статус и чтение JSON из ответа",
      "url": "https://learn.javascript.ru/fetch",
      "urlTitle": "Современный учебник JavaScript — Fetch"
    },
    {
      "title": "Ожидание промиса и ошибки асинхронной функции",
      "url": "https://learn.javascript.ru/async-await",
      "urlTitle": "Современный учебник JavaScript — async/await"
    },
    {
      "title": "Проверка структуры внешних данных",
      "url": "https://scriptdev.ru/guide/036/",
      "urlTitle": "ScriptDev — защитники типа"
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
  "explanation": explanation20,
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
      "title": "Обязательная реализация метода в наследнике",
      "url": "https://metanit.com/web/typescript/3.12.php",
      "urlTitle": "METANIT — абстрактные классы и методы"
    },
    {
      "title": "Доступ к зарплате через protected",
      "url": "https://metanit.com/web/typescript/3.4.php",
      "urlTitle": "METANIT — модификаторы доступа"
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
  "explanation": explanation21,
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
      "title": "Несколько сигнатур и одна реализация функции",
      "url": "https://code-basics.com/ru/languages/typescript/lessons/function-overloads",
      "urlTitle": "CodeBasics — перегрузка функций"
    },
    {
      "title": "Контракт параметров и возвращаемого значения",
      "url": "https://scriptdev.ru/guide/020/",
      "urlTitle": "ScriptDev — типы функций"
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
  "explanation": explanation22,
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
      "title": "Связь имени события с payload через keyof и T[K]",
      "url": "https://scriptdev.ru/guide/042/",
      "urlTitle": "ScriptDev — ключи и отображаемые типы"
    },
    {
      "title": "Механика подписки, отправки событий и отписки",
      "url": "https://learn.javascript.ru/mixins#eventmixin",
      "urlTitle": "Современный учебник JavaScript — EventMixin"
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
  "explanation": explanation23,
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
      "title": "Условное преобразование вложенного типа",
      "url": "https://scriptdev.ru/guide/043/",
      "urlTitle": "ScriptDev — условные типы"
    },
    {
      "title": "Обход свойств типа и изменение их обязательности",
      "url": "https://scriptdev.ru/guide/042/",
      "urlTitle": "ScriptDev — отображаемые типы"
    },
    {
      "title": "Поверхностное копирование и вложенные объекты",
      "url": "https://learn.javascript.ru/object-copy",
      "urlTitle": "Современный учебник JavaScript — копирование объектов"
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
  "explanation": explanation24,
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
      "title": "Брендированные идентификаторы и моделирование бизнес-ограничений",
      "url": "https://habr.com/ru/companies/lanit/articles/908642/",
      "urlTitle": "Хабр — практическое применение branded types"
    },
    {
      "title": "Что утверждение типа делает и чего не проверяет",
      "url": "https://scriptdev.ru/guide/035/",
      "urlTitle": "ScriptDev — утверждение типов"
    }
  ],
  "rawCandidate": candidate24,
  "rawSolution": solution24
}
];
