// Run with: npx tsx src/app/lib/rateLimit.test.ts
import assert from "node:assert/strict";
import { resolveAiLimit } from "./rateLimit";

// Unset or blank -> the route's own default applies.
assert.equal(resolveAiLimit(undefined, 60), 60);
assert.equal(resolveAiLimit("", 60), 60);
assert.equal(resolveAiLimit("   ", 60), 60);

// A typo must NOT silently disable the cap — it falls back to the default.
assert.equal(resolveAiLimit("abc", 60), 60);
assert.equal(resolveAiLimit("10x", 60), 60);

// Explicit values win, including 0 (disable) which callers treat as unlimited.
assert.equal(resolveAiLimit("5", 60), 5);
assert.equal(resolveAiLimit("0", 60), 0);
assert.equal(resolveAiLimit("-1", 60), -1);

console.log("rateLimit: all assertions passed");
