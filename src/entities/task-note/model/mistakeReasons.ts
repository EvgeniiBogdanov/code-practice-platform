export interface MistakeReason {
  id: string;
  label: string;
}

export const MISTAKE_REASONS: readonly MistakeReason[] = [
  { id: "idea", label: "Не нашёл идею" },
  { id: "condition", label: "Неверно понял условие" },
  { id: "edge-cases", label: "Граничные случаи" },
  { id: "off-by-one", label: "Off-by-one / индексы" },
  { id: "data-structure", label: "Не та структура данных" },
  { id: "complexity", label: "Не уложился в сложность" },
  { id: "mutation", label: "Мутация / ссылки" },
  { id: "syntax", label: "Синтаксис / API" },
  { id: "other", label: "Другое" },
];

const FALLBACK_REASON = MISTAKE_REASONS[MISTAKE_REASONS.length - 1];

export const getMistakeReason = (reasonId: string): MistakeReason =>
  MISTAKE_REASONS.find((reason) => reason.id === reasonId) ?? FALLBACK_REASON;
