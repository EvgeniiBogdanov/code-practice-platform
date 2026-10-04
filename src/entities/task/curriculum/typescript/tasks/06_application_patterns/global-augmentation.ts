// Скрипт аналитики добавляет в window объект analytics с методом
// track(event: string, payload?: Record<string, unknown>).
//
// Сервер встраивает в страницу window.__INITIAL_STATE__ с полями
// userId (строка) и featureFlags (массив строк).
//
// Опишите эти поля так, чтобы обращение к ним было типобезопасным
// во всём проекте — без приведения window к any.

export {};

window.analytics.track("page_view", { path: location.pathname });

const flags = window.__INITIAL_STATE__.featureFlags;
const isBetaEnabled = flags.includes("beta");
