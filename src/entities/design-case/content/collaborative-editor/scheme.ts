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
        "• правка текста вместе",
        "• курсоры соавторов",
        "• комментарии",
        "• короткий офлайн",
      ]
    ),
    card(
      "requirements",
      "req-nonfunc",
      [1, 0],
      [
        "Нефункциональные",
        "• ввод не ждёт сеть",
        "• копии сходятся",
        "• до 50 редакторов",
        "• до 100 страниц",
      ]
    ),
    card(
      "requirements",
      "req-scope",
      [2, 0],
      ["Границы", "курсоры — не документ;", "вне: экспорт, печать,", "поиск по всем докам"]
    ),

    card(
      "architecture",
      "editor",
      [0, 1],
      ["Редактор", "ProseMirror / Tiptap:", "ввод → транзакция"]
    ),
    card(
      "architecture",
      "doc",
      [1, 1],
      ["Локальная копия", "CRDT-документ (Yjs),", "правка без сети"]
    ),
    card(
      "architecture",
      "room",
      [2, 1],
      ["Комната документа", "WebSocket-сервис:", "рассылка соавторам"]
    ),
    card(
      "architecture",
      "presence",
      [0, 2],
      ["Presence", "курсоры, выделения;", "тот же сокет,", "не сохраняется"]
    ),
    card("architecture", "idb", [1, 2], ["IndexedDB", "очередь обновлений", "без сети, кэш"]),
    card(
      "architecture",
      "storage",
      [2, 2],
      ["Хранилище", "снимки документа", "и хвост обновлений"]
    ),
    card("architecture", "rest", [2, 3], ["REST API", "открытие документа,", "комментарии, права"]),

    card(
      "data-model",
      "dm-tree",
      [0, 3],
      ["Документ", "дерево блоков с id:", "paragraph, heading;", "текст + метки"]
    ),
    card(
      "data-model",
      "dm-update",
      [1, 3],
      ["Обновление", "вставка, удаление, метка;", "id клиента, часы;", "снимок + хвост"]
    ),
    card(
      "data-model",
      "dm-lww",
      [0, 4],
      ["Свойства блоков", "LWW: побеждают", "старшие часы, ничья —", "по id клиента"]
    ),
    card(
      "data-model",
      "dm-presence",
      [1, 4],
      ["Presence", "userId, color, anchor,", "head; в памяти,", "пропадает по таймауту"]
    ),
    card(
      "data-model",
      "dm-comment",
      [2, 4],
      ["Комментарий", "id, anchor, thread[],", "resolved; якорь —", "относительная позиция"]
    ),

    card(
      "interface",
      "if-load",
      [0, 5],
      ["GET /docs/:id", "→ { snapshot, version };", "открытие не зависит", "от длины истории"]
    ),
    card(
      "interface",
      "if-room",
      [1, 5],
      [
        "WS /docs/:id",
        "sync(since) · update ·",
        "ack · presence · error;",
        "id клиента — без дублей",
      ]
    ),
    card(
      "interface",
      "if-comments",
      [2, 5],
      ["Комментарии", "GET/POST /comments,", "PATCH { resolved };", "права — на сервере"]
    ),
    card(
      "interface",
      "if-editor",
      [0, 6],
      ["EditorView", "doc, onLocalChange;", "чужие курсоры —", "декорации, не правки"]
    ),

    card(
      "optimizations",
      "opt-latency",
      [1, 6],
      ["Задержка", "свой ввод — в том же", "кадре, чужие — пачкой;", "INP, p95 доставки"]
    ),
    card(
      "optimizations",
      "opt-large",
      [2, 6],
      ["Большие документы", "в DOM — блоки у экрана,", "синхронизация —", "в Web Worker"]
    ),
    card(
      "optimizations",
      "opt-offline",
      [0, 7],
      ["Обрыв сети", "очередь в IndexedDB,", "backoff, досылка", "по версии"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [1, 7],
      ["Доступность", "role=textbox,", "aria-multiline; соавторы", "— aria-live без спама"]
    ),
    card(
      "optimizations",
      "opt-security",
      [2, 7],
      ["Безопасность", "вставка — через схему,", "ссылки только http(s),", "права — на сервере"]
    ),
  ],
  edges: [
    arrow("architecture", "editor", "doc", "транзакция"),
    arrow("architecture", "doc", "room", "update"),
    arrow("architecture", "editor", "presence", "курсор", ["bottom", "top"]),
    arrow("architecture", "doc", "idb", "без сети", ["bottom", "top"]),
    arrow("architecture", "room", "storage", "снимки", ["bottom", "top"]),
    arrow("architecture", "rest", "storage", "снимок", ["top", "bottom"]),

    arrow("data-model", "idb", "dm-update", "", ["bottom", "top"]),
    arrow("data-model", "rest", "dm-comment", "", ["bottom", "top"]),

    arrow("interface", "if-load", "if-room", "затем"),
  ],
};
