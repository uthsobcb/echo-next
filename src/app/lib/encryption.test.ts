// Run with: npx tsx src/app/lib/encryption.test.ts
import assert from "node:assert/strict";

const OLD = "old-encryption-secret-at-least-32-bytes";
const NEW = "new-encryption-secret-at-least-32-bytes";
const PLAINTEXT = "a journal entry: with a colon in it";

async function main() {
    // Encrypt under the original key.
    process.env.ENCRYPTION_SECRET_KEY = OLD;
    delete process.env.LEGACY_ENCRYPTION_SECRET_KEY;
    const { encrypt, decrypt } = await import("./encryption");

    const ciphertext = encrypt(PLAINTEXT);
    assert.equal(ciphertext.split(":").length, 3, "current format is 3-segment GCM");
    assert.equal(decrypt(ciphertext), PLAINTEXT, "round-trips under its own key");

    // Rotate: new key current, old key retained as legacy.
    process.env.ENCRYPTION_SECRET_KEY = NEW;
    process.env.LEGACY_ENCRYPTION_SECRET_KEY = OLD;
    assert.equal(decrypt(ciphertext), PLAINTEXT, "entries written before rotation must still decrypt");

    // New writes use the new key and are readable alongside the old ones.
    const afterRotation = encrypt(PLAINTEXT);
    assert.equal(decrypt(afterRotation), PLAINTEXT, "entries written after rotation decrypt");

    // Without the legacy key, old entries are unreadable - and must NOT be
    // returned as raw ciphertext masquerading as plaintext.
    delete process.env.LEGACY_ENCRYPTION_SECRET_KEY;
    assert.notEqual(decrypt(ciphertext), PLAINTEXT, "old entries are lost once the legacy key is dropped");

    console.log("encryption: all assertions passed");
}

main();
