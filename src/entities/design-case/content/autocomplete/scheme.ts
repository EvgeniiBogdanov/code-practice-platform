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
        "• до 8–10 подсказок",
        "• выбор мышью/клавиатурой",
        "• пустое поле → история",
        "• подсветка совпадений",
      ]
    ),
    card(
      "requirements",
      "req-nonfunc",
      [1, 0],
      [
        "Нефункциональные",
        "• отклик 100–200 мс",
        "• медленная сеть, обрывы",
        "• клавиатура, скринридер",
        "• лимит запросов",
      ]
    ),
    card(
      "requirements",
      "req-scale",
      [2, 0],
      [
        "Масштаб и границы",
        "1 млн товаров → сервер;",
        "вне объёма: ранжирование,",
        "индексация — бэкенд",
      ]
    ),

    card("architecture", "input", [0, 1], ["SearchInput", "текст, клавиатура"]),
    card("architecture", "debounce", [1, 1], ["Debounce", "пауза ~300 мс"]),
    card("architecture", "api", [2, 1], ["API /search", "поиск по индексу"]),
    card("architecture", "list", [0, 2], ["SuggestionList", "подсказки из кэша"]),
    card("architecture", "cache", [1, 2], ["Кэш запросов", "отмена старых, без гонок"]),

    card(
      "data-model",
      "dm-states",
      [0, 3],
      ["Состояния списка", "загрузка · пусто ·", "ошибка · результаты"]
    ),
    card(
      "data-model",
      "dm-cache",
      [1, 3],
      ["Запись кэша", "ключ: trim + lower(q)", "TTL + лимит, LRU", "чтение не продлевает TTL"]
    ),
    card("data-model", "dm-history", [2, 3], ["localStorage", "недавние запросы"]),
    card(
      "data-model",
      "dm-local",
      [0, 4],
      ["Локально: useState", "текст, открыт ли список,", "активный пункт"]
    ),

    card(
      "interface",
      "if-component",
      [0, 5],
      ["SearchBox", "onSelect, minLength,", "delayMs, search(q, signal)", "транспорт — снаружи"]
    ),
    card(
      "interface",
      "if-xss",
      [1, 5],
      ["Подсветка", "по highlights; HTML", "с сервера не вставляем"]
    ),
    card(
      "interface",
      "if-api",
      [2, 5],
      [
        "GET /search?q&limit=8",
        "{ items: [{ id, label,",
        "  type, highlights }] }",
        "4xx/5xx ≠ отмена",
      ]
    ),

    card(
      "optimizations",
      "opt-speed",
      [0, 6],
      ["Скорость", "minLength = 2, история", "пока ждём, без мигания"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [1, 6],
      ["Доступность: combobox", "aria-activedescendant,", "aria-live, Esc"]
    ),
    card(
      "optimizations",
      "opt-degrade",
      [2, 6],
      ["Деградация", "API упал → поиск по Enter,", "повтор — только GET"]
    ),
    card(
      "optimizations",
      "opt-metrics",
      [1, 7],
      ["Метрики", "p95 подсказок, INP,", "пустые выдачи, hit rate"]
    ),
  ],
  edges: [
    arrow("architecture", "input", "debounce", "ввод"),
    arrow("architecture", "debounce", "cache", "запрос", ["bottom", "top"]),
    arrow("architecture", "cache", "api", "промах", ["right", "bottom"]),
    arrow("architecture", "cache", "list", "данные", ["left", "right"]),

    arrow("data-model", "list", "dm-states", "", ["bottom", "top"]),
    arrow("data-model", "cache", "dm-cache", "", ["bottom", "top"]),
  ],
};
