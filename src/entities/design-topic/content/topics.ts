import type { DesignTopic } from "../model/types";

/** Reading order of the theory; every id has a `<id>.md` article next to this file. */
export const DESIGN_TOPICS: readonly DesignTopic[] = [
  {
    id: "radio",
    title: "Как вести дизайн-интервью: RADIO",
    summary: "Пять этапов разговора, формула компромисса и то, что отличает сеньора.",
    minutes: 6,
  },
  {
    id: "rendering",
    title: "Стратегии рендеринга",
    summary: "CSR, SSR, SSG, ISR и streaming: как выбрать и чем платить.",
    minutes: 7,
  },
  {
    id: "data-and-state",
    title: "Данные и состояние",
    summary: "Серверное и клиентское состояние, кэш запросов, нормализация и пагинация.",
    minutes: 7,
  },
  {
    id: "network-realtime",
    title: "Сеть и real-time",
    summary: "HTTP-кэширование, повторы с backoff, WebSocket, SSE и жизнь соединения.",
    minutes: 8,
  },
  {
    id: "performance",
    title: "Производительность",
    summary: "Web Vitals, разделение кода, виртуализация и как говорить об оптимизации.",
    minutes: 7,
  },
  {
    id: "a11y-security",
    title: "Доступность и безопасность",
    summary: "Паттерн combobox, XSS и CSP, хранение токенов, надёжность интерфейса.",
    minutes: 7,
  },
];
