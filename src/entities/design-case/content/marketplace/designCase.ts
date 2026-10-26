import type { DesignCase } from "../../model/types";
import { requirementsStage } from "./requirements";
import { architectureStage } from "./architecture";
import { dataModelStage } from "./dataModel";
import { interfaceStage } from "./interfaceStage";
import { optimizationsStage } from "./optimizations";

export const designCase: DesignCase = {
  id: "marketplace",
  title: "Маркетплейс",
  difficulty: "hard",
  summary:
    "Каталог и карточка товара: SSR для SEO, границы между командами, локализация и валюта, корзина с офлайном и независимые релизы.",
  stages: [
    requirementsStage,
    architectureStage,
    dataModelStage,
    interfaceStage,
    optimizationsStage,
  ],
  production:
    "## Что меняется в продакшене\n\n**Цены и акции.** Цены меняются ежедневно, акции — по расписанию. Карточка и корзина должны показывать то, что будет списано. Расхождения цен фиксируем отдельным потоком ошибок в мониторинге.\n\n**Команды и релизы.** Каталог, карточка и корзина выкатываются независимо. Дизайн-система и версия React — общая ответственность, иначе части расходятся по версиям и выглядят по-разному.\n\n**Поисковая выдача.** Фильтры создают тысячи комбинаций URL: дубли и пустые страницы. Нужны canonical, `noindex` для бесполезных комбинаций и отдельный sitemap.\n\n**Нагрузка и злоупотребления.** Массовые запросы цен (скрапинг) и повторные клики «В корзину». Троттлинг на клиенте защищает интерфейс, но не сервер: нужен rate limit и ответ `429` с `Retry-After`.\n\n**Инциденты.** Если сервис рекомендаций недоступен, карточка показывает товар без блока. Если сервис остатков медленный, карточка показывает кэш, а оформление проверяет остаток на сервере.\n\n**Наблюдаемость.** RUM по странам и языкам, доля ошибок оформления заказа, Web Vitals по версиям релиза.",
};
