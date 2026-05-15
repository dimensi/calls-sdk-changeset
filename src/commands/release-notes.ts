import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { readExistingChangelog } from "../utils.js";

function normalizeVersion(version: string): string {
  return version.trim().replace(/^v/, "");
}

function extractReleaseNotes(changelog: string, version: string): string {
  const normalizedVersion = normalizeVersion(version);
  const heading = `**v${normalizedVersion}**`;
  const lines = changelog.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === heading);

  if (startIndex === -1) {
    throw new Error(`Could not find changelog entry for v${normalizedVersion}`);
  }

  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    if (/^\*\*v\d+\.\d+\.\d+/.test(lines[index].trim())) {
      endIndex = index;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join("\n").trim() + "\n";
}

export async function releaseNotesCommand(
  version: string,
  output: string
): Promise<void> {
  if (!version) {
    throw new Error("Version is required. Use --version <version>.");
  }

  if (!output) {
    throw new Error("Output file is required. Use --output <file>.");
  }

  const changelog = readExistingChangelog();
  if (!changelog) {
    throw new Error("CHANGELOG.md is empty or does not exist");
  }

  const notes = extractReleaseNotes(changelog, version);
  fs.ensureDirSync(path.dirname(output));
  fs.writeFileSync(output, notes, "utf-8");

  console.log(chalk.green("✅ Release notes generated successfully!"));
  console.log(chalk.gray(`📦 Version: v${normalizeVersion(version)}`));
  console.log(chalk.gray(`📄 File: ${output}`));
}
