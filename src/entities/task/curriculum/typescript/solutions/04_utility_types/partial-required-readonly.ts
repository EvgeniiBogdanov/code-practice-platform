interface Options {
  timeout: number;
  retries: number;
  baseUrl: string;
}

interface LegacyOptions {
  host?: string;
  port?: number;
}

type ResolvedOptions = Readonly<Options>;

const DEFAULT_OPTIONS: ResolvedOptions = { timeout: 5000, retries: 3, baseUrl: "/" };

const resolveOptions = (options: Partial<Options>): ResolvedOptions => {
  return { ...DEFAULT_OPTIONS, ...options };
};

const resolved = resolveOptions({ retries: 5 });
// resolved.retries = 10 — ошибка: поле доступно только для чтения (проверяется в tests.ts)

type StrictLegacyOptions = Required<LegacyOptions>; // { host: string; port: number }

type RawKey = string | number | null | undefined;
type CacheKey = NonNullable<RawKey>; // string | number
