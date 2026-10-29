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
        "• 4 шага + проверка",
        "• черновик, возврат позже",
        "• загрузка документов",
        "• статус после отправки",
      ]
    ),
    card(
      "requirements",
      "req-nonfunc",
      [1, 0],
      [
        "Нефункциональные",
        "• 10–15 мин, с телефона",
        "• персональные данные",
        "• отправка без дублей",
        "• клавиатура, скринридер",
      ]
    ),
    card(
      "requirements",
      "req-scope",
      [2, 0],
      [
        "Границы и метрики",
        "поля — по схеме с сервера;",
        "вне: скоринг, договор;",
        "конверсия по шагам",
      ]
    ),

    card(
      "architecture",
      "wizard",
      [0, 1],
      ["Мастер шагов", "шаг в URL: /apply/:step;", "«Далее» — проверка шага"]
    ),
    card(
      "architecture",
      "renderer",
      [1, 1],
      ["FormRenderer", "схема → поля из реестра:", "text, select, date, file"]
    ),
    card("architecture", "api", [2, 1], ["API заявки", "схема, черновик,", "загрузка, отправка"]),
    card(
      "architecture",
      "validator",
      [0, 2],
      ["Валидатор", "правила из схемы;", "сервер — источник правды"]
    ),
    card(
      "architecture",
      "model",
      [1, 2],
      ["Модель формы", "values, errors, touched;", "поле подписано на себя"]
    ),
    card(
      "architecture",
      "autosave",
      [2, 2],
      ["Автосохранение", "пауза в вводе, смена", "шага; один запрос за раз"]
    ),
    card(
      "architecture",
      "uploads",
      [1, 3],
      ["Загрузка файлов", "подписанная ссылка →", "файл прямо в хранилище"]
    ),

    card(
      "data-model",
      "dm-schema",
      [0, 3],
      ["FormSchema", "шаги → поля: name, type,", "rules, visibleIf; версия"]
    ),
    card(
      "data-model",
      "dm-draft",
      [2, 3],
      ["Draft — на сервере", "id, version, step,", "values, updatedAt"]
    ),
    card(
      "data-model",
      "dm-state",
      [0, 4],
      [
        "Состояние формы",
        "values по name, errors,",
        "touched; видимость и",
        "валидность — вычисляем",
      ]
    ),
    card(
      "data-model",
      "dm-upload",
      [1, 4],
      ["Upload", "id, name, size, status,", "progress; в values — id"]
    ),
    card(
      "data-model",
      "dm-hidden",
      [2, 4],
      ["Скрытые поля", "в черновике остаются,", "не проверяются", "и не отправляются"]
    ),

    card(
      "interface",
      "if-draft",
      [0, 5],
      ["Схема и черновик", "GET /forms/credit;", "PUT /drafts/:id", "{ values, version } → 409"]
    ),
    card(
      "interface",
      "if-submit",
      [1, 5],
      ["POST /applications", "Idempotency-Key —", "один на попытку,", "повтор с тем же ключом"]
    ),
    card(
      "interface",
      "if-errors",
      [2, 5],
      ["Ошибки 422", "{ errors: [{ field,", "code }] } → к полям,", "шаг с первой ошибкой"]
    ),
    card(
      "interface",
      "if-components",
      [0, 6],
      ["Компоненты", "FormRenderer: схема, шаг;", "Field(name) подписан", "на значение и ошибку"]
    ),

    card(
      "optimizations",
      "opt-errors",
      [1, 6],
      ["Когда показывать ошибки", "после ухода с поля,", "затем при вводе;", "«Далее» — весь шаг"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [2, 6],
      ["Доступность", "label, aria-invalid,", "aria-describedby, фокус", "на первую ошибку"]
    ),
    card(
      "optimizations",
      "opt-pii",
      [0, 7],
      ["Персональные данные", "не в localStorage, логи", "и аналитику; HttpOnly"]
    ),
    card(
      "optimizations",
      "opt-reliability",
      [1, 7],
      ["Надёжность", "статус «Сохранено»,", "повтор сохранения;", "409 — не затираем"]
    ),
    card(
      "optimizations",
      "opt-metrics",
      [2, 7],
      ["Метрики", "конверсия по шагам,", "поля с ошибками, INP,", "доля 409 и 422"]
    ),
  ],
  edges: [
    arrow("architecture", "wizard", "renderer", "шаг"),
    arrow("architecture", "api", "renderer", "схема", ["left", "right"]),
    arrow("architecture", "renderer", "model", "ввод", ["bottom", "top"]),
    arrow("architecture", "wizard", "validator", "«Далее»", ["bottom", "top"]),
    arrow("architecture", "model", "validator", "значения", ["left", "right"]),
    arrow("architecture", "model", "autosave", "изменения"),
    arrow("architecture", "autosave", "api", "PUT", ["top", "bottom"]),
    arrow("architecture", "model", "uploads", "файл", ["bottom", "top"]),

    arrow("data-model", "dm-schema", "validator", "правила", ["top", "bottom"]),
    arrow("data-model", "autosave", "dm-draft", "", ["bottom", "top"]),
    arrow("data-model", "uploads", "dm-upload", "", ["bottom", "top"]),

    arrow("interface", "if-submit", "if-errors", "422"),
  ],
};
