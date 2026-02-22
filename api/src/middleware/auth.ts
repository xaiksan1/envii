import { Context, Next } from 'hono';

/**
 * Extract vault ID from Authorization header
 * Format: Bearer <vault_id>
 */
export function extractVaultId(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  const vaultId = parts[1];

  // Validate vault ID format (should be a hex string from SHA-256)
  if (!/^[a-f0-9]{64}$/i.test(vaultId)) {
    return null;
  }

  return vaultId;
}

/**
 * Authentication middleware
 * Extracts vault ID from Authorization header and adds it to context
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  const vaultId = extractVaultId(authHeader);

  if (!vaultId) {
    return c.json(
      {
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected: Bearer <vault_id>',
      },
      401
    );
  }

  // Add vault ID to context
  c.set('vaultId', vaultId);

  await next();
}

// Type augmentation for Hono context
declare module 'hono' {
  interface ContextVariableMap {
    vaultId: string;
  }
}
