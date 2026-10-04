export {};

interface Analytics {
  track(event: string, payload?: Record<string, unknown>): void;
}

interface InitialState {
  userId: string;
  featureFlags: string[];
}

// Файл — модуль (есть export), поэтому выход в глобальную область
// оформляется через declare global. Интерфейсы Window сливаются.
declare global {
  interface Window {
    analytics: Analytics;
    __INITIAL_STATE__: InitialState;
  }
}

window.analytics.track("page_view", { path: location.pathname });

const flags = window.__INITIAL_STATE__.featureFlags;
const isBetaEnabled = flags.includes("beta");
