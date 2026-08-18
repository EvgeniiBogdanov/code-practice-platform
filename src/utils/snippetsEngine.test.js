import {
  expandImportStatement,
  addImportToFile,
  getCompletions,
  resolveModuleForSymbol,
  fuzzyMatch,
  expandSnippet,
  getComponentNameFromFilepath,
  JS_SNIPPETS,
  JS_MEMBER_COMPLETIONS,
  JSX_ELEMENTS,
  REACT_JSX_PROPS,
  REACT_CSS_PROPERTIES,
  TS_UTILITY_TYPES,
  findDefinition,
  getWordAtPosition,
} from "./snippetsEngine.js";

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ ${testName}`);
    console.error(`    Expected: ${JSON.stringify(expected)}`);
    console.error(`    Actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function assertTrue(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ ${testName}`);
    failed++;
  }
}

console.log("=== Running Comprehensive IntelliSense Test Suite ===\n");

// 1. Тесты expandImportStatement (расширение по клавише Tab)
console.log("--- 1. expandImportStatement (Tab Key Expansion) ---");
assertEqual(
  expandImportStatement("import {useState}"),
  "import { useState } from 'react';",
  "import {useState} expands to import { useState } from 'react';"
);

assertEqual(
  expandImportStatement("import { useState }"),
  "import { useState } from 'react';",
  "import { useState } expands to import { useState } from 'react';"
);

assertEqual(
  expandImportStatement("import {useState"),
  "import { useState } from 'react';",
  "import {useState expands to import { useState } from 'react';"
);

assertEqual(
  expandImportStatement("import { useState"),
  "import { useState } from 'react';",
  "import { useState expands to import { useState } from 'react';"
);

assertEqual(
  expandImportStatement("import {useState, useEffect}"),
  "import { useState, useEffect } from 'react';",
  "import {useState, useEffect} expands to import { useState, useEffect } from 'react';"
);

assertEqual(
  expandImportStatement("import { useState, useMemo"),
  "import { useState, useMemo } from 'react';",
  "import { useState, useMemo expands to import { useState, useMemo } from 'react';"
);

assertEqual(
  expandImportStatement("import React"),
  "import React from 'react';",
  "import React expands to import React from 'react';"
);

assertEqual(
  expandImportStatement("import React, { useState }"),
  "import React, { useState } from 'react';",
  "import React, { useState } expands to import React, { useState } from 'react';"
);

assertEqual(
  expandImportStatement("import { createSlice }"),
  "import { createSlice } from '@reduxjs/toolkit';",
  "import { createSlice } expands to @reduxjs/toolkit"
);

assertEqual(
  expandImportStatement("import { useSelector, useDispatch }"),
  "import { useSelector, useDispatch } from 'react-redux';",
  "import { useSelector, useDispatch } expands to react-redux"
);

assertEqual(
  expandImportStatement("import { Link, useNavigate }"),
  "import { Link, useNavigate } from '@tanstack/react-router';",
  "import { Link, useNavigate } expands to @tanstack/react-router"
);

assertEqual(
  expandImportStatement("import { create }"),
  "import { create } from 'zustand';",
  "import { create } expands to zustand"
);

assertEqual(
  expandImportStatement("import { FileCode }"),
  "import { FileCode } from 'lucide-react';",
  "import { FileCode } expands to lucide-react"
);

assertEqual(
  expandImportStatement("import type { FC, ReactNode }"),
  "import type { FC, ReactNode } from 'react';",
  "import type { FC, ReactNode } expands with type prefix"
);

assertEqual(
  expandImportStatement("import { useState } from 'react';"),
  null,
  "Already completed import returns null (no expansion needed)"
);

// Тест с локальными файлами задачи
const mockTaskFiles = [
  { name: "Button.jsx", code: "export const Button = () => <button />;\nexport default Button;" },
  { name: "usersSlice.js", code: "export const usersSlice = createSlice(...);" },
];

assertEqual(
  expandImportStatement("import Button", mockTaskFiles),
  "import Button from './Button';",
  "Local file default import expands to ./Button"
);

assertEqual(
  expandImportStatement("import { Button }", mockTaskFiles),
  "import { Button } from './Button';",
  "Local file named import expands to ./Button"
);

console.log("\n--- 2. addImportToFile (Auto-Import into File Header) ---");

const codeWithNamedReact = "import { useEffect } from 'react';\n\nfunction App() {\n  return <div>App</div>;\n}";
const res1 = addImportToFile(codeWithNamedReact, "useState", "react");
assertTrue(
  res1.newCode.includes("import { useEffect, useState } from 'react';"),
  "Appends useState to existing React named import"
);

const codeWithDefaultReact = "import React from 'react';\n\nfunction App() {\n  return <div>App</div>;\n}";
const res2 = addImportToFile(codeWithDefaultReact, "useState", "react");
assertTrue(
  res2.newCode.includes("import React, { useState } from 'react';"),
  "Appends { useState } to existing import React from 'react'"
);

const bareCode = "// Main component\nfunction App() {\n  const [x, setX] = useState(0);\n}";
const res3 = addImportToFile(bareCode, "useState", "react");
assertTrue(
  res3.newCode.startsWith("// Main component\nimport { useState } from 'react';\n"),
  "Adds new import statement after leading comments"
);

const codeWithReactOnly = "import React, { useState } from 'react';\n\nfunction App() {}";
const res4 = addImportToFile(codeWithReactOnly, "createSlice", "@reduxjs/toolkit");
assertTrue(
  res4.newCode.includes("import React, { useState } from 'react';\nimport { createSlice } from '@reduxjs/toolkit';"),
  "Adds new package import on line after existing imports"
);

const res5 = addImportToFile("import { useState } from 'react';", "useState", "react");
assertEqual(
  res5.insertedLength,
  0,
  "Does not duplicate already imported symbol"
);

console.log("\n--- 3. getCompletions (Context-Aware IntelliSense) ---");

// 3.1. import {useState}
const comp1 = getCompletions("import {useState}", 17);
assertTrue(
  comp1.items.some((i) => i.insertText === "import { useState } from 'react';"),
  "Suggests full statement completion on import {useState}"
);

// 3.2. import {useS} (с закрывающей скобкой) -> выбираем useState -> разворачивается с from 'react';
const compUseS1 = getCompletions("import {useS}", 13);
assertEqual(
  compUseS1.items[0]?.insertText,
  "import { useState } from 'react';",
  "Selecting useState inside import {useS} expands to full 'import { useState } from 'react';'"
);

// 3.3. import {useS (без закрывающей скобки) -> выбираем useState -> разворачивается с from 'react';
const compUseS2 = getCompletions("import {useS", 12);
assertEqual(
  compUseS2.items[0]?.insertText,
  "import { useState } from 'react';",
  "Selecting useState inside import {useS expands to full 'import { useState } from 'react';'"
);

// 3.4. import { useState, useE } -> выбираем useEffect -> разворачивается с from 'react';
const compMultiImport = getCompletions("import { useState, useE }", 23);
assertEqual(
  compMultiImport.items[0]?.insertText,
  "import { useState, useEffect } from 'react';",
  "Adding useEffect to import { useState, useE } expands to full 'import { useState, useEffect } from 'react';'"
);

// 3.5. import { useE } from 'react'; -> редактирование строки, где from уже есть -> заменяет только useE
const compExistingFrom = getCompletions("import { useE } from 'react';", 14);
assertEqual(
  compExistingFrom.items[0]?.insertText,
  "useEffect",
  "Editing inside import with existing from 'react' replaces only symbol name"
);

// 3.6. import useS (без скобок) -> выбираем useState -> разворачивается в import { useState } from 'react';
const compNoBraces = getCompletions("import useS", 11);
assertTrue(
  compNoBraces.items.some((i) => i.insertText === "import { useState } from 'react';"),
  "Typing 'import useS' suggests 'import { useState } from 'react';'"
);

const comp2 = getCompletions("import {use", 11);
assertTrue(
  comp2.items.some((i) => i.prefix === "useState"),
  "Suggests useState inside import {use"
);
assertTrue(
  comp2.items.some((i) => i.prefix === "useEffect"),
  "Suggests useEffect inside import {use"
);

const comp3 = getCompletions("import { useState, ", 19);
assertTrue(
  comp3.items.some((i) => i.prefix === "useEffect"),
  "Suggests useEffect when adding to import { useState, "
);
assertTrue(
  !comp3.items.some((i) => i.prefix === "useState"),
  "Excludes already imported useState from suggestions"
);

const comp4 = getCompletions("import from '", 13);
assertTrue(
  comp4.items.some((i) => i.prefix === "react"),
  "Suggests module 'react' after from '"
);

// 3.7. Module from completion inside existing string 'react'; -> zustand/middleware
const codeWithReact = "import { create } from 'react';";
const compFromMod = getCompletions(codeWithReact, 24);
const zustandMid = compFromMod.items.find((i) => i.prefix === "zustand/middleware");
assertTrue(Boolean(zustandMid), "Suggests 'zustand/middleware' module");
const beforeCode = codeWithReact.substring(0, zustandMid.replaceStart);
const afterCode = codeWithReact.substring(zustandMid.replaceEnd);
const fullResult = beforeCode + zustandMid.insertText + afterCode;
assertEqual(
  fullResult,
  "import { create } from 'zustand/middleware';",
  "Replaces 'react'; with 'zustand/middleware'; without producing ';act' or leftover chars"
);

// 3.8. Module from completion typing 'zus' in import { create } from 'zus
const codeWithZus = "import { create } from 'zus";
const compFromZus = getCompletions(codeWithZus, 27);
const zusItem = compFromZus.items.find((i) => i.prefix === "zustand");
const beforeZus = codeWithZus.substring(0, zusItem.replaceStart);
const afterZus = codeWithZus.substring(zusItem.replaceEnd);
assertEqual(
  beforeZus + zusItem.insertText + afterZus,
  "import { create } from 'zustand';",
  "Replaces 'zus with 'zustand'; cleanly"
);

const comp5 = getCompletions("function App() {\n  const [val, setVal] = useSt", 46);
const useStateItem = comp5.items.find((i) => i.prefix === "useState");
assertTrue(
  Boolean(useStateItem && useStateItem.autoImport && useStateItem.autoImport.module === "react"),
  "Hook suggestion in component body carries autoImport metadata"
);

// 3.9. Emmet JSX expansion in getCompletions (Этап 5.4)
const codeEmmet = "return (\n    ul.list>li.item*3";
const compEmmet = getCompletions(codeEmmet, codeEmmet.length);
const emmetItem = compEmmet.items.find((i) => i.kind === "snippet" && i.prefix === "ul.list>li.item*3");
assertTrue(Boolean(emmetItem), "Suggests Emmet expansion for 'ul.list>li.item*3'");
assertTrue(emmetItem && emmetItem.insertText.includes('<ul className="list">'), "Emmet insertText generates '<ul className=\"list\">'");
assertTrue(emmetItem && emmetItem.insertText.includes('<li className="item"></li>'), "Emmet insertText generates '<li className=\"item\"></li>'");

console.log("\n--- 4. Fuzzy Matching & CamelCase Acronyms (Этап 1) ---");

const match1 = fuzzyMatch("useState", "uSt");
assertTrue(match1.match && match1.score > 60, "fuzzyMatch matches 'useState' for acronym 'uSt'");

const match2 = fuzzyMatch("createSlice", "cSl");
assertTrue(match2.match && match2.score > 60, "fuzzyMatch matches 'createSlice' for acronym 'cSl'");

const match3 = fuzzyMatch("useSelector", "uSel");
assertTrue(match3.match && match3.score > 60, "fuzzyMatch matches 'useSelector' for acronym 'uSel'");

const match4 = fuzzyMatch("console.log", "clg");
assertTrue(match4.match, "fuzzyMatch matches 'console.log' for 'clg'");

const compFuzzy1 = getCompletions("const x = uSt", 13);
assertTrue(
  compFuzzy1.items.some((i) => i.prefix === "useState"),
  "getCompletions finds 'useState' when typing 'uSt'"
);

const compFuzzy2 = getCompletions("const x = cSl", 13);
assertTrue(
  compFuzzy2.items.some((i) => i.prefix === "createSlice"),
  "getCompletions finds 'createSlice' when typing 'cSl'"
);

const compForce = getCompletions("", 0, { force: true });
assertTrue(
  compForce.items.length > 0,
  "getCompletions with force=true returns top suggestions on empty cursor"
);

console.log("\n--- 5. Member Access Autocomplete (.) (Этап 2) ---");

// 5.1. console.
const compConsole = getCompletions("console.", 8);
assertTrue(
  compConsole.items.some((i) => i.prefix === "log"),
  "Suggests .log on console."
);
assertTrue(
  compConsole.items.some((i) => i.prefix === "error"),
  "Suggests .error on console."
);
assertTrue(
  compConsole.items.some((i) => i.prefix === "table"),
  "Suggests .table on console."
);

// 5.2. console.l
const compConsoleL = getCompletions("console.l", 9);
assertEqual(
  compConsoleL.items[0]?.prefix,
  "log",
  "Top suggestion for console.l is 'log'"
);

// 5.3. Math.fl
const compMath = getCompletions("Math.fl", 7);
assertEqual(
  compMath.items[0]?.prefix,
  "floor",
  "Top suggestion for Math.fl is 'floor'"
);

// 5.4. Object.k
const compObject = getCompletions("Object.k", 8);
assertEqual(
  compObject.items[0]?.prefix,
  "keys",
  "Top suggestion for Object.k is 'keys'"
);

// 5.5. e.prev
const compEvent = getCompletions("const handler = (e) => e.prev", 29);
assertEqual(
  compEvent.items[0]?.prefix,
  "preventDefault",
  "Top suggestion for e.prev is 'preventDefault'"
);

// 5.6. e.target.v
const compTarget = getCompletions("e.target.v", 10);
assertEqual(
  compTarget.items[0]?.prefix,
  "value",
  "Top suggestion for e.target.v is 'value'"
);

// 5.7. items. and items.m
const compArrayAll = getCompletions("const res = items.", 18);
assertTrue(
  compArrayAll.items.some((i) => i.prefix === "map"),
  "Suggests .map on items."
);
assertTrue(
  compArrayAll.items.some((i) => i.prefix === "filter"),
  "Suggests .filter on items."
);
assertTrue(
  compArrayAll.items.some((i) => i.prefix === "reduce"),
  "Suggests .reduce on items."
);

const compArray = getCompletions("const res = items.m", 19);
assertEqual(
  compArray.items[0]?.prefix,
  "map",
  "Top suggestion for items.m is 'map'"
);

// 5.8. [1, 2, 3].
const compArrayLiteral = getCompletions("[1, 2, 3].", 10);
assertTrue(
  compArrayLiteral.items.some((i) => i.prefix === "map"),
  "Suggests .map on array literal [1, 2, 3]."
);

// 5.9. str.spl
const compString = getCompletions("const parts = str.spl", 21);
assertEqual(
  compString.items[0]?.prefix,
  "split",
  "Top suggestion for str.spl is 'split'"
);

// 5.10. Optional chaining user?.
const compOptChain = getCompletions("const res = user?.to", 20);
assertTrue(
  compOptChain.items.some((i) => i.prefix === "toString" || i.prefix === "toLowerCase"),
  "Supports optional chaining user?.to"
);

console.log("\n--- 6. JSX Elements & React Props (Этап 3) ---");

const compTagD = getCompletions("return (<d", 10);
assertEqual(
  compTagD.items[0]?.prefix,
  "div",
  "Top suggestion for <d is 'div'"
);

const compTagB = getCompletions("return (<b", 10);
assertTrue(
  compTagB.items.some((i) => i.prefix === "button"),
  "Suggests 'button' on <b"
);

const compTagIn = getCompletions("return (<In", 11);
assertTrue(
  compTagIn.items.some((i) => i.prefix === "input"),
  "Suggests 'input' on <In"
);

const compCustomTag = getCompletions("return (<Butt", 13, { files: mockTaskFiles });
assertTrue(
  compCustomTag.items.some((i) => i.prefix === "Button"),
  "Suggests local task component <Button> from mockTaskFiles"
);

const compButtonOn = getCompletions("<button on", 10);
assertTrue(
  compButtonOn.items.some((i) => i.prefix === "onClick"),
  "Suggests 'onClick' inside <button on"
);

const compInputType = getCompletions("<input typ", 10);
assertEqual(
  compInputType.items[0]?.prefix,
  "type",
  "Top suggestion for <input typ is 'type'"
);

const compDivClass = getCompletions("<div cla", 8);
assertEqual(
  compDivClass.items[0]?.prefix,
  "className",
  "Top suggestion for <div cla is 'className'"
);

const compFormSubmit = getCompletions("<form onS", 9);
assertEqual(
  compFormSubmit.items[0]?.prefix,
  "onSubmit",
  "Top suggestion for <form onS is 'onSubmit'"
);

// 6.8. TypeScript Generics Disambiguation (type ListProps<T>, useRef<T>, Array<T>)
const compGenericType = getCompletions("type ListProps<d", 16);
assertTrue(
  !compGenericType.items?.some((i) => i.prefix === "div" || i.label === "<div>"),
  "Does NOT suggest JSX HTML <div on TypeScript type ListProps<d"
);

const compGenericRef = getCompletions("const r = useRef<d", 18);
assertTrue(
  !compGenericRef.items?.some((i) => i.prefix === "div" || i.label === "<div>"),
  "Does NOT suggest JSX HTML <div on TypeScript generic useRef<d"
);

console.log("\n--- 7. CSS Properties in style={{ ... }} & TypeScript Utility Types (Этап 4) ---");

const compCssDisp = getCompletions("<div style={{ disp", 19);
assertEqual(
  compCssDisp.items[0]?.prefix,
  "display",
  "Top suggestion for style={{ disp is 'display'"
);

const compCssFlex = getCompletions("<div style={{ flexD", 20);
assertEqual(
  compCssFlex.items[0]?.prefix,
  "flexDirection",
  "Top suggestion for style={{ flexD is 'flexDirection'"
);

const compCssBg = getCompletions("<div style={{ backgroundC", 26);
assertEqual(
  compCssBg.items[0]?.prefix,
  "backgroundColor",
  "Top suggestion for style={{ backgroundC is 'backgroundColor'"
);

const compCssJust = getCompletions("<div style={{ display: 'flex', just", 37);
assertEqual(
  compCssJust.items[0]?.prefix,
  "justifyContent",
  "Top suggestion after comma style={{ display: 'flex', just is 'justifyContent'"
);

const compTsPartial = getCompletions("type UserUpdate = Part", 23);
assertTrue(
  compTsPartial.items.some((i) => i.prefix === "Partial"),
  "Suggests Partial<T> utility type on 'Part'"
);

const compTsRecord = getCompletions("type UserMap = Rec", 19);
assertTrue(
  compTsRecord.items.some((i) => i.prefix === "Record"),
  "Suggests Record<K, T> utility type on 'Rec'"
);

const compTsOmit = getCompletions("type SafeUser = Om", 19);
assertTrue(
  compTsOmit.items.some((i) => i.prefix === "Omit"),
  "Suggests Omit<T, K> utility type on 'Om'"
);

const compTsCssProp = getCompletions("const customStyle: CSSProp", 27);
assertTrue(
  compTsCssProp.items.some((i) => i.prefix === "CSSProperties"),
  "Suggests CSSProperties type on 'CSSProp'"
);

const compTsReactNode = getCompletions("children: ReactN", 17);
assertTrue(
  compTsReactNode.items.some((i) => i.prefix === "ReactNode"),
  "Suggests ReactNode type on 'ReactN'"
);

// 7.2. React Namespace Completions (React.)
const compReactDot = getCompletions("const node: React.", 18);
assertTrue(
  compReactDot.items.some((i) => i.prefix === "ReactNode"),
  "Suggests React.ReactNode on 'React.'"
);
assertTrue(
  compReactDot.items.some((i) => i.prefix === "ChangeEvent"),
  "Suggests React.ChangeEvent on 'React.'"
);
const compReactComp = getCompletions("const props: React.Comp", 23);
assertTrue(
  compReactComp.items.some((i) => i.prefix === "ComponentPropsWithoutRef"),
  "Suggests React.ComponentPropsWithoutRef on 'React.Comp'"
);

const compReactChange = getCompletions("const handler = (e: React.Change", 32);
assertTrue(
  compReactChange.items.some((i) => i.prefix === "ChangeEvent"),
  "Top suggestion for React.Change is 'ChangeEvent'"
);

// 7.3. Generic Argument Completions inside <...>
const compGenericHtmlInput = getCompletions("const handleChange = (e: React.ChangeEvent<HTMLIn", 49);
assertTrue(
  compGenericHtmlInput.items.some((i) => i.prefix === "HTMLInputElement"),
  "Suggests HTMLInputElement inside React.ChangeEvent<HTMLIn"
);

const compGenericRefNumber = getCompletions("const timerRef = useRef<number", 30);
assertTrue(
  compGenericRefNumber.items.some((i) => i.prefix === "number | null" || i.prefix === "number"),
  "Suggests number | null or number inside useRef<number"
);

const compGenericTag = getCompletions("type Props = ComponentPropsWithoutRef<'bu", 41);
assertTrue(
  compGenericTag.items.some((i) => i.prefix === "'button'"),
  "Suggests 'button' tag literal inside ComponentPropsWithoutRef<'bu"
);

console.log("\n--- 8. Smart Snippet Defaults & Clean Expansion (Этап 5) ---");

// 8.1. getComponentNameFromFilepath
assertEqual(
  getComponentNameFromFilepath("App.jsx"),
  "App",
  "App.jsx -> App"
);
assertEqual(
  getComponentNameFromFilepath("user-profile.tsx"),
  "UserProfile",
  "user-profile.tsx -> UserProfile"
);
assertEqual(
  getComponentNameFromFilepath("src/components/todo_item.jsx"),
  "TodoItem",
  "src/components/todo_item.jsx -> TodoItem"
);

// 8.2. rfc snippet expansion with file name
const rfcSnippet = JS_SNIPPETS.find((s) => s.prefix === "rfc");
const rfcExpanded = expandSnippet("rfc", 3, rfcSnippet, "rfc", { filepath: "UserProfile.jsx" });
assertTrue(
  rfcExpanded.newCode.includes("export default function UserProfile()"),
  "rfc expands to export default function UserProfile() in UserProfile.jsx"
);
assertTrue(
  !rfcExpanded.newCode.includes("$1"),
  "rfc has no remaining $1 placeholders"
);

// 8.3. rafce snippet expansion with file name
const rafceSnippet = JS_SNIPPETS.find((s) => s.prefix === "rafce");
const rafceExpanded = expandSnippet("rafce", 5, rafceSnippet, "rafce", { filepath: "Counter.tsx" });
assertTrue(
  rafceExpanded.newCode.includes("export const Counter = () =>") &&
  rafceExpanded.newCode.includes("export default Counter;"),
  "rafce expands to export const Counter in Counter.tsx"
);

// 8.4. usestate snippet expansion
const usestateSnippet = JS_SNIPPETS.find((s) => s.prefix === "usestate");
const usestateExpanded = expandSnippet("usestate", 8, usestateSnippet, "usestate");
assertEqual(
  usestateExpanded.newCode,
  "const [state, setState] = useState(null);",
  "usestate expands cleanly to const [state, setState] = useState(null);"
);

// 8.5. clg snippet expansion
const clgSnippet = JS_SNIPPETS.find((s) => s.prefix === "clg");
const clgExpanded = expandSnippet("clg", 3, clgSnippet, "clg");
assertEqual(
  clgExpanded.newCode,
  "console.log();",
  "clg expands cleanly to console.log();"
);

console.log("\n--- 9. Go to Definition & Word Extraction (Этап 2) ---");

// 9.1. getWordAtPosition
const sampleText = "const [count, setCount] = useState(0);";
assertEqual(getWordAtPosition(sampleText, 9), "count", "Extracts 'count' at index 9");
assertEqual(getWordAtPosition(sampleText, 18), "setCount", "Extracts 'setCount' at index 18");
assertEqual(getWordAtPosition(sampleText, 30), "useState", "Extracts 'useState' at index 30");

// 9.2. findDefinition - Local definition
const localSampleCode = `import React from 'react';

const myCustomFunction = () => {
  return 42;
};

type AppProps = {
  title: string;
};

export function MainComponent() {
  return <div>{myCustomFunction()}</div>;
}`;

const defFn = findDefinition("myCustomFunction", localSampleCode);
assertEqual(defFn?.type, "local", "Finds local definition of myCustomFunction");
assertEqual(defFn?.line, 3, "myCustomFunction definition is on line 3");

const defType = findDefinition("AppProps", localSampleCode);
assertEqual(defType?.type, "local", "Finds local definition of AppProps");
assertEqual(defType?.line, 7, "AppProps definition is on line 7");

// 9.3. findDefinition - Task file navigation (Go to File / Component)
const testTaskFiles = [
  { name: "App.jsx", code: "export default function App() {}" },
  { name: "CustomHeader.jsx", code: "export const CustomHeader = () => <header />;\nexport default CustomHeader;" },
  { name: "usersSlice.js", code: "export const usersSlice = createSlice(...);" },
];

const defHeader = findDefinition("CustomHeader", localSampleCode, testTaskFiles, "App.jsx");
assertEqual(defHeader?.type, "file", "Finds task file for CustomHeader");
assertEqual(defHeader?.fileIndex, 1, "CustomHeader matches file index 1");

const defSlice = findDefinition("usersSlice", localSampleCode, testTaskFiles, "App.jsx");
assertEqual(defSlice?.type, "file", "Finds task file for usersSlice");
assertEqual(defSlice?.fileIndex, 2, "usersSlice matches file index 2");

console.log(`\n========================================`);
console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓\n");
}
