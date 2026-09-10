import RemoveElementCandidateRaw from "../tasks/1_two_pointers/7_RemoveElement.js?raw";
import RemoveElementSolutionRaw from "../solutions/1_two_pointers/7_RemoveElement.js?raw";
import RemoveElementExplanationRaw from "../explanations/1_two_pointers/7_RemoveElement.md?raw";
import RunningSumCandidateRaw from "../tasks/4_prefix_sum/4_RunningSum.js?raw";
import RunningSumSolutionRaw from "../solutions/4_prefix_sum/4_RunningSum.js?raw";
import RunningSumExplanationRaw from "../explanations/4_prefix_sum/4_RunningSum.md?raw";
import RemoveAdjacentDuplicatesCandidateRaw from "../tasks/6_stack/4_RemoveAdjacentDuplicates.js?raw";
import RemoveAdjacentDuplicatesSolutionRaw from "../solutions/6_stack/4_RemoveAdjacentDuplicates.js?raw";
import RemoveAdjacentDuplicatesExplanationRaw from "../explanations/6_stack/4_RemoveAdjacentDuplicates.md?raw";
import PreorderTraversalCandidateRaw from "../tasks/8_dfs/5_PreorderTraversal.js?raw";
import PreorderTraversalSolutionRaw from "../solutions/8_dfs/5_PreorderTraversal.js?raw";
import PreorderTraversalExplanationRaw from "../explanations/8_dfs/5_PreorderTraversal.md?raw";
import MinimumDepthCandidateRaw from "../tasks/9_bfs/4_MinimumDepth.js?raw";
import MinimumDepthSolutionRaw from "../solutions/9_bfs/4_MinimumDepth.js?raw";
import MinimumDepthExplanationRaw from "../explanations/9_bfs/4_MinimumDepth.md?raw";
import FloodFillCandidateRaw from "../tasks/9_bfs/5_FloodFill.js?raw";
import FloodFillSolutionRaw from "../solutions/9_bfs/5_FloodFill.js?raw";
import FloodFillExplanationRaw from "../explanations/9_bfs/5_FloodFill.md?raw";
import GenerateBinaryStringsCandidateRaw from "../tasks/10_backtracking/5_GenerateBinaryStrings.js?raw";
import GenerateBinaryStringsSolutionRaw from "../solutions/10_backtracking/5_GenerateBinaryStrings.js?raw";
import GenerateBinaryStringsExplanationRaw from "../explanations/10_backtracking/5_GenerateBinaryStrings.md?raw";

export const REMOVE_ELEMENT_ENTRY_TASK = {
  id: "algo38",
  group: "Two Pointers",
  title: "1. Remove Element",
  desc: "Удалите заданное значение из массива на месте с помощью сонаправленных указателей read/write и верните длину полезного префикса.",
  difficulty: "easy",
  isRaw: true,
  candidate: RemoveElementCandidateRaw,
  rawCandidate: RemoveElementCandidateRaw,
  solution: RemoveElementSolutionRaw,
  rawSolution: RemoveElementSolutionRaw,
  explanation: RemoveElementExplanationRaw,
  filepath: "src/algorithms/tasks/1_two_pointers/7_RemoveElement.js",
  solutions: [{ title: "Рекомендуемое решение (Two Pointers: Read / Write)", isRecommended: true, badge: "O(n) время / O(1) память", recommendationNote: "Read просматривает каждый элемент, а write продвигается только после записи подходящего значения.", rawSolution: RemoveElementSolutionRaw, filepath: "src/algorithms/solutions/1_two_pointers/7_RemoveElement.js" }],
  articles: [{ title: "LeetCode #27", urlTitle: "LeetCode — Remove Element", url: "https://leetcode.com/problems/remove-element/" }],
  interviewerQuestions: [{ question: "Что находится после первых k элементов?", answer: "Эта часть массива не входит в ответ: её значения могут остаться любыми." }],
  checklist: ["Два сонаправленных индекса read/write", "Мутация nums на месте", "Сохранение порядка оставшихся элементов", "Возврат длины k", "O(n) время и O(1) память"],
};

export const RUNNING_SUM_ENTRY_TASK = {
  id: "algo39",
  group: "Prefix Sum",
  title: "1. Running Sum of 1d Array",
  desc: "Постройте массив, где каждый элемент равен сумме исходного массива от начала до текущего индекса включительно.",
  difficulty: "easy",
  isRaw: true,
  candidate: RunningSumCandidateRaw,
  rawCandidate: RunningSumCandidateRaw,
  solution: RunningSumSolutionRaw,
  rawSolution: RunningSumSolutionRaw,
  explanation: RunningSumExplanationRaw,
  filepath: "src/algorithms/tasks/4_prefix_sum/4_RunningSum.js",
  solutions: [{ title: "Рекомендуемое решение (Running Prefix Sum)", isRecommended: true, badge: "O(n) время / O(n) результат", recommendationNote: "Одна накопительная переменная переносит сумму предыдущего префикса на следующий индекс.", rawSolution: RunningSumSolutionRaw, filepath: "src/algorithms/solutions/4_prefix_sum/4_RunningSum.js" }],
  articles: [{ title: "LeetCode #1480", urlTitle: "LeetCode — Running Sum", url: "https://leetcode.com/problems/running-sum-of-1d-array/" }],
  interviewerQuestions: [{ question: "Можно ли получить O(1) дополнительной памяти?", answer: "Да, если по условию разрешено перезаписывать nums накопленными суммами." }],
  checklist: ["Накопительная сумма", "Один проход", "Корректный пустой массив", "Исходный порядок индексов", "O(n) время"],
};

export const REMOVE_ADJACENT_DUPLICATES_ENTRY_TASK = {
  id: "algo40",
  group: "Stack",
  title: "1. Remove All Adjacent Duplicates in String",
  desc: "Удалите соседние одинаковые символы, используя вершину стека для проверки каждой новой буквы.",
  difficulty: "easy",
  isRaw: true,
  candidate: RemoveAdjacentDuplicatesCandidateRaw,
  rawCandidate: RemoveAdjacentDuplicatesCandidateRaw,
  solution: RemoveAdjacentDuplicatesSolutionRaw,
  rawSolution: RemoveAdjacentDuplicatesSolutionRaw,
  explanation: RemoveAdjacentDuplicatesExplanationRaw,
  filepath: "src/algorithms/tasks/6_stack/4_RemoveAdjacentDuplicates.js",
  solutions: [{ title: "Рекомендуемое решение (LIFO Stack)", isRecommended: true, badge: "O(n) время / O(n) память", recommendationNote: "Совпадение с вершиной вызывает pop, иначе текущий символ добавляется через push.", rawSolution: RemoveAdjacentDuplicatesSolutionRaw, filepath: "src/algorithms/solutions/6_stack/4_RemoveAdjacentDuplicates.js" }],
  articles: [{ title: "LeetCode #1047", urlTitle: "LeetCode — Remove Adjacent Duplicates", url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/" }],
  interviewerQuestions: [{ question: "Почему одного прохода достаточно для цепной реакции удалений?", answer: "После pop новая вершина сразу становится соседом следующего входного символа, поэтому стек автоматически учитывает все предыдущие удаления." }],
  checklist: ["Массив как стек", "Сравнение с вершиной", "push для нового символа", "pop для пары", "join итогового стека"],
};

export const PREORDER_TRAVERSAL_ENTRY_TASK = {
  id: "algo41",
  group: "Depth-First Search",
  title: "1. Binary Tree Preorder Traversal",
  desc: "Верните значения бинарного дерева в порядке root-left-right, чтобы отработать чистый рекурсивный DFS без агрегации.",
  difficulty: "easy",
  isRaw: true,
  candidate: PreorderTraversalCandidateRaw,
  rawCandidate: PreorderTraversalCandidateRaw,
  solution: PreorderTraversalSolutionRaw,
  rawSolution: PreorderTraversalSolutionRaw,
  explanation: PreorderTraversalExplanationRaw,
  filepath: "src/algorithms/tasks/8_dfs/5_PreorderTraversal.js",
  solutions: [{ title: "Рекомендуемое решение (DFS: Preorder)", isRecommended: true, badge: "O(n) время / O(h) стек", recommendationNote: "Узел записывается до рекурсивных вызовов left и right — это определяет preorder.", rawSolution: PreorderTraversalSolutionRaw, filepath: "src/algorithms/solutions/8_dfs/5_PreorderTraversal.js" }],
  articles: [{ title: "LeetCode #144", urlTitle: "LeetCode — Preorder Traversal", url: "https://leetcode.com/problems/binary-tree-preorder-traversal/" }],
  interviewerQuestions: [{ question: "Как получить postorder из этого решения?", answer: "Перенести запись node.val после рекурсивных обходов left и right." }],
  checklist: ["Базовый случай null", "Сначала root", "Затем left", "Затем right", "O(n) время"],
};

export const MINIMUM_DEPTH_ENTRY_TASK = {
  id: "algo42",
  group: "Breadth-First Search",
  title: "1. Minimum Depth of Binary Tree",
  desc: "Найдите ближайший к корню лист с помощью BFS и раннего выхода из поуровневого обхода.",
  difficulty: "easy",
  isRaw: true,
  candidate: MinimumDepthCandidateRaw,
  rawCandidate: MinimumDepthCandidateRaw,
  solution: MinimumDepthSolutionRaw,
  rawSolution: MinimumDepthSolutionRaw,
  explanation: MinimumDepthExplanationRaw,
  filepath: "src/algorithms/tasks/9_bfs/4_MinimumDepth.js",
  solutions: [{ title: "Рекомендуемое решение (BFS: Early Exit)", isRecommended: true, badge: "O(n) время / O(w) память", recommendationNote: "Первый лист, извлечённый из FIFO-очереди, имеет минимальную возможную глубину.", rawSolution: MinimumDepthSolutionRaw, filepath: "src/algorithms/solutions/9_bfs/4_MinimumDepth.js" }],
  articles: [{ title: "LeetCode #111", urlTitle: "LeetCode — Minimum Depth", url: "https://leetcode.com/problems/minimum-depth-of-binary-tree/" }],
  interviewerQuestions: [{ question: "Почему первый узел без одного ребёнка не всегда является ответом?", answer: "Листом считается только узел, у которого одновременно отсутствуют left и right." }],
  checklist: ["Пустое дерево возвращает 0", "FIFO-очередь", "Хранение глубины", "Лист без обоих детей", "Ранний возврат"],
};

export const FLOOD_FILL_ENTRY_TASK = {
  id: "algo43",
  group: "Breadth-First Search",
  title: "3. Flood Fill",
  desc: "Перекрасьте связную область матрицы через очередь, проверку четырёх соседей и раннюю отметку посещённых клеток.",
  difficulty: "easy",
  isRaw: true,
  candidate: FloodFillCandidateRaw,
  rawCandidate: FloodFillCandidateRaw,
  solution: FloodFillSolutionRaw,
  rawSolution: FloodFillSolutionRaw,
  explanation: FloodFillExplanationRaw,
  filepath: "src/algorithms/tasks/9_bfs/5_FloodFill.js",
  solutions: [{ title: "Рекомендуемое решение (BFS: Flood Fill)", isRecommended: true, badge: "O(m * n) время / O(m * n) память", recommendationNote: "Клетка перекрашивается при постановке в очередь, поэтому ни один сосед не добавит её повторно.", rawSolution: FloodFillSolutionRaw, filepath: "src/algorithms/solutions/9_bfs/5_FloodFill.js" }],
  articles: [{ title: "LeetCode #733", urlTitle: "LeetCode — Flood Fill", url: "https://leetcode.com/problems/flood-fill/" }],
  interviewerQuestions: [{ question: "Зачем отдельно проверять sourceColor === color?", answer: "Без раннего возврата перекрашивание не сможет служить отметкой visited, и клетки будут добавляться снова." }],
  checklist: ["Сохранение исходного цвета", "Проверка одинакового цвета", "Четыре направления", "Проверка границ", "Отметка до enqueue"],
};

export const GENERATE_BINARY_STRINGS_ENTRY_TASK = {
  id: "algo44",
  group: "Backtracking",
  title: "1. Generate Binary Strings",
  desc: "Сгенерируйте все строки длины n, делая в каждой позиции простой бинарный выбор между 0 и 1.",
  difficulty: "easy",
  isRaw: true,
  candidate: GenerateBinaryStringsCandidateRaw,
  rawCandidate: GenerateBinaryStringsCandidateRaw,
  solution: GenerateBinaryStringsSolutionRaw,
  rawSolution: GenerateBinaryStringsSolutionRaw,
  explanation: GenerateBinaryStringsExplanationRaw,
  filepath: "src/algorithms/tasks/10_backtracking/5_GenerateBinaryStrings.js",
  solutions: [{ title: "Рекомендуемое решение (Backtracking: Binary Choice)", isRecommended: true, badge: "O(n * 2^n) время / O(n) стек", recommendationNote: "Каждый уровень добавляет один символ, а две рекурсивные ветки формируют полное дерево решений.", rawSolution: GenerateBinaryStringsSolutionRaw, filepath: "src/algorithms/solutions/10_backtracking/5_GenerateBinaryStrings.js" }],
  articles: [{ title: "Рекурсивные алгоритмы", urlTitle: "Яндекс Образование — Хендбук", url: "https://education.yandex.ru/handbook/algorithms/article/rekursivnye-algoritmy" }],
  interviewerQuestions: [{ question: "Почему для n = 0 результат содержит пустую строку?", answer: "Существует ровно один способ выбрать ноль символов — ничего не выбрать; это базовый случай рекурсии." }],
  checklist: ["Базовый случай длины n", "Ветка с 0", "Ветка с 1", "Сохранение готовой строки", "Корректный n = 0"],
};
