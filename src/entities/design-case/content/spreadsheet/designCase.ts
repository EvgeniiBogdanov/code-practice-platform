import type { DesignCase } from "../../model/types";
import { requirementsStage } from "./requirements";
import { architectureStage } from "./architecture";
import { dataModelStage } from "./dataModel";
import { interfaceStage } from "./interfaceStage";
import { optimizationsStage } from "./optimizations";
import { scheme } from "./scheme";

export const designCase: DesignCase = {
  id: "spreadsheet",
  title: "Онлайн-таблица",
  difficulty: "hard",
  summary:
    "Лист на миллион строк, как в Google Sheets: сетка на canvas, окно видимых ячеек, формулы по графу зависимостей в Web Worker и доступная навигация.",
  stages: [
    requirementsStage,
    architectureStage,
    dataModelStage,
    interfaceStage,
    optimizationsStage,
  ],
  scheme,
  production:
    "## Что меняется в продакшене\n\n**Огромные листы.** Пользователи загружают выгрузки на сотни тысяч строк. Нужен лимит размера листа, предупреждение и загрузка частями, иначе вкладка упирается в память.\n\n**Тяжёлые формулы.** `VLOOKUP` по всему листу и цепочки на тысячи ячеек. Время пересчёта измеряется, слишком долгий пересчёт прерывается, а медленные формулы подсвечиваются.\n\n**Совместная правка.** Вставка и удаление строк сдвигают адреса в чужих операциях и формулах. Сервер упорядочивает операции и переписывает адреса, клиент применяет уже преобразованные.\n\n**Совместимость с Excel.** Вставка из Excel, форматы чисел и дат, разделители по локали (`;` вместо `,` в формулах для русской локали).\n\n**Инциденты.** Ошибка в движке формул даёт неверные числа, и это хуже падения. Новую версию движка сверяют со старой на реальных листах до раскатки.\n\n**Наблюдаемость.** Пропуски кадров при прокрутке, время пересчёта по размеру листа, ошибки воркера, время открытия листа.",
};
