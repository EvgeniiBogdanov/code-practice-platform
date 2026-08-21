/**
 * Единый источник правды для цветов UI, системных иконок и версии платформы
 */

// Версия платформы, автоматически подставляемая из package.json на этапе сборки Vite
export const APP_VERSION =
  typeof __APP_VERSION__ !== "undefined"
    ? __APP_VERSION__
    : "2.2.6";

// Цвет иконок файлов/задач в Sidebar, Header, Breadcrumbs и списках папок
export const FILE_ICON_COLOR = "#94a3b8"; // Slate 400
