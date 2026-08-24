/**
 * JSON Language Knowledge Base
 */

import { SnippetItem } from "../snippetsData";

export const JSON_SNIPPETS: SnippetItem[] = [
  {
    prefix: "obj",
    label: "{} ⚡ (JSON Object)",
    detail: "Пустой JSON объект",
    body: '{\n  "$1": "$2"\n}',
  },
  {
    prefix: "arr",
    label: "[] ⚡ (JSON Array)",
    detail: "JSON массив",
    body: "[\n  $1\n]",
  },
  {
    prefix: "kv",
    label: '"key": "value" ⚡ (JSON Key-Value)',
    detail: "Пара ключ-значение",
    body: '"$1": "$2"',
  },
];
