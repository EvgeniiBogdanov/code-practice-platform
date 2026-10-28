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
        "• бесконечная лента",
        "• пост: текст, фото, лайки",
        "• мгновенный лайк",
        "• новые посты без скачка",
      ]
    ),
    card(
      "requirements",
      "req-nonfunc",
      [1, 0],
      [
        "Нефункциональные",
        "• мобильные, слабая сеть",
        "• тысячи постов за сессию",
        "• клавиатура, скринридер",
      ]
    ),
    card(
      "requirements",
      "req-seo",
      [2, 0],
      [
        "Индексация и границы",
        "публичные посты → первый",
        "экран с сервера; вне:",
        "ранжирование, модерация",
      ]
    ),

    card("architecture", "cdn", [0, 1], ["CDN", "кэш HTML ленты", "(цена SSR) и картинки"]),
    card(
      "architecture",
      "bff",
      [1, 1],
      ["BFF (SSR)", "первый экран: посты", "и авторы одним ответом"]
    ),
    card("architecture", "api", [2, 1], ["Feed API", "посты и авторы"]),
    card(
      "architecture",
      "list",
      [0, 2],
      ["Лента", "виртуализация,", "IntersectionObserver →", "следующая порция"]
    ),
    card("architecture", "store", [1, 2], ["Хранилище по id", "посты, авторы"]),
    card(
      "architecture",
      "query",
      [2, 2],
      ["Кэш запросов", "useInfiniteQuery,", "один запрос за раз"]
    ),

    card(
      "data-model",
      "dm-client",
      [0, 3],
      ["Клиентское", "плашка новых постов,", "раскрыт ли текст"]
    ),
    card(
      "data-model",
      "dm-normal",
      [1, 3],
      ["Нормализация", "лента хранит id; патч", "сливаем, ссылка цела,", "если нет изменений"]
    ),
    card(
      "data-model",
      "dm-page",
      [2, 3],
      ["Страница ленты", "items: id[], nextCursor", "курсор, а не offset"]
    ),
    card(
      "data-model",
      "dm-post",
      [0, 4],
      [
        "Post",
        "id, authorId, text, media,",
        "createdAt, likesCount,",
        "likedByMe · User: id,",
        "name, avatar",
      ]
    ),
    card(
      "data-model",
      "dm-merge",
      [2, 4],
      ["Склейка страниц", "дубли по id убираем,", "данные — свежие,", "курсор — последний"]
    ),

    card(
      "interface",
      "if-components",
      [0, 5],
      ["Компоненты", "Feed: порции, загрузка", "PostCard: memo по id", "NewPostsBanner"]
    ),
    card(
      "interface",
      "if-like",
      [1, 5],
      ["Optimistic лайк", "сразу в хранилище,", "откат при ошибке,", "последнее нажатие решает"]
    ),
    card(
      "interface",
      "if-api",
      [2, 5],
      [
        "GET /feed?cursor&limit=20",
        "→ { items, nextCursor }",
        "PUT/DELETE /posts/:id/like",
        "идемпотентно",
      ]
    ),

    card(
      "optimizations",
      "opt-virtual",
      [0, 6],
      ["Виртуализация", "DOM не растёт; цена —", "поиск по странице, a11y"]
    ),
    card(
      "optimizations",
      "opt-images",
      [1, 6],
      ["Картинки", "размеры (нет CLS), lazy,", "приоритет первого экрана"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [2, 6],
      ["Доступность и сбои", "role feed, aria-busy,", "«Загрузить ещё»,", "«Повторить» при ошибке"]
    ),
    card("optimizations", "opt-metrics", [1, 7], ["Метрики", "LCP, INP, CLS"]),
  ],
  edges: [
    arrow("architecture", "cdn", "bff", "страница"),
    arrow("architecture", "bff", "api", "данные"),
    arrow("architecture", "bff", "query", "стартовые данные", ["bottom", "top"]),
    arrow("architecture", "query", "api", "курсор", ["top", "bottom"]),
    arrow("architecture", "query", "store", "сущности", ["left", "right"]),
    arrow("architecture", "store", "list", "id → посты", ["left", "right"]),

    arrow("data-model", "store", "dm-normal", "", ["bottom", "top"]),
    arrow("data-model", "query", "dm-page", "страницы", ["bottom", "top"]),
    arrow("data-model", "dm-page", "dm-merge", "", ["bottom", "top"]),
  ],
};
