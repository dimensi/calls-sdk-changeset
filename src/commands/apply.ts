import chalk from "chalk";
import {
  getChangesetFiles,
  getUnprocessedFiles,
  readChangesetFile,
  deleteChangesetFile,
  getCurrentVersion,
  generateVersion,
  readExistingChangelog,
  writeChangelog,
  readSaveFile,
  writeSaveFile,
  clearSaveFile,
  formatChangelogEntry,
  formatDate,
} from "../utils.js";
import { ChangelogEntry } from "../types.js";

export async function applyCommand(
  dryRun: boolean = false,
  useCurrentVersion: boolean = false,
  showFull: boolean = false,
  saveMode: boolean = false,
): Promise<void> {
  console.log(chalk.blue("🔄 Applying changesets...\n"));

  const changesetFiles = saveMode ? getUnprocessedFiles() : getChangesetFiles();

  if (changesetFiles.length === 0) {
    console.log(chalk.yellow("⚠️  No changeset files found"));
    console.log(chalk.gray('Run "changeset add" to create a new changeset'));
    return;
  }

  console.log(chalk.gray(`Found ${changesetFiles.length} changeset file(s)`));

  // Читаем все changeset файлы
  const changesets = changesetFiles.map((filename) => {
    const data = readChangesetFile(filename);
    return { filename, ...data };
  });

  // Группируем изменения по типу
  const changes = {
    patch: [] as string[],
    minor: [] as string[],
    major: [] as string[],
  };

  changesets.forEach((changeset) => {
    changes[changeset.type].push(changeset.message);
  });

  // Определяем версию
  let newVersion: string;

  if (useCurrentVersion) {
    newVersion = getCurrentVersion();
  } else {
    // Определяем тип версии на основе изменений
    let versionType: "patch" | "minor" | "major" = "patch";
    if (changes.major.length > 0) {
      versionType = "major";
    } else if (changes.minor.length > 0) {
      versionType = "minor";
    }

    const currentVersion = getCurrentVersion();
    newVersion = generateVersion(currentVersion, versionType);
  }

  // Создаем запись для changelog
  const changelogEntry: ChangelogEntry = {
    version: newVersion,
    date: formatDate(new Date()),
    changes,
  };

  // Форматируем changelog
  const changelogContent = formatChangelogEntry(changelogEntry);

  // Читаем существующий changelog
  const existingChangelog = readExistingChangelog();

  // Создаем новый changelog
  let newChangelogContent: string;

  if (existingChangelog) {
    // Добавляем новую версию в начало существующего changelog
    const lines = existingChangelog.split("\n");
    const titleIndex = lines.findIndex((line) => line.startsWith("# "));

    if (titleIndex !== -1) {
      lines.splice(titleIndex + 1, 0, "", changelogContent);
    } else {
      lines.unshift(changelogContent);
    }

    newChangelogContent = lines.join("\n");
  } else {
    // Создаем новый changelog
    newChangelogContent = `${changelogContent}`;
  }

  // Выводим информацию
  console.log(chalk.green("📋 Generated changelog entry:"));
  console.log(chalk.gray(`📦 Version: ${newVersion}`));
  console.log(chalk.gray(`📅 Date: ${changelogEntry.date}`));
  console.log(chalk.gray(`🚨 Breaking Changes: ${changes.major.length}`));
  console.log(chalk.gray(`✨ Features: ${changes.minor.length}`));
  console.log(chalk.gray(`🐛 Bug Fixes: ${changes.patch.length}`));

  console.log(chalk.blue("\n📝 Changes:"));
  changes.major.forEach((change) => {
    console.log(chalk.red(`  🚨 ${change}`));
  });
  changes.minor.forEach((change) => {
    console.log(chalk.green(`  ✨ ${change}`));
  });
  changes.patch.forEach((change) => {
    console.log(chalk.blue(`  🐛 ${change}`));
  });

  if (dryRun) {
    console.log(chalk.yellow("\n🔍 Dry run mode - changelog preview:"));
    console.log(chalk.gray("─".repeat(50)));

    if (showFull) {
      console.log(chalk.gray(newChangelogContent));
    } else {
      console.log(chalk.gray(changelogContent));
    }

    console.log(chalk.gray("─".repeat(50)));

    if (saveMode) {
      // В save режиме добавляем файлы в save.json
      const processedFiles = readSaveFile();
      const newProcessedFiles = [...processedFiles, ...changesetFiles];
      writeSaveFile(newProcessedFiles);

      changesetFiles.forEach((filename) => {
        console.log(
          chalk.gray(`💾 Marked as processed: .changeset/${filename}`)
        );
      });

      console.log(
        chalk.green(
          "💾 Save mode: Files will be marked as processed in save.json"
        )
      );
    } else {
      console.log(
        chalk.yellow(
          "💡 Files were not deleted. Run without --dry-run to apply changes."
        )
      );
    }
  } else {
    // Записываем changelog
    writeChangelog(newChangelogContent);

    // В обычном режиме удаляем файлы и очищаем save.json
    changesetFiles.forEach((filename) => {
      deleteChangesetFile(filename);
      console.log(chalk.gray(`🗑️  Deleted: .changeset/${filename}`));
    });

    // Очищаем save.json при обычном apply
    clearSaveFile();

    console.log(chalk.green("\n✅ Changelog updated successfully!"));
    console.log(chalk.gray(`📄 File: CHANGELOG.md`));
    console.log(chalk.gray(`📦 New version: ${newVersion}`));
  }
}
