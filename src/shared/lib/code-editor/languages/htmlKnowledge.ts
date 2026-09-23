/**
 * HTML Language Knowledge Base
 */

import { SnippetItem } from "../snippetsData";

export { MARKUP_TAGS as HTML_TAGS } from "./markup-tags";

export const HTML_ATTRIBUTES = [
  { name: "class", detail: "CSS класс элемента", insertText: 'class="$1"' },
  { name: "id", detail: "Уникальный идентификатор элемента", insertText: 'id="$1"' },
  { name: "src", detail: "URL источника", insertText: 'src="$1"' },
  { name: "href", detail: "Целевой URL ссылки", insertText: 'href="$1"' },
  { name: "alt", detail: "Альтернативный текст изображения", insertText: 'alt="$1"' },
  { name: "type", detail: "Тип элемента / инпута", insertText: 'type="$1"' },
  { name: "name", detail: "Имя поля формы", insertText: 'name="$1"' },
  { name: "value", detail: "Значение поля", insertText: 'value="$1"' },
  { name: "placeholder", detail: "Подсказка в поле ввода", insertText: 'placeholder="$1"' },
  { name: "disabled", detail: "Отключение элемента", insertText: "disabled" },
  { name: "readonly", detail: "Только для чтения", insertText: "readonly" },
  { name: "required", detail: "Обязательное поле", insertText: "required" },
  { name: "target", detail: "Цель открытия ссылки (_blank)", insertText: 'target="_blank"' },
  { name: "rel", detail: "Отношение ссылки (noreferrer)", insertText: 'rel="noreferrer"' },
  { name: "style", detail: "Встроенные CSS стили", insertText: 'style="$1"' },
  { name: "for", detail: "Связка label с id инпута", insertText: 'for="$1"' },
];

export const HTML_SNIPPETS: SnippetItem[] = [
  {
    prefix: "!",
    label: "! ⚡ (HTML5 Boilerplate)",
    detail: "HTML5 базовая структура документа",
    body: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  $1\n</body>\n</html>',
  },
  {
    prefix: "html:5",
    label: "html:5 ⚡ (HTML5 Template)",
    detail: "HTML5 шаблон страницы",
    body: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  $1\n</body>\n</html>',
  },
];
