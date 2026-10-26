// Каталог показывает «3 товара» и «1 товар», а сообщения приходят на двух языках.
// Строку нельзя склеивать руками, а формы слова по числу зависят от языка.
//
// Реализуйте createMessages({ locale, fallbackLocale, dictionaries }):
// - t(key, params) ищет строку сначала в locale, затем в fallbackLocale; нет нигде —
//   возвращает сам key;
// - плейсхолдеры вида {name} заменяются на params.name; неизвестный плейсхолдер остаётся;
// - если сообщение — набор форм для плюрализации, форма выбирается через
//   Intl.PluralRules языка, из которого взято сообщение, по params.count;
//   нет нужной формы — берётся other.

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
  return {
    t: (key: string) => key,
  };
}
