import crypto from 'crypto';

const LEGACY_ALGORITHM = 'aes-256-cbc';
const GCM_ALGORITHM = 'aes-256-gcm';
const GCM_IV_LENGTH = 12;

function getCurrentKey(): Buffer {
    const secret = process.env.ENCRYPTION_SECRET_KEY;
    if (!secret) throw new Error("ENCRYPTION_SECRET_KEY environment variable is required");
    return crypto.createHash('sha256').update(secret).digest();
}

function getLegacyKey(): Buffer | null {
    const secret = process.env.LEGACY_ENCRYPTION_SECRET_KEY;
    return secret ? crypto.createHash('sha256').update(secret).digest() : null;
}

function decryptCbc(encryptedText: string, decryptKey: Buffer): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) throw new Error("Invalid format");
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(LEGACY_ALGORITHM, decryptKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

function decryptGcm(encryptedText: string, decryptKey: Buffer): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !authTagHex || !encrypted) throw new Error("Invalid format");
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(GCM_ALGORITHM, decryptKey, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

// Encrypt function - always uses the current key, in authenticated GCM mode.
// Format: iv:authTag:ciphertext (3 hex segments), distinguishing it from the
// legacy iv:ciphertext (2 segments) CBC format still supported for reads below.
export const encrypt = (text: string) => {
    const key = getCurrentKey();
    const iv = crypto.randomBytes(GCM_IV_LENGTH);
    const cipher = crypto.createCipheriv(GCM_ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

// Decrypt function - dispatches on segment count to support both the current
// GCM format and data written before this migration (CBC, current or legacy key).
export const decrypt = (encryptedText: string) => {
    if (!encryptedText || !encryptedText.includes(':')) {
        return encryptedText;
    }

    const segments = encryptedText.split(':').length;
    const key = getCurrentKey();

    if (segments === 3) {
        try {
            return decryptGcm(encryptedText, key);
        } catch {
            // Tampered, corrupted, or encrypted under a rotated key - fall through to as-is below.
        }
        return encryptedText;
    }

    // Legacy CBC format: try current key first, then legacy key
    try {
        return decryptCbc(encryptedText, key);
    } catch {
        // Current key failed, try legacy key
    }

    const legacyKey = getLegacyKey();
    if (legacyKey) {
        try {
            return decryptCbc(encryptedText, legacyKey);
        } catch {
            // Both keys failed - fall through
        }
    }

    // Both keys failed (or no legacy key configured) - return as-is (likely unencrypted text containing a colon)
    return encryptedText;
};
