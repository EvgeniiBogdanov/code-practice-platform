# Работа с Git через терминал

Руководство для проекта Code Practice Platform: как вести ветки, писать коммиты и доводить изменения до `main`. Правила PR и лицензии — в [CONTRIBUTING.md](../CONTRIBUTING.md); здесь — практика работы с Git.

## Содержание

1. [Принципы](#принципы)
2. [Первоначальная настройка](#первоначальная-настройка)
3. [Именование веток](#именование-веток)
4. [Как избежать конфликтов имён](#как-избежать-конфликтов-имён)
5. [Ежедневный цикл работы](#ежедневный-цикл-работы)
6. [Коммиты](#коммиты)
7. [Синхронизация с main](#синхронизация-с-main)
8. [Pull request и merge](#pull-request-и-merge)
9. [Hotfix](#hotfix)
10. [Отмена и исправление ошибок](#отмена-и-исправление-ошибок)
11. [Переименование и удаление веток](#переименование-и-удаление-веток)
12. [Шпаргалка](#шпаргалка)

## Принципы

- `main` всегда рабочая: в неё попадает только то, что прошло CI (`CI OK`). Напрямую в `main` не коммитим и не пушим.
- Одна ветка — одна задача. Мелкие и независимые правки не смешиваем в один PR.
- Ветки короткоживущие: чем дольше живёт ветка, тем больнее её сливать.
- Историю общих (запушенных) веток не переписываем. `--force` — только `--force-with-lease` и только в своей ветке.
- Перед каждым действием смотрим состояние: `git status`, `git branch -vv`, `git log --oneline -5`.

## Первоначальная настройка

```bash
git config --global user.name "Имя Фамилия"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global pull.ff only          # pull никогда не создаёт случайный merge-коммит
git config --global fetch.prune true      # убирать ссылки на удалённые ветки при fetch
git config --global push.autoSetupRemote true  # первый push сам настроит upstream
git config --global rerere.enabled true   # запоминать решения конфликтов
```

Клонирование и установка (Lefthook-хуки ставятся на `npm install`):

```bash
git clone https://github.com/EvgeniiBogdanov/code-practice-platform.git
cd code-practice-platform
npm install
```

Что делают хуки: перед коммитом — Prettier и ESLint по изменённым файлам, перед push — проверка типов. Пропустить один раз можно через `LEFTHOOK=0 git commit ...`, но CI всё равно всё проверит.

## Именование веток

Формат:

```
<тип>/<ДД.ММ.ГГ>-<область>-<краткое-описание>
```

Пример: `fix/15.10.26-editor-undo-redo` — исправление от 15 октября 2026 года.

Если в тот же день уже есть ветка с таким же типом и описанием, после даты добавляется счётчик: `<тип>/<ДД.ММ.ГГ>-<N>-<описание>`, где `N` — 2, 3 и так далее (`fix/15.10.26-2-editor-undo-redo`).

Правила записи:

- Дата — дата **создания ветки** в формате `ДД.ММ.ГГ` (точки допустимы в именах веток Git). Берите её командой `date +%d.%m.%y`.
- Остальное: латиница, нижний регистр, слова через дефис, без пробелов и подчёркиваний, 2–5 слов.
- Префикс — тип работы, он совпадает с типом Conventional Commits из заголовка PR.
- Дата ставится сразу после префикса и **не заменяет описание**: по имени должно быть понятно, что делает ветка.

| Префикс     | Для чего                                                  | Пример                              | Тип PR/коммита |
| ----------- | --------------------------------------------------------- | ----------------------------------- | -------------- |
| `feat/`     | Новая функциональность                                    | `feat/15.10.26-editor-multi-cursor`          | `feat`         |
| `fix/`      | Исправление бага (не срочное)                             | `fix/15.10.26-type-tests-reset`              | `fix`          |
| `hotfix/`   | Срочное исправление проблемы на проде, мимо очереди       | `hotfix/15.10.26-pages-deploy-404`           | `fix`          |
| `content/`  | Правки учебного контента: задачи, решения, разборы        | `content/15.10.26-react-task-statements`     | `fix`/`docs`   |
| `refactor/` | Рефакторинг без изменения поведения                       | `refactor/15.10.26-task-registry`            | `refactor`     |
| `perf/`     | Оптимизация производительности                            | `perf/15.10.26-landing-lcp`                  | `perf`         |
| `docs/`     | Документация, README, CHANGELOG                           | `docs/15.10.26-git-workflow`                 | `docs`         |
| `test/`     | Только тесты                                              | `test/15.10.26-algorithms-curriculum`        | `test`         |
| `style/`    | Форматирование, без изменения логики                      | `style/15.10.26-css-tokens-order`            | `style`        |
| `build/`    | Сборка, зависимости                                       | `build/15.10.26-vite-upgrade`                | `build`        |
| `ci/`       | CI/CD, workflows                                          | `ci/15.10.26-quality-gates`                  | `ci`           |
| `chore/`    | Прочая рутина, обслуживание                               | `chore/15.10.26-relicense-agpl`              | `chore`        |
| `release/`  | Подготовка релиза (версия, CHANGELOG)                     | `release/2.4.31`                    | `chore`        |

Отличие `fix/` от `hotfix/`: `fix/` идёт обычным порядком вместе с остальными PR, `hotfix/` — когда сломано то, что видят пользователи, и чинить надо немедленно. Ветка `hotfix/` всё равно создаётся от `main` и проходит CI.

Dependabot создаёт свои ветки `dependabot/...` — руками их не создаём и не переименовываем.

### Хорошие и плохие имена

| Плохо                    | Почему                      | Хорошо                                 |
| ------------------------ | --------------------------- | -------------------------------------- |
| `test`, `new`, `my-work` | Непонятно, о чём ветка      | `feat/15.10.26-task-favorites-filter`  |
| `fix/15.10.26`           | Только дата, нет описания   | `fix/15.10.26-editor-undo-redo-cursor` |
| `fix/editor-undo-redo`   | Нет даты, имя будет повторяться | `fix/15.10.26-editor-undo-redo`    |
| `Fix/15.10.26_Editor`    | Регистр и подчёркивания     | `fix/15.10.26-editor-undo`             |
| `fix/2026-10-15-editor`  | Другой формат даты          | `fix/15.10.26-editor-undo`             |
| `fix/15.10.26-ошибка`    | Кириллица ломает инструменты| `fix/15.10.26-login-form-validation`   |

## Как избежать конфликтов имён

Git не позволяет иметь две ветки с одинаковым именем, а ещё есть нюанс с иерархией: если существует ветка `fix/login`, ветку `fix/login/form` создать нельзя (и наоборот), потому что `fix/login` — это уже файл в `refs/heads`. Чтобы имена не пересекались:

1. **Всегда ставьте дату создания ветки.** Один и тот же баг, вернувшийся через месяц, получит другое имя: `fix/15.10.26-editor-undo-redo` и `fix/12.11.26-editor-undo-redo`.
2. **Делайте описание конкретным.** Область + суть: `editor-undo-redo-after-paste`, а не `editor`. Это защищает от совпадения в рамках одного дня.
3. **Если в один день нужна вторая ветка с тем же типом и описанием,** добавьте счётчик сразу после даты: первая ветка — `fix/15.10.26-editor-undo-redo`, вторая — `fix/15.10.26-2-editor-undo-redo`, третья — `fix/15.10.26-3-editor-undo-redo`. Первую ветку не переименовываем. Перед выбором номера проверьте занятые имена командой из пункта 6.
4. **Не используйте имя как префикс другой ветки.** Нельзя иметь `feat/15.10.26-tasks` и `feat/15.10.26-tasks/filters` одновременно: Git хранит ветки как пути. Берите `feat/15.10.26-tasks-list` и `feat/15.10.26-tasks-filters`.
5. **Для работы нескольких людей над одной областью** добавляйте ник после типа: `feat/ivan/15.10.26-editor-snippets`. Правило 4 соблюдайте: ветки с именем `feat/ivan` быть не должно.
6. **Перед созданием проверьте, что имени нет** ни локально, ни на удалённом сервере:

```bash
git fetch --prune
git branch -a --list "*editor-undo*"
git ls-remote --heads origin "*editor-undo*"
```

7. **Не переиспользуйте имя смёрженной ветки.** После merge ветку удаляем (см. ниже); новая работа — новая ветка с новой датой.
8. **Не работайте двое в одной ветке без договорённости.** Договоритесь, кто пушит, и перед работой делайте `git pull`.

Формат проверяет хук `branch-name` в [lefthook.yml](../lefthook.yml) перед `git push`. Он пропускает `main`, `dependabot/*` и `release/*`, а остальные имена, не подходящие под `<тип>/<ДД.ММ.ГГ>[-N]-<описание>`, отклоняет. Если ветка названа неверно, переименуйте её (`git branch -m <новое-имя>`) и повторите push. Пропустить проверку один раз: `LEFTHOOK_EXCLUDE=branch-name git push`.

> Дата в имени отвечает на вопрос «когда», а не «что» и не хранит связь с задачей. Поэтому суть всегда пишем в описании, а ссылку на issue (если есть) — в описании PR (`Closes #123`).

## Ежедневный цикл работы

### 1. Начать с актуального main

```bash
git switch main
git pull
git switch -c feat/15.10.26-editor-multi-cursor
```

Если пришли в середине работы с чужой веткой:

```bash
git fetch origin
git switch fix/15.10.26-type-tests-reset      # локальная ветка создастся и привяжется к origin сама
```

### 2. Работать маленькими шагами

```bash
git status                    # что изменено
git diff                      # посмотреть правки целиком
git add src/path/file.ts      # добавлять конкретные файлы, не вслепую `git add .`
git add -p                    # или выбрать куски правок интерактивно
git diff --staged             # проверить, что именно уйдёт в коммит
git commit -m "feat(editor): add multi-cursor selection"
```

### 3. Запушить

```bash
git push                      # первый раз с push.autoSetupRemote сам настроит upstream
# без настройки: git push -u origin feat/15.10.26-editor-multi-cursor
```

### 4. Проверить локально перед PR

```bash
npm run lint
npm run typecheck
npm run test:unit
```

## Коммиты

Формат — [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/):

```
<тип>(<область>): <что сделано в повелительном наклонении, строчными>

<необязательное тело: зачем и почему, а не «что»>

<необязательный футер: Closes #123>
```

Допустимые типы (их же проверяет CI в заголовке PR): `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `upg`, `revert`. Область — необязательна: `editor`, `react`, `typescript`, `algorithms`, `landing` и т. п.

Примеры из проекта:

```
fix(typescript): fix inaccurate hints and explanations
fix(algorithms): rewrite task statements and examples in own words
chore(license): AGPL-3.0 for code, CC BY-NC-SA 4.0 for content
```

Хорошие привычки:

- Один коммит — одно логическое изменение, которое можно понять и откатить отдельно.
- Заголовок до ~72 символов, без точки в конце.
- Не коммитим секреты, `.env`, `node_modules`, `dist`, `coverage`, отчёты тестов.
- Незаконченную работу можно коммитить как `wip`, но перед PR — привести историю в порядок (см. ниже), потому что при squash-merge важен только заголовок PR.

## Синхронизация с main

Пока вы работали, `main` ушёл вперёд. Подтягиваем изменения в свою ветку:

```bash
git fetch origin
git merge origin/main        # безопасно для уже запушенных веток
```

или, пока ветка ещё не опубликована и в ней никто больше не работает:

```bash
git fetch origin
git rebase origin/main       # история получается линейной
```

Правило: **rebase — только для своих неопубликованных коммитов**, для общих веток — merge. После rebase опубликованной ветки нужен `git push --force-with-lease` (он откажется перезаписывать чужие коммиты, в отличие от `--force`).

### Если случился конфликт

```bash
git status                   # какие файлы в конфликте (both modified)
# открыть файл, найти маркеры <<<<<<<, =======, >>>>>>>, оставить нужный код
git add path/to/file
git merge --continue         # или: git rebase --continue
# передумали: git merge --abort / git rebase --abort
```

Конфликт в `package-lock.json` не правим руками: берём версию из `main` и пересобираем.

```bash
git checkout origin/main -- package-lock.json
npm install
git add package-lock.json
```

### Подтянуть изменения своей ветки с сервера

Если ветку изменили на GitHub или с другого компьютера:

```bash
git pull                      # благодаря pull.ff only не создаст лишний merge-коммит
```

Если upstream не настроен или указывает не туда (бывает после переименования ветки):

```bash
git branch -vv                                                   # посмотреть, куда смотрит ветка
git branch --set-upstream-to=origin/<имя-ветки>
```

## Pull request и merge

1. Запушьте ветку и откройте PR в `main`.
2. **Заголовок PR — в формате Conventional Commits**, иначе упадёт проверка `Conventional PR title`: `fix(react): update warm-up task statements`. Заголовок вида `Content/react task statements` не пройдёт — нет типа.
3. Заполните [шаблон PR](../.github/PULL_REQUEST_TEMPLATE.md).
4. Если изменение видно пользователю — поднимите версию в `package.json`, добавьте запись в `CHANGELOG.md`, обновите бейдж в README (CI сверяет их).
5. Дождитесь зелёного `CI OK`. Merge — только через squash: заголовок PR становится коммитом в `main`.
6. После merge удалите ветку и обновите `main`:

```bash
git switch main
git pull
git branch -d feat/15.10.26-editor-multi-cursor        # удалить локально
git push origin --delete feat/15.10.26-editor-multi-cursor   # удалить на сервере (GitHub может сделать это сам)
git fetch --prune
```

`-d` откажется удалять ветку с несмёрженными коммитами — это защита. При squash-merge Git не видит ветку «влитой» и тоже может спросить; убедившись, что PR смёржен, используйте `-D`.

## Hotfix

Когда на проде сломано то, что видят пользователи:

```bash
git switch main
git pull
git switch -c hotfix/15.10.26-pages-deploy-404
# минимальное исправление, без попутных изменений
git commit -m "fix(ci): deploy Pages on push to main"
git push
```

Откройте PR с заголовком `fix(...)`, пометьте его срочным, дождитесь CI и смёржите вне очереди. Не добавляйте в hotfix рефакторинг и «заодно» правки.

## Отмена и исправление ошибок

| Ситуация                                         | Команда                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| Отменить правки в файле (необратимо!)            | `git restore path/to/file`                                         |
| Убрать файл из индекса, оставив правки           | `git restore --staged path/to/file`                                |
| Поправить последний коммит (не запушенный)       | `git add ... && git commit --amend`                                |
| Изменить только сообщение последнего коммита     | `git commit --amend -m "новое сообщение"`                          |
| Отменить коммит, оставив правки в рабочей папке  | `git reset --soft HEAD~1`                                          |
| Отменить уже запушенный коммит                   | `git revert <sha>` (создаёт новый коммит, историю не ломает)       |
| Временно спрятать работу                         | `git stash push -m "описание"` → потом `git stash pop`             |
| Найти потерянный коммит после ошибки             | `git reflog`, затем `git switch -c rescue <sha>`                   |
| Закоммитил не в ту ветку                         | `git switch -c right-branch`, затем на старой: `git reset --hard origin/<ветка>` |

Опасные команды — `git reset --hard`, `git clean -fd`, `git push --force`, `git branch -D`. Прежде чем их выполнять, проверьте `git status` и `git log`; изменения, которых нет в коммитах, после них не вернуть.

## Переименование и удаление веток

Переименование локальной ветки, которая уже есть на сервере, затрагивает три вещи:

```bash
git branch -m old-name new-name                    # 1. локальное имя
git push -u origin new-name                        # 2. опубликовать под новым именем и привязать upstream
git push origin --delete old-name                  # 3. удалить старое имя на сервере
```

Если по старой ветке уже открыт PR, GitHub закроет его при удалении ветки — поэтому либо переименуйте до открытия PR, либо откройте новый. После `git branch -m` без шагов 2–3 upstream продолжит указывать на старую ветку (проверка: `git branch -vv`).

Прибраться в локальных ветках:

```bash
git fetch --prune
git branch -vv | grep ': gone]'                    # ветки, удалённые на сервере
git branch --merged main                           # ветки, уже влитые в main
```

## Шпаргалка

```bash
# Состояние
git status -sb                      # короткий статус с веткой
git branch -vv                      # ветки и их upstream
git log --oneline --graph -15       # история графом
git diff / git diff --staged        # что изменено / что в индексе

# Ветки
git switch main                     # переключиться
git switch -c feat/name             # создать и переключиться
git branch -d name                  # удалить (безопасно)

# Сохранение
git add -p                          # выбрать куски правок
git commit -m "type(scope): text"   # коммит
git commit --amend                  # поправить последний

# Синхронизация
git fetch --prune                   # обновить сведения о сервере
git pull                            # подтянуть текущую ветку (только fast-forward)
git push                            # отправить
git merge origin/main               # влить свежий main в ветку

# Спасение
git stash push -m "msg" / git stash pop
git reflog
git revert <sha>
```

## Полезные ссылки

- [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/)
- [Pro Git (книга, на русском)](https://git-scm.com/book/ru/v2)
- [CONTRIBUTING.md](../CONTRIBUTING.md) — правила кода, PR и лицензии
