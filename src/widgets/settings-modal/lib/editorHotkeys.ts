/**
 * Every keyboard shortcut of the app, grouped for the settings modal. Keys use the tokens
 * `Mod` (⌘ on Apple platforms, Ctrl elsewhere), `Alt`, `Shift` and `Ctrl`; anything else is
 * shown as written. Keep it in sync with the handlers named in the comments.
 */

export interface HotkeyDefinition {
  description: string;
  keys: readonly string[];
  /** Replaces `keys` on Apple platforms when the shortcut differs there. */
  macKeys?: readonly string[];
}

export interface HotkeyGroup {
  title: string;
  items: readonly HotkeyDefinition[];
}

const APPLE_LABELS: Record<string, string> = { Mod: "⌘", Alt: "⌥", Shift: "⇧", Ctrl: "⌃" };

/** Labels of one shortcut for the platform, in press order. */
export const resolveHotkeyKeys = (hotkey: HotkeyDefinition, apple: boolean): string[] =>
  (apple && hotkey.macKeys ? hotkey.macKeys : hotkey.keys).map((key) =>
    key === "Mod" && !apple ? "Ctrl" : apple ? (APPLE_LABELS[key] ?? key) : key
  );

export const EDITOR_HOTKEY_GROUPS: readonly HotkeyGroup[] = [
  {
    // useEditorKeyHandlers, useCodeEditor (handleEditorKeyDown)
    title: "Запуск и вид",
    items: [
      { keys: ["Mod", "Enter"], description: "Запустить код" },
      { keys: ["Shift", "Alt", "F"], description: "Отформатировать код (Prettier)" },
      { keys: ["Alt", "Z"], description: "Включить или выключить перенос строк" },
      { keys: ["F11"], description: "Редактор на весь экран; Esc — выйти" },
    ],
  },
  {
    // useEditorKeyHandlers, lineKeyHandlers, tabKey, commentOperations
    title: "Правка текста",
    items: [
      { keys: ["Mod", "Z"], description: "Отменить" },
      {
        keys: ["Ctrl", "Y"],
        macKeys: ["Mod", "Shift", "Z"],
        description: "Повторить",
      },
      {
        keys: ["Tab"],
        description: "Добавить отступ; в сниппете — к следующему полю. Shift+Tab — назад",
      },
      { keys: ["Mod", "]"], description: "Сдвинуть выделенные строки вправо. «[» — влево" },
      { keys: ["Alt", "↑ / ↓"], description: "Переместить строку или выделенный блок" },
      { keys: ["Shift", "Alt", "↑ / ↓"], description: "Дублировать строку или блок" },
      { keys: ["Mod", "Shift", "K"], description: "Удалить строку" },
      { keys: ["Mod", "Shift", "Enter"], description: "Вставить пустую строку выше" },
      {
        keys: ["Home"],
        description: "К первому символу строки; повторное нажатие — к началу строки",
      },
      { keys: ["Mod", "/"], description: "Закомментировать или раскомментировать строки" },
      { keys: ["Shift", "Alt", "A"], description: "Блочный комментарий" },
      {
        keys: ["Enter"],
        description:
          "Новая строка с отступом, после «{», «(», «[» — с дополнительным; «/**» + Enter создаёт JSDoc",
      },
    ],
  },
  {
    // useMultiCursor, useEditorKeyHandlers
    title: "Несколько курсоров",
    items: [
      {
        keys: ["Mod", "D"],
        description: "Выделить слово, повторное нажатие добавляет следующее совпадение",
      },
      { keys: ["Mod", "Shift", "L"], description: "Выделить все совпадения слова" },
      { keys: ["Esc"], description: "Оставить один курсор" },
    ],
  },
  {
    // useFindReplace, FindReplaceBar
    title: "Поиск и замена",
    items: [
      { keys: ["Mod", "F"], description: "Найти в файле" },
      { keys: ["Ctrl", "H"], macKeys: ["Mod", "Alt", "F"], description: "Найти и заменить" },
      { keys: ["F3"], description: "Следующее совпадение. Shift+F3 — предыдущее" },
      { keys: ["Ctrl", "G"], description: "Перейти к строке" },
      {
        keys: ["Alt", "C"],
        description: "В панели поиска: учитывать регистр. Alt+W — слово целиком, Alt+R — regex",
      },
      {
        keys: ["Enter"],
        description: "В панели поиска: следующее совпадение. Shift+Enter — назад",
      },
      { keys: ["Esc"], description: "Закрыть панель поиска" },
    ],
  },
  {
    // useEditorKeyHandlers, useCodeEditor, useDefinitionNavigation
    title: "Подсказки и навигация по коду",
    items: [
      { keys: ["Ctrl", "Space"], description: "Открыть подсказки автодополнения" },
      {
        keys: ["Enter"],
        description: "В списке подсказок: принять. Tab — тоже, ↑ / ↓ — выбор, Esc — закрыть",
      },
      { keys: ["Mod", "Shift", "Space"], description: "Показать подсказку параметров функции" },
      { keys: ["Mod", "."], description: "Перейти к быстрым исправлениям ошибки" },
      { keys: ["F8"], description: "Следующая проблема. Shift+F8 — предыдущая" },
      { keys: ["F12"], description: "Перейти к определению. То же — Mod + клик по имени" },
      { keys: ["F2"], description: "Переименовать символ во всех файлах задачи" },
    ],
  },
  {
    // useGlobalShortcuts (вне полей ввода)
    title: "Приложение",
    items: [
      { keys: ["Mod", "K"], description: "Быстрый поиск задач" },
      { keys: ["Esc"], description: "Закрыть окно, поиск или подсказку" },
      { keys: ["↑ / ↓"], description: "Предыдущая или следующая задача" },
      {
        keys: ["← / →"],
        description: "Переключить вкладку задачи: кандидат, решение, материалы, вопросы, чек-лист",
      },
    ],
  },
  {
    // tracePlaybackKeyboard, scenes, CodeStepViewer; need focus on the viewer
    title: "Визуализации и просмотр кода",
    items: [
      { keys: ["Space"], description: "Запустить или поставить на паузу пошаговое выполнение" },
      { keys: ["← / →"], description: "Шаг назад или вперёд. Home / End — в начало и конец" },
      { keys: ["+ / −"], description: "Масштаб сцены или размер шрифта. 0 — сбросить" },
      { keys: ["Mod", "колесо"], description: "Масштаб 3D-сцены и схем" },
    ],
  },
];
