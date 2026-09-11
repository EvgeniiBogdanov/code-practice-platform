export const loadAlgorithmLab = (): Promise<typeof import("../ui/AlgorithmLab")> =>
  import("../ui/AlgorithmLab");

export const preloadTaskVisualization = (): void => {
  void loadAlgorithmLab().catch((error: unknown) => {
    console.warn("Не удалось предзагрузить визуализацию", error);
  });
};
