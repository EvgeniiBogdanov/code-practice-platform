import type { DesignScheme } from "../../model/types";
import { arrow, card } from "../../model/schemeLayout";

/** Each stage fills its own band of rows, so the viewer can frame what the stage adds. */
export const scheme: DesignScheme = {
  nodes: [
    card(
      "requirements",
      "req-func",
      [0, 0],
      [
        "Функциональные",
        "• сетка, ввод, формулы",
        "• форматирование",
        "• копирование из Excel",
        "• совместная правка",
      ]
    ),
    card(
      "requirements",
      "req-nonfunc",
      [1, 0],
      [
        "Нефункциональные",
        "• до 1 млн строк",
        "• прокрутка 60 кадров/с",
        "• ввод не замирает",
        "• клавиатура, скринридер",
      ]
    ),
    card(
      "requirements",
      "req-scope",
      [2, 0],
      ["Границы", "заполнено разреженно;", "вне: графики, сводные,", "макросы"]
    ),

    card("architecture", "canvas", [0, 1], ["Canvas-сетка", "рисует только окно", "видимых ячеек"]),
    card(
      "architecture",
      "overlay",
      [1, 1],
      ["DOM-слой", "редактор ячейки,", "выделение, role=grid"]
    ),
    card(
      "architecture",
      "server",
      [2, 1],
      ["Сервер листа", "WebSocket: порядок", "операций, рассылка"]
    ),
    card(
      "architecture",
      "viewport",
      [0, 2],
      ["Окно видимости", "прокрутка → строки", "и колонки; rAF"]
    ),
    card("architecture", "worker", [1, 2], ["Web Worker", "данные листа, движок", "формул, граф"]),
    card("architecture", "storage", [2, 2], ["Хранилище", "снимок листа", "и журнал операций"]),

    card(
      "data-model",
      "dm-sizes",
      [0, 3],
      ["Размеры", "по умолчанию +", "исключения в Map;", "смещение — сумма"]
    ),
    card(
      "data-model",
      "dm-graph",
      [1, 3],
      ["Граф зависимостей", "формула → ячейки,", "обратные ссылки;", "цикл → #CYCLE"]
    ),
    card(
      "data-model",
      "dm-cell",
      [2, 3],
      ["Ячейка", "raw «=SUM(A1:A9)»,", "value, format;", "Map по адресу"]
    ),
    card("data-model", "dm-format", [0, 4], ["Форматирование", "диапазонами:", "A1:C10 — жирный"]),
    card(
      "data-model",
      "dm-selection",
      [1, 4],
      ["Выделение", "активная ячейка,", "диапазон; соавторы —", "presence"]
    ),

    card(
      "interface",
      "if-load",
      [0, 5],
      ["GET /sheets/:id", "?range=A1:Z100 →", "видимое, остальное —", "порциями в фоне"]
    ),
    card(
      "interface",
      "if-ops",
      [1, 5],
      ["Операции", "setCells(range, values),", "insertRows, setFormat;", "id клиента, версия"]
    ),
    card(
      "interface",
      "if-worker",
      [2, 5],
      ["Поток ↔ воркер", "edit, viewport →", "values окна,", "не весь лист"]
    ),
    card(
      "interface",
      "if-grid",
      [0, 6],
      ["Grid", "rowCount, columnCount,", "getCell, onEdit;", "буфер: TSV и HTML"]
    ),

    card(
      "optimizations",
      "opt-scroll",
      [1, 6],
      ["Прокрутка", "rAF, окно + запас,", "кэш замеров текста"]
    ),
    card(
      "optimizations",
      "opt-calc",
      [2, 6],
      ["Пересчёт", "в воркере, порциями,", "видимые — первыми"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [0, 7],
      ["Доступность", "role=grid, aria-", "rowindex/colindex,", "стрелки, объявления"]
    ),
    card(
      "optimizations",
      "opt-security",
      [1, 7],
      ["Безопасность", "свой парсер, не eval;", "CSV: экранировать", "= + - @ в начале"]
    ),
    card(
      "optimizations",
      "opt-metrics",
      [2, 7],
      ["Метрики", "пропуски кадров,", "INP ввода,", "p95 пересчёта"]
    ),
  ],
  edges: [
    arrow("architecture", "viewport", "canvas", "окно", ["top", "bottom"]),
    arrow("architecture", "overlay", "worker", "правка", ["bottom", "top"]),
    arrow("architecture", "worker", "viewport", "значения", ["left", "right"]),
    arrow("architecture", "overlay", "server", "операции"),
    arrow("architecture", "server", "storage", "журнал", ["bottom", "top"]),

    arrow("data-model", "viewport", "dm-sizes", "", ["bottom", "top"]),
    arrow("data-model", "worker", "dm-graph", "", ["bottom", "top"]),

    arrow("interface", "if-ops", "if-worker", "edit"),
  ],
};
