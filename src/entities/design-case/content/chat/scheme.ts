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
        "• личные и групповые",
        "• отправка и статусы",
        "• история вверх",
        "• typing, непрочитанные",
      ]
    ),
    card(
      "requirements",
      "req-delivery",
      [1, 0],
      ["Доставка", "без потерь и дублей,", "порядок сохраняется:", "client id + повтор + ack"]
    ),
    card(
      "requirements",
      "req-offline",
      [2, 0],
      ["Без сети и границы", "ввод работает, очередь;", "вне: сервер, E2E,", "звонки"]
    ),

    card("architecture", "ui", [0, 1], ["Окно чата", "список, переписка, ввод"]),
    card("architecture", "outbox", [1, 1], ["Очередь исходящих", "optimistic, повтор"]),
    card(
      "architecture",
      "socket",
      [2, 1],
      ["Сокет → WS-шлюз", "backoff + джиттер,", "heartbeat ping/pong"]
    ),
    card("architecture", "store", [1, 2], ["Хранилище по id", "диалоги, сообщения"]),
    card("architecture", "protocol", [2, 2], ["Протокол", "message · ack ·", "typing · read"]),
    card("architecture", "rest", [0, 2], ["REST", "история, пропущенное"]),

    card(
      "data-model",
      "dm-conv",
      [0, 3],
      ["Conversation", "id, участники, последнее,", "непрочитанные"]
    ),
    card(
      "data-model",
      "dm-message",
      [1, 3],
      ["Message", "clientId, conversationId,", "text, authorId, createdAt,", "seq, status"]
    ),
    card(
      "data-model",
      "dm-ids",
      [2, 3],
      ["Два id", "clientId: optimistic,", "идемпотентность;", "seq: порядок в диалоге"]
    ),
    card(
      "data-model",
      "dm-status",
      [0, 4],
      ["Статусы", "sending → sent →", "delivered → read; failed", "не удаляет текст"]
    ),
    card(
      "data-model",
      "dm-idb",
      [1, 4],
      ["IndexedDB", "последние сообщения,", "очередь неотправленных"]
    ),

    card(
      "interface",
      "if-components",
      [2, 4],
      ["Компоненты", "ChatWindow: без сокета", "MessageList, MessageInput,", "ConnectionBanner"]
    ),
    card(
      "interface",
      "if-events",
      [0, 5],
      ["События", "message: clientId, seq", "ack: seq · typing · read", "нумерованы → без дублей"]
    ),
    card(
      "interface",
      "if-rest",
      [1, 5],
      ["GET /messages?before", "GET /events?after=lastId", "→ догрузка после обрыва"]
    ),
    card(
      "interface",
      "if-auth",
      [2, 5],
      ["Аутентификация", "короткий токен первым", "сообщением, не в URL"]
    ),

    card(
      "optimizations",
      "opt-speed",
      [0, 6],
      ["Отзывчивость", "виртуализация, scroll", "anchoring, memo,", "throttle для typing"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [1, 6],
      ["Доступность", "aria-live polite,", "клавиатура, статусы", "не только цветом"]
    ),
    card(
      "optimizations",
      "opt-security",
      [2, 6],
      ["Безопасность", "текст экранируем,", "rel noopener, превью —", "на сервере"]
    ),
    card(
      "optimizations",
      "opt-ops",
      [1, 7],
      ["Эксплуатация", "задержка доставки,", "переподключения, failed;", "лимиты на отправку"]
    ),
  ],
  edges: [
    arrow("architecture", "ui", "outbox", "send"),
    arrow("architecture", "outbox", "socket", "по очереди"),
    arrow("architecture", "socket", "protocol", "кадры", ["bottom", "top"]),
    arrow("architecture", "protocol", "store", "события", ["left", "right"]),
    arrow("architecture", "store", "ui", "список", ["top", "bottom"]),
    arrow("architecture", "rest", "store", "пропущенное"),

    arrow("data-model", "store", "dm-message", "", ["bottom", "top"]),
    arrow("data-model", "protocol", "dm-ids", "seq", ["bottom", "top"]),
  ],
};
