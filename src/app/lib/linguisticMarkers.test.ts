// Run with: npx tsx src/app/lib/linguisticMarkers.test.ts
import assert from "node:assert/strict";
import { computeLinguisticMarkers } from "./linguisticMarkers";

assert.deepEqual(computeLinguisticMarkers(""), { wordCount: 0, absolutistRatio: 0, firstPersonRatio: 0, negationRatio: 0 });

const neutral = computeLinguisticMarkers("The weather was pleasant today.");
assert.equal(neutral.wordCount, 5);
assert.equal(neutral.absolutistRatio, 0);
assert.equal(neutral.firstPersonRatio, 0);
assert.equal(neutral.negationRatio, 0);

// "I" x2, "my" x1 out of 6 words -> firstPersonRatio 3/6
const firstPerson = computeLinguisticMarkers("I lost my keys and I am upset");
assert.equal(firstPerson.firstPersonRatio, 3 / 8);

// "always" and "never" out of 6 words
const absolutist = computeLinguisticMarkers("Nothing ever works and it always fails completely");
assert.ok(absolutist.absolutistRatio > 0);

// contraction handling: "don't" counts as negation without a literal "not"
const contraction = computeLinguisticMarkers("I don't know why this keeps happening");
assert.ok(contraction.negationRatio > 0);

console.log("linguisticMarkers: all assertions passed");
