import * as path from 'path';
import { execSync } from 'child_process';
import { sha256 } from './crypto.js';
import { pathExists, readJsonFile } from '../utils/fs.js';

export interface FingerprintResult {
  fingerprint: string;
  source: 'git' | 'package' | 'folder';
  value: string;
}

/**
 * Generate fingerprint for a project directory
 * Priority: git remote URL > package.json name > folder name
 */
export async function generateFingerprint(projectPath: string): Promise<FingerprintResult> {
  // Try git remote URL first
  const gitFingerprint = await getGitRemoteFingerprint(projectPath);
  if (gitFingerprint) {
    return gitFingerprint;
  }

  // Try package.json name
  const packageFingerprint = await getPackageJsonFingerprint(projectPath);
  if (packageFingerprint) {
    return packageFingerprint;
  }

  // Fall back to folder name
  const folderName = path.basename(projectPath);
  return {
    fingerprint: sha256(folderName),
    source: 'folder',
    value: folderName,
  };
}

/**
 * Get fingerprint from git remote URL
 */
async function getGitRemoteFingerprint(projectPath: string): Promise<FingerprintResult | null> {
  const gitDir = path.join(projectPath, '.git');
  if (!(await pathExists(gitDir))) {
    return null;
  }

  try {
    const remoteUrl = execSync('git remote get-url origin', {
      cwd: projectPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (remoteUrl) {
      return {
        fingerprint: sha256(remoteUrl),
        source: 'git',
        value: remoteUrl,
      };
    }
  } catch {
    // No git remote or git not available
  }

  return null;
}

/**
 * Get fingerprint from package.json name
 */
async function getPackageJsonFingerprint(projectPath: string): Promise<FingerprintResult | null> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!(await pathExists(packageJsonPath))) {
    return null;
  }

  try {
    const packageJson = await readJsonFile<{ name?: string }>(packageJsonPath);
    if (packageJson.name) {
      return {
        fingerprint: sha256(packageJson.name),
        source: 'package',
        value: packageJson.name,
      };
    }
  } catch {
    // Invalid package.json
  }

  return null;
}

/**
 * Get project name for display
 */
export async function getProjectName(projectPath: string): Promise<string> {
  // Try package.json name first for display
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (await pathExists(packageJsonPath)) {
    try {
      const packageJson = await readJsonFile<{ name?: string }>(packageJsonPath);
      if (packageJson.name) {
        return packageJson.name;
      }
    } catch {
      // Ignore
    }
  }

  // Fall back to folder name
  return path.basename(projectPath);
}

/**
 * Get git remote URL if available
 */
export async function getGitRemoteUrl(projectPath: string): Promise<string | null> {
  const gitDir = path.join(projectPath, '.git');
  if (!(await pathExists(gitDir))) {
    return null;
  }

  try {
    return execSync('git remote get-url origin', {
      cwd: projectPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}
