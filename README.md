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
```

### Команда `apply`

Собирает все changeset файлы, генерирует changelog и удаляет файлы.

#### Опции:
- `--dry-run` - предварительный просмотр без применения изменений
- `--use-current-version` - использовать текущую версию из package.json вместо автоматического расчета
- `--full` - показать полное содержимое changelog в dry-run режиме

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
```

## Структура проекта

```
.
├── src/
│   ├── commands/
│   │   ├── add.ts      # Команда создания changeset
│   │   └── apply.ts    # Команда применения changeset
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
message: Fix login button not working
timestamp: '2024-01-15'
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

## Скрипты

- `npm run build` - сборка проекта с помощью SWC
- `npm run dev` - сборка в режиме watch
- `npm run start` - запуск скомпилированного приложения
- `npm run clean` - очистка папки dist

## Преимущества Markdown формата

- **Читаемость**: Changeset файлы легко читать и редактировать
- **Простота**: Минимальный набор полей для быстрого создания
- **Совместимость**: Стандартный формат для документации
- **Версионирование**: Git лучше работает с текстовыми файлами
- **Редактирование**: Можно легко редактировать файлы в любом текстовом редакторе 