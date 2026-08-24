/**
 * HTML Language Knowledge Base
 */

import { SnippetItem } from "../snippetsData";

export const HTML_TAGS = [
  { name: "div", detail: "HTML <div> блок-контейнер" },
  { name: "span", detail: "HTML <span> строчный элемент" },
  { name: "p", detail: "HTML <p> текстовый абзац" },
  { name: "a", detail: "HTML <a> гиперссылка" },
  { name: "button", detail: "HTML <button> кнопка" },
  { name: "input", detail: "HTML <input> поле ввода" },
  { name: "form", detail: "HTML <form> форма" },
  { name: "label", detail: "HTML <label> подпись к элементу формы" },
  { name: "select", detail: "HTML <select> выпадающий список" },
  { name: "option", detail: "HTML <option> пункт списка" },
  { name: "textarea", detail: "HTML <textarea> многострочное поле ввода" },
  { name: "ul", detail: "HTML <ul> маркированный список" },
  { name: "ol", detail: "HTML <ol> нумерованный список" },
  { name: "li", detail: "HTML <li> пункт списка" },
  { name: "table", detail: "HTML <table> таблица" },
  { name: "thead", detail: "HTML <thead> заголовочная часть таблицы" },
  { name: "tbody", detail: "HTML <tbody> тело таблицы" },
  { name: "tr", detail: "HTML <tr> строка таблицы" },
  { name: "th", detail: "HTML <th> заголовочная ячейка таблицы" },
  { name: "td", detail: "HTML <td> ячейка таблицы" },
  { name: "h1", detail: "HTML <h1> заголовок 1 уровня" },
  { name: "h2", detail: "HTML <h2> заголовок 2 уровня" },
  { name: "h3", detail: "HTML <h3> заголовок 3 уровня" },
  { name: "header", detail: "HTML <header> шапка страницы или секции" },
  { name: "footer", detail: "HTML <footer> подвал страницы или секции" },
  { name: "nav", detail: "HTML <nav> навигационный блок" },
  { name: "main", detail: "HTML <main> основное содержимое страницы" },
  { name: "section", detail: "HTML <section> тематический раздел" },
  { name: "article", detail: "HTML <article> самостоятельная статья" },
  { name: "img", detail: "HTML <img> изображение" },
  { name: "link", detail: "HTML <link> внешняя ссылка (стили/иконки)" },
  { name: "script", detail: "HTML <script> подключение скрипта" },
  { name: "style", detail: "HTML <style> встроенные стили" },
];

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
