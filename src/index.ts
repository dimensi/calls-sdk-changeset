#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { addCommand } from "./commands/add.js";
import { applyCommand } from "./commands/apply.js";
import { getVersion } from "./utils.js";

const program = new Command();

// Получаем версию из package.json
const version = await getVersion();

program
  .name("changeset")
  .description(
    "CLI tool for managing changeset files and generating changelogs"
  )
  .version(version);

program
  .command("add")
  .description("Create a new changeset file")
  .option("-p, --patch", "Create a patch changeset (bug fixes)")
  .option("-m, --minor", "Create a minor changeset (new features)")
  .option("-M, --major", "Create a major changeset (breaking changes)")
  .action(async (options) => {
    try {
      let type: "patch" | "minor" | "major" | undefined;

      if (options.patch) type = "patch";
      else if (options.minor) type = "minor";
      else if (options.major) type = "major";

      await addCommand(type);
    } catch (error) {
      console.error(chalk.red("❌ Error creating changeset:"), error);
      process.exit(1);
    }
  });

program
  .command("apply")
  .description("Apply changesets and generate changelog")
  .option("--dry-run", "Preview changes without applying them")
  .option(
    "--use-current-version",
    "Use current version from package.json instead of calculating new version"
  )
  .option("--full", "Show full changelog content in dry-run mode")
  .option("--save", "Save processed files to save.json (works only with --dry-run)")
  .option("--from-date <date>", "Apply changesets from a specific date (YYYY-MM-DD)")
  .action(async (options) => {
          try {
        // Проверяем, что --save используется только с --dry-run
        if (options.save && !options.dryRun) {
          console.error(chalk.red("❌ Error: --save option can only be used with --dry-run"));
          process.exit(1);
        }

        if (options.fromDate) {
          const parsedFromDate = new Date(options.fromDate);
          if (isNaN(parsedFromDate.getTime())) {
            console.error(chalk.red("❌ Error: Invalid date format"));
            process.exit(1);
          }
          options.fromDate = parsedFromDate;
        }
        
        await applyCommand(
          options.dryRun,
          options.useCurrentVersion,
          options.full,
          options.save,
          options.fromDate
        );
      } catch (error) {
        console.error(chalk.red("❌ Error applying changesets:"), error);
        process.exit(1);
      }
  });

// Обработка ошибок
program.exitOverride();

try {
  program.parse();
} catch (error: any) {
  if (
    error.code === "commander.help" ||
    error.code === "commander.helpDisplayed" ||
    error.code === "commander.version"
  ) {
    process.exit(0);
  }
  console.error(chalk.red("❌ Unexpected error:"), error);
  process.exit(1);
}
