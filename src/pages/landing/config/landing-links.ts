export const REPOSITORY_URL = "https://github.com/EvgeniiBogdanov/code-practice-platform";
export const TELEGRAM_URL = "https://t.me/johnbeelow";
export const CHANGELOG_URL = `${REPOSITORY_URL}/blob/main/CHANGELOG.md`;
export const LICENSE_URL = `${REPOSITORY_URL}/blob/main/LICENSE.md`;
export const HOTKEYS_URL = `${REPOSITORY_URL}#️-горячие-клавиши`;

/** Anchor ids of the landing sections. */
export const LANDING_SECTION = {
  practice: "practice",
  catalog: "catalog",
  probability: "probability",
  editor: "editor",
  runner: "runner",
  start: "start",
} as const;

export type LandingSectionId = (typeof LANDING_SECTION)[keyof typeof LANDING_SECTION];

export interface LandingAnchorLink {
  sectionId: LandingSectionId;
  label: string;
  description: string;
}

export const FEATURE_LINKS: readonly LandingAnchorLink[] = [
  {
    sectionId: LANDING_SECTION.practice,
    label: "Цикл практики",
    description: "Решение, эталон и повторение каждой задачи",
  },
  {
    sectionId: LANDING_SECTION.probability,
    label: "Индекс вероятности",
    description: "Что чаще всего дают на live coding",
  },
  {
    sectionId: LANDING_SECTION.editor,
    label: "Редактор кода",
    description: "Горячие клавиши VS Code прямо в браузере",
  },
  {
    sectionId: LANDING_SECTION.runner,
    label: "Живой запуск",
    description: "React 19, сплит 70/30 и песочница",
  },
];

export interface ExternalLink {
  label: string;
  href: string;
}

export const PROJECT_LINKS: readonly ExternalLink[] = [
  { label: "GitHub", href: REPOSITORY_URL },
  { label: "Telegram", href: TELEGRAM_URL },
  { label: "Changelog", href: CHANGELOG_URL },
  { label: "Лицензия", href: LICENSE_URL },
];
