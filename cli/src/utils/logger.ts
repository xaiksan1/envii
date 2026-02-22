import chalk from 'chalk';
import ora, { Ora } from 'ora';

export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  warn: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  log: (message: string) => {
    console.log(message);
  },

  newline: () => {
    console.log();
  },

  box: (content: string[], style: 'warning' | 'info' | 'success' = 'info') => {
    const colors = {
      warning: chalk.yellow,
      info: chalk.blue,
      success: chalk.green,
    };
    const color = colors[style];
    const border = '━'.repeat(50);
    
    console.log(color(border));
    content.forEach((line) => console.log(line));
    console.log(color(border));
  },

  header: (title: string) => {
    console.log();
    console.log(chalk.bold.cyan(title));
    console.log();
  },

  dim: (message: string) => {
    console.log(chalk.dim(message));
  },

  spinner: (message: string): Ora => {
    return ora({
      text: message,
      color: 'cyan',
    }).start();
  },

  projectItem: (name: string, envCount: number, git?: string | null) => {
    const envText = envCount === 1 ? '1 env file' : `${envCount} env files`;
    console.log(chalk.green('✓'), chalk.bold(name), chalk.dim(`(${envText})`));
  },

  projectBox: (name: string, details: { fingerprint?: string; git?: string; package?: string; folder?: string; files: string[] }) => {
    console.log(chalk.cyan('📦'), chalk.bold(name));
    if (details.fingerprint) {
      console.log(chalk.dim(`   Fingerprint: ${details.fingerprint.substring(0, 8)}...`));
    }
    if (details.git) {
      console.log(chalk.dim(`   Git: ${details.git}`));
    }
    if (details.package) {
      console.log(chalk.dim(`   Package: ${details.package}`));
    }
    if (details.folder) {
      console.log(chalk.dim(`   Folder: ${details.folder}`));
    }
    const filesStr = details.files.length > 0 ? details.files.join(', ') : '(none)';
    console.log(chalk.dim(`   Files: ${filesStr}`));
  },

  restoreItem: (path: string, status: 'restored' | 'skipped' | 'failed') => {
    const icons = {
      restored: chalk.green('✓'),
      skipped: chalk.yellow('○'),
      failed: chalk.red('✗'),
    };
    const labels = {
      restored: chalk.green('restored'),
      skipped: chalk.yellow('skipped - already exists'),
      failed: chalk.red('failed'),
    };
    console.log(icons[status], path, chalk.dim(`(${labels[status]})`));
  },
};
