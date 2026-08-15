/**
 * emmetEngine.test.js
 * Набор тестов для генератора Emmet JSX разметки.
 */

import { expandEmmetAbbreviation, isEmmetAbbreviation } from "./emmetEngine.js";

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

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    console.error(`    Expected:\n${expected}`);
    console.error(`    Actual:\n${actual}`);
    failed++;
  }
}

console.log("=== Running Emmet JSX Engine Test Suite ===");

// 1. isEmmetAbbreviation checks
console.log("\n--- 1. isEmmetAbbreviation ---");
assert(isEmmetAbbreviation("div.card"), "Recognizes 'div.card'");
assert(isEmmetAbbreviation("button.btn.btn-primary"), "Recognizes 'button.btn.btn-primary'");
assert(isEmmetAbbreviation("ul>li.item*3"), "Recognizes 'ul>li.item*3'");
assert(isEmmetAbbreviation("input#name"), "Recognizes 'input#name'");
assert(!isEmmetAbbreviation("const x = 10"), "Rejects 'const x = 10'");
assert(!isEmmetAbbreviation("function foo()"), "Rejects 'function foo()'");
assert(!isEmmetAbbreviation(""), "Rejects empty string");

// 2. Simple Elements with Classes and IDs
console.log("\n--- 2. Simple Elements ---");
assertEqual(
  expandEmmetAbbreviation("div.container"),
  '<div className="container"></div>',
  "Expands 'div.container' to '<div className=\"container\"></div>'"
);

assertEqual(
  expandEmmetAbbreviation("button.btn.btn-primary#submit"),
  '<button id="submit" className="btn btn-primary"></button>',
  "Expands 'button.btn.btn-primary#submit' with id and multiple classNames"
);

assertEqual(
  expandEmmetAbbreviation(".box"),
  '<div className="box"></div>',
  "Expands '.box' with default div tag"
);

// 3. Void / Self-Closing Tags
console.log("\n--- 3. Void Tags ---");
assertEqual(
  expandEmmetAbbreviation("input.form-control"),
  '<input className="form-control" />',
  "Self-closes void tag 'input'"
);

assertEqual(
  expandEmmetAbbreviation("img.avatar[src=\"/logo.png\" alt=\"Logo\"]"),
  '<img className="avatar" src="/logo.png" alt="Logo" />',
  "Self-closes 'img' with custom attributes"
);

// 4. Nested Children (>) and Multiplication (*)
console.log("\n--- 4. Nested Children & Multiplication ---");
const ulExpected = `<ul className="list">
  <li className="item"></li>
  <li className="item"></li>
  <li className="item"></li>
</ul>`;
assertEqual(
  expandEmmetAbbreviation("ul.list>li.item*3"),
  ulExpected,
  "Expands 'ul.list>li.item*3' with indented children"
);

// 5. Siblings (+) and Text ({text})
console.log("\n--- 5. Siblings & Text ---");
const cardExpected = `<div className="card">
  <h2>Title</h2>
  <p>Description</p>
  <button className="btn">Click me</button>
</div>`;
assertEqual(
  expandEmmetAbbreviation("div.card>h2{Title}+p{Description}+button.btn{Click me}"),
  cardExpected,
  "Expands complex card with text and siblings"
);

// 6. Numbering ($)
console.log("\n--- 6. Item Numbering ($) ---");
const numberedExpected = `<ul className="menu">
  <li className="item-1">Item 1</li>
  <li className="item-2">Item 2</li>
</ul>`;
assertEqual(
  expandEmmetAbbreviation("ul.menu>li.item-${Item $}*2"),
  numberedExpected,
  "Expands '$' to 1-based index in className and text"
);

console.log(`\n========================================`);
console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓\n");
}
