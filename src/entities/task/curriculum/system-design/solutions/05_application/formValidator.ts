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

const isEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

/** Код первого нарушенного правила или null. */
const checkRules = (rules: FieldRules, value: unknown): string | null => {
  // Пустое значение проверяет только required: остальные правила — про формат введённого.
  if (isEmpty(value)) return rules.required ? "required" : null;
  const text = String(value);
  if (rules.minLength !== undefined && text.length < rules.minLength) return "minLength";
  if (rules.maxLength !== undefined && text.length > rules.maxLength) return "maxLength";
  if (rules.pattern !== undefined && !new RegExp(rules.pattern).test(text)) return "pattern";
  if (rules.min !== undefined && Number(value) < rules.min) return "min";
  if (rules.max !== undefined && Number(value) > rules.max) return "max";
  return null;
};

/** Видимость не хранится, а вычисляется из схемы и значений: так она не расходится с данными. */
const createVisibility = (
  fields: readonly FieldSchema[],
  values: FormValues
): ((field: FieldSchema | undefined) => boolean) => {
  const byName = new Map(fields.map((field) => [field.name, field]));
  const isVisible = (field: FieldSchema | undefined): boolean => {
    if (!field?.visibleIf) return true;
    const { field: parent, equals } = field.visibleIf;
    // Поле внутри скрытого блока скрыто, даже если его условие совпало.
    return values[parent] === equals && isVisible(byName.get(parent));
  };
  return isVisible;
};

export function validateForm(fields: readonly FieldSchema[], values: FormValues): FieldErrors {
  const isVisible = createVisibility(fields, values);
  const errors: FieldErrors = {};
  for (const field of fields) {
    if (!isVisible(field)) continue;
    const code = checkRules(field.rules ?? {}, values[field.name]);
    if (code) errors[field.name] = code;
  }
  return errors;
}

export function pickSubmitValues(fields: readonly FieldSchema[], values: FormValues): FormValues {
  const isVisible = createVisibility(fields, values);
  return Object.fromEntries(
    fields
      .filter((field) => isVisible(field) && Object.hasOwn(values, field.name))
      .map((field) => [field.name, values[field.name]])
  );
}
