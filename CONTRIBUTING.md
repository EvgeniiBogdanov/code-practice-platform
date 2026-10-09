# Участие в разработке

Спасибо, что хотите помочь проекту! Ниже — всё, что нужно для первого PR.

## Быстрый старт

Нужны Node.js из [`.nvmrc`](.nvmrc) и npm.

```bash
npm install      # заодно ставит git-хуки Lefthook
npm run dev      # http://localhost:4000/code-practice-platform/
```

Перед коммитом Lefthook сам прогоняет Prettier и ESLint по изменённым файлам, перед push — проверку типов.

## Проверки

| Команда | Что проверяет |
| :-- | :-- |
| `npm run lint` | ESLint, ноль предупреждений |
| `npm run typecheck` | TypeScript |
| `npm run test:unit` | Unit-тесты (Vitest) |
| `npm run build && npm run test:e2e` | E2E и доступность (Playwright + axe) |
| `npm run build && npm run size` | Бюджет бандла |

CI запускает всё это и Lighthouse в каждом PR. Merge возможен только при зелёном `CI OK`.

## Правила кода

- Архитектура — [Feature-Sliced Design](https://feature-sliced.design): импорты только сверху вниз по слоям и только через публичный `index.ts` слайса; линтер это проверяет.
- TypeScript без `any`, `@ts-ignore` и `eslint-disable`: ошибки исправляются, а не скрываются.
- Стили — только CSS Modules и дизайн-токены (`var(--...)`), классы склеиваются через `clsx`.
- Новый файл длиннее 300 строк не пройдёт линтер — разбейте его.

## Pull request

1. Создайте ветку от `main` и сделайте изменения.
2. Заголовок PR — в формате [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/) (`feat: ...`, `fix(editor): ...`): при squash-merge он становится сообщением коммита.
3. Если изменение заметно пользователю — поднимите версию в `package.json`, добавьте запись в [`CHANGELOG.md`](CHANGELOG.md) и обновите бейдж версии в README. CI проверит, что они совпадают.
4. Заполните [шаблон PR](.github/PULL_REQUEST_TEMPLATE.md).

## Лицензия вклада

Отправляя pull request, вы подтверждаете, что имеете право передать этот вклад, и соглашаетесь распространять его на условиях лицензии проекта:

- код платформы — [GNU AGPL v3.0](LICENSE);
- учебный контент (`src/entities/task/curriculum/**`, `src/shared/data/**`) — [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).

Не добавляйте чужие задачи, тексты или код без совместимой лицензии и указания источника.
