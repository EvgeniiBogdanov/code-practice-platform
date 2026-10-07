import type { AlgorithmInput, TracePanel, TraceStep } from "./algorithmTrace";
import { createTraceRecorder } from "../lib/traceRecorder";
import { graphScene, layeredLayout, type GraphEdge } from "./graphScene";
import { mapPanel } from "./hashTraces";
import { tracePanel } from "./structureScene";

const balance = (label: string, entries: readonly [string, string, boolean?][]): TracePanel => ({
  kind: "balance",
  label,
  entries: entries.map(([key, value, active]) => ({ key, value, active: Boolean(active) })),
});

export const buildCourseScheduleTrace = ({
  parameter: numCourses,
  pairs = [],
}: AlgorithmInput): readonly TraceStep[] => {
  // Решение читает пары как [course, prerequisite]; ребро графа идёт prerequisite → course.
  const dependencies: GraphEdge[] = pairs.map(([course, prerequisite]) => [prerequisite, course]);
  const ids = Array.from({ length: numCourses }, (_, id) => id);
  const layout = layeredLayout(ids, dependencies);
  const indegree = new Map<number, number>(ids.map((id) => [id, 0]));
  const edges: GraphEdge[] = [];
  const queue: number[] = [];
  const done = new Set<number>();
  let head = 0;
  let active: number[] = [];
  let processed = 0;
  let finished = false;
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: graphScene("Граф зависимостей · стрелка: «сначала → потом»", {
      layout,
      edges,
      caption: (id) => `indeg ${indegree.get(id)}`,
      state: (id) =>
        active.includes(id)
          ? "active"
          : done.has(id)
            ? "done"
            : queue.slice(head).includes(id)
              ? "frontier"
              : finished && !done.has(id)
                ? "rejected"
                : undefined,
    }),
    panels: [
      tracePanel("queue · очередь FIFO, выход слева", queue.slice(head), -1),
      balance("Счётчик", [["processed", `${processed} / ${numCourses}`, true]]),
      mapPanel(indegree, "indegree · курс → невыполненные зависимости"),
    ],
  }));
  add(
    "const graph = Array.from",
    "Курсы без зависимостей",
    `Создаём ${numCourses} вершин. Пока у всех indegree = 0.`
  );
  pairs.forEach(([course, prerequisite]) => {
    active = [course, prerequisite];
    add(
      "for (const [course, prerequisite] of prerequisites)",
      "Читаем зависимость",
      `Курс ${course} требует курс ${prerequisite}: сначала ${prerequisite}, потом ${course}.`
    );
    edges.push([prerequisite, course]);
    add(
      "graph[prerequisite].push(course)",
      "Строим ребро",
      `Ребро ${prerequisite} → ${course}: после ${prerequisite} открывается ${course}.`
    );
    indegree.set(course, (indegree.get(course) ?? 0) + 1);
    add(
      "indegree[course]++",
      "Растёт indegree",
      `У курса ${course} стало невыполненных зависимостей: ${indegree.get(course)}.`
    );
  });
  active = [];
  add(
    "const queue = []",
    "Очередь Кана",
    "В очередь попадают курсы, у которых нет невыполненных зависимостей."
  );
  ids.forEach((course) => {
    active = [course];
    add(
      "for (let course = 0; course < numCourses; course++)",
      "Проверяем курс",
      `Курс ${course}: indegree = ${indegree.get(course)}.`
    );
    const ready = indegree.get(course) === 0;
    add(
      "if (indegree[course] === 0)",
      ready ? "Нет зависимостей" : "Есть зависимости",
      ready
        ? `У курса ${course} зависимостей нет: его можно проходить сразу.`
        : `Курс ${course} ждёт ${indegree.get(course)} зависимостей.`
    );
    if (ready) {
      queue.push(course);
      add("queue.push(course)", "В очередь", `Курс ${course} ждёт обработки.`);
    }
  });
  active = [];
  add(
    "let processed = 0",
    "Счётчик пройденных",
    "Если в конце processed меньше numCourses, часть курсов осталась заблокирована зависимостями из цикла."
  );
  const next = new Map<number, number[]>(ids.map((id) => [id, []]));
  dependencies.forEach(([from, to]) => next.get(from)!.push(to));
  for (head = 0; head < queue.length; head++) {
    const course = queue[head];
    active = [];
    add(
      "for (let head = 0; head < queue.length; head++)",
      "Берём курс из очереди",
      `Очередь не пуста: следующим идёт курс ${course}.`
    );
    active = [course];
    add(
      "const course = queue[head]",
      "Курс обрабатывается",
      `Курс ${course} можно пройти: все его зависимости выполнены.`
    );
    processed++;
    add("processed++", "Курс пройден", `Пройдено курсов: ${processed}.`);
    done.add(course);
    for (const target of next.get(course)!) {
      active = [course, target];
      add(
        "for (const next of graph[course])",
        "Открываем зависимые курсы",
        `От курса ${course} зависит курс ${target}.`
      );
      indegree.set(target, indegree.get(target)! - 1);
      add(
        "indegree[next]--",
        "Снимаем зависимость",
        `У курса ${target} осталось зависимостей: ${indegree.get(target)}.`
      );
      const ready = indegree.get(target) === 0;
      add(
        "if (indegree[next] === 0)",
        ready ? "Курс освободился" : "Ещё ждёт",
        ready
          ? `У курса ${target} не осталось зависимостей: он готов.`
          : `Курс ${target} всё ещё ждёт другие курсы.`
      );
      if (ready) {
        queue.push(target);
        add("queue.push(next)", "В очередь", `Курс ${target} добавлен в конец очереди.`);
      }
    }
  }
  active = [];
  finished = true;
  const possible = processed === numCourses;
  add(
    "return processed === numCourses",
    possible ? "Цикла нет" : "Есть цикл",
    possible
      ? `Пройдены все ${numCourses} курсов: порядок существует.`
      : `Пройдено ${processed} из ${numCourses}. Остальные курсы ждут друг друга по кругу.`,
    { result: possible }
  );
  return steps;
};

export const buildParallelCoursesTrace = ({
  parameter: n,
  pairs = [],
  times = [],
}: AlgorithmInput): readonly TraceStep[] => {
  const dependencies: GraphEdge[] = [...pairs];
  const ids = Array.from({ length: n }, (_, index) => index + 1);
  const layout = layeredLayout(ids, dependencies);
  const indegree = new Map<number, number>(ids.map((id) => [id, 0]));
  const start = new Map<number, number>(ids.map((id) => [id, 0]));
  const finishAt = new Map<number, number>();
  const edges: GraphEdge[] = [];
  const queue: number[] = [];
  let head = 0;
  let active: number[] = [];
  let answer = 0;
  const timeline = new Map<string, string>();
  const { steps, add } = createTraceRecorder(() => ({
    values: [],
    pointers: [],
    structure: graphScene("Курсы и зависимости · t — длительность в месяцах", {
      layout,
      edges,
      caption: (id) =>
        finishAt.has(id) ? `${start.get(id)}→${finishAt.get(id)}` : `t=${times[id - 1]}`,
      state: (id) =>
        active.includes(id)
          ? "active"
          : finishAt.has(id)
            ? "done"
            : queue.slice(head).includes(id)
              ? "frontier"
              : undefined,
    }),
    panels: [
      tracePanel("queue · очередь FIFO, выход слева", queue.slice(head), -1),
      balance("Ответ", [["answer", `${answer} мес.`, true]]),
      mapPanel(timeline, "Расписание · курс → старт→конец"),
    ],
  }));
  add(
    "const graph = Array.from",
    "Курсы и длительности",
    `Курсов: ${n}. Параллельное обучение не ограничено, поэтому важен самый долгий путь зависимостей.`
  );
  pairs.forEach(([prev, next]) => {
    active = [prev, next];
    add(
      "for (const [prev, next] of relations)",
      "Читаем зависимость",
      `Курс ${prev} нужно завершить до начала курса ${next}.`
    );
    edges.push([prev, next]);
    add("graph[prev].push(next)", "Строим ребро", `Ребро ${prev} → ${next}.`);
    indegree.set(next, (indegree.get(next) ?? 0) + 1);
    add(
      "indegree[next]++",
      "Растёт indegree",
      `У курса ${next} невыполненных зависимостей: ${indegree.get(next)}.`
    );
  });
  active = [];
  add(
    "const start = new Array(n + 1).fill(0)",
    "Самое раннее начало",
    "start[course] — месяц, раньше которого курс начать нельзя. Пока везде 0."
  );
  add("const queue = []", "Очередь Кана", "Стартуем с курсов без зависимостей.");
  ids.forEach((course) => {
    active = [course];
    add(
      "for (let course = 1; course <= n; course++)",
      "Проверяем курс",
      `Курс ${course}: indegree = ${indegree.get(course)}.`
    );
    const ready = indegree.get(course) === 0;
    add(
      "if (indegree[course] === 0)",
      ready ? "Нет зависимостей" : "Есть зависимости",
      ready ? `Курс ${course} начнётся в месяц 0.` : `Курс ${course} ждёт зависимости.`
    );
    if (ready) {
      queue.push(course);
      add("queue.push(course)", "В очередь", `Курс ${course} готов к старту.`);
    }
  });
  active = [];
  add("let answer = 0", "Ответ", "answer — самый поздний месяц завершения среди курсов.");
  const next = new Map<number, number[]>(ids.map((id) => [id, []]));
  dependencies.forEach(([from, to]) => next.get(from)!.push(to));
  for (head = 0; head < queue.length; head++) {
    const course = queue[head];
    active = [];
    add(
      "for (let head = 0; head < queue.length; head++)",
      "Берём курс из очереди",
      `Следующим стартует курс ${course}.`
    );
    active = [course];
    const finish = start.get(course)! + times[course - 1];
    finishAt.set(course, finish);
    timeline.set(`курс ${course}`, `${start.get(course)}→${finish}`);
    add(
      "const course = queue[head]",
      "Курс стартует",
      `Курс ${course} начинается в месяц ${start.get(course)}.`
    );
    add(
      "const finish = start[course] + time[course - 1]",
      "Время завершения",
      `Курс ${course} длится ${times[course - 1]} мес. и закончится к месяцу ${finish}.`,
      { formula: `${start.get(course)} + ${times[course - 1]} = ${finish}` }
    );
    const previous = answer;
    answer = Math.max(answer, finish);
    add(
      "answer = Math.max(answer, finish)",
      "Обновляем ответ",
      answer > previous
        ? `${finish} больше ${previous}: ответ теперь ${answer}.`
        : `${finish} не больше ${previous}: ответ остаётся ${answer}.`,
      { formula: `max(${previous}, ${finish}) = ${answer}` }
    );
    for (const target of next.get(course)!) {
      active = [course, target];
      add(
        "for (const next of graph[course])",
        "Зависимые курсы",
        `Курс ${target} ждёт завершения курса ${course}.`
      );
      const old = start.get(target)!;
      start.set(target, Math.max(old, finish));
      add(
        "start[next] = Math.max(start[next], finish)",
        "Самый поздний предшественник",
        `Курс ${target} стартует после самой долгой зависимости: максимум из ${old} и ${finish}.`,
        { formula: `max(${old}, ${finish}) = ${start.get(target)}` }
      );
      indegree.set(target, indegree.get(target)! - 1);
      add(
        "indegree[next]--",
        "Снимаем зависимость",
        `У курса ${target} осталось зависимостей: ${indegree.get(target)}.`
      );
      const ready = indegree.get(target) === 0;
      add(
        "if (indegree[next] === 0)",
        ready ? "Курс освободился" : "Ещё ждёт",
        ready
          ? `Курс ${target} получил окончательное время старта: ${start.get(target)}.`
          : `Курс ${target} ждёт другие зависимости.`
      );
      if (ready) {
        queue.push(target);
        add("queue.push(next)", "В очередь", `Курс ${target} добавлен в очередь.`);
      }
    }
  }
  active = [];
  add(
    "return answer",
    "Результат",
    `Все курсы можно пройти за ${answer} мес.: это длина критического пути.`,
    { result: answer }
  );
  return steps;
};
