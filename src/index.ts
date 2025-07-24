#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add.js';
import { applyCommand } from './commands/apply.js';

const program = new Command();

program
  .name('changeset')
  .description('CLI tool for managing changeset files and generating changelogs')
  .version('1.0.0');

program
  .command('add')
  .description('Create a new changeset file')
  .option('-p, --patch', 'Create a patch changeset (bug fixes)')
  .option('-m, --minor', 'Create a minor changeset (new features)')
  .option('-M, --major', 'Create a major changeset (breaking changes)')
  .action(async (options) => {
    try {
      let type: 'patch' | 'minor' | 'major' | undefined;
      
      if (options.patch) type = 'patch';
      else if (options.minor) type = 'minor';
      else if (options.major) type = 'major';
      
      await addCommand(type);
    } catch (error) {
      console.error(chalk.red('❌ Error creating changeset:'), error);
      process.exit(1);
    }
  });

program
  .command('apply')
  .description('Apply changesets and generate changelog')
  .option('--dry-run', 'Preview changes without applying them')
  .option('--use-current-version', 'Use current version from package.json instead of calculating new version')
  .action(async (options) => {
    try {
      await applyCommand(options.dryRun, options.useCurrentVersion);
    } catch (error) {
      console.error(chalk.red('❌ Error applying changesets:'), error);
      process.exit(1);
    }
  });

// Обработка ошибок
program.exitOverride();

try {
  program.parse();
} catch (error: any) {
  if (error.code === 'commander.help' || error.code === 'commander.helpDisplayed' || error.code === 'commander.version') {
    process.exit(0);
  }
  console.error(chalk.red('❌ Unexpected error:'), error);
  process.exit(1);
} 