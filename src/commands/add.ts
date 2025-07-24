import inquirer from 'inquirer';
import chalk from 'chalk';
import { 
  generateChangesetId, 
  writeChangesetFile, 
  formatDate 
} from '../utils.js';
import { ChangesetFile } from '../types.js';

export async function addCommand(type?: 'patch' | 'minor' | 'major'): Promise<void> {
  console.log(chalk.blue('📝 Creating new changeset...\n'));

  let selectedType: 'patch' | 'minor' | 'major';
  let message: string;

  // Если тип не указан, предлагаем выбрать интерактивно
  if (!type) {
    const typeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of change:',
        choices: [
          { name: '🐛 Patch (bug fixes)', value: 'patch' },
          { name: '✨ Minor (new features)', value: 'minor' },
          { name: '🚨 Major (breaking changes)', value: 'major' }
        ]
      }
    ]);
    selectedType = typeAnswer.type;
  } else {
    selectedType = type;
  }

  // Запрашиваем сообщение об изменении
  const messageAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Describe the change:',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Message cannot be empty';
        }
        return true;
      }
    }
  ]);
  message = messageAnswer.message;

  // Запрашиваем дополнительное описание (опционально)
  const descriptionAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Additional description (optional):',
      default: ''
    }
  ]);
  const description = descriptionAnswer.description.trim() || undefined;

  // Создаем changeset файл
  const id = generateChangesetId();
  const changesetData: ChangesetFile = {
    id,
    type: selectedType,
    message: message.trim(),
    timestamp: formatDate(new Date()),
    author: process.env.USER || process.env.USERNAME || 'Unknown',
    description
  };

  writeChangesetFile(id, changesetData);

  console.log(chalk.green('✅ Changeset created successfully!'));
  console.log(chalk.gray(`📁 File: .changeset/${id}.md`));
  console.log(chalk.gray(`📝 Type: ${selectedType}`));
  console.log(chalk.gray(`💬 Message: ${message}`));
  if (description) {
    console.log(chalk.gray(`📄 Description: ${description}`));
  }
  console.log(chalk.gray(`⏰ Timestamp: ${changesetData.timestamp}`));
  console.log(chalk.gray(`👤 Author: ${changesetData.author}`));
  console.log(chalk.yellow('\n💡 Run "changeset apply" to generate changelog'));
} 