import { describe, expect, it } from "vitest";
import { TASK_EXPLANATIONS } from "../../taskExplanations";
import { enrichJavaScriptExplanations } from "./javascript-explanations";
import {
  JS_ARRAYS_REDUCE_TASKS,
  JS_CLOSURES_TASKS,
  JS_COLLECTIONS_MAP_TASKS,
  JS_FOR_OF_TASKS,
  JS_LOOPS_TASKS,
  JS_OBJECTS_TASKS,
  JS_RECURSION_TASKS,
  JS_STRING_DOM_UTILS_TASKS,
  JS_TYPES_COERCION_TASKS,
  JS_WHILE_TASKS,
} from "./tasksData";

const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

describe("JavaScript task explanations", () => {
  it("keeps an explanation for every JavaScript task", () => {
    const javascriptExplanations = Object.entries(TASK_EXPLANATIONS).filter(([taskId]) =>
      taskId.startsWith("js")
    );

    expect(javascriptExplanations.length).toBeGreaterThanOrEqual(195);
    expect(javascriptExplanations.every(([, explanation]) => explanation.trim().length > 0)).toBe(
      true
    );
  });

  it("adds the verified mental model and pitfalls to a short basic explanation", () => {
    const enriched = enrichJavaScriptExplanations({
      js14: "### Суть\nКороткий разбор.\n\n```js\nconst values = [];\n```",
    });

    expect(enriched.js14).toContain("Как рассуждать");
    expect(enriched.js14).toContain("Граничные случаи и частые ошибки");
    expect(enriched.js14).not.toContain("Алгоритм до написания кода");
  });

  it("does not use the stale generated hints for remapped advanced tasks", () => {
    expect(TASK_EXPLANATIONS.js158).toContain("исходный порядок");
    expect(TASK_EXPLANATIONS.js158).toContain("fail-fast");
    expect(TASK_EXPLANATIONS.js158).not.toContain("Debounce откладывает");
  });

  it("documents limitations and edge cases of the current solutions", () => {
    expect(TASK_EXPLANATIONS.js194).toContain("`O(1)` **в лучшем случае**");
    expect(TASK_EXPLANATIONS.js194).toContain("Худший случай");
  });

  it("explains the requested reduce tasks in enough depth for a junior", () => {
    const reduceTaskIds = [
      "js54",
      "js55",
      "js56",
      "js57",
      "js58",
      "js59",
      "js60",
      "js63",
      "js64",
      "js65",
      "js66",
      "js67",
    ];

    for (const taskId of reduceTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(200);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить");
    }
  });

  it("calls out mismatches between the wording and current reduce solutions", () => {
    expect(TASK_EXPLANATIONS.js60).toContain("только группирует");
    expect(TASK_EXPLANATIONS.js60).toContain("действительно сортирует группы");
    expect(TASK_EXPLANATIONS.js63).toContain("формально этому дополнительному ограничению не соответствует");
    expect(TASK_EXPLANATIONS.js64).toContain("Если во входном примере используются `{ name, count }`");
  });

  it("uses an article description that matches the Company X grouping task", () => {
    const task = JS_ARRAYS_REDUCE_TASKS.find(({ id }) => id === "js67");

    expect(task?.articles).toEqual([
      {
        title: "Индексация массива объектов по id (JavaScript.ru)",
        urlTitle: "Учебник JavaScript — Создайте объект с ключами из массива",
        url: "https://learn.javascript.ru/array-methods#sozdayte-obekt-s-klyuchami-iz-massiva",
      },
    ]);
  });

  it("provides substantial dedicated material for every visible Map task", () => {
    const mapTaskIds = JS_COLLECTIONS_MAP_TASKS.map(({ id }) => id);

    expect(mapTaskIds).toHaveLength(12);
    expect(mapTaskIds).toContain("js196");

    for (const taskId of mapTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(250);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить");
    }
  });

  it("documents the important limitations of the current Map solutions", () => {
    expect(TASK_EXPLANATIONS.js91).toContain("существующие значения `0`, `false`");
    expect(TASK_EXPLANATIONS.js92).toContain("отдельная проверка `map.has(key)` не нужна");
    expect(TASK_EXPLANATIONS.js100).toContain("Просроченные ключи не удаляются по таймеру");
    expect(TASK_EXPLANATIONS.js101).toContain("`fn.apply(this, args)`");
    expect(TASK_EXPLANATIONS.js196).toContain("O(n²)");
  });

  it("provides substantial dedicated material for every visible while task", () => {
    const whileTaskIds = JS_WHILE_TASKS.map(({ id }) => id);

    expect(whileTaskIds).toEqual(
      Array.from({ length: 8 }, (_, index) => `js_while_${index + 1}`)
    );

    for (const taskId of whileTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(250);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что делает решение");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить");
    }
  });

  it("calls out the important contracts and pitfalls of the current while solutions", () => {
    expect(TASK_EXPLANATIONS.js_while_1).toContain("заблокирует основной поток");
    expect(TASK_EXPLANATIONS.js_while_2).toContain("Это не то же самое, что `while (n--)`");
    expect(TASK_EXPLANATIONS.js_while_3).toContain("`Number.MAX_SAFE_INTEGER`");
    expect(TASK_EXPLANATIONS.js_while_4).toContain("отрицательного `num`");
    expect(TASK_EXPLANATIONS.js_while_5).toContain("`(0, 0)`");
    expect(TASK_EXPLANATIONS.js_while_6).toContain("не обязательно первый или последний");
    expect(TASK_EXPLANATIONS.js_while_7).toContain("Циклический список");
    expect(TASK_EXPLANATIONS.js_while_8).toContain("стабильного слияния");
  });

  it("provides substantial material for the requested loop and utility folders", () => {
    const requestedGroups = [
      JS_LOOPS_TASKS,
      JS_FOR_OF_TASKS,
      JS_CLOSURES_TASKS,
      JS_RECURSION_TASKS,
      JS_STRING_DOM_UTILS_TASKS,
    ];
    const requestedTaskIds = requestedGroups.flatMap((tasks) => tasks.map(({ id }) => id));

    expect(requestedTaskIds).toHaveLength(41);
    expect(JS_LOOPS_TASKS.map(({ id }) => id)).toEqual(
      Array.from({ length: 7 }, (_, index) => `js${index + 1}`)
    );
    expect(JS_FOR_OF_TASKS.map(({ id }) => id)).toEqual(
      Array.from({ length: 6 }, (_, index) => `js${index + 8}`)
    );
    expect(JS_CLOSURES_TASKS.map(({ id }) => id)).toEqual(
      Array.from({ length: 6 }, (_, index) => `js${index + 126}`)
    );
    expect(JS_RECURSION_TASKS.map(({ id }) => id)).toEqual(
      Array.from({ length: 16 }, (_, index) => `js${index + 132}`)
    );

    for (const taskId of requestedTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(225);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить");
    }
  });

  it("documents mismatches and non-obvious behavior in the new explanations", () => {
    expect(TASK_EXPLANATIONS.js7).toContain("лучший случай здесь тоже `O(n²)`");
    expect(TASK_EXPLANATIONS.js11).toContain("умеет находить `NaN`");
    expect(TASK_EXPLANATIONS.js129).toContain("сохранённую локальную переменную `message`");
    expect(TASK_EXPLANATIONS.js136).toContain("могут достигать `O(n²)`");
    expect(TASK_EXPLANATIONS.js142).toContain("вернёт `true` и для папки");
    expect(TASK_EXPLANATIONS.js144).toContain("добавляет **только числа**");
  });

  it("provides a specification-based explanation for every data-types task", () => {
    const typeTaskIds = JS_TYPES_COERCION_TASKS.map(({ id }) => id);

    expect(typeTaskIds).toEqual(["js186", "js187", "js188"]);

    for (const taskId of typeTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(500);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить");
    }
  });

  it("explains the coercion algorithms instead of only listing their results", () => {
    expect(TASK_EXPLANATIONS.js186).toContain("Пошаговый разбор [] == ![]");
    expect(TASK_EXPLANATIONS.js186).toContain("Бинарный `+` перегружен");
    expect(TASK_EXPLANATIONS.js187).toContain("Контекстная ловушка {} + []");
    expect(TASK_EXPLANATIONS.js187).toContain("разные алгоритмы");
    expect(TASK_EXPLANATIONS.js188).toContain("SameValueZero");
    expect(TASK_EXPLANATIONS.js188).toContain("работающая и с массивами из другого iframe/realm");
  });

  it("provides substantial dedicated material for the audited advanced tasks", () => {
    const detailedTaskIds = [
      "js90",
      "js158",
      "js159",
      "js160",
      "js165",
      "js166",
      "js170",
      "js171",
      "js173",
      "js176",
      "js177",
      "js178",
      ...Array.from({ length: 7 }, (_, index) => `js${189 + index}`),
    ];

    for (const taskId of detailedTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(200);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить");
    }
  });

  it("provides comprehensive deep explanations for all tasks in the Objects section", () => {
    const objectTaskIds = JS_OBJECTS_TASKS.map(({ id }) => id);

    expect(objectTaskIds).toHaveLength(26);

    for (const taskId of objectTaskIds) {
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(150);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что делает решение");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить для собеседования");
    }

    // Specific architectural highlights
    expect(TASK_EXPLANATIONS.js197).toContain("hidden classes");
    expect(TASK_EXPLANATIONS.js198).toContain("Object.hasOwn");
    expect(TASK_EXPLANATIONS.js199).toContain("OrdinaryOwnPropertyKeys");
    expect(TASK_EXPLANATIONS.js200).toContain("undefined");
    expect(TASK_EXPLANATIONS.js201).toContain("Shallow Copy");
    expect(TASK_EXPLANATIONS.js202).toContain("Symbol");
    expect(TASK_EXPLANATIONS.js203).toContain("invert");
    expect(TASK_EXPLANATIONS.js204).toContain("whitelist");
    expect(TASK_EXPLANATIONS.js205).toContain("Set");
    expect(TASK_EXPLANATIONS.js206).toContain("Object.is");
    expect(TASK_EXPLANATIONS.js207).toContain("defaultValue");
    expect(TASK_EXPLANATIONS.js208).toContain("Prototype Pollution");
    expect(TASK_EXPLANATIONS.js209).toContain("flatten");
    expect(TASK_EXPLANATIONS.js170).toContain("Object.freeze");
    expect(TASK_EXPLANATIONS.js210).toContain("WeakMap");
    expect(TASK_EXPLANATIONS.js211).toContain("isPlainObject");
  });

  it("provides deep interview explanations for all newly added JS tasks (js216-js231)", () => {
    const newInterviewTaskIds = Array.from({ length: 16 }, (_, index) => `js${216 + index}`);

    for (const taskId of newInterviewTaskIds) {
      expect(TASK_EXPLANATIONS[taskId], `Explanation for ${taskId} must exist`).toBeDefined();
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(120);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что делает решение");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить для собеседования");
    }

    // Check specific technical topics
    expect(TASK_EXPLANATIONS.js216).toContain("деструктуризаци");
    expect(TASK_EXPLANATIONS.js217).toContain("Structural Sharing");
    expect(TASK_EXPLANATIONS.js218).toContain("finally");
    expect(TASK_EXPLANATIONS.js219).toContain("cause");
    expect(TASK_EXPLANATIONS.js220).toContain("once");
    expect(TASK_EXPLANATIONS.js221).toContain("myBind");
    expect(TASK_EXPLANATIONS.js222).toContain("Object.defineProperty");
    expect(TASK_EXPLANATIONS.js223).toContain("Reflect.ownKeys");
    expect(TASK_EXPLANATIONS.js224).toContain("Symbol.toPrimitive");
    expect(TASK_EXPLANATIONS.js225).toContain("Proxy");
    expect(TASK_EXPLANATIONS.js226).toContain("WeakMap");
    expect(TASK_EXPLANATIONS.js227).toContain("WeakSet");
    expect(TASK_EXPLANATIONS.js228).toContain("Prototype Pollution");
    expect(TASK_EXPLANATIONS.js229).toContain("Object.create");
    expect(TASK_EXPLANATIONS.js230).toContain("instanceof");
    expect(TASK_EXPLANATIONS.js231).toContain("extends");
  });

  it("provides deep interview explanations for all newly added array/transformation tasks", () => {
    const newTasks = [
      "js232", "js233", "js234", "js235",
      "js241", "js242", "js243", "js244", "js245", "js246", "js247", "js248",
    ];

    for (const taskId of newTasks) {
      expect(TASK_EXPLANATIONS[taskId], `Explanation for ${taskId} must exist`).toBeDefined();
      expect(countWords(TASK_EXPLANATIONS[taskId]), taskId).toBeGreaterThan(120);
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что делает решение");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Граничные случаи и ошибки");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Сложность");
      expect(TASK_EXPLANATIONS[taskId], taskId).toContain("Что запомнить для собеседования");
    }

    // Check specific technical topics
    expect(TASK_EXPLANATIONS.js232).toContain("Array.prototype.map");
    expect(TASK_EXPLANATIONS.js233).toContain("Array.prototype.filter");
    expect(TASK_EXPLANATIONS.js234).toContain("Array.prototype.reduce");
    expect(TASK_EXPLANATIONS.js235).toContain("chunk");
    expect(TASK_EXPLANATIONS.js241).toContain("LRUCache");
    expect(TASK_EXPLANATIONS.js242).toContain("Hash Join");
    expect(TASK_EXPLANATIONS.js243).toContain("Unicode");
    expect(TASK_EXPLANATIONS.js244).toContain("Лексический");
    expect(TASK_EXPLANATIONS.js245).toContain("replaceAll");
    expect(TASK_EXPLANATIONS.js246).toContain("diff");
    expect(TASK_EXPLANATIONS.js247).toContain("safeGet");
    expect(TASK_EXPLANATIONS.js248).toContain("camelCase");
  });
});
