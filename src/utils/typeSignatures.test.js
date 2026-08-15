/**
 * typeSignatures.test.js
 * Набор тестов для базы знаний типов, Hover Tooltips и Parameter Signature Help.
 */

import { getHoverInfo, getSignatureHelp, TYPE_SIGNATURES } from "./typeSignatures.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== Running Type Signatures & Hover/Signature Help Test Suite ===");

// 1. Hover Tooltips
console.log("\n--- 1. getHoverInfo (Hover Tooltips) ---");
const hUseState = getHoverInfo("useState", "const [x, setX] = useState(0);", 25);
assert(hUseState !== null, "Finds hover info for useState");
assert(hUseState.signature.includes("function useState"), "Contains useState function signature");
assert(hUseState.module === "react", "Identifies module 'react'");

const hMap = getHoverInfo("map", "items.map(item => item.id)", 8);
assert(hMap !== null, "Finds hover info for map");
assert(hMap.signature.includes("Array<T>.prototype.map"), "Contains Array.map signature");

const hPartial = getHoverInfo("Partial", "type T = Partial<Props>", 12);
assert(hPartial !== null, "Finds hover info for Partial");
assert(hPartial.signature.includes("type Partial<T>"), "Contains Partial<T> signature");

// 2. Parameter Hints / Signature Help
console.log("\n--- 2. getSignatureHelp (Parameter Hints) ---");

// Case 2.1: useEffect(
const codeEffect1 = "useEffect(";
const sigEffect1 = getSignatureHelp(codeEffect1, codeEffect1.length);
assert(sigEffect1 !== null, "Finds signature help for useEffect(");
assert(sigEffect1.functionName === "useEffect", "Identifies functionName as useEffect");
assert(sigEffect1.activeParameter === 0, "Active parameter is 0 (effect)");
assert(sigEffect1.parameters[0].name === "effect", "First parameter is effect");

// Case 2.2: useEffect(() => {}, [
const codeEffect2 = "useEffect(() => {}, [";
const sigEffect2 = getSignatureHelp(codeEffect2, codeEffect2.length);
assert(sigEffect2 !== null, "Finds signature help for useEffect second param");
assert(sigEffect2.activeParameter === 1, "Active parameter is 1 (deps)");
assert(sigEffect2.parameters[1].name === "deps", "Second parameter is deps");

// Case 2.3: useMemo(() => compute(a, b), [
const codeMemo = "useMemo(() => compute(a, b), [";
const sigMemo = getSignatureHelp(codeMemo, codeMemo.length);
assert(sigMemo !== null, "Finds signature help for useMemo with nested function call");
assert(sigMemo.activeParameter === 1, "Active parameter for useMemo is 1 (deps)");

// Case 2.4: setTimeout(
const codeTimeout = "setTimeout(";
const sigTimeout = getSignatureHelp(codeTimeout, codeTimeout.length);
assert(sigTimeout !== null, "Finds signature help for setTimeout");
assert(sigTimeout.activeParameter === 0, "Active parameter is handler");

// Case 2.5: createSlice({
const codeSlice = "createSlice({";
const sigSlice = getSignatureHelp(codeSlice, codeSlice.length);
assert(sigSlice !== null, "Finds signature help for createSlice");

console.log(`\n========================================`);
console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓\n");
}
