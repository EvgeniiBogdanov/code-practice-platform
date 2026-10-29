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

interface ServerFieldError {
  field: string;
  code: string;
}

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const toFieldErrors = (errors: readonly ServerFieldError[]): Record<string, string> => {
  const byField = new Map<string, string>();
  for (const { field, code } of errors) if (!byField.has(field)) byField.set(field, code);
  return Object.fromEntries(byField);
};

export function createApplicationSubmitter({
  url,
  createKey,
  maxAttempts,
  retryDelayMs,
}: SubmitterOptions): ApplicationSubmitter {
  // Ключ переживает неудачу: первый запрос мог создать заявку, а потерялся только ответ.
  let key: string | null = null;
  let inflight: Promise<SubmitResult> | null = null;

  const send = async (
    values: Record<string, unknown>,
    idempotencyKey: string
  ): Promise<SubmitResult> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (attempt > 1) await wait(retryDelayMs);
      let response: Response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
          body: JSON.stringify(values),
        });
      } catch {
        continue;
      }
      if (response.ok) {
        const { id } = await response.json();
        return { status: "ok", id };
      }
      if (response.status === 422) {
        const { errors } = await response.json();
        return { status: "invalid", errors: toFieldErrors(errors) };
      }
      // Прочие 4xx — ошибка в самом запросе: повтор даст тот же ответ.
      if (response.status < 500) return { status: "failed" };
    }
    return { status: "failed" };
  };

  const submit = (values: Record<string, unknown>): Promise<SubmitResult> => {
    if (inflight) return inflight;
    key ??= createKey();
    inflight = send(values, key)
      .then((result) => {
        if (result.status !== "failed") key = null;
        return result;
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  };

  return { submit };
}
