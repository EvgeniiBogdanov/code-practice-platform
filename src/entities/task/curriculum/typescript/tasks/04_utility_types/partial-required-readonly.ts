// 1. resolveOptions принимает любой набор полей Options (можно ни одного)
//    и дополняет их значениями по умолчанию.
// 2. Результат должен гарантировать наличие всех полей,
//    а изменить его после создания должно быть нельзя.
// 3. Старая библиотека описывает LegacyOptions с необязательными полями.
//    Опишите StrictLegacyOptions, в котором все эти поля обязательны.
// 4. CacheKey должен исключать null и undefined из исходного RawKey.

interface Options {
  timeout: number;
  retries: number;
  baseUrl: string;
}

interface LegacyOptions {
  host?: string;
  port?: number;
}

const DEFAULT_OPTIONS = { timeout: 5000, retries: 3, baseUrl: "/" };

const resolveOptions = (options) => {
  return { ...DEFAULT_OPTIONS, ...options };
};

const resolved = resolveOptions({ retries: 5 });
resolved.retries = 10; // должно быть ошибкой

type StrictLegacyOptions = LegacyOptions;

type RawKey = string | number | null | undefined;
type CacheKey = RawKey;
