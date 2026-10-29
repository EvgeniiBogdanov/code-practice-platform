// Отправка заявки на кредит не должна создавать дубли. Блокировка кнопки спасает от
// двойного клика, но не от повтора после обрыва: запрос мог дойти до сервера, а потерялся
// только ответ. Сервер принимает заголовок Idempotency-Key: повтор с тем же ключом
// возвращает уже созданную заявку, а не создаёт новую.
//
// Реализуйте createApplicationSubmitter({ url, createKey, maxAttempts, retryDelayMs }):
// - submit(values) отправляет fetch(url) методом POST с телом JSON.stringify(values) и
//   заголовками "Content-Type": "application/json" и "Idempotency-Key";
// - пока отправка идёт, повторный submit возвращает тот же промис и не шлёт запрос;
// - 2xx → { status: "ok", id } из тела ответа { id };
// - 422 → { status: "invalid", errors: { [field]: code } } из тела { errors: [{ field, code }] },
//   у поля остаётся первая ошибка; без повтора;
// - сетевая ошибка или 5xx → повтор через retryDelayMs с тем же ключом, всего не больше
//   maxAttempts попыток; все неудачны → { status: "failed" };
// - остальные 4xx → { status: "failed" } без повтора;
// - ключ создаётся через createKey() и живёт, пока заявка не принята или не отклонена
//   с 422: новый submit после "failed" идёт с тем же ключом, после "ok" и "invalid" — с новым.

export type SubmitResult =
  | { status: "ok"; id: string }
  | { status: "invalid"; errors: Record<string, string> }
  | { status: "failed" };

export interface SubmitterOptions {
  url: string;
  createKey: () => string;
  maxAttempts: number;
  retryDelayMs: number;
}

export interface ApplicationSubmitter {
  submit: (values: Record<string, unknown>) => Promise<SubmitResult>;
}

export function createApplicationSubmitter({
  url,
  createKey,
  maxAttempts,
  retryDelayMs,
}: SubmitterOptions): ApplicationSubmitter {
  return {
    submit: async (values) => {
      try {
        const response = await fetch(url, { method: "POST", body: JSON.stringify(values) });
        if (!response.ok) return { status: "failed" };
        const { id } = await response.json();
        return { status: "ok", id };
      } catch {
        return { status: "failed" };
      }
    },
  };
}
