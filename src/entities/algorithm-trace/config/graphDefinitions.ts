import type { AlgorithmDefinition } from "../model/algorithmTrace";
import { buildCourseScheduleTrace, buildParallelCoursesTrace } from "../model/graphTraces";

export const graphDefinitions = {
  algo52: {
    pattern: "BFS · топологическая сортировка (алгоритм Кана)",
    invariant:
      "В очереди — курсы без невыполненных зависимостей. Курсы цикла никогда не получат indegree 0, поэтому останутся необработанными.",
    complexity: "O(V + E) время · O(V + E) память",
    inputKind: "graph",
    inputLabel: "prerequisites",
    inputHint:
      "До 12 пар [курс, требование]. Курс требует выполнить «требование» раньше. numCourses — от 1 до 8.",
    parameter: "numCourses",
    stateLabels: {
      active: "Обрабатывается",
      frontier: "В очереди",
      done: "Пройден",
      rejected: "В цикле",
    },
    build: buildCourseScheduleTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: 2 курса, [[1,0]]",
        input: "[[1,0]]",
        parameter: "2",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: цикл [[1,0],[0,1]]",
        input: "[[1,0],[0,1]]",
        parameter: "2",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: цепочка из 4 курсов",
        input: "[[1,0],[2,1],[3,2]]",
        parameter: "4",
        isTask: true,
      },
      {
        id: "task-4",
        label: "Пример 4: нет зависимостей",
        input: "[]",
        parameter: "3",
        isTask: true,
      },
      {
        id: "diamond",
        label: "Ромб: [[1,0],[2,0],[3,1],[3,2]]",
        input: "[[1,0],[2,0],[3,1],[3,2]]",
        parameter: "4",
      },
      {
        id: "partial",
        label: "Цикл внутри графа: [[1,0],[2,1],[1,2]]",
        input: "[[1,0],[2,1],[1,2]]",
        parameter: "3",
      },
    ],
  },
  algo53: {
    pattern: "BFS · топологическая сортировка + критический путь",
    invariant:
      "Курс стартует после самой долгой зависимости: start[next] = max(start[next], finish). Ответ — максимум finish по всем курсам.",
    complexity: "O(n + E) время · O(n + E) память",
    inputKind: "courses",
    inputLabel: "relations",
    inputHint:
      "До 12 пар [prev, next] с номерами курсов от 1 до n. В поле time — длительности курсов (от 1 до 9), n = их число.",
    parameter: "time",
    stateLabels: { active: "Обрабатывается", frontier: "В очереди", done: "Завершён" },
    build: buildParallelCoursesTrace,
    examples: [
      {
        id: "task-1",
        label: "Пример 1: [[1,3],[2,3]], time = [3,2,5]",
        input: "[[1,3],[2,3]]",
        parameter: "3, 2, 5",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: 5 курсов, ответ 12",
        input: "[[1,5],[2,5],[3,5],[3,4],[4,5]]",
        parameter: "1, 2, 3, 4, 5",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: без зависимостей",
        input: "[]",
        parameter: "4, 7",
        isTask: true,
      },
      {
        id: "chain",
        label: "Цепочка: [[1,2],[2,3]], time = [2,3,4]",
        input: "[[1,2],[2,3]]",
        parameter: "2, 3, 4",
      },
    ],
  },
} satisfies Record<string, AlgorithmDefinition>;
