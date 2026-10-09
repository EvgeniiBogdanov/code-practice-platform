describe("updateConfig", () => {
  test("принимает частичные поля верхнего уровня", () => {
    const apply = (config: AppConfig): void => {
      updateConfig(config, {});
      updateConfig(config, { theme: { color: "red" } });
    };
  });

  test("принимает частичные поля на любой глубине", () => {
    const apply = (config: AppConfig): void => {
      updateConfig(config, { theme: { fontSize: 14 } });
      updateConfig(config, { features: { beta: { enabled: true } } });
    };
  });

  test("возвращает полную конфигурацию", () => {
    const apply = (config: AppConfig): AppConfig => updateConfig(config, {});
  });

  test("не принимает лишние поля и неверные типы", () => {
    const apply = (config: AppConfig): void => {
      // @ts-expect-error
      updateConfig(config, { theme: { color: 1 } });
      // @ts-expect-error
      updateConfig(config, { theme: { size: 12 } });
      // @ts-expect-error
      updateConfig(config, { features: { beta: { enabled: "yes" } } });
    };
  });
});
