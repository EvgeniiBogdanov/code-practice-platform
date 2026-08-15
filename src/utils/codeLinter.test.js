/**
 * codeLinter.test.js
 * Комплексный набор тестов для проверки статического анализатора отсутствующих импортов,
 * детектора опечаток и баланса скобок (VS Code style diagnostics).
 */

import { lintJavaScriptCode, fixMissingImportInCode, fixTypoInCode } from "./codeLinter.js";
import { compileReactProject } from "./reactLiveRunner.js";

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

console.log("=== Running Code Linter & Missing Import Test Suite ===\n");

// --- 1. Missing Import Detection (React Hooks) ---
console.log("--- 1. Missing Import Detection (React Hooks) ---");

const rawUseState = `// Task 1
const App = () => {
  const [text, setText] = useState('hello');
  return <div>{text}</div>;
};
export default App;`;

const res1 = lintJavaScriptCode(rawUseState);
assert(res1.errorCount === 1, "Flags unimported useState with 1 error");
assert(res1.allMissingImports[0]?.symbol === "useState", "Identifies symbol 'useState'");
assert(res1.allMissingImports[0]?.module === "react", "Identifies module 'react'");
assert(res1.missingImportMap[3]?.symbol === "useState", "Maps missing import to line 3");

// Fix with Auto-Import
const fixed1 = fixMissingImportInCode(rawUseState, "useState", "react", false);
const res1Fixed = lintJavaScriptCode(fixed1);
assert(res1Fixed.errorCount === 0, "Fixed code has 0 errors after adding import");
assert(fixed1.includes("import { useState } from 'react';"), "Includes import { useState } statement");

// --- 2. Multiple Missing Imports (React & Lucide) ---
console.log("\n--- 2. Multiple Missing Imports (React & Lucide) ---");

const multiMissing = `const App = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count]);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      <Search size={16} />
      <span>{count}</span>
    </button>
  );
};
export default App;`;

const res2 = lintJavaScriptCode(multiMissing);
assert(res2.errorCount === 3, "Detects 3 missing imports (useState, useEffect, Search)");
const missingSymbols = res2.allMissingImports.map(i => i.symbol);
assert(missingSymbols.includes("useState"), "Includes useState in missing symbols");
assert(missingSymbols.includes("useEffect"), "Includes useEffect in missing symbols");
assert(missingSymbols.includes("Search"), "Includes Search icon in missing symbols");

// --- 3. Redux Toolkit & React-Redux Imports ---
console.log("\n--- 3. Redux Toolkit & React-Redux Imports ---");

const reduxCode = `const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; }
  }
});

const CounterView = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  return <div onClick={() => dispatch(counterSlice.actions.increment())}>{count}</div>;
};`;

const res3 = lintJavaScriptCode(reduxCode);
assert(res3.errorCount === 3, "Detects 3 missing imports (createSlice, useSelector, useDispatch)");
assert(res3.allMissingImports.some(i => i.symbol === "createSlice" && i.module === "@reduxjs/toolkit"), "createSlice maps to @reduxjs/toolkit");
assert(res3.allMissingImports.some(i => i.symbol === "useSelector" && i.module === "react-redux"), "useSelector maps to react-redux");
assert(res3.allMissingImports.some(i => i.symbol === "useDispatch" && i.module === "react-redux"), "useDispatch maps to react-redux");

// --- 4. React Default Import (React.useState / React.memo / React.Fragment) ---
console.log("\n--- 4. React Default Namespace Import ---");

const reactNamespaceCode = `const MyComp = React.memo(() => {
  const [val, setVal] = React.useState('');
  return <React.Fragment>{val}</React.Fragment>;
});`;

const res4 = lintJavaScriptCode(reactNamespaceCode);
assert(res4.allMissingImports.length === 1, "Identifies 1 unique missing import (React)");
assert(res4.errorCount === 4, "Flags all 4 occurrences of unimported React");
assert(res4.allMissingImports[0]?.symbol === "React" && res4.allMissingImports[0]?.isDefault === true, "Identifies React as default import");

// --- 5. No False Positives (Declared Variables, Props, Destructuring, Properties) ---
console.log("\n--- 5. No False Positives ---");

const validDeclaredCode = `import { useState } from 'react';

const App = (props) => {
  // Local declaration with same name as a known symbol
  const useEffect = "custom local variable";
  const { useSelector } = props;
  const [data, setData] = useState({ createSlice: 123 });

  // Property access
  const propVal = data.createSlice;

  return <div>{useEffect} {useSelector} {propVal}</div>;
};
export default App;`;

const res5 = lintJavaScriptCode(validDeclaredCode);
assert(res5.errorCount === 0, "No false positives for locally declared variables or object properties");

// --- 6. Task Multi-File Local Components ---
console.log("\n--- 6. Task Multi-File Local Components ---");

const multiFileCode = `const App = () => {
  return (
    <div>
      <CustomHeader />
      <TodoItem />
    </div>
  );
};
export default App;`;

const mockFiles = [
  { name: "App.jsx" },
  { name: "CustomHeader.jsx" },
  { name: "TodoItem.jsx" },
];

const res6 = lintJavaScriptCode(multiFileCode, { files: mockFiles });
assert(res6.errorCount === 2, "Detects missing imports for local task files CustomHeader and TodoItem");
assert(res6.allMissingImports.some(i => i.symbol === "CustomHeader" && i.module === "./CustomHeader"), "CustomHeader maps to ./CustomHeader");
assert(res6.allMissingImports.some(i => i.symbol === "TodoItem" && i.module === "./TodoItem"), "TodoItem maps to ./TodoItem");

// --- 7. Runtime Sandbox Execution (ReferenceError on Unimported Hooks) ---
console.log("\n--- 7. Runtime Sandbox Execution ---");

// Unimported hook should throw ReferenceError at runtime
const { Component: CompUnimported } = compileReactProject({
  "App.jsx": {
    name: "App.jsx",
    code: `const App = () => { const [x, setX] = useState(0); return <div>{x}</div>; }; export default App;`
  }
});

let runtimeError = null;
try {
  CompUnimported();
} catch (err) {
  runtimeError = err;
}
assert(runtimeError instanceof ReferenceError, "CompUnimported() throws ReferenceError at runtime");
assert(runtimeError?.message.includes("useState is not defined"), "Error message specifies 'useState is not defined'");

// Imported hook compiles and runs as proper React component
const { Component: CompImported } = compileReactProject({
  "App.jsx": {
    name: "App.jsx",
    code: `import { useState } from 'react'; const App = () => { return <div>working</div>; }; export default App;`
  }
});

let renderResult = null;
try {
  renderResult = CompImported();
} catch (err) {
  console.error("CompImported error:", err);
}
// --- 8. Duplicate Identifiers & Types (TS / JS) ---
console.log("\n--- 8. Duplicate Identifiers & Types (TS / JS) ---");

const duplicateTypeSample = `import React from 'react';

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => React.Key;
};

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getKey: (item: T) => React.Key;
};`;

const res8 = lintJavaScriptCode(duplicateTypeSample);
assert(res8.errorCount === 1, "Detects 1 error for duplicate type ListProps");
assert(res8.problems.some(p => p.rule === "duplicate-identifier" && p.line === 9), "Duplicate error is on line 9");
assert(res8.problems[0]?.message.includes("ListProps"), "Error message contains 'ListProps'");

const duplicateVarSample = `const value = 1;
const value = 2;
function foo() {
  const inner = 1;
}
function bar() {
  const inner = 2; // Different scope, OK!
}`;

const res8Var = lintJavaScriptCode(duplicateVarSample);
assert(res8Var.errorCount === 1, "Detects duplicate variable 'value' in same scope without false positive on inner");
assert(res8Var.problems.some(p => p.rule === "duplicate-identifier" && p.line === 2), "Duplicate error is on line 2");

// --- 9. Unused Imports Detection (Этап 5.1) ---
console.log("\n--- 9. Unused Imports Detection ---");
const codeWithUnused = `import React, { useState, useEffect, useMemo } from 'react';
import { createSlice } from '@reduxjs/toolkit';

export default function App() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}`;

const res9 = lintJavaScriptCode(codeWithUnused);
assert(res9.unusedImports.has("useEffect"), "Identifies unused 'useEffect'");
assert(res9.unusedImports.has("useMemo"), "Identifies unused 'useMemo'");
assert(res9.unusedImports.has("createSlice"), "Identifies unused 'createSlice'");
assert(!res9.unusedImports.has("useState"), "Does NOT flag used 'useState'");

// --- 10. TypeScript Type Checking & Component Props (Этап 6) ---
console.log("\n--- 10. TypeScript Type Checking & Component Props ---");
const codeWithTypeAndProps = `import React from 'react';

function CustomBtn({ title, onClick }) {
  return <button onClick={onClick}>{title}</button>;
}

export default function App() {
  const count: number = "ten";
  return (
    <div>
      <CustomBtn />
      <img src="/logo.png" />
    </div>
  );
}`;

const res10 = lintJavaScriptCode(codeWithTypeAndProps);
assert(
  res10.problems.some((p) => p.rule === "ts-type-mismatch" && p.message.includes("'number'")),
  "lintJavaScriptCode flags TypeScript type mismatch error"
);
assert(
  res10.problems.some((p) => p.rule === "react-missing-required-props" && p.message.includes("<CustomBtn>")),
  "lintJavaScriptCode flags missing required props warning on <CustomBtn>"
);
assert(
  res10.problems.some((p) => p.rule === "jsx-a11y-img-has-alt"),
  "lintJavaScriptCode flags <img> missing alt attribute"
);

// --- Summary ---
console.log("\n========================================");
console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
if (failed === 0) {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓\n");
} else {
  process.exit(1);
}
