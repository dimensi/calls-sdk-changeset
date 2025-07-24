import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import yaml from 'js-yaml';
import { ChangesetFile, ChangelogEntry, ChangesetYaml } from './types.js';

export const CHANGESET_DIR = '.changeset';

export function ensureChangesetDir(): void {
  if (!fs.existsSync(CHANGESET_DIR)) {
    fs.mkdirSync(CHANGESET_DIR, { recursive: true });
  }
}

export function generateChangesetId(): string {
  return uuidv4().replace(/-/g, '');
}

export function getChangesetFiles(): string[] {
  ensureChangesetDir();
  const files = fs.readdirSync(CHANGESET_DIR);
  return files.filter(file => file.endsWith('.md'));
}

export function readChangesetFile(filename: string): ChangesetFile {
  const filePath = path.join(CHANGESET_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Разделяем YAML заголовок и содержимое
  const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!yamlMatch) {
    throw new Error(`Invalid changeset file format: ${filename}`);
  }
  
  const [, yamlContent, markdownContent] = yamlMatch;
  const yamlData = yaml.load(yamlContent) as ChangesetYaml;
  
  // Извлекаем ID из имени файла
  const id = filename.replace('.md', '');
  
  return {
    id,
    type: yamlData.type,
    message: yamlData.message,
    timestamp: yamlData.timestamp,
    author: yamlData.author
  };
}

export function writeChangesetFile(id: string, data: ChangesetFile): void {
  ensureChangesetDir();
  const filePath = path.join(CHANGESET_DIR, `${id}.md`);
  
  // Создаем YAML заголовок
  const yamlData: ChangesetYaml = {
    type: data.type,
    message: data.message,
    timestamp: data.timestamp,
    author: data.author
  };
  
  const yamlContent = yaml.dump(yamlData, { 
    indent: 2,
    lineWidth: -1,
    noRefs: true
  });
  
  // Создаем Markdown файл с YAML заголовком
  const markdownContent = `---
${yamlContent}---

${data.message}
`;
  
  fs.writeFileSync(filePath, markdownContent, 'utf-8');
}

export function deleteChangesetFile(filename: string): void {
  const filePath = path.join(CHANGESET_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateVersion(currentVersion: string, type: 'patch' | 'minor' | 'major'): string {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

export function getCurrentVersion(): string {
  try {
    const packageJson = fs.readJsonSync('package.json');
    return packageJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

export function readExistingChangelog(): string {
  const changelogPath = 'CHANGELOG.md';
  if (fs.existsSync(changelogPath)) {
    return fs.readFileSync(changelogPath, 'utf-8');
  }
  return '';
}

export function writeChangelog(content: string): void {
  fs.writeFileSync('CHANGELOG.md', content, 'utf-8');
}

export function formatChangelogEntry(entry: ChangelogEntry): string {
  const { version, date, changes } = entry;
  
  let content = `## [${version}] - ${date}\n\n`;
  
  if (changes.major.length > 0) {
    content += '### 🚨 Breaking Changes\n';
    changes.major.forEach(change => {
      content += `- ${change}\n`;
    });
    content += '\n';
  }
  
  if (changes.minor.length > 0) {
    content += '### ✨ Features\n';
    changes.minor.forEach(change => {
      content += `- ${change}\n`;
    });
    content += '\n';
  }
  
  if (changes.patch.length > 0) {
    content += '### 🐛 Bug Fixes\n';
    changes.patch.forEach(change => {
      content += `- ${change}\n`;
    });
    content += '\n';
  }
  
  return content;
} 