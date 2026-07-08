import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error("ENCRYPTION_SECRET_KEY environment variable is required. Set it in your .env file.");
}

// Current key for new encryptions
const key = crypto.createHash('sha256').update(SECRET_KEY).digest();

// Legacy key used before ENCRYPTION_SECRET_KEY was configured. Optional: only set this
// in environments that still hold data encrypted under the old default key.
const LEGACY_KEY = process.env.LEGACY_ENCRYPTION_SECRET_KEY;
const legacyKey = LEGACY_KEY ? crypto.createHash('sha256').update(LEGACY_KEY).digest() : null;

function decryptWithKey(encryptedText: string, decryptKey: Buffer): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) throw new Error("Invalid format");
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, decryptKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

// Encrypt function - always uses the current key
export const encrypt = (text: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Decrypt function - tries current key first, then legacy key
export const decrypt = (encryptedText: string) => {
    if (!encryptedText || !encryptedText.includes(':')) {
        return encryptedText;
    }

    // Try current key first
    try {
        return decryptWithKey(encryptedText, key);
    } catch {
        // Current key failed, try legacy key
    }

    // Try legacy key for entries encrypted before ENCRYPTION_SECRET_KEY was set
    if (legacyKey) {
        try {
            return decryptWithKey(encryptedText, legacyKey);
        } catch {
            // Both keys failed - fall through
        }
    }

    // Both keys failed (or no legacy key configured) - return as-is (likely unencrypted text containing a colon)
    return encryptedText;
};
