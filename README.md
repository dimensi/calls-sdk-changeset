# Changeset CLI

CLI инструмент для управления changeset файлами и генерации changelog на основе TypeScript с использованием SWC для сборки.

## Установка

```bash
npm install
npm run build
npm link  # для глобального использования
```

## Использование

После установки вы можете использовать команду `changeset` глобально.

### Команда `add`

Создает новый changeset файл с рандомным ID.

#### Опции:

- `--patch` или `-p` - создать patch changeset (исправления багов)
- `--minor` или `-m` - создать minor changeset (новые функции)
- `--major` или `-M` - создать major changeset (breaking changes)
- `--type <type>` или `-t <type>` - явно задать тип (`patch | minor | major`)
- `--message <message>` - передать текст изменения без интерактивного вопроса
- `--stdin` - прочитать текст изменения из stdin (для CI/скриптов)

#### Примеры:

```bash
# Интерактивный режим
changeset add

# С указанием типа
changeset add --patch
changeset add --minor
changeset add --major

# Короткие флаги
changeset add -p
changeset add -m
changeset add -M

# Явный выбор типа через --type
changeset add --type patch
changeset add -t minor

# Полностью неинтерактивный режим
changeset add --type patch --message "Fix race condition in call state sync"
echo "Fix token refresh in reconnect flow" | changeset add --major --stdin
```

#### Неинтерактивный режим (CI / automation)

Команда `changeset add` автоматически переходит в неинтерактивный режим, если stdin не TTY (например, в CI пайплайнах).

Важно:

- В неинтерактивном режиме **обязательно** указывать тип изменения (`--patch`, `--minor`, `--major` или `--type`).
- Сообщение можно передать через `--message` или через `--stdin`.
- Пустое сообщение не допускается.

### Команда `apply`

Собирает все changeset файлы, генерирует changelog и удаляет файлы.

#### Опции:

- `--dry-run` - предварительный просмотр без применения изменений
- `--use-current-version` - использовать текущую версию из package.json вместо автоматического расчета
- `--full` - показать полное содержимое changelog в dry-run режиме
- `--save` - сохранить обработанные файлы в save.json (работает только с --dry-run). Полезно для бета-релизов, когда нужно сгенерировать changelog без обновления основного файла
- `--from-date <date>` - применить changeset файлы с определенной даты (формат YYYY-MM-DD)

#### Примеры:

```bash
# Применить изменения
changeset apply

# Предварительный просмотр (только новые изменения)
changeset apply --dry-run

# Предварительный просмотр (полный changelog)
changeset apply --dry-run --full

# Использовать текущую версию из package.json
changeset apply --use-current-version

# Комбинирование опций
changeset apply --dry-run --use-current-version --full

# Сохранение обработанных файлов в save.json
changeset apply --dry-run --save

# Применение changeset файлов с определенной даты
changeset apply --from-date 2024-01-15

# Предварительный просмотр с фильтрацией по дате
changeset apply --dry-run --from-date 2024-01-15
```

### Команда `release-notes`

Извлекает запись конкретной версии из `CHANGELOG.md` и сохраняет ее в отдельный файл. Команда используется в GitHub Actions для создания GitHub Release notes из changelog, который сгенерировала сама тулза.

#### Опции:

- `--version <version>` - версия для извлечения (`1.5.0` или `v1.5.0`)
- `--output <file>` - файл для сохранения release notes

#### Пример:

```bash
changeset release-notes --version 1.5.0 --output .release-notes.md
```

### Пример использования функции Save

Функция `--save` позволяет сохранить обработанные файлы в save.json без их удаления. Это может быть полезно в различных сценариях.

#### Пример: Бета-релизы

Один из возможных кейсов использования - создание бета-релизов с changelog без обновления основного CHANGELOG.md файла:

```bash
# Генерация changelog для бета-версии (файлы не удаляются)
changeset apply --dry-run --save

# Бета-релиз с определенной версией
changeset apply --dry-run --save --use-current-version

# Бета-релиз с полным changelog
changeset apply --dry-run --save --full
```

#### Workflow для бета-релизов:

```bash
# 1. Создаем бета-версию с changelog
changeset apply --dry-run --save --full > beta-changelog.md

# 2. Публикуем бета-версию с changelog
# (beta-changelog.md можно использовать для релизных заметок)

# 3. Когда готовы к финальному релизу, применяем изменения
changeset apply
```

#### Что происходит при использовании --save:

- Файлы помечаются как обработанные в save.json
- CHANGELOG.md не изменяется
- Можно повторно применять изменения
- При обычном `changeset apply` save.json очищается

## Структура проекта

```
.
├── src/
│   ├── commands/
│   │   ├── add.ts           # Команда создания changeset
│   │   ├── apply.ts         # Команда применения changeset
│   │   └── release-notes.ts # Команда генерации release notes
│   ├── types.ts        # TypeScript типы
│   ├── utils.ts        # Утилиты
│   └── index.ts        # Главный файл CLI
├── .changeset/         # Директория с changeset файлами (.md)
├── CHANGELOG.md        # Генерируемый changelog
├── package.json
├── tsconfig.json
└── .swcrc
```

## Формат changeset файла

Каждый changeset файл имеет формат Markdown с YAML заголовком:

```markdown
---
type: patch
timestamp: "2024-01-15"
author: username
---

Fix login button not working
```

## Формат changelog

Changelog генерируется в формате Markdown:

```markdown
# Changelog

**v3.0.0**

- (🚨 major) Breaking change in API
- (✨ minor) Add new feature
- (🐛 patch) Fix bug

**v2.1.0**

- (✨ minor) Add user authentication
- (🐛 patch) Fix login button not working

**v2.0.0**

- (🚨 major) API redesign
- (✨ minor) Implement dark mode
```

## Разработка

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Разработка с watch режимом
npm run dev

# Запуск
npm start
```

## Автопубликация в npm (GitHub Actions)

В репозитории добавлен workflow `.github/workflows/npm-publish.yml`, который публикует пакет в npm по Trusted Publishing (OIDC):

- запуск при push тега `v*`
- ручной запуск (`workflow_dispatch`) с указанием тега
- публикация через `npm publish --access public`
- создание GitHub Release с notes из `CHANGELOG.md`

Trusted Publishing автоматически добавляет provenance attestation, поэтому отдельный npm token и флаг `--provenance` в workflow не нужны.

Перед публикацией workflow выполняет:

1. `npm ci`
2. `npm run build`
3. `npm run typecheck`
4. проверку совпадения тега `vX.Y.Z` с `package.json` version
5. `changeset release-notes --version X.Y.Z --output .release-notes.md`

## Скрипты

- `npm run build` - сборка проекта с помощью SWC
- `npm run typecheck` - проверка TypeScript типов без генерации файлов
- `npm run lint` - текущая линт-проверка (на базе `tsc --noEmit`)
- `npm run dev` - сборка в режиме watch
- `npm run start` - запуск скомпилированного приложения
- `npm run clean` - очистка папки dist
