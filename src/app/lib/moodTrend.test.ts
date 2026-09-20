// Run with: npx tsx src/app/lib/moodTrend.test.ts
import assert from "node:assert/strict";
import { detectMoodTrend } from "./moodTrend";

// Too few points -> no verdict, never a false alert on thin data.
assert.equal(detectMoodTrend([8, 7, 8]).direction, "stable");
assert.equal(detectMoodTrend([8, 7, 8]).zScore, null);

// Flat baseline, flat recent window -> stable, no alert.
const flat = detectMoodTrend([7, 7, 7, 7, 7, 7, 7, 7, 7, 7]);
assert.equal(flat.direction, "stable");
assert.equal(flat.alert, false);

// Steady baseline around 8, then a sustained drop to ~3 -> declining + alert.
const declining = detectMoodTrend([8, 8, 8, 8, 8, 8, 8, 3, 3, 3, 3, 3]);
assert.equal(declining.direction, "declining");
assert.equal(declining.alert, true);

// Steady baseline, then a sustained rise -> improving, not flagged as an alert.
const improving = detectMoodTrend([3, 3, 3, 3, 3, 3, 3, 8, 8, 8, 8, 8]);
assert.equal(improving.direction, "improving");
assert.equal(improving.alert, false);

// Zero-variance baseline must not divide by zero.
const zeroVariance = detectMoodTrend([5, 5, 5, 5, 5, 5, 5, 5]);
assert.equal(Number.isFinite(zeroVariance.zScore), true);

console.log("moodTrend: all assertions passed");
