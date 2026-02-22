import inquirer from 'inquirer';
import chalk from 'chalk';

export async function confirmPhrase(): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Have you saved your recovery phrase?',
      default: false,
    },
  ]);
  return confirmed;
}

export async function hasExistingPhrase(): Promise<boolean> {
  const { hasPhrase } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasPhrase',
      message: 'Do you already have a recovery phrase?',
      default: false,
    },
  ]);
  return hasPhrase;
}

export async function inputRecoveryPhrase(): Promise<string> {
  const { phrase } = await inquirer.prompt([
    {
      type: 'input',
      name: 'phrase',
      message: 'Enter your 12-word recovery phrase:',
      validate: (input: string) => {
        const words = input.trim().split(/\s+/);
        if (words.length !== 12) {
          return 'Recovery phrase must be exactly 12 words';
        }
        return true;
      },
    },
  ]);
  return phrase.trim();
}

export async function confirmOverwrite(): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.yellow('Config already exists. Do you want to overwrite it?'),
      default: false,
    },
  ]);
  return confirmed;
}

export async function pressEnterToContinue(): Promise<void> {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press Enter to continue...',
    },
  ]);
}
