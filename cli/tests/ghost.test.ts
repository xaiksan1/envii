import { describe, it, expect } from 'vitest';
import { ghost } from '../src/core/ghost';

describe('Ghost Protocol Robustness', () => {
  const secretPayload = "S3CRET_K3Y_12345";
  
  it('should encode and decode correctly', () => {
    const encoded = ghost.encode(secretPayload);
    const decoded = ghost.decode(encoded);
    expect(decoded).toBe(secretPayload);
  });

  it('should be invisible in plain sight', () => {
    const cover = "System log normal.";
    const encoded = ghost.encode(secretPayload, cover);
    
    // The length should be greater (expansion)
    expect(encoded.length).toBeGreaterThan(cover.length);
    
    // But visual content (sanitized) should remain identical
    const sanitized = ghost.sanitize(encoded);
    expect(sanitized).toBe(cover);
  });

  it('should survive Base64 tunneling (The Envii Flow)', () => {
    // 1. Original Binary Data (simulated as base64 string from crypto module)
    const originalEncryptedBlob = Buffer.from("ENCRYPTED_DATA_IV_SALT").toString('base64');
    
    // 2. Ghost Encoding (CLI Backup side)
    // We treat the base64 string as the secret to hide
    const ghostText = ghost.encode(originalEncryptedBlob);
    
    // 3. Convert Ghost Text to Base64 for API Transport (CLI -> API)
    // This uses UTF-8 to preserve ZW chars
    const transportBlob = Buffer.from(ghostText, 'utf-8').toString('base64');
    
    // --- NETWORK / DATABASE STORAGE ---
    
    // 4. API receives and decodes (API side)
    const storedBuffer = Buffer.from(transportBlob, 'base64');
    // At this point, storedBuffer contains the UTF-8 bytes of the Ghost Text
    
    // 5. Restore: API sends back as Base64 (API -> CLI)
    const downloadedBlob = storedBuffer.toString('base64');
    
    // 6. CLI receives and decodes to UTF-8 String
    const restoredText = Buffer.from(downloadedBlob, 'base64').toString('utf-8');
    
    // 7. Validation: Text should be identical to what we sent
    expect(restoredText).toBe(ghostText);
    
    // 8. Ghost Decoding
    expect(ghost.hasGhostSignal(restoredText)).toBe(true);
    const extractedPayload = ghost.decode(restoredText);
    
    // 9. Final check
    expect(extractedPayload).toBe(originalEncryptedBlob);
  });

  it('should handle UTF-8 replacement character check', () => {
    // Simulate raw binary data that is NOT valid UTF-8
    const rawBinary = Buffer.from([0xFF, 0xFF, 0xFF]); // Invalid UTF-8 sequence
    const asString = rawBinary.toString('utf-8');
    
    // Should contain replacement char \uFFFD
    expect(asString).toContain('\uFFFD');
    
    // Ghost text should NOT contain replacement char if handled correctly
    const ghostText = ghost.encode("test");
    const ghostBuffer = Buffer.from(ghostText, 'utf-8');
    const ghostString = ghostBuffer.toString('utf-8');
    
    expect(ghostString).not.toContain('\uFFFD');
  });
});
