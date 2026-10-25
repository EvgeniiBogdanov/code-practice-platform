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
];
