import type { DesignStage } from "../../model/types";

export const architectureStage: DesignStage = {
  id: "architecture",
  prompt:
    "Опишите архитектуру клиента: как он получает и отправляет сообщения, из каких слоёв состоит и как переживает обрыв соединения.",
  forks: [
    {
      id: "transport",
      question: "Какой транспорт выбрать для сообщений?",
      options: [
        {
          id: "polling",
          label: "Polling по таймеру",
          explanation:
            "Проще всего, но задержка равна интервалу, а нагрузка растёт вместе с числом пользователей, даже когда сообщений нет. Для чата слишком медленно.",
        },
        {
          id: "websocket",
          label: "WebSocket",
          recommended: true,
          explanation:
            "Двусторонний канал с минимальной задержкой: подходит и для входящих, и для исходящих сообщений. Цена: нужно самим управлять жизнью соединения (переподключение, heartbeat), сложнее масштабировать на сервере.",
        },
        {
          id: "sse",
          label: "SSE для входящих и POST для исходящих",
          explanation:
            "Проще в инфраструктуре и поддерживает автопереподключение, но два канала усложняют порядок и подтверждения. Разумный вариант для уведомлений, для чата хуже.",
        },
      ],
    },
  ],
  reference:
    "## Слои клиента\n\n- **Транспорт**: сокет с переподключением. Знает только об открытии, закрытии и сообщениях.\n- **Протокол**: события message, ack, typing, read. Преобразует сырые данные в типизированные события.\n- **Хранилище**: диалоги и сообщения, нормализованные по id.\n- **Очередь исходящих**: optimistic-отправка, статусы, повтор.\n- **Представление**: список диалогов, окно переписки, поле ввода.\n\n## Жизнь соединения\n\n- Переподключение с **экспоненциальной задержкой и джиттером**: иначе после падения сервера все клиенты вернутся разом.\n- **Heartbeat**: ping/pong, чтобы заметить «тихий» обрыв.\n- После восстановления запросить **пропущенные события** после последнего полученного id.\n- Реакция на `online` и `visibilitychange`: не ждать таймер, когда сеть вернулась.\n\n## Состояние соединения в интерфейсе\n\nСтатусы connecting, open, reconnecting, closed показываются пользователю («Нет соединения»), поле ввода при этом остаётся доступным: сообщения встают в очередь.",
  diagram: {
    label: "Архитектура чата",
    nodes: [
      { id: "ui", value: "Окно чата", caption: "компоненты", column: 0, row: 0, shape: "box" },
      {
        id: "outbox",
        value: "Очередь",
        caption: "optimistic",
        column: 1,
        row: 0,
        shape: "box",
      },
      { id: "socket", value: "Сокет", caption: "backoff", column: 2, row: 0, shape: "box" },
      { id: "gateway", value: "WS-шлюз", caption: "сервер", column: 3, row: 0, shape: "box" },
      { id: "store", value: "Хранилище", caption: "по id", column: 1, row: 1, shape: "box" },
      { id: "history", value: "REST", caption: "история", column: 2, row: 1, shape: "box" },
    ],
    edges: [
      { from: "ui", to: "outbox", label: "send" },
      { from: "outbox", to: "socket", label: "по очереди" },
      { from: "socket", to: "gateway", label: "WebSocket" },
      { from: "socket", to: "store", label: "события" },
      { from: "store", to: "ui", label: "список" },
      { from: "history", to: "store", label: "пропущенное" },
    ],
  },
  rubric: [
    "Выбран WebSocket и объяснено, почему не polling и не SSE.",
    "Описаны слои: транспорт, протокол, хранилище, очередь, представление.",
    "Описано переподключение с backoff и джиттером и зачем нужен джиттер.",
    "Упомянуты heartbeat и догрузка пропущенных событий.",
  ],
  drillIds: ["sd-reconnecting-socket"],
  topicIds: ["network-realtime"],
};
