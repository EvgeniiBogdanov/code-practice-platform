/**
 * UI Configuration Constants
 */

declare const __APP_VERSION__: string | undefined;

export const APP_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "2.2.7";

export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 24;

export const DEFAULT_SIDEBAR_WIDTH = 280;
export const MIN_SIDEBAR_WIDTH = 200;
export const MAX_SIDEBAR_WIDTH = 480;
