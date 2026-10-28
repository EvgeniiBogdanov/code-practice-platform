import type { DesignCase } from "../../model/types";
import { requirementsStage } from "./requirements";
import { architectureStage } from "./architecture";
import { dataModelStage } from "./dataModel";
import { interfaceStageStage } from "./interfaceStage";
import { optimizationsStage } from "./optimizations";
import { scheme } from "./scheme";

export const designCase: DesignCase = {
  id: "autocomplete",
  title: "Автокомплит поиска",
  difficulty: "easy",
  summary:
    "Поле поиска с подсказками для интернет-магазина: запросы по мере набора, гонки ответов, кэш и доступность.",
  stages: [
    requirementsStage,
    architectureStage,
    dataModelStage,
    interfaceStageStage,
    optimizationsStage,
  ],
  scheme,
  production:
    "## Что меняется в продакшене\n\n**Нагрузка.** Автокомплит — самый «шумный» запрос сайта: поиск стоит дорого, а запросов в десятки раз больше, чем страниц. Популярные запросы кэшируют на CDN и на сервере; клиент и сервер вместе ограничивают частоту (rate limiting).\n\n**Качество поиска.** Нулевая выдача — сигнал: логируйте запросы без результатов, это самый ценный источник улучшений каталога. Опечатки и синонимы решаются на стороне поискового индекса.\n\n**Эксперименты.** Задержка debounce, число подсказок и ранжирование подбираются A/B-тестами по конверсии, а не на ощупь.\n\n**Инциденты.** Если поисковый сервис деградировал, интерфейс отключает подсказки (feature flag) и оставляет обычный поиск по Enter. Это заранее продуманная деградация, а не срочная правка.\n\n**Приватность.** Поисковые запросы — персональные данные: не пишите их в аналитику вместе с идентификатором пользователя и не отправляйте сторонним скриптам без необходимости.\n\n**Наблюдаемость.** Следите за p95 задержкой подсказок, долей ошибок и долей попаданий в кэш; алерты на рост задержки ловят проблему до жалоб.",
};
