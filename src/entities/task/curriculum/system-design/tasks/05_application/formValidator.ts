// Поля заявки и их правила приходят с сервера схемой, а не зашиты в код. Клиент проверяет
// значения по тем же правилам, что и сервер, чтобы показать ошибку сразу у поля.
// Часть полей условная: ИНН нужен, только если выбран тип занятости «самозанятый».
//
// Реализуйте validateForm(fields, values) и pickSubmitValues(fields, values):
// - validateForm возвращает { [name]: код правила } только для полей с ошибкой; ошибок нет — {};
// - правила проверяются по порядку required → minLength → maxLength → pattern → min → max,
//   у поля остаётся первое нарушенное;
// - пустое значение (undefined, null, строка из пробелов, пустой массив) нарушает только
//   required: у необязательного пустого поля остальные правила не проверяются;
// - minLength и maxLength сравнивают длину строки, pattern — регулярное выражение, которое
//   схема присылает строкой (например, "^\\d{12}$"), min и max сравнивают число;
// - поле с visibleIf { field, equals } видно, только если values[field] === equals и само
//   поле field тоже видно; скрытое поле не проверяется;
// - pickSubmitValues возвращает значения только видимых полей схемы: скрытые поля и ключи,
//   которых нет в схеме, в заявку не уходят.

export interface FieldRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FieldSchema {
  name: string;
  rules?: FieldRules;
  visibleIf?: { field: string; equals: unknown };
}

export type FormValues = Record<string, unknown>;
export type FieldErrors = Record<string, string>;

export function validateForm(fields: readonly FieldSchema[], values: FormValues): FieldErrors {
  return {};
}

export function pickSubmitValues(fields: readonly FieldSchema[], values: FormValues): FormValues {
  return { ...values };
}
