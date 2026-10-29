import type { DesignCase } from "../../model/types";
import { requirementsStage } from "./requirements";
import { architectureStage } from "./architecture";
import { dataModelStage } from "./dataModel";
import { interfaceStage } from "./interfaceStage";
import { optimizationsStage } from "./optimizations";
import { scheme } from "./scheme";

export const designCase: DesignCase = {
  id: "video-streaming",
  title: "Видеостриминг",
  difficulty: "medium",
  summary:
    "Каталог и плеер, как у YouTube или Netflix: сегменты HLS через CDN, адаптивное качество, плеер как машина состояний, прогресс просмотра и метрики.",
  stages: [
    requirementsStage,
    architectureStage,
    dataModelStage,
    interfaceStage,
    optimizationsStage,
  ],
  scheme,
  production:
    "## Что меняется в продакшене\n\n**Пиковая нагрузка.** Премьера серии — миллионы стартов за минуты. Манифесты и сегменты отдаёт CDN, API прогресса и метрик принимает пачки, а клиенты добавляют к повторам случайную задержку, чтобы не ударить по серверу одновременно.\n\n**Разнообразие устройств.** Телевизоры, старые браузеры, iOS без Media Source Extensions. Кодек (H.264, VP9, AV1) выбирают по `MediaSource.isTypeSupported`, а не по user agent.\n\n**Настройка выбора качества.** Запас и пороги буфера подбирают A/B-тестами по метрикам: доле буферизации и среднему битрейту.\n\n**Права и регионы.** Лицензии на контент различаются по странам. Каталог фильтрует сервер, ссылки на сегменты подписаны и истекают.\n\n**Инциденты.** Упал один CDN — плеер переключается на резервный. Сломалась новая версия плеера — откат флагом и сравнение метрик по версиям.\n\n**Наблюдаемость.** Время до первого кадра, доля буферизации и ошибки по стране, провайдеру, CDN и версии плеера.",
};
