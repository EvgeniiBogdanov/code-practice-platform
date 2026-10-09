test("window.analytics.track принимает событие и необязательные данные", () => {
  window.analytics.track("page_view");
  window.analytics.track("click", { id: 1 });
  // @ts-expect-error
  window.analytics.track(1);
});

test("__INITIAL_STATE__ содержит userId и featureFlags", () => {
  const userId: string = window.__INITIAL_STATE__.userId;
  const flags: string[] = window.__INITIAL_STATE__.featureFlags;
});

test("другие поля window.analytics и __INITIAL_STATE__ недоступны", () => {
  // @ts-expect-error
  window.analytics.missing();
  // @ts-expect-error
  window.__INITIAL_STATE__.missing;
});
