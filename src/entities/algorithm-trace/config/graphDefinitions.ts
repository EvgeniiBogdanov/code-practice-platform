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
        label: "Пример 1: 3 курса, [[1,0],[2,0]]",
        input: "[[1,0],[2,0]]",
        parameter: "3",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: цикл из 3 курсов",
        input: "[[0,1],[1,2],[2,0]]",
        parameter: "3",
        isTask: true,
      },
      {
        id: "task-3",
        label: "Пример 3: цикл в середине цепочки",
        input: "[[1,0],[2,1],[3,2],[1,3]]",
        parameter: "4",
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
        label: "Пример 1: [[1,2],[1,3],[2,4],[3,4]], time = [2,3,1,4]",
        input: "[[1,2],[1,3],[2,4],[3,4]]",
        parameter: "2, 3, 1, 4",
        isTask: true,
      },
      {
        id: "task-2",
        label: "Пример 2: цепочка из 3 курсов, ответ 15",
        input: "[[1,2],[2,3]]",
        parameter: "5, 5, 5",
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
