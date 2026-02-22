import * as os from 'os';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { pathExists, readJsonFile, writeJsonFile } from '../utils/fs.js';

const CONFIG_DIR = path.join(os.homedir(), '.envii');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const PROD_API_URL = 'https://api.envii.dev';
const DEV_API_URL = 'http://localhost:3006';

export interface EnviiConfig {
  vaultId: string;
  deviceId: string;
  apiUrl: string;
  salt: string;
}

/**
 * Check if config exists
 */
export async function configExists(): Promise<boolean> {
  return pathExists(CONFIG_FILE);
}

/**
 * Load config from disk
 */
export async function loadConfig(): Promise<EnviiConfig | null> {
  if (!(await configExists())) {
    return null;
  }
  try {
    return await readJsonFile<EnviiConfig>(CONFIG_FILE);
  } catch {
    return null;
  }
}

/**
 * Save config to disk
 */
export async function saveConfig(config: EnviiConfig): Promise<void> {
  await writeJsonFile(CONFIG_FILE, config);
}

/**
 * Create new config
 */
export function createConfig(vaultId: string, salt: string, dev: boolean): EnviiConfig {
  return {
    vaultId,
    deviceId: uuidv4(),
    apiUrl: dev ? DEV_API_URL : PROD_API_URL,
    salt,
  };
}

/**
 * Get API URL (respects --dev flag override)
 */
export function getApiUrl(config: EnviiConfig, dev?: boolean): string {
  if (dev) {
    return DEV_API_URL;
  }
  return config.apiUrl;
}

/**
 * Get config directory path
 */
export function getConfigDir(): string {
  return CONFIG_DIR;
}

/**
 * Get config file path
 */
export function getConfigPath(): string {
  return CONFIG_FILE;
}
