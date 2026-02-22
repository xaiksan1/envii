# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Envii** is a secure backup and restore system for `.env` files across machines using BIP-39 recovery phrase authentication and AES-256-GCM encryption. The system consists of three main components:

1. **CLI** (`cli/`) - Command-line tool for scanning projects, backing up `.env` files, and restoring them
2. **API** (`api/`) - Backend server for storing encrypted backups with PostgreSQL database
3. **Web** (`web/`) - Frontend landing page and documentation site

**Core Architecture**:
```
User Machine → CLI (encrypts locally) → API Server (stores encrypted blob)
                 ↓
           Uses BIP-39 phrase
           to derive vault ID & key
                 ↓
           Never transmits phrase
           or plaintext to server
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (for API) - create a database and set `DATABASE_URL` environment variable
- npm or yarn

### Development Setup

**1. Install all dependencies:**
```bash
cd /home/ichigo/alexandria/ADAM/envii

# CLI
cd cli && npm install && cd ..

# API
cd api && npm install && cd ..

# Web
cd web && npm install && cd ..
```

**2. Start services (in separate terminals):**

```bash
# Terminal 1: API Server
cd api
npm run dev
# Runs on http://localhost:4400

# Terminal 2: Web Dev Server
cd web
npm run dev
# Runs on http://localhost:8084

# Terminal 3: CLI (watch mode for development)
cd cli
npm run dev
```

**3. Initialize and test:**
```bash
cd cli
npm run build
npm link  # Makes envii command available globally

# Test with local API
envii init --dev
envii backup --dev
```

## Project Structure

```
envii/
├── cli/                           # Command-line interface
│   ├── src/
│   │   ├── index.ts              # Entry point, command definitions
│   │   ├── commands/             # Command implementations
│   │   │   ├── init.ts           # Initialize with recovery phrase
│   │   │   ├── backup.ts         # Scan and backup .env files
│   │   │   ├── restore.ts        # Restore from backup
│   │   │   └── list.ts           # List backed up projects
│   │   ├── core/                 # Core functionality
│   │   │   ├── crypto.ts         # AES-256-GCM encryption/PBKDF2 key derivation
│   │   │   ├── config.ts         # Config file management (~/.envii/config.json)
│   │   │   ├── scanner.ts        # Project detection and env file scanning
│   │   │   ├── fingerprint.ts    # Project identification (git/package/folder)
│   │   │   ├── api.ts            # API client for backup/restore
│   │   │   └── ghost.ts          # Ghost Protocol (steganography, optional)
│   │   └── utils/
│   │       ├── fs.ts             # File system utilities
│   │       ├── logger.ts         # CLI output formatting
│   │       └── prompts.ts        # Interactive prompts
│   ├── tests/                    # Vitest tests
│   ├── package.json
│   └── tsconfig.json
│
├── api/                           # Backend API server
│   ├── src/
│   │   ├── index.ts              # Hono app setup
│   │   ├── db/
│   │   │   ├── client.ts         # PostgreSQL connection pool
│   │   │   ├── schema.ts         # Database schema and operations
│   │   │   └── init.ts           # Database initialization script
│   │   ├── routes/               # API endpoints
│   │   │   ├── health.ts         # GET /health
│   │   │   ├── backup.ts         # POST/GET /backup routes
│   │   │   └── admin.ts          # Admin analytics endpoints
│   │   └── middleware/
│   │       └── auth.ts           # Bearer token (vault ID) authentication
│   ├── package.json
│   └── tsconfig.json
│
├── web/                           # Frontend landing page
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   ├── components/           # React components
│   │   └── assets/               # Images and static files
│   ├── public/                   # Static files
│   ├── vite.config.ts            # Vite configuration (port 8084)
│   ├── package.json
│   └── tsconfig files
│
├── README.md                      # User-facing documentation
└── CLAUDE.md                      # This file
```

## Key Concepts & Architecture

### Encryption & Security

**BIP-39 Recovery Phrase** (`crypto.ts`):
- 12-word mnemonic (128 bits entropy)
- Never stored locally or sent to server
- Derived to create vault ID (SHA-256 hash) and encryption key (PBKDF2 600k iterations)
- User is responsible for securely storing the phrase

**Encryption Pipeline**:
```
plaintext → gzip → AES-256-GCM (IV + ciphertext + auth tag) → prepend salt → base64
```

Key constants:
- Algorithm: AES-256-GCM
- Key derivation: PBKDF2-SHA256, 600,000 iterations
- IV length: 12 bytes (96 bits for GCM)
- Auth tag: 16 bytes (128 bits for integrity)
- Salt: 32 bytes (stored with encrypted data)

### Project Detection & Fingerprinting

**Scanner** (`scanner.ts`):
- Recursively scans directories for project markers: `.git`, `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`
- Finds all `.env` and `.env.*` files in each project
- Skips common build/dependency directories: `node_modules`, `dist`, `vendor`, `__pycache__`, etc.
- Returns `Project[]` with metadata: id, name, path, fingerprint, env files

**Fingerprinting** (`fingerprint.ts`):
- Priority order: Git remote URL > package.json name > folder name
- Each fingerprint source is SHA-256 hashed
- Used to match projects across machines (highest priority: git remote URL)
- Fallback matching via name-to-path map for cases where fingerprint doesn't exist

### Database Schema

**Tables**:
- `vaults` - User vaults (id, created_at, last_backup_at)
- `backups` - Encrypted backup blobs (id, vault_id, blob as BYTEA, size_bytes, created_at, device_id)
- `events` - Analytics and audit log (event_type, vault_id, backup_id, metadata, ip_address, user_agent, created_at)

**Indexes**: Created on vault_id, created_at, event_type for performance

### API Authentication

Simple bearer token auth (`auth.ts`):
- `Authorization: Bearer <vault_id>` header required
- Vault ID is public (derived from recovery phrase)
- Server never sees recovery phrase or encryption key
- All data encrypted client-side before transmission

### CLI Commands

**`envii init [--dev]`**:
- Prompts for recovery phrase (new or existing)
- Creates `~/.envii/config.json` with vault ID, device ID, API URL, salt
- Generates random device ID for backup device tracking

**`envii backup [--dev] [--ghost]`**:
- Scans current directory tree for projects
- Prompts user to select which projects to backup
- Encrypts project data (name, path, env files) with derived key
- Sends to API server
- Optional `--ghost` flag applies steganography (Ghost Protocol)

**`envii restore [--dev] [--force]`**:
- Fetches latest backup from API
- Decrypts using derived key
- Matches projects using fingerprints (with fallback to name-based matching)
- Restores `.env` files to detected projects
- `--force` overwrites existing `.env` files

**`envii list [--dev]`**:
- Fetches backup metadata (not the blob)
- Lists projects and their .env files in latest backup

## Commands

### CLI Development
```bash
cd cli

# Build TypeScript
npm run build

# Watch mode during development
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Install globally for testing
npm link
```

### API Development
```bash
cd api

# Development server with tsx (auto-reload)
npm run dev

# Build TypeScript
npm run build

# Lint
npm run lint

# Tests
npm test

# Initialize database schema
npm run db:init
```

### Web Development
```bash
cd web

# Dev server on port 8084
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

### Integration Testing
```bash
# Terminal 1: Start API
cd api && npm run dev

# Terminal 2: Test CLI
cd cli
npm run build
npm link

# Terminal 3: Test commands
envii init --dev
envii backup --dev
envii list --dev
envii restore --dev --force
```

## Architecture Deep Dive

### Backup Flow

1. **Scanner** (`scanner.ts` → `scanDirectory()`)
   - Recursively walks directory tree
   - Identifies projects via marker files
   - Finds all `.env*` files
   - Generates fingerprints for each project

2. **Config** (`config.ts` → `loadConfig()`)
   - Loads `~/.envii/config.json`
   - Retrieves vault ID and salt

3. **Encryption** (`crypto.ts` → `encryptBackup()`)
   - Compresses project data with gzip
   - Derives encryption key from recovery phrase + salt using PBKDF2
   - Encrypts with AES-256-GCM
   - Returns base64-encoded blob (salt + IV + ciphertext + auth tag)

4. **API Call** (`api.ts` → `uploadBackup()`)
   - Sends to `POST /backup` with vault ID as bearer token
   - Server stores encrypted blob without decrypting

### Restore Flow

1. **API Fetch** (`api.ts` → `downloadLatestBackup()`)
   - Fetches encrypted blob from `GET /backup/latest`
   - No decryption happens server-side

2. **Decryption** (`crypto.ts` → `decryptBackup()`)
   - Extracts salt from blob header
   - Derives key from recovery phrase + salt
   - Decrypts with AES-256-GCM (verifies auth tag)
   - Decompresses with gunzip

3. **Project Matching** (`scanner.ts` + `fingerprint.ts`)
   - Scans current directory to get local projects
   - Builds fingerprint map
   - Matches backed-up projects to local projects
   - Fallback: `buildNameMap()` for name-based matching if fingerprints don't match

4. **File Restoration** (`restore.ts`)
   - For each matched project, creates `.env*` files
   - Prompts user for files that would be overwritten (unless `--force`)
   - Writes restored content to disk

### Server-Side Storage

- **No decryption**: Blobs stored as BYTEA (binary) in database
- **Metadata only**: Server knows vault ID, backup ID, created timestamp, device ID, size
- **Events table**: Tracks backup.created, backup.downloaded for analytics
- **Admin endpoints**: `/admin/analytics` and `/admin/events` (require `ADMIN_API_KEY`)

## Data Types & Interfaces

### CLI Core Types
```typescript
// From scanner.ts
interface Project {
  id: string;
  name: string;
  path: string;
  git: string | null;
  fingerprint: string;
  fingerprintSource: "git" | "package" | "folder";
  fingerprintValue: string;
  envs: EnvFile[];
}

// From config.ts
interface EnviiConfig {
  vaultId: string;
  deviceId: string;
  apiUrl: string;
  salt: string;
}

// From fingerprint.ts
interface FingerprintResult {
  fingerprint: string;
  source: "git" | "package" | "folder";
  value: string;
}
```

### API Types
```typescript
// From schema.ts
interface BackupRecord {
  id: string;
  vault_id: string;
  blob: Buffer;
  size_bytes: number;
  created_at: string;
  device_id: string | null;
}

interface EventRecord {
  id: number;
  event_type: EventType;
  vault_id: string | null;
  backup_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
```

## Testing

### CLI Tests
Located in `cli/tests/`, uses Vitest:
```bash
cd cli
npm test
```

Example test pattern:
- `ghost.test.ts` - Tests Ghost Protocol steganography

### API Tests
Located in `api/` (minimal), uses Vitest:
```bash
cd api
npm test
```

### Manual Testing Workflow
1. Start API server: `cd api && npm run dev`
2. Initialize CLI: `envii init --dev`
3. Create test `.env` files in subdirectories
4. Backup: `envii backup --dev`
5. Verify metadata: `envii list --dev`
6. Clear local `.env` files
7. Restore: `envii restore --dev --force`
8. Verify files restored correctly

## Configuration & Environment

### CLI Configuration
**Location**: `~/.envii/config.json`

```json
{
  "vaultId": "sha256-hash-of-recovery-phrase",
  "deviceId": "uuid-v4",
  "apiUrl": "http://localhost:3006" or "https://api.envii.dev",
  "salt": "base64-encoded-32-byte-salt"
}
```

- Created by `envii init` command
- Vault ID allows server to organize backups
- Salt persists between backups/restores
- Device ID tracks which machine performed backup

### API Environment Variables
```bash
PORT=4400                           # Server port
DATABASE_URL=postgresql://...       # PostgreSQL connection string
ADMIN_API_KEY=your-secret-key       # Admin API authentication (optional)
```

Set in `api/.env` or as system environment variables before `npm run dev`.

### Web Configuration
```bash
PORT=8084                           # Dev server port (in vite.config.ts)
```

## Recent Work & Patterns

**From git history** (last 15 commits):
- Project name fallback matching enhancement (`buildNameMap` function)
- Version management (currently 0.0.4 for CLI)
- Code style standardization (quote consistency)
- Analytics integration (PostHog)
- Landing page and web presence
- Ghost Protocol feature (steganography for backups)

**Development patterns**:
- Conventional commit messages: `feat:`, `fix:`, `chore:`, `style:`
- TypeScript with strict type checking
- ESLint for linting
- Vitest for testing (minimal coverage currently)
- Database initialization script for schema management

## Common Development Tasks

### Adding a New CLI Command
1. Create file in `cli/src/commands/your-command.ts` following pattern of existing commands
2. Export a command function that takes `options` and `args`
3. Register in `cli/src/index.ts` using `program.command()`
4. Handle errors and output using utilities from `cli/src/utils/logger.ts`

### Adding a New API Route
1. Create file in `api/src/routes/your-route.ts` as a Hono router
2. Use `authMiddleware` for authenticated endpoints
3. Log events for analytics tracking
4. Export router and register in `api/src/index.ts`

### Adding Database Queries
1. Add query functions to `api/src/db/schema.ts`
2. Use parameterized queries to prevent SQL injection
3. Define TypeScript interfaces for return types
4. Update schema initialization if adding tables

## Performance Considerations

- **Backup size limit**: 10 MB (enforced by API, configurable in `backup.ts`)
- **Database indexes**: Created on vault_id, created_at, event_type for fast queries
- **Compression**: All backups compressed with gzip before encryption (typically 50-80% reduction)
- **Project scanning**: Skips large directories (node_modules, dist, etc.) to avoid traversal overhead

## Security Notes

- **Recovery phrase**: Never logged, never transmitted, never stored on server
- **Encryption key**: Derived fresh from phrase + salt every backup/restore cycle
- **Server trust**: Server receives only encrypted blob and vault ID (hash of phrase)
- **Auth**: Simple bearer token doesn't require password management
- **Integrity**: AES-256-GCM auth tag prevents tampering with encrypted data

## Troubleshooting

### "Module not found" errors
Ensure all dependencies installed: `npm install` in each subdirectory.

### API connection failures
- Check `DATABASE_URL` is set and PostgreSQL is running
- Verify port 4400 is available (or change `PORT` environment variable)
- Test with `curl http://localhost:4400/health`

### Decryption failures
- Verify recovery phrase matches the one used for backup
- Check salt is correctly stored in `~/.envii/config.json`
- Ensure you're using the same `--dev` flag (dev vs production API)

### Project not restoring to correct location
- Check fingerprint matching in `cli/src/core/fingerprint.ts`
- Verify git remote URL hasn't changed since backup
- Use fallback name matching by checking `buildNameMap()` logic

---

**Last Updated**: February 2026
**Status**: Active Development
**Node Version Required**: 18+
**TypeScript Version**: 5.3+
