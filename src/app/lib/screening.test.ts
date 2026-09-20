// Run with: npx tsx src/app/lib/screening.test.ts
import assert from "node:assert/strict";
import { scoreScreening, validateAnswers, phq9SuicideRisk } from "./screening";

// PHQ-9 band boundaries (0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 mod-severe, 20-27 severe)
assert.equal(scoreScreening("phq9", [0, 0, 0, 0, 0, 0, 0, 0, 0]).severity, "minimal");
assert.equal(scoreScreening("phq9", [1, 1, 1, 0, 0, 0, 0, 0, 0]).totalScore, 3);
assert.equal(scoreScreening("phq9", [1, 1, 1, 1, 1, 0, 0, 0, 0]).severity, "mild"); // 5
assert.equal(scoreScreening("phq9", [2, 2, 2, 2, 2, 0, 0, 0, 0]).severity, "moderate"); // 10
assert.equal(scoreScreening("phq9", [2, 2, 2, 3, 3, 3, 0, 0, 0]).severity, "moderately-severe"); // 15
assert.equal(scoreScreening("phq9", [3, 3, 3, 3, 3, 3, 3, 0, 0]).severity, "severe"); // 21

// GAD-7 band boundaries (0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe)
assert.equal(scoreScreening("gad7", [0, 0, 0, 0, 0, 0, 0]).severity, "minimal");
assert.equal(scoreScreening("gad7", [1, 1, 1, 1, 1, 0, 0]).severity, "mild"); // 5
assert.equal(scoreScreening("gad7", [2, 2, 2, 2, 2, 0, 0]).severity, "moderate"); // 10
assert.equal(scoreScreening("gad7", [3, 3, 3, 3, 3, 0, 0]).severity, "severe"); // 15

// validateAnswers: length and range must match the instrument exactly.
assert.equal(validateAnswers("phq9", [0, 1, 2, 3, 0, 1, 2, 3, 0]), true);
assert.equal(validateAnswers("phq9", [0, 1, 2]), false); // wrong length
assert.equal(validateAnswers("gad7", [0, 1, 2, 3, 0, 1, 4]), false); // out of range
assert.equal(validateAnswers("gad7", [0, 1, 2, 3, 0, 1, "2" as unknown as number]), false); // non-integer

// PHQ-9 item 9 (index 8) drives the crisis path independent of total score.
assert.deepEqual(phq9SuicideRisk([0, 0, 0, 0, 0, 0, 0, 0, 0]), { severity: "none", indicators: [] });
assert.deepEqual(phq9SuicideRisk([0, 0, 0, 0, 0, 0, 0, 0, 1]), { severity: "moderate", indicators: ["passive-ideation"] });
assert.deepEqual(phq9SuicideRisk([0, 0, 0, 0, 0, 0, 0, 0, 3]), { severity: "high", indicators: ["active-ideation"] });

console.log("screening: all assertions passed");
