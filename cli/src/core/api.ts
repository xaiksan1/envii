import { EnviiConfig, getApiUrl } from './config.js';

interface BackupResponse {
  id: string;
  vaultId: string;
  createdAt: string;
}

interface LatestBackupResponse {
  id: string;
  blob: string;
  createdAt: string;
  deviceId: string;
}

interface BackupListItem {
  id: string;
  createdAt: string;
  sizeBytes: number;
  deviceId: string;
}

interface BackupListResponse {
  backups: BackupListItem[];
  total: number;
}

interface HealthResponse {
  status: string;
  version: string;
}

interface ApiError {
  error: string;
}

class ApiClient {
  private baseUrl: string;
  private vaultId: string;

  constructor(config: EnviiConfig, dev?: boolean) {
    this.baseUrl = getApiUrl(config, dev);
    this.vaultId = config.vaultId;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.vaultId}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Upload a backup
   */
  async uploadBackup(blob: string, deviceId: string): Promise<BackupResponse> {
    const response = await fetch(`${this.baseUrl}/backup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ blob, deviceId }),
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.error || `Upload failed: ${response.status}`);
    }

    return response.json() as Promise<BackupResponse>;
  }

  /**
   * Get the latest backup
   */
  async getLatestBackup(): Promise<LatestBackupResponse | null> {
    const response = await fetch(`${this.baseUrl}/backup/latest`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.error || `Failed to fetch backup: ${response.status}`);
    }

    return response.json() as Promise<LatestBackupResponse>;
  }

  /**
   * List all backups
   */
  async listBackups(limit = 10, offset = 0): Promise<BackupListResponse> {
    const response = await fetch(
      `${this.baseUrl}/backups?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.error || `Failed to list backups: ${response.status}`);
    }

    return response.json() as Promise<BackupListResponse>;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json() as Promise<HealthResponse>;
  }
}

export function createApiClient(config: EnviiConfig, dev?: boolean): ApiClient {
  return new ApiClient(config, dev);
}

export type { ApiClient, BackupResponse, LatestBackupResponse, BackupListItem, BackupListResponse };
