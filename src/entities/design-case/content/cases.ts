import type { DesignCaseMeta } from "../model/types";

/** Learning order of the cases; every id has a `<id>/designCase.ts` module next to this file. */
export const DESIGN_CASES: readonly DesignCaseMeta[] = [
  {
    id: "autocomplete",
    title: "Автокомплит поиска",
    difficulty: "easy",
    summary:
      "Поле поиска с подсказками для интернет-магазина: запросы по мере набора, гонки ответов, кэш и доступность.",
  },
  {
    id: "news-feed",
    title: "Лента новостей",
    difficulty: "medium",
    summary:
      "Бесконечная лента постов: курсорная пагинация, общие сущности в нескольких списках, optimistic-лайки и виртуализация.",
  },
  {
    id: "chat",
    title: "Чат реального времени",
    difficulty: "hard",
    summary:
      "Мессенджер: транспорт, переподключение, статусы доставки, optimistic-отправка, история и доступность.",
  },
  {
    id: "marketplace",
    title: "Маркетплейс",
    difficulty: "hard",
    summary:
      "Каталог и карточка товара: SSR для SEO, границы между командами, локализация и валюта, корзина с офлайном и независимые релизы.",
  },
  {
    id: "application-form",
    title: "Форма заявки",
    difficulty: "medium",
    summary:
      "Многошаговая заявка на кредит: поля по схеме с сервера, проверка на клиенте и сервере, черновик с автосохранением, документы и отправка без дублей.",
  },
  {
    id: "video-streaming",
    title: "Видеостриминг",
    difficulty: "medium",
    summary:
      "Каталог и плеер, как у YouTube или Netflix: сегменты HLS через CDN, адаптивное качество, плеер как машина состояний, прогресс просмотра и метрики.",
  },
  {
    id: "collaborative-editor",
    title: "Совместный редактор",
    difficulty: "hard",
    summary:
      "Документ, который правят несколько человек сразу: OT или CRDT, курсоры соавторов, комментарии, история снимками и работа при обрывах сети.",
  },
  {
    id: "spreadsheet",
    title: "Онлайн-таблица",
    difficulty: "hard",
    summary:
      "Лист на миллион строк, как в Google Sheets: сетка на canvas, окно видимых ячеек, формулы по графу зависимостей в Web Worker и доступная навигация.",
  },
];
