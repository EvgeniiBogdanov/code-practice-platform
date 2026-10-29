import type { DesignScheme } from "../../model/types";
import { arrow, card } from "../../model/schemeLayout";

/** Each stage fills its own band of rows, so the viewer can frame what the stage adds. */
export const scheme: DesignScheme = {
  nodes: [
    card(
      "requirements",
      "req-func",
      [0, 0],
      [
        "Функциональные",
        "• каталог, страница видео",
        "• плеер, авто-качество",
        "• продолжить просмотр",
        "• субтитры",
      ]
    ),
    card(
      "requirements",
      "req-nonfunc",
      [1, 0],
      [
        "Нефункциональные",
        "• старт за 1–2 с",
        "• без пауз в метро",
        "• телефон и телевизор",
        "• трафик по делу",
      ]
    ),
    card(
      "requirements",
      "req-scope",
      [2, 0],
      ["Границы и метрики", "вне: загрузка видео,", "рекомендации, DRM;", "старт, буферизация"]
    ),

    card(
      "architecture",
      "pages",
      [0, 1],
      ["Каталог и страница", "SSR, индексация;", "плеер — ленивый остров"]
    ),
    card("architecture", "player-ui", [1, 1], ["UI плеера", "контролы, субтитры,", "клавиатура"]),
    card("architecture", "api", [2, 1], ["API", "видео, прогресс,", "метрики"]),
    card("architecture", "cdn", [0, 2], ["CDN", "манифест и сегменты", "по 2–6 с, рядом"]),
    card(
      "architecture",
      "engine",
      [1, 2],
      ["Движок", "MSE + hls.js / Shaka:", "сегменты, качество"]
    ),
    card(
      "architecture",
      "machine",
      [2, 2],
      ["Машина состояний", "loading · playing ·", "buffering · error"]
    ),

    card(
      "data-model",
      "dm-video",
      [0, 3],
      ["Video", "id, title, duration,", "poster, manifestUrl,", "subtitles[]"]
    ),
    card(
      "data-model",
      "dm-levels",
      [1, 3],
      ["Лесенка качеств", "bitrate, width, height,", "codecs — из манифеста"]
    ),
    card(
      "data-model",
      "dm-states",
      [2, 3],
      ["Состояния плеера", "idle → loading →", "playing ⇄ paused,", "buffering, ended, error"]
    ),
    card("data-model", "dm-buffer", [0, 4], ["Буфер", "скачанные интервалы;", "впереди 30–60 с"]),
    card(
      "data-model",
      "dm-progress",
      [1, 4],
      ["Progress", "videoId, position;", "раз в 10–30 с,", "на паузе и при уходе"]
    ),
    card(
      "data-model",
      "dm-prefs",
      [2, 4],
      ["Настройки зрителя", "громкость, субтитры,", "скорость — localStorage"]
    ),

    card(
      "interface",
      "if-api",
      [0, 5],
      ["GET /videos/:id", "метаданные +", "manifestUrl; PUT", "/progress идемпотентен"]
    ),
    card(
      "interface",
      "if-abr",
      [1, 5],
      ["Выбор качества", "сглаженная сеть × запас;", "вверх — по ступени,", "вниз — сразу"]
    ),
    card(
      "interface",
      "if-player",
      [2, 5],
      ["VideoPlayer", "videoId, startAt;", "события: statechange,", "qualitychange, error"]
    ),
    card(
      "interface",
      "if-events",
      [0, 6],
      ["POST /events", "пачка: старт, пауза,", "буферизация, качество"]
    ),

    card(
      "optimizations",
      "opt-start",
      [1, 6],
      ["Быстрый старт", "preconnect, постер,", "первые сегменты", "в низком качестве"]
    ),
    card(
      "optimizations",
      "opt-errors",
      [2, 6],
      ["Сбои сегментов", "повтор с паузой,", "ниже качество,", "резервный CDN"]
    ),
    card(
      "optimizations",
      "opt-traffic",
      [0, 7],
      ["Трафик и метрики", "Save-Data, не выше", "экрана; события —", "пачкой, sendBeacon"]
    ),
    card(
      "optimizations",
      "opt-a11y",
      [1, 7],
      ["Доступность", "клавиатура, подписи", "кнопок, WebVTT,", "без автозвука"]
    ),
    card(
      "optimizations",
      "opt-metrics",
      [2, 7],
      ["Метрики", "до первого кадра,", "доля буферизации,", "битрейт, ошибки"]
    ),
  ],
  edges: [
    arrow("architecture", "pages", "player-ui", "videoId"),
    arrow("architecture", "player-ui", "api", "прогресс"),
    arrow("architecture", "player-ui", "engine", "play, seek", ["bottom", "top"]),
    arrow("architecture", "cdn", "engine", "сегменты"),
    arrow("architecture", "engine", "machine", "события"),

    arrow("data-model", "engine", "dm-levels", "", ["bottom", "top"]),
    arrow("data-model", "machine", "dm-states", "", ["bottom", "top"]),

    arrow("interface", "if-abr", "if-player", "qualitychange"),
  ],
};
