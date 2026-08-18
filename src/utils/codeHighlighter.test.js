import { highlightJS, findMatchingBracketPair } from "./codeHighlighter.js";

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

console.log("=== Running Code Highlighter Test Suite ===");

// 1. Basic Syntax Highlighting
console.log("\n--- 1. Basic Syntax Highlighting ---");
const code1 = "const [count, setCount] = useState(0);";
const html1 = highlightJS(code1);
assert(html1.includes('class="hl-kw"'), "Highlights keyword 'const'");
assert(html1.includes('class="hl-hook"'), "Highlights React hook 'useState'");
assert(html1.includes('class="hl-num"'), "Highlights number '0'");

const codeTsx = "type Props = { children: ReactNode; onChange: (e: ChangeEvent<HTMLInputElement>) => void };";
const htmlTsx = highlightJS(codeTsx);
assert(htmlTsx.includes('class="hl-type">ReactNode</span>'), "Highlights ReactNode as hl-type");
assert(htmlTsx.includes('class="hl-type">ChangeEvent</span>'), "Highlights ChangeEvent as hl-type");
assert(htmlTsx.includes('class="hl-type">HTMLInputElement</span>'), "Highlights HTMLInputElement as hl-type");

const codeTsxOp = "type Keys = keyof T; function isString(x: any): x is string { return true; }";
const htmlTsxOp = highlightJS(codeTsxOp);
assert(htmlTsxOp.includes('class="hl-kw">keyof</span>'), "Highlights keyof as hl-kw");
assert(htmlTsxOp.includes('class="hl-kw">is</span>'), "Highlights type predicate 'is' as hl-kw");

// 2. Word Occurrence Highlighting
console.log("\n--- 2. Word Occurrence Highlighting ---");
const code2 = `const count = 1;
function getCount() {
  return count + 1;
}`;
const html2 = highlightJS(code2, { highlightWord: "count" });
assert(html2.includes("hl-word-match"), "Adds hl-word-match class for target word");
const matches = html2.match(/hl-word-match/g);
assert(matches && matches.length === 2, "Highlights all 2 occurrences of 'count'");

// 3. Bracket Pair Match Highlighting
console.log("\n--- 3. Bracket Pair Matching ---");
const code3 = "const fn = (a, b) => { return [a, b]; };";
// Indices:
// '(' is at index 11, ')' is at index 16
// '{' is at index 21, '}' is at index 38
// '[' is at index 30, ']' is at index 35

const pairParen = findMatchingBracketPair(code3, 11);
assert(pairParen !== null, "Finds matching parenthesis pair");
assert(pairParen[0] === 11 && pairParen[1] === 16, "Opening '(' at 11 matches closing ')' at 16");

const pairParenFromClose = findMatchingBracketPair(code3, 17);
assert(pairParenFromClose !== null && pairParenFromClose[0] === 11 && pairParenFromClose[1] === 16, "Cursor after ')' matches '(' at 11");

const pairBrace = findMatchingBracketPair(code3, 21);
assert(pairBrace !== null && pairBrace[0] === 21 && pairBrace[1] === 38, "Brace '{' at 21 matches '}' at 38");

const pairSquare = findMatchingBracketPair(code3, 30);
assert(pairSquare !== null && pairSquare[0] === 30 && pairSquare[1] === 35, "Bracket '[' at 30 matches ']' at 35");

// 4. Bracket Match HTML Rendering
console.log("\n--- 4. Bracket Match HTML Rendering ---");
const htmlBracket = highlightJS(code3, { bracketPair: [11, 16] });
assert(htmlBracket.includes("hl-bracket-match"), "Renders hl-bracket-match on matched bracket pair");

// 5. Squiggly Underlines & Unused Dimming (Этап 5.1)
console.log("\n--- 5. Squiggly Underlines & Unused Dimming ---");
const code5 = `import { useState, useEffect } from 'react';
conts x = 10;
const [val, setVal] = useReducer(reducer, 0);`;

const problemsMock = [
  { line: 2, col: 1, typo: "conts", correct: "const", severity: "error" },
  { line: 3, col: 23, symbol: "useReducer", severity: "error" },
];
const unusedMock = new Set(["useEffect"]);

const html5 = highlightJS(code5, {
  problems: problemsMock,
  unusedImports: unusedMock,
});

assert(html5.includes("hl-squiggly-error"), "Renders hl-squiggly-error under typo and unimported symbols");
assert(html5.includes("hl-unused-dimmed"), "Renders hl-unused-dimmed on unused import symbol");

console.log(`\n========================================`);
console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓\n");
}
