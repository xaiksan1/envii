import chalk from 'chalk';
import {
  configExists,
  loadConfig,
  saveConfig,
  createConfig,
} from '../core/config.js';
import {
  generateRecoveryPhrase,
  validateRecoveryPhrase,
  generateVaultId,
  generateSalt,
} from '../core/crypto.js';
import { logger } from '../utils/logger.js';
import {
  confirmPhrase,
  hasExistingPhrase,
  inputRecoveryPhrase,
  confirmOverwrite,
} from '../utils/prompts.js';

interface InitOptions {
  dev?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  logger.log(chalk.bold.cyan('\nWelcome to Envii! 🔐\n'));

  // Check if config already exists
  if (await configExists()) {
    const existingConfig = await loadConfig();
    if (existingConfig) {
      logger.warn('Envii is already initialized.');
      logger.dim(`Vault ID: ${existingConfig.vaultId.substring(0, 16)}...`);
      logger.newline();

      const overwrite = await confirmOverwrite();
      if (!overwrite) {
        logger.info('Initialization cancelled.');
        return;
      }
    }
  }

  let phrase: string;
  let isNewPhrase = false;

  // Ask if user has existing phrase
  const hasPhrase = await hasExistingPhrase();

  if (hasPhrase) {
    // User has existing phrase
    phrase = await inputRecoveryPhrase();

    // Validate phrase format
    if (!validateRecoveryPhrase(phrase)) {
      logger.error('Invalid recovery phrase. Please check your phrase and try again.');
      logger.dim('The phrase must be exactly 12 valid BIP-39 words.');
      process.exit(1);
    }
  } else {
    // Generate new phrase
    logger.info('Generating your recovery phrase...\n');
    phrase = generateRecoveryPhrase();
    isNewPhrase = true;

    // Display phrase prominently
    logger.box(
      [
        chalk.bold.yellow('  ⚠️  SAVE THIS PHRASE SECURELY ⚠️'),
        '',
        chalk.white.bold(`  ${phrase}`),
        '',
        chalk.dim('  This phrase is the ONLY way to restore your backups.'),
        chalk.dim('  If you lose it, your data is GONE FOREVER.'),
        '',
        chalk.dim('  Write it down. Store it safely. Never share it.'),
      ],
      'warning'
    );

    logger.newline();

    // Confirm user has saved phrase
    const confirmed = await confirmPhrase();
    if (!confirmed) {
      logger.error('You must save your recovery phrase before continuing.');
      logger.info('Run `envii init` again when you\'re ready.');
      process.exit(1);
    }
  }

  // Generate vault ID and salt
  const vaultId = generateVaultId(phrase);
  const salt = generateSalt();

  // Create and save config
  const config = createConfig(vaultId, salt, options.dev ?? false);
  await saveConfig(config);

  // Success message
  logger.newline();
  logger.success('Envii initialized successfully!');
  logger.newline();
  logger.dim(`Vault ID: ${vaultId.substring(0, 16)}...`);
  logger.dim(`Device ID: ${config.deviceId}`);
  logger.dim(`API URL: ${config.apiUrl}`);

  if (options.dev) {
    logger.newline();
    logger.info(chalk.yellow('Development mode enabled - using local API'));
  }

  if (isNewPhrase) {
    logger.newline();
    logger.warn('Remember: Your recovery phrase is NOT stored anywhere.');
    logger.warn('You\'ll need it to restore backups on other devices.');
  }

  logger.newline();
  logger.info('Next steps:');
  logger.log(chalk.dim('  1. Navigate to your projects folder'));
  logger.log(chalk.dim('  2. Run `envii backup` to backup your .env files'));
  logger.newline();
}
