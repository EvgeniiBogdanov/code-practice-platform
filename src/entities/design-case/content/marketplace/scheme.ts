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
        "• каталог: фильтры, сорт.",
        "• карточка: галерея, цена",
        "• корзина без сети",
        "• поиск — отдельный кейс",
      ]
    ),
    card(
      "requirements",
      "req-seo",
      [1, 0],
      [
        "SEO, скорость, языки",
        "индексация, URL на язык,",
        "LCP на мобильной сети,",
        "валюта по региону",
      ]
    ),
    card(
      "requirements",
      "req-teams",
      [2, 0],
      ["Команды", "каталог, карточка, корзина", "— разные, релизы", "независимы; СУБД — вне"]
    ),

    card("architecture", "cdn", [0, 1], ["CDN", "статика, HTML,", "картинки из хранилища"]),
    card("architecture", "bff", [1, 1], ["BFF", "SSR каталога и карточки,", "язык и регион"]),
    card("architecture", "catalog", [2, 1], ["Каталог и карточка", "домен, SSR"]),
    card(
      "architecture",
      "split",
      [0, 2],
      ["Границы команд", "модули + дизайн-система;", "Module Federation —", "когда релизы мешают"]
    ),
    card("architecture", "cart", [1, 2], ["Корзина и оформление", "SPA-часть, свой домен"]),
    card("architecture", "api", [2, 2], ["API", "товары, цены, остатки"]),

    card(
      "data-model",
      "dm-product",
      [0, 3],
      [
        "Product",
        "id, title, цены по валютам,",
        "images, stock, attributes",
        "Category: id, parent",
      ]
    ),
    card(
      "data-model",
      "dm-cart",
      [1, 3],
      ["Корзина", "гость — локально, вход →", "слияние; итог считает", "сервер"]
    ),
    card(
      "data-model",
      "dm-filters",
      [2, 3],
      ["Фильтры в URL", "ссылка = вид, назад/", "вперёд, SSR с фильтрами"]
    ),
    card(
      "data-model",
      "dm-state",
      [0, 4],
      ["Сервер и клиент", "каталог, цены — кэш;", "попап, кадр, черновик —", "клиент"]
    ),
    card(
      "data-model",
      "dm-price",
      [1, 4],
      ["Цены и остатки", "кэш + фоновое обновление;", "перед покупкой —", "проверка на сервере"]
    ),

    card(
      "interface",
      "if-components",
      [2, 4],
      ["Компоненты", "ProductCard → Price,", "CatalogList(onLoadMore);", "фильтры — группы, ul/li"]
    ),
    card(
      "interface",
      "if-catalog",
      [0, 5],
      [
        "GET /catalog?category&sort",
        "&cursor → { items,",
        "nextCursor }; ошибки:",
        "код + можно ли повторить",
      ]
    ),
    card(
      "interface",
      "if-price",
      [1, 5],
      ["Price", "Intl.NumberFormat:", "число и валюта — данные,", "формат — локаль"]
    ),
    card(
      "interface",
      "if-i18n",
      [2, 5],
      ["Тексты", "ключи по локали,", "Intl.PluralRules, dir,", "логические свойства CSS"]
    ),

    card(
      "optimizations",
      "opt-ops",
      [0, 6],
      ["Метрики и релизы", "LCP, INP, CLS (RUM);", "флаги, откат — флагом,", "canary"]
    ),
    card(
      "optimizations",
      "opt-images",
      [1, 6],
      ["Галерея", "размеры, srcset, AVIF,", "приоритет главного кадра,", "остальное — lazy"]
    ),
    card(
      "optimizations",
      "opt-offline",
      [2, 6],
      ["PWA и офлайн", "каталог — SWR, корзина —", "очередь; оплата — только", "онлайн"]
    ),
    card(
      "optimizations",
      "opt-security",
      [1, 7],
      ["Безопасность", "HttpOnly, санитайзер,", "CSP + SRI"]
    ),
  ],
  edges: [
    arrow("architecture", "cdn", "bff", "страница"),
    arrow("architecture", "bff", "catalog", "SSR"),
    arrow("architecture", "catalog", "api", "товары, цены", ["bottom", "top"]),
    arrow("architecture", "cart", "api", "заказ"),

    arrow("data-model", "cart", "dm-cart", "", ["bottom", "top"]),
  ],
};
