// Run with: npx tsx src/app/lib/jwtKeys.test.ts
import assert from "node:assert/strict";
import { SignJWT } from "jose";
import { verifyWithRotation } from "./jwtKeys";

const OLD = "old-secret-at-least-32-bytes-long-aaaa";
const NEW = "new-secret-at-least-32-bytes-long-bbbb";
const OTHER = "unrelated-secret-at-least-32-bytes-cccc";

const sign = (secret: string) =>
    new SignJWT({ userId: "u1" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(new TextEncoder().encode(secret));

async function main() {
    const tokenFromOldSecret = await sign(OLD);
    const tokenFromNewSecret = await sign(NEW);
    const forgedToken = await sign(OTHER);

    // Before rotation: only the current secret verifies.
    process.env.JWT_SECRET = OLD;
    delete process.env.LEGACY_JWT_SECRET;
    assert.ok(await verifyWithRotation(tokenFromOldSecret), "pre-rotation token must verify");
    assert.equal(await verifyWithRotation(tokenFromNewSecret), null);

    // Mid-rotation: both secrets verify, so nobody is signed out.
    process.env.JWT_SECRET = NEW;
    process.env.LEGACY_JWT_SECRET = OLD;
    const stillValid = await verifyWithRotation(tokenFromOldSecret);
    assert.ok(stillValid, "cookie signed with the old secret must survive rotation");
    assert.equal(stillValid.userId, "u1", "payload must survive the legacy path intact");
    assert.ok(await verifyWithRotation(tokenFromNewSecret), "newly issued token must verify");

    // A secret that was never ours is rejected in every phase.
    assert.equal(await verifyWithRotation(forgedToken), null, "forged token must be rejected");

    // After the legacy secret is retired, old cookies stop working — the point of rotating.
    delete process.env.LEGACY_JWT_SECRET;
    assert.equal(await verifyWithRotation(tokenFromOldSecret), null, "retiring the legacy secret must invalidate old cookies");
    assert.ok(await verifyWithRotation(tokenFromNewSecret), "current tokens keep working after retirement");

    console.log("jwtKeys: all assertions passed");
}

main();
