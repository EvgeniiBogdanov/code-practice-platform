export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export type PluralForms = Partial<Record<PluralCategory, string>> & { other: string };

export type Message = string | PluralForms;

export type Params = Record<string, string | number>;

export interface MessagesOptions {
  locale: string;
  fallbackLocale: string;
  dictionaries: Record<string, Record<string, Message>>;
}

export interface Messages {
  t: (key: string, params?: Params) => string;
}

export function createMessages({ locale, fallbackLocale, dictionaries }: MessagesOptions): Messages {
  // Ищем строку в языке интерфейса, затем в запасном; вместе с ней запоминаем язык,
  // потому что правила плюрализации принадлежат языку строки, а не интерфейса.
  const lookup = (key: string): { message: Message; language: string } | undefined => {
    for (const language of [locale, fallbackLocale]) {
      const message = dictionaries[language]?.[key];
      if (message !== undefined) return { message, language };
    }
    return undefined;
  };

  const pickForm = (forms: PluralForms, language: string, count: number): string => {
    const category: PluralCategory = new Intl.PluralRules(language).select(count);
    return forms[category] ?? forms.other;
  };

  const interpolate = (text: string, params: Params): string =>
    text.replace(/\{(\w+)\}/g, (placeholder: string, name: string) =>
      Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : placeholder
    );

  const t = (key: string, params: Params = {}): string => {
    const found = lookup(key);
    if (!found) return key;
    const count = typeof params.count === "number" ? params.count : 0;
    const text =
      typeof found.message === "string" ? found.message : pickForm(found.message, found.language, count);
    return interpolate(text, params);
  };

  return { t };
}
