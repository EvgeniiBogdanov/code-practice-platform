import React from "react";
import { GitMerge, Hash, Folder, SlidersHorizontal, Sigma, Search, Layers, Link2, GitBranch, Compass, RotateCcw } from "lucide-react";
import TwoPointersInfoRaw from "../explanations/1_two_pointers/_info.md?raw";
import HashMapInfoRaw from "../explanations/2_hash_map/_info.md?raw";
import SlidingWindowInfoRaw from "../explanations/3_sliding_window/_info.md?raw";
import PrefixSumInfoRaw from "../explanations/4_prefix_sum/_info.md?raw";
import BinarySearchInfoRaw from "../explanations/5_binary_search/_info.md?raw";
import StackInfoRaw from "../explanations/6_stack/_info.md?raw";
import LinkedListInfoRaw from "../explanations/7_linked_list/_info.md?raw";
import DfsInfoRaw from "../explanations/8_dfs/_info.md?raw";
import BfsInfoRaw from "../explanations/9_bfs/_info.md?raw";
import BacktrackingInfoRaw from "../explanations/10_backtracking/_info.md?raw";

export const ALGO_GROUP_CONFIG = {
  "Two Pointers": {
    name: "Two Pointers",
    title: "Two Pointers",
    iconEmoji: "🔀",
    icon: GitMerge,
    color: "#ec4899", // Pink
    bg: "rgba(236, 72, 153, 0.12)",
    infoId: "group-two-pointers",
    infoRaw: TwoPointersInfoRaw,
    desc: "Полное руководство по алгоритмической технике двух указателей: теория, примеры, трассировки и готовые шаблоны для собеседований.",
    guideTitle: "Полное руководство по алгоритмической технике двух указателей",
    practiceTasksList: [
      { id: "algo4_ext", title: "Reverse String", desc: "разворот массива на месте", url: "https://leetcode.com/problems/reverse-string/", isInternal: false },
      { id: "algo2", title: "Valid Palindrome (LeetCode #125)", desc: "проверка палиндрома с помощью двух указателей", isInternal: true },
      { id: "algo1", title: "Two Sum II — Input Array Is Sorted (LeetCode #167)", desc: "поиск суммы двух чисел за O(1) памяти", isInternal: true },
      { id: "algo5_ext", title: "Remove Duplicates from Sorted Array (LeetCode #26)", desc: "удаление дубликатов на месте (slow / fast)", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", isInternal: false },
      { id: "algo6_ext", title: "Move Zeroes (LeetCode #283)", desc: "сдвиг нулей в конец массива на месте", url: "https://leetcode.com/problems/move-zeroes/", isInternal: false },
      { id: "algo7_ext", title: "Container With Most Water (LeetCode #11)", desc: "наибольшая площадь между столбиками", url: "https://leetcode.com/problems/container-with-most-water/", isInternal: false },
      { id: "algo3", title: "3Sum (LeetCode #15)", desc: "усложнённая версия с фиксацией элемента и Two Pointers", isInternal: true },
      { id: "algo8_ext", title: "Linked List Cycle (LeetCode #141)", desc: "вариант slow/fast для связного списка", url: "https://leetcode.com/problems/linked-list-cycle/", isInternal: false },
      { id: "algo9_ext", title: "Merge Sorted Array (LeetCode #88)", desc: "два указателя по двум массивам", url: "https://leetcode.com/problems/merge-sorted-array/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Что такое метод двух указателей (two pointers)?", urlTitle: "CodeChick — Разбор метода", url: "https://codechick.io/community/330" },
      { title: "Two Pointers (Два указателя): разбор техники для начинающих", urlTitle: "SprintCode.pro — Руководство", url: "https://sprintcode.pro/ru/blog/two-pointers" },
      { title: "Алгосы от Влада, часть 2. Два указателя", urlTitle: "Блог Влада Крыловского", url: "https://krilovskiy.com/posts/algo-patterns-two-pointers/" },
      { title: "Two Pointers — паттерн", urlTitle: "Habr — Обзор паттерна", url: "https://habr.com/ru/articles/1020222" },
      { title: "Список задач с тегом \"Two Pointers\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/two-pointers/" },
    ],
  },
  "Hash Map": {
    name: "Hash Map",
    title: "Hash Map",
    iconEmoji: "🗺️",
    icon: Hash,
    color: "#f59e0b", // Amber / Gold
    bg: "rgba(245, 158, 11, 0.12)",
    infoId: "group-hash-map",
    infoRaw: HashMapInfoRaw,
    desc: "Полное руководство по хеш-таблицам и частотным словарям: устройство, коллизии, Map vs Object, типовые паттерны и оптимизации.",
    guideTitle: "Полное руководство по алгоритму Hash Map (частотный словарь)",
    practiceTasksList: [
      { id: "algo4", title: "Two Sum (LeetCode #1)", desc: "поиск пары чисел с заданной суммой через Map за O(n)", isInternal: true },
      { id: "algo5", title: "Valid Anagram (LeetCode #242)", desc: "проверка анаграмм через частотный словарь символов", isInternal: true },
      { id: "algo6", title: "Contains Duplicate (LeetCode #217)", desc: "быстрая проверка дубликатов через Set за O(n)", isInternal: true },
      { id: "algo7", title: "Group Anagrams (LeetCode #49)", desc: "группировка анаграмм по общему отсортированному ключу", isInternal: true },
      { id: "algo_lc387", title: "First Unique Character in a String (LeetCode #387)", desc: "поиск первого уникального символа через частотный словарь", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", isInternal: false },
      { id: "algo_lc347", title: "Top K Frequent Elements (LeetCode #347)", desc: "топ-K самых частых элементов массива", url: "https://leetcode.com/problems/top-k-frequent-elements/", isInternal: false },
      { id: "algo_lc128", title: "Longest Consecutive Sequence (LeetCode #128)", desc: "самая длинная непрерывная последовательность чисел за O(n)", url: "https://leetcode.com/problems/longest-consecutive-sequence/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Хеш-таблицы: как они устроены и почему быстрые", urlTitle: "Хабр — Подробный разбор", url: "https://habr.com/ru/articles/509510/" },
      { title: "Map и Set в JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/map-set" },
      { title: "Сложность алгоритмов: O(n), O(n²) и другие", urlTitle: "Хабр — Оценка сложности", url: "https://habr.com/ru/articles/188010/" },
      { title: "Структуры данных в JavaScript: Set и Map на практике", urlTitle: "Хабр (Otus) — Практика", url: "https://habr.com/ru/companies/otus/articles/549814/" },
      { title: "Задача Two Sum: разбор нескольких подходов", urlTitle: "Хабр — Разбор подходов", url: "https://habr.com/ru/articles/704088/" },
      { title: "Список задач с тегом \"Hash Table\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/hash-table/" },
    ],
  },
  "Sliding Window": {
    name: "Sliding Window",
    title: "Sliding Window",
    iconEmoji: "🪟",
    icon: SlidersHorizontal,
    color: "#06b6d4", // Cyan
    bg: "rgba(6, 182, 212, 0.12)",
    infoId: "group-sliding-window",
    infoRaw: SlidingWindowInfoRaw,
    desc: "Полное руководство по алгоритмической технике скользящего окна: фиксированные и динамические окна, инкрементальный пересчёт и разбор задач.",
    guideTitle: "Полное руководство по алгоритму Sliding Window (скользящее окно)",
    practiceTasksList: [
      { id: "algo8", title: "Longest Substring Without Repeating Characters (LeetCode #3)", desc: "динамическое окно + Set для поиска максимальной подстроки без повторов", isInternal: true },
      { id: "algo9", title: "Maximum Average Subarray I (LeetCode #643)", desc: "окно фиксированного размера k для поиска максимального среднего значения", isInternal: true },
      { id: "algo10", title: "Minimum Size Subarray Sum (LeetCode #209)", desc: "динамическое окно сжатия слева для поиска минимальной длины подмассива с суммой ≥ target", isInternal: true },
      { id: "algo_lc53", title: "Maximum Subarray (LeetCode #53)", desc: "максимальная сумма непрерывного подмассива (алгоритм Кадане)", url: "https://leetcode.com/problems/maximum-subarray/", isInternal: false },
      { id: "algo_lc438", title: "Find All Anagrams in a String (LeetCode #438)", desc: "фиксированное окно размера слова + частотный словарь", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", isInternal: false },
      { id: "algo_lc76", title: "Minimum Window Substring (LeetCode #76)", desc: "минимальное подстрочное окно, содержащее все целевые символы (Hard)", url: "https://leetcode.com/problems/minimum-window-substring/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Решение задачи с собеседования, используя технику Sliding Window", urlTitle: "Хабр — Разбор техники", url: "https://habr.com/ru/articles/1007886/" },
      { title: "Алгоритм «Скользящее окно» — вопросы с собеседований", urlTitle: "AppTractor — Вопросы и примеры", url: "https://apptractor.ru/info/techhype/sliding-window.html" },
      { title: "Алгосы от Влада: Скользящее окно", urlTitle: "Блог Влада Крыловского", url: "https://krilovskiy.com/posts/algo-patterns-sliding-window/" },
      { title: "Хеш-таблицы: как они устроены и почему быстрые", urlTitle: "Хабр — Устройство Map/Set", url: "https://habr.com/ru/articles/509510/" },
      { title: "Сложность алгоритмов: O(n), O(n²) и другие", urlTitle: "Хабр — Оценка сложности", url: "https://habr.com/ru/articles/188010/" },
      { title: "Список задач с тегом \"Sliding Window\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/sliding-window/" },
    ],
  },
  "Prefix Sum": {
    name: "Prefix Sum",
    title: "Prefix Sum",
    iconEmoji: "➕",
    icon: Sigma,
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
    infoId: "group-prefix-sum",
    infoRaw: PrefixSumInfoRaw,
    desc: "Полное руководство по алгоритму префиксных сумм: математическая база, формула суммы на отрезке за O(1), комбинация с Map и разбор типовых задач.",
    guideTitle: "Полное руководство по алгоритму Prefix Sum (префиксные суммы)",
    practiceTasksList: [
      { id: "algo11", title: "Range Sum Query - Immutable (LeetCode #303)", desc: "построение префиксного массива для запроса суммы на отрезке за O(1)", isInternal: true },
      { id: "algo12", title: "Subarray Sum Equals K (LeetCode #560)", desc: "подсчет количества подмассивов с суммой k через Prefix Sum и Map за O(n)", isInternal: true },
      { id: "algo13", title: "Find Pivot Index (LeetCode #724)", desc: "поиск опорного индекса массива за линейное время O(n) без доп. памяти O(1)", isInternal: true },
      { id: "algo_lc525", title: "Contiguous Array (LeetCode #525)", desc: "максимальная длина подмассива с равным числом 0 и 1 (префиксный баланс)", url: "https://leetcode.com/problems/contiguous-array/", isInternal: false },
      { id: "algo_lc238", title: "Product of Array Except Self (LeetCode #238)", desc: "префиксные и суффиксные произведения за O(n) без деления", url: "https://leetcode.com/problems/product-of-array-except-self/", isInternal: false },
      { id: "algo_lc304", title: "Range Sum Query 2D - Immutable (LeetCode #304)", desc: "двумерные префиксные суммы для суммы прямоугольника за O(1)", url: "https://leetcode.com/problems/range-sum-query-2d-immutable/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Префиксные суммы — разбор с картинками и 2D", urlTitle: "Алгоритмика — Руководство", url: "https://ru.algorithmica.org/cs/range-queries/prefix-sum/" },
      { title: "Префиксная сумма — математическая база и свойства", urlTitle: "Википедия — Статья", url: "https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B5%D1%84%D0%B8%D0%BA%D1%81%D0%BD%D0%B0%D1%8F_%D1%81%D1%83%D0%BC%D0%BC%D0%B0" },
      { title: "Разбор задачи с префиксными суммами на практике", urlTitle: "Хабр — Разбор задачи", url: "https://habr.com/ru/articles/901190/" },
      { title: "Префиксные суммы, разностный массив и обобщения", urlTitle: "Codeforces — Блог", url: "https://codeforces.com/blog/entry/88474?locale=ru" },
      { title: "Префиксные суммы и разностный массив (продвинутый уровень)", urlTitle: "Peltorator.org — Статья", url: "https://peltorator.org/posts/prefix_sums/" },
      { title: "Список задач с тегом \"Prefix Sum\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/prefix-sum/" },
    ],
  },
  "Binary Search": {
    name: "Binary Search",
    title: "Binary Search",
    iconEmoji: "🔍",
    icon: Search,
    color: "#3b82f6", // Blue
    bg: "rgba(59, 130, 246, 0.12)",
    infoId: "group-binary-search",
    infoRaw: BinarySearchInfoRaw,
    desc: "Полное руководство по алгоритму бинарного поиска: классический поиск за O(log n), поиск позиции вставки, поиск первой сломанной версии (граница) и поиск в повернутом массиве.",
    guideTitle: "Полное руководство по алгоритму Binary Search (бинарный поиск)",
    practiceTasksList: [
      { id: "algo14", title: "Binary Search (LeetCode #704)", desc: "классический бинарный поиск индекса элемента за O(log n)", isInternal: true },
      { id: "algo15", title: "Search Insert Position (LeetCode #35)", desc: "поиск элемента или корректной позиции для вставки за O(log n)", isInternal: true },
      { id: "algo16", title: "First Bad Version (LeetCode #278)", desc: "поиск границы между false и true с минимизацией API-вызовов", isInternal: true },
      { id: "algo17", title: "Search in Rotated Sorted Array (LeetCode #33)", desc: "бинарный поиск в массиве со сдвигом через проверку упорядоченной половины", isInternal: true },
      { id: "algo_lc153", title: "Find Minimum in Rotated Sorted Array (LeetCode #153)", desc: "поиск точки излома (минимума) в повернутом массиве", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", isInternal: false },
      { id: "algo_lc74", title: "Search a 2D Matrix (LeetCode #74)", desc: "бинарный поиск в двумерной отсортированной матрице за O(log(m*n))", url: "https://leetcode.com/problems/search-a-2d-matrix/", isInternal: false },
      { id: "algo_lc875", title: "Koko Eating Bananas (LeetCode #875)", desc: "бинарный поиск по пространству ответов (Binary Search on Answer)", url: "https://leetcode.com/problems/koko-eating-bananas/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Бинарный поиск в JavaScript: основы и реализация", urlTitle: "Хабр — Руководство", url: "https://habr.com/ru/articles/783848/" },
      { title: "Бинарный поиск: сравнение с линейным поиском", urlTitle: "Хабр — Практический пример", url: "https://habr.com/ru/articles/335750/" },
      { title: "Бинарный поиск: алгоритм «Разделяй и властвуй»", urlTitle: "DevGang — Статья", url: "https://dev-gang.ru/article/binarnyi-poisk-v-javascript-v8n3upwuib/" },
      { title: "Поиск в повернутом отсортированном массиве", urlTitle: "Хабр — Разбор задачи", url: "https://habr.com/ru/articles/331848/" },
      { title: "Каррирование и замыкания в JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/currying-partials" },
      { title: "Список задач с тегом \"Binary Search\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/binary-search/" },
    ],
  },
  "Stack": {
    name: "Stack",
    title: "Stack",
    iconEmoji: "🥞",
    icon: Layers,
    color: "#8b5cf6", // Purple/Violet
    bg: "rgba(139, 92, 246, 0.12)",
    infoId: "group-stack",
    infoRaw: StackInfoRaw,
    desc: "Полное руководство по структуре данных Stack (Стек): принцип LIFO, реализация на JavaScript, валидация скобок, Min Stack и монотонный стек.",
    guideTitle: "Полное руководство по структуре данных Stack (Стек)",
    practiceTasksList: [
      { id: "algo18", title: "Valid Parentheses (LeetCode #20)", desc: "проверка сбалансированности скобок за один проход O(n) через LIFO-стек", isInternal: true },
      { id: "algo19", title: "Min Stack (LeetCode #155)", desc: "стек с операцией получения минимума getMin() за константное время O(1)", isInternal: true },
      { id: "algo20", title: "Daily Temperatures (LeetCode #739)", desc: "поиск следующего большего элемента через монотонный стек за линейное время O(n)", isInternal: true },
      { id: "algo_lc150", title: "Evaluate Reverse Polish Notation (LeetCode #150)", desc: "вычисление выражений в обратной польской нотации на стеке", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", isInternal: false },
      { id: "algo_lc84", title: "Largest Rectangle in Histogram (LeetCode #84)", desc: "поиск наибольшего прямоугольника в гистограмме с монотонным стеком за O(n)", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", isInternal: false },
      { id: "algo_lc22", title: "Generate Parentheses (LeetCode #22)", desc: "генерация всех правильных скобочных последовательностей (Backtracking + Stack)", url: "https://leetcode.com/problems/generate-parentheses/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Структуры данных в JavaScript: стек, очередь и другие", urlTitle: "Дока — Руководство", url: "https://doka.guide/tools/structure-data-in-js/" },
      { title: "Стек — глава из книги \"Структуры данных на JS\"", urlTitle: "GitBook — Учебник", url: "https://verkholantsev.gitbooks.io/data-structures/docs/Stack.html" },
      { title: "Стеки, очереди и связные списки в JavaScript", urlTitle: "ProgLib — Статья", url: "https://proglib.io/p/rasprostranennye-algoritmy-i-struktury-dannyh-v-javascript-steki-ocheredi-i-svyaznye-spiski-2021-10-13" },
      { title: "Call Stack и рекурсия в JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/recursion" },
      { title: "Замыкания и фабричные функции в JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/closure" },
      { title: "Список задач с тегом \"Stack\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/stack/" },
    ],
  },
  "Linked List": {
    name: "Linked List",
    title: "Linked List",
    iconEmoji: "🔗",
    icon: Link2,
    color: "#0ea5e9", // Sky Blue
    bg: "rgba(14, 165, 233, 0.12)",
    infoId: "group-linked-list",
    infoRaw: LinkedListInfoRaw,
    desc: "Полное руководство по структуре данных Linked List (Связный список): односвязные, двусвязные и кольцевые списки, приём Dummy Node, алгоритм Флойда («черепаха и заяц») и решение типовых задач.",
    guideTitle: "Полное руководство по структуре данных Linked List (связный список)",
    practiceTasksList: [
      { id: "algo21", title: "Reverse Linked List (LeetCode #206)", desc: "разворот односвязного списка in-place за один проход O(n) с O(1) памяти", isInternal: true },
      { id: "algo22", title: "Merge Two Sorted Lists (LeetCode #21)", desc: "слияние двух отсортированных списков с использованием Dummy Node за O(n+m)", isInternal: true },
      { id: "algo23", title: "Linked List Cycle (LeetCode #141)", desc: "определение наличия цикла через алгоритм двух указателей Флойда за O(1) памяти", isInternal: true },
      { id: "algo_lc876", title: "Middle of the Linked List (LeetCode #876)", desc: "поиск середины списка за один проход быстрыми и медленными указателями", url: "https://leetcode.com/problems/middle-of-the-linked-list/", isInternal: false },
      { id: "algo_lc19", title: "Remove Nth Node From End of List (LeetCode #19)", desc: "удаление n-го узла с конца списка с помощью Dummy Node и двух указателей", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", isInternal: false },
      { id: "algo_lc234", title: "Palindrome Linked List (LeetCode #234)", desc: "проверка списка на палиндром за O(n) времени и O(1) памяти", url: "https://leetcode.com/problems/palindrome-linked-list/", isInternal: false },
      { id: "algo_lc160", title: "Intersection of Two Linked Lists (LeetCode #160)", desc: "поиск точки пересечения двух связных списков", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Структуры данных: связный список — Хабр", urlTitle: "Хабр — Подробное введение", url: "https://habr.com/ru/articles/717572/" },
      { title: "Связный список в учебнике JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/recursion#svyazannyy-spisok" },
      { title: "Структуры данных в JavaScript: связный список", urlTitle: "Дока — Руководство", url: "https://doka.guide/tools/structure-data-in-js/" },
      { title: "Связный список — глава из книги \"Структуры данных на JS\"", urlTitle: "GitBook — Учебник", url: "https://verkholantsev.gitbooks.io/data-structures/docs/LinkedList.html" },
      { title: "Стеки, очереди и связные списки в JavaScript", urlTitle: "ProgLib — Статья", url: "https://proglib.io/p/rasprostranennye-algoritmy-i-struktury-dannyh-v-javascript-steki-ocheredi-i-svyaznye-spiski-2021-10-13" },
      { title: "Список задач с тегом \"Linked List\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/linked-list/" },
    ],
  },
  "Depth-First Search": {
    name: "Depth-First Search",
    title: "Depth-First Search",
    iconEmoji: "🌲",
    icon: GitBranch,
    color: "#10b981", // Emerald
    bg: "rgba(16, 185, 129, 0.12)",
    infoId: "group-depth-first-search",
    infoRaw: DfsInfoRaw,
    desc: "Полное руководство по алгоритму поиска в глубину (DFS) на деревьях и графах: прямой (preorder), центрированный (inorder) и обратный (postorder) обходы, рекурсия, стек и решение типовых задач.",
    guideTitle: "Полное руководство по алгоритму Depth-First Search (DFS)",
    practiceTasksList: [
      { id: "algo24", title: "Maximum Depth of Binary Tree (LeetCode #104)", desc: "поиск максимальной глубины дерева методом bottom-up DFS за O(n)", isInternal: true },
      { id: "algo25", title: "Invert Binary Tree (LeetCode #226)", desc: "зеркальное инвертирование бинарного дерева через рекурсивный обмен поддеревьев", isInternal: true },
      { id: "algo26", title: "Same Tree (LeetCode #100)", desc: "проверка структурного и содержательного равенства двух бинарных деревьев", isInternal: true },
      { id: "algo27", title: "Diameter of Binary Tree (LeetCode #543)", desc: "вычисление максимального пути между любыми двумя узлами за один проход DFS", isInternal: true },
      { id: "algo_lc112", title: "Path Sum (LeetCode #112)", desc: "проверка наличия пути от корня к листу с заданной суммой", url: "https://leetcode.com/problems/path-sum/", isInternal: false },
      { id: "algo_lc110", title: "Balanced Binary Tree (LeetCode #110)", desc: "проверка сбалансированности бинарного дерева по высоте", url: "https://leetcode.com/problems/balanced-binary-tree/", isInternal: false },
      { id: "algo_lc572", title: "Subtree of Another Tree (LeetCode #572)", desc: "проверка, является ли дерево поддеревом другого дерева", url: "https://leetcode.com/problems/subtree-of-another-tree/", isInternal: false },
      { id: "algo_lc235", title: "Lowest Common Ancestor of a BST (LeetCode #235)", desc: "поиск наименьшего общего предка двух узлов в дереве поиска", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Бинарные деревья — решение задач (часть 1)", urlTitle: "Хабр — Руководство", url: "https://habr.com/ru/articles/835706/" },
      { title: "Обход бинарных деревьев: рекурсия, итерации и стек", urlTitle: "Хабр — Анализ подходов", url: "https://habr.com/ru/articles/144850/" },
      { title: "Бинарные деревья поиска и рекурсия — это просто", urlTitle: "Хабр — Объяснение", url: "https://habr.com/ru/articles/267855/" },
      { title: "Рекурсия и стек вызовов в JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/recursion" },
      { title: "Двоичное (бинарное) дерево: создание и обход", urlTitle: "Tproger — Статья", url: "https://tproger.ru/articles/dvoichnoe-binarnoe-derevo-sozdanie-i-obhod" },
      { title: "Список задач с тегом \"Depth-First Search\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/depth-first-search/" },
    ],
  },
  "Breadth-First Search": {
    name: "Breadth-First Search",
    title: "Breadth-First Search",
    iconEmoji: "🌊",
    icon: Compass,
    color: "#06b6d4", // Cyan
    bg: "rgba(6, 182, 212, 0.12)",
    infoId: "group-breadth-first-search",
    infoRaw: BfsInfoRaw,
    desc: "Полное руководство по алгоритму поиска в ширину (BFS): поуровневый обход деревьев, поиск кратчайшего пути в графах, обход 2D-матриц и Multi-Source BFS.",
    guideTitle: "Полное руководство по алгоритму Breadth-First Search (BFS)",
    practiceTasksList: [
      { id: "algo28", title: "Binary Tree Level Order Traversal (LeetCode #102)", desc: "поуровневый обход бинарного дерева с помощью очереди и levelSize за O(n)", isInternal: true },
      { id: "algo29", title: "Number of Islands (LeetCode #200)", desc: "подсчет компонент связности на 2D-сетке с использованием BFS и Flood Fill", isInternal: true },
      { id: "algo30", title: "Rotting Oranges (LeetCode #994)", desc: "моделирование одновременного распространения заражения через Multi-Source BFS", isInternal: true },
      { id: "algo_lc127", title: "Word Ladder (LeetCode #127)", desc: "поиск кратчайшей цепочки трансформации слов на графе", url: "https://leetcode.com/problems/word-ladder/", isInternal: false },
      { id: "algo_lc1091", title: "Shortest Path in Binary Matrix (LeetCode #1091)", desc: "поиск кратчайшего пути в бинарной матрице с 8 направлениями", url: "https://leetcode.com/problems/shortest-path-in-binary-matrix/", isInternal: false },
      { id: "algo_lc130", title: "Surrounded Regions (LeetCode #130)", desc: "захват окруженных областей на матрице через BFS от границ", url: "https://leetcode.com/problems/surrounded-regions/", isInternal: false },
      { id: "algo_lc542", title: "01 Matrix (LeetCode #542)", desc: "вычисление расстояния до ближайшего 0 для каждой клетки через Multi-Source BFS", url: "https://leetcode.com/problems/01-matrix/", isInternal: false },
      { id: "algo_lc116", title: "Populating Next Right Pointers (LeetCode #116)", desc: "связывание узлов одного уровня указателями next в совершенном дереве", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Поиск в ширину (Breadth-First Search) на практике", urlTitle: "Хабр — Руководство", url: "https://habr.com/ru/articles/504374/" },
      { title: "Бинарные деревья — поуровневый обход BFS", urlTitle: "Хабр — Обзор", url: "https://habr.com/ru/articles/835706/" },
      { title: "Структуры данных в JavaScript: очередь и граф", urlTitle: "Дока — Руководство", url: "https://doka.guide/tools/structure-data-in-js/" },
      { title: "Алгоритмы на графах: обход в ширину и глубину", urlTitle: "ProgLib — Статья", url: "https://proglib.io/p/algoritmy-na-grafah-obhod-v-shirinu-i-glubinu-2021-08-16" },
      { title: "Методы массивов: организация очередей в JS", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/array-methods" },
      { title: "Список задач с тегом \"Breadth-First Search\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/breadth-first-search/" },
    ],
  },
  "Backtracking": {
    name: "Backtracking",
    title: "Backtracking",
    iconEmoji: "🔄",
    icon: RotateCcw,
    color: "#f59e0b", // Amber
    bg: "rgba(245, 158, 11, 0.12)",
    infoId: "group-backtracking",
    infoRaw: BacktrackingInfoRaw,
    desc: "Полное руководство по алгоритму поиска с возвратом (Backtracking): отсечение невалидных ветвей (Pruning), генерация подмножеств, перестановок, комбинаций и скобочных структур.",
    guideTitle: "Полное руководство по алгоритму Backtracking (Перебор с возвратом)",
    practiceTasksList: [
      { id: "algo31", title: "Subsets (LeetCode #78)", desc: "генерация всех возможных подмножеств массива чисел (Power Set) за O(2^n)", isInternal: true },
      { id: "algo32", title: "Permutations (LeetCode #46)", desc: "построение всех перестановок массива с отслеживанием использованных элементов через used", isInternal: true },
      { id: "algo33", title: "Combination Sum (LeetCode #39)", desc: "поиск всех комбинаций с заданной суммой с возможностью повторного выбора элементов", isInternal: true },
      { id: "algo34", title: "Generate Parentheses (LeetCode #22)", desc: "генерация всех правильных скобочных последовательностей длины 2n с контролем баланса", isInternal: true },
      { id: "algo_lc51", title: "N-Queens (LeetCode #51)", desc: "расстановка N ферзей на шахматной доске без взаимных угроз", url: "https://leetcode.com/problems/n-queens/", isInternal: false },
      { id: "algo_lc37", title: "Sudoku Solver (LeetCode #37)", desc: "решение головоломки Судоку 9x9 через перебор с возвратом", url: "https://leetcode.com/problems/sudoku-solver/", isInternal: false },
      { id: "algo_lc79", title: "Word Search (LeetCode #79)", desc: "поиск слова на 2D-сетке букв с возвратом и снятием меток", url: "https://leetcode.com/problems/word-search/", isInternal: false },
      { id: "algo_lc17", title: "Letter Combinations of a Phone Number (LeetCode #17)", desc: "генерация буквенных комбинаций телефонного номера", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", isInternal: false },
      { id: "algo_lc131", title: "Palindrome Partitioning (LeetCode #131)", desc: "разбиение строки на подстроки-палиндромы", url: "https://leetcode.com/problems/palindrome-partitioning/", isInternal: false },
    ],
    articleLinksList: [
      { title: "Алгоритм поиска с возвратом (Backtracking): теория и примеры", urlTitle: "Хабр — Руководство", url: "https://habr.com/ru/articles/580644/" },
      { title: "Перебор с возвратом и отсечением (Pruning)", urlTitle: "Хабр — Анализ подходов", url: "https://habr.com/ru/articles/191418/" },
      { title: "Что такое бэктрекинг и как решать задачи перебором", urlTitle: "The Code — Статья", url: "https://thecode.media/backtracking/" },
      { title: "Рекурсия и стек вызовов в JavaScript", urlTitle: "learn.javascript.ru — Учебник", url: "https://learn.javascript.ru/recursion" },
      { title: "Поиск с возвратом", urlTitle: "Википедия — Теория", url: "https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA_%D1%81_%D0%B2%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%82%D0%BE%D0%BC" },
      { title: "Список задач с тегом \"Backtracking\"", urlTitle: "LeetCode — Tag List", url: "https://leetcode.com/tag/backtracking/" },
    ],
  },
};

export const getAlgoGroupMeta = (groupName) => {
  const meta = ALGO_GROUP_CONFIG[groupName] || {
    name: groupName || "Algorithms",
    title: groupName || "Algorithms",
    iconEmoji: "🧠",
    icon: Folder,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.12)",
    infoId: `group-${String(groupName || "algo").toLowerCase().replace(/\s+/g, "-")}`,
    infoRaw: "",
    desc: "",
    guideTitle: `Полное руководство по разделу ${groupName}`,
    practiceTasksList: [],
    articleLinksList: [],
  };
  const IconComponent = meta.icon;

  return {
    ...meta,
    renderIcon: (size = 14, extraStyle = {}) => (
      <IconComponent size={size} style={{ color: meta.color, flexShrink: 0, ...extraStyle }} />
    ),
  };
};

export const getAlgoGroupMetaByInfoId = (infoId) => {
  if (!infoId) return null;
  const entry = Object.values(ALGO_GROUP_CONFIG).find(
    (g) => g.infoId === infoId || infoId === `group-${g.name.toLowerCase().replace(/\s+/g, "-")}`
  );
  if (entry) return getAlgoGroupMeta(entry.name);
  return null;
};

export default getAlgoGroupMeta;
