import inquirer from "inquirer";
import chalk from "chalk";
import {
  generateChangesetId,
  writeChangesetFile,
  formatDate,
} from "../utils.js";
import { AddCommandOptions, ChangesetFile } from "../types.js";

async function readMessageFromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    process.stdin.on("error", reject);
  });
}

export async function addCommand(options: AddCommandOptions = {}): Promise<void> {
  console.log(chalk.blue("📝 Creating new changeset...\n"));

  let selectedType: "patch" | "minor" | "major";
  let message: string | undefined = options.message;
  const isNonInteractive = Boolean(options.stdin || !process.stdin.isTTY);

  // Если тип не указан, предлагаем выбрать интерактивно
  if (!options.type) {
    if (isNonInteractive) {
      throw new Error(
        "Non-interactive mode requires explicit change type. Use --patch, --minor, --major or --type."
      );
    }

    const typeAnswer = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Select the type of change:",
        choices: [
          { name: "🐛 Patch (bug fixes)", value: "patch" },
          { name: "✨ Minor (new features)", value: "minor" },
          { name: "🚨 Major (breaking changes)", value: "major" },
        ],
      },
    ]);
    selectedType = typeAnswer.type;
  } else {
    selectedType = options.type;
  }

  if (!message && isNonInteractive) {
    message = (await readMessageFromStdin()).trim();
  }

  // Запрашиваем сообщение об изменении в интерактивном режиме
  if (!message) {
    const messageAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "message",
        message: "Describe the change:",
        validate: (input: string) => {
          if (input.trim().length === 0) {
            return "Message cannot be empty";
          }
          return true;
        },
      },
    ]);
    message = messageAnswer.message;
  }

  if (!message || message.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  // Создаем changeset файл
  const id = generateChangesetId();
  const changesetData: ChangesetFile = {
    id,
    type: selectedType,
    message: message.trim(),
    timestamp: formatDate(new Date()),
    author: process.env.USER || process.env.USERNAME || "Unknown",
  };

  writeChangesetFile(id, changesetData);

  console.log(chalk.green("✅ Changeset created successfully!"));
  console.log(chalk.gray(`📁 File: .changeset/${id}.md`));
  console.log(chalk.gray(`📝 Type: ${selectedType}`));
  console.log(chalk.gray(`💬 Message: ${message}`));
  console.log(chalk.gray(`⏰ Timestamp: ${changesetData.timestamp}`));
  console.log(chalk.gray(`👤 Author: ${changesetData.author}`));
  console.log(chalk.yellow('\n💡 Run "changeset apply" to generate changelog'));
}
