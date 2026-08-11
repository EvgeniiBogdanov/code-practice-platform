import TwoSumIICandidateRaw from "../tasks/1_two_pointers/1_TwoSumII.js?raw";
import TwoSumIISolutionRaw from "../solutions/1_two_pointers/1_TwoSumII.js?raw";
import TwoSumIIExplanationRaw from "../explanations/1_two_pointers/1_TwoSumII.md?raw";

import ValidPalindromeCandidateRaw from "../tasks/1_two_pointers/2_ValidPalindrome.js?raw";
import ValidPalindromeSolutionRaw from "../solutions/1_two_pointers/2_ValidPalindrome.js?raw";
import ValidPalindromeExplanationRaw from "../explanations/1_two_pointers/2_ValidPalindrome.md?raw";

import ThreeSumCandidateRaw from "../tasks/1_two_pointers/3_ThreeSum.js?raw";
import ThreeSumSolutionRaw from "../solutions/1_two_pointers/3_ThreeSum.js?raw";
import ThreeSumExplanationRaw from "../explanations/1_two_pointers/3_ThreeSum.md?raw";

export const ALGO_TWO_POINTERS_TASKS = [
  {
    id: "algo1",
    group: "Two Pointers",
    title: "1. Two Sum II - Input Array Is Sorted",
    desc: "Напишите функцию twoSum(numbers, target), которая находит два числа в отсортированном массиве с суммой target и возвращает их 1-based индексы за O(1) памяти.",
    difficulty: "medium",
    isRaw: true,
    candidate: TwoSumIICandidateRaw,
    rawCandidate: TwoSumIICandidateRaw,
    solution: TwoSumIISolutionRaw,
    rawSolution: TwoSumIISolutionRaw,
    explanation: TwoSumIIExplanationRaw,
    filepath: "src/algorithms/tasks/1_two_pointers/1_TwoSumII.js",
    solutions: [
      {
        title: "Рекомендуемое решение (Two Pointers)",
        isRecommended: true,
        badge: "O(n) время / O(1) память",
        recommendationNote: "Два указателя двигаются навстречу друг другу с концов массива, обеспечивая линейную сложность без использования дополнительной памяти.",
        rawSolution: TwoSumIISolutionRaw,
        filepath: "src/algorithms/solutions/1_two_pointers/1_TwoSumII.js",
      },
    ],
    articles: [
      { title: "LeetCode #167", urlTitle: "LeetCode — Two Sum II", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { title: "Метод двух указателей (Two Pointers)", urlTitle: "Habr — Обзор техники", url: "https://habr.com/ru/articles/" },
      { title: "Алгоритм «два указателя»", urlTitle: "Metanit — Объяснение с примерами", url: "https://metanit.com/" },
      { title: "Two Sum — разбор задачи", urlTitle: "LeetCode — Русскоязычное сообщество", url: "https://leetcode.com/problemset/" },
    ],
    interviewerQuestions: [
      { question: "Почему нельзя использовать HashMap в этой задаче?", answer: "Условие требует O(1) дополнительной памяти, а HashMap затребовала бы O(n) памяти." },
      { question: "Почему Two Pointers работает за O(n)?", answer: "Каждый шаг сдвигает left вправо или right влево, поэтому сумма шагов не превышает длину массива n." },
    ],
    checklist: ["Использование O(1) дополнительной памяти", "Возврат 1-based индексов", "Массив отсортирован по неубыванию"],
  },
  {
    id: "algo2",
    group: "Two Pointers",
    title: "2. Valid Palindrome",
    desc: "Проверьте, является ли строка палиндромом после приведения к нижнему регистру и отбрасывания всех не буквенно-цифровых символов.",
    difficulty: "easy",
    isRaw: true,
    candidate: ValidPalindromeCandidateRaw,
    rawCandidate: ValidPalindromeCandidateRaw,
    solution: ValidPalindromeSolutionRaw,
    rawSolution: ValidPalindromeSolutionRaw,
    explanation: ValidPalindromeExplanationRaw,
    filepath: "src/algorithms/tasks/1_two_pointers/2_ValidPalindrome.js",
    solutions: [
      {
        title: "Рекомендуемое решение (Two Pointers)",
        isRecommended: true,
        badge: "O(n) время / O(1) память",
        recommendationNote: "Указатели подтягиваются с краёв к центру, пропуская не буквенно-цифровые символы и сравнивая оставшиеся без учёта регистра.",
        rawSolution: ValidPalindromeSolutionRaw,
        filepath: "src/algorithms/solutions/1_two_pointers/2_ValidPalindrome.js",
      },
    ],
    articles: [
      { title: "LeetCode #125", urlTitle: "LeetCode — Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/" },
      { title: "Метод двух указателей (Two Pointers)", urlTitle: "Habr — Обзор техники", url: "https://habr.com/ru/articles/" },
      { title: "Работа со строками в JS", urlTitle: "MDN Web Docs", url: "https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String" },
      { title: "Регулярные выражения в JS", urlTitle: "Learn JavaScript", url: "https://learn.javascript.ru/regular-expressions" },
    ],
    interviewerQuestions: [
      { question: "Как обрабатываются не буквенно-цифровые символы?", answer: "Игнорируются путем сдвига соответствующего указателя до тех пор, пока под ним не окажется буква или цифра." },
    ],
    checklist: ["Игнорирование регистра", "Игнорирование спецсимволов и пробелов", "Корректная обработка пустых строк"],
  },
  {
    id: "algo3",
    group: "Two Pointers",
    title: "3. 3Sum",
    desc: "Найдите все уникальные тройки чисел в массиве, сумма которых равна 0, исключив дубликаты.",
    difficulty: "medium",
    isRaw: true,
    candidate: ThreeSumCandidateRaw,
    rawCandidate: ThreeSumCandidateRaw,
    solution: ThreeSumSolutionRaw,
    rawSolution: ThreeSumSolutionRaw,
    explanation: ThreeSumExplanationRaw,
    filepath: "src/algorithms/tasks/1_two_pointers/3_ThreeSum.js",
    solutions: [
      {
        title: "Рекомендуемое решение (Sorting + Two Pointers)",
        isRecommended: true,
        badge: "O(n²) время / O(1) память",
        recommendationNote: "Сортировка массива позволяет свести задачу 3Sum к Two Sum для каждого элемента и легко пропускать дубликаты.",
        rawSolution: ThreeSumSolutionRaw,
        filepath: "src/algorithms/solutions/1_two_pointers/3_ThreeSum.js",
      },
    ],
    articles: [
      { title: "LeetCode #15", urlTitle: "LeetCode — 3Sum", url: "https://leetcode.com/problems/3sum/" },
      { title: "Что такое метод двух указателей?", urlTitle: "CodeChick — Разбор метода", url: "https://codechick.io/community/330" },
      { title: "Two Pointers для начинающих", urlTitle: "SprintCode — Статья и разбор", url: "https://sprintcode.pro/ru/blog/two-pointers" },
      { title: "Two Pointers — паттерн", urlTitle: "Habr — Паттерны алгоритмов", url: "https://habr.com/ru/articles/1020222" },
      { title: "Метод двух указателей", urlTitle: "Habr — Подробный гайд", url: "https://habr.com/ru/articles/803709/" },
    ],
    interviewerQuestions: [
      { question: "Зачем нужна предварительная сортировка?", answer: "Сортировка дает возможность двигать указатели по направлению суммы и эффективнее избегать повторов (дубликатов) в ответе." },
    ],
    checklist: ["Исключение дубликатов троек", "Сортировка входного массива", "Пропуск повторяющихся элементов"],
  },
];

export const ALGO_TASKS = [
  ...ALGO_TWO_POINTERS_TASKS,
];

export const ALL_ALGO_TASKS = [...ALGO_TASKS];
