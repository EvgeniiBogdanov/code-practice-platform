import type { DesignTopic } from "../model/types";

/** Reading order of the theory; every id has a `<id>.md` article next to this file. */
export const DESIGN_TOPICS: readonly DesignTopic[] = [
  {
    id: "radio",
    title: "Как вести дизайн-интервью: RADIO",
    summary: "Пять этапов разговора, формула компромисса и то, что отличает сеньора.",
    minutes: 6,
    group: "process",
  },
  {
    id: "interview-tips",
    title: "Как проходить секцию",
    summary: "Что на самом деле оценивают, тайминг 45–60 минут и типичные ошибки кандидатов.",
    minutes: 6,
    group: "process",
  },
  {
    id: "decision-points",
    title: "Точки выбора: метод подготовки",
    summary: "Как находить развилки в любом приложении, назвать альтернативы и задать критерии.",
    minutes: 5,
    group: "process",
  },
  {
    id: "rendering",
    title: "Стратегии рендеринга",
    summary: "CSR, SSR, SSG, ISR и streaming: как выбрать и чем платить.",
    minutes: 7,
    group: "foundation",
  },
  {
    id: "data-and-state",
    title: "Данные и состояние",
    summary: "Серверное и клиентское состояние, кэш запросов, нормализация и пагинация.",
    minutes: 7,
    group: "foundation",
  },
  {
    id: "performance",
    title: "Производительность",
    summary:
      "Web Vitals, разделение кода, tree shaking, виртуализация и как говорить об оптимизации.",
    minutes: 7,
    group: "foundation",
  },
  {
    id: "network-realtime",
    title: "Сеть и real-time",
    summary: "HTTP-кэширование, REST и GraphQL, rate limit, WebSocket, SSE и жизнь соединения.",
    minutes: 9,
    group: "foundation",
  },
  {
    id: "system-architecture",
    title: "Архитектура фронтенда",
    summary:
      "Схема клиент → CDN → BFF → API, зачем BFF и контракт API, который проектирует фронтенд.",
    minutes: 8,
    group: "foundation",
  },
  {
    id: "micro-frontends",
    title: "Микрофронтенды",
    summary: "Когда делить приложение, способы склейки, Module Federation и модульный монолит.",
    minutes: 7,
    group: "crosscutting",
  },
  {
    id: "pwa-offline",
    title: "PWA и офлайн",
    summary: "Манифест, service worker, стратегии кэша и офлайн-интерфейс.",
    minutes: 7,
    group: "crosscutting",
  },
  {
    id: "i18n",
    title: "Интернационализация",
    summary: "Словари, Intl-форматы, плюрализация, RTL, выбор языка и SEO для языков.",
    minutes: 7,
    group: "crosscutting",
  },
  {
    id: "security",
    title: "Безопасность клиента",
    summary: "Токены, XSS, CSP и CORS, CSRF, сторонние скрипты и зависимости.",
    minutes: 8,
    group: "crosscutting",
  },
  {
    id: "a11y",
    title: "Доступность",
    summary: "Семантика, паттерн combobox, виртуализированные списки и проверка доступности.",
    minutes: 6,
    group: "crosscutting",
  },
  {
    id: "delivery",
    title: "Delivery: CI/CD и наблюдаемость",
    summary:
      "Сборка один раз, feature flags и откат, командные процессы и мониторинг после релиза.",
    minutes: 8,
    group: "crosscutting",
  },
];
