interface AppConfig {
  theme: {
    color: string;
    fontSize: number;
  };
  features: {
    darkMode: boolean;
    beta: {
      enabled: boolean;
    };
  };
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const updateConfig = (
  current: AppConfig,
  updates: DeepPartial<AppConfig>
): AppConfig => {
  return {
    ...current,
    ...updates,
    theme: { ...current.theme, ...updates.theme },
    features: {
      ...current.features,
      ...updates.features,
      beta: { ...current.features.beta, ...updates.features?.beta },
    },
  };
};
