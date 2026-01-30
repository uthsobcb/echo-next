import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';  // Algorithm for encryption
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || "your_secret_key";  // Fetch the secret key from environment variable
const IV_LENGTH = 16;  // Initialization vector length for AES-256-CBC

// Ensure the key is exactly 32 bytes using SHA-256 hash
const key = crypto.createHash('sha256').update(SECRET_KEY).digest();  // 32 bytes

// Encrypt function
export const encrypt = (text: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);  // Generate random IV
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);  // Use the 32-byte key
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;  // Return the IV and encrypted data
};

// Decrypt function with fallback for unencrypted data
export const decrypt = (encryptedText: string) => {
    try {
        if (!encryptedText || !encryptedText.includes(':')) {
            return encryptedText;
        }
        const [ivHex, encrypted] = encryptedText.split(':');  // Split IV and encrypted data
        if (!ivHex || !encrypted) return encryptedText;

        const iv = Buffer.from(ivHex, 'hex');  // Convert IV from hex to buffer
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);  // Use the 32-byte key
        let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (error) {
        // console.error("Decryption failed, returning original text:", error);
        return encryptedText;
    }
};
