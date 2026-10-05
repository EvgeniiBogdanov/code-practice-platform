import { getLanguageId, LANGUAGES, type LanguageId } from "@/shared/lib/code-editor";

/** Keep in sync with `tab-size` of the textarea and highlight layer in CodeEditor.module.css. */
export const TAB_SIZE = 2;

export interface LanguageInfo {
  id: LanguageId;
  name: string;
}

export const getLanguageInfo = (filepath = "main.jsx"): LanguageInfo => {
  const id = getLanguageId(filepath);
  return { id, name: LANGUAGES[id].label };
};

export interface PluralForms {
  one: string;
  few: string;
  many: string;
}

const pluralRules = new Intl.PluralRules("ru");

/** "1 строка", "3 строки", "11 строк". */
export const pluralize = (count: number, forms: PluralForms): string => {
  const rule = pluralRules.select(count);
  return `${count} ${rule === "one" ? forms.one : rule === "few" ? forms.few : forms.many}`;
};
