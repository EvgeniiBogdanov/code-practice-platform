import type { DesignCase } from "../../model/types";
import { requirementsStage } from "./requirements";
import { architectureStage } from "./architecture";
import { dataModelStage } from "./dataModel";
import { interfaceStageStage } from "./interfaceStage";
import { optimizationsStage } from "./optimizations";

export const designCase: DesignCase = {
  id: "news-feed",
  title: "Лента новостей",
  difficulty: "medium",
  summary:
    "Бесконечная лента постов: курсорная пагинация, общие сущности в нескольких списках, optimistic-лайки и виртуализация.",
  stages: [
    requirementsStage,
    architectureStage,
    dataModelStage,
    interfaceStageStage,
    optimizationsStage,
  ],
  production:
    "## Что меняется в продакшене\n\n**Согласованность счётчиков.** Лайки и просмотры в реальной системе eventually consistent: клиент может увидеть число, которое на секунды отличается от сервера. Это нормально, если интерфейс не противоречит сам себе (мой лайк не пропадает после обновления).\n\n**Эксперименты и ранжирование.** Лента — главная поверхность для A/B-тестов. Нужны feature flags, одинаковые события аналитики для всех вариантов и защита от «мерцания» варианта при гидратации.\n\n**Нагрузка на публичную ленту.** SSR-страницы кэшируются на CDN с короткими сроками и stale-while-revalidate; персональные части дозагружаются отдельно, чтобы не ломать кэш.\n\n**Инциденты.** Если сервис ленты недоступен, показываем последнюю закэшированную порцию с пометкой, а не пустой экран. Если сервис лайков недоступен, лента остаётся читаемой.\n\n**Миграции.** Изменение формата ответа API делают совместимо: клиенты старых версий живут в браузерах днями. Контракт версионируется, а лишние поля игнорируются.\n\n**Наблюдаемость.** RUM-метрики (LCP, INP, CLS) по устройствам и странам, ошибки по карточкам, доля ошибок загрузки порций, глубина прокрутки как продуктовая метрика.",
};
