/**
 * typeChecker.test.js
 * Набор тестов для проверки типов TypeScript и валидации пропсов React-компонентов.
 */

import {
  inferExpressionType,
  isTypeAssignable,
  checkTypeScriptTypes,
  extractComponentContracts,
  checkComponentProps,
} from "./typeChecker.js";

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
    console.error(`    Expected: ${JSON.stringify(expected)}`);
    console.error(`    Actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

console.log("=== Running TypeScript & Props Validator Test Suite ===");

// 1. Type Inference
console.log("\n--- 1. Type Inference (inferExpressionType) ---");
assertEqual(inferExpressionType('"hello"').type, "string", 'Infers string for "hello"');
assertEqual(inferExpressionType("42").type, "number", "Infers number for 42");
assertEqual(inferExpressionType("3.14").type, "number", "Infers number for 3.14");
assertEqual(inferExpressionType("true").type, "boolean", "Infers boolean for true");
assertEqual(inferExpressionType("null").type, "null", "Infers null for null");
assertEqual(inferExpressionType("[1, 2, 3]").type, "number[]", "Infers number[] for [1, 2, 3]");
assertEqual(inferExpressionType('["a", "b"]').type, "string[]", 'Infers string[] for ["a", "b"]');
assertEqual(inferExpressionType('{ name: "Ivan", age: 30 }').type, "object", "Infers object for literal");

// 2. Type Assignability (isTypeAssignable)
console.log("\n--- 2. Type Assignability (isTypeAssignable) ---");
assert(isTypeAssignable("number", { type: "number" }).compatible, "number is assignable to number");
assert(!isTypeAssignable("number", { type: "string" }).compatible, "string is NOT assignable to number");
assert(isTypeAssignable("string | number", { type: "string" }).compatible, "string is assignable to string | number");
assert(isTypeAssignable("string | number", { type: "number" }).compatible, "number is assignable to string | number");
assert(!isTypeAssignable("string | number", { type: "boolean" }).compatible, "boolean is NOT assignable to string | number");
assert(isTypeAssignable("string[]", { type: "string[]", elementType: "string" }).compatible, "string[] is assignable to string[]");
assert(!isTypeAssignable("string[]", { type: "number[]", elementType: "number" }).compatible, "number[] is NOT assignable to string[]");

// 3. TypeScript Diagnostics (checkTypeScriptTypes)
console.log("\n--- 3. Live Type Checking Diagnostics (checkTypeScriptTypes) ---");
const codeErr1 = 'const age: number = "twenty";';
const p1 = checkTypeScriptTypes(codeErr1);
assert(p1.length === 1 && p1[0].rule === "ts-type-mismatch", "Flags error on const age: number = 'twenty'");

const codeOk1 = "const age: number = 25;";
const pOk1 = checkTypeScriptTypes(codeOk1);
assert(pOk1.length === 0, "No error on valid const age: number = 25");

const codeErrArray = "const names: string[] = [1, 2, 3];";
const pArray = checkTypeScriptTypes(codeErrArray);
assert(pArray.length === 1, "Flags error on const names: string[] = [1, 2, 3]");

const codeErrReturn = 'const getCount = (): number => "ten";';
const pReturn = checkTypeScriptTypes(codeErrReturn);
assert(pReturn.length === 1 && pReturn[0].rule === "ts-return-type-mismatch", "Flags error on return type mismatch in arrow function");

// 4. Extract Component Contracts
console.log("\n--- 4. Component Contracts Extraction (extractComponentContracts) ---");
const compCode = `
function Button({ label, onClick, variant = "primary" }) {
  return <button>{label}</button>;
}

interface CardProps {
  title: string;
  count: number;
  subtitle?: string;
}

const Card = ({ title, count, subtitle }: CardProps) => <div>{title}</div>;
`;
const contracts = extractComponentContracts(compCode);
assert(Boolean(contracts.Button), "Extracts contract for Button");
assert(contracts.Button.requiredProps.includes("label"), "Button requires 'label'");
assert(contracts.Button.requiredProps.includes("onClick"), "Button requires 'onClick'");
assert(contracts.Button.optionalProps.includes("variant"), "Button has optional 'variant'");

assert(Boolean(contracts.Card), "Extracts contract for Card");
assert(contracts.Card.requiredProps.includes("title"), "Card requires 'title'");
assert(contracts.Card.requiredProps.includes("count"), "Card requires 'count'");
assert(contracts.Card.optionalProps.includes("subtitle"), "Card has optional 'subtitle'");

// 5. Component Props Checking in JSX
console.log("\n--- 5. Component Props Checking in JSX (checkComponentProps) ---");
const usageCodeMissing = `
function App() {
  return (
    <div>
      <Button label="Click me" />
      <Card />
    </div>
  );
}
`;
const propsProblems = checkComponentProps(usageCodeMissing, {
  files: [{ name: "Button.jsx", code: compCode }],
});

assert(
  propsProblems.some((p) => p.message.includes("<Button>") && p.message.includes("'onClick'")),
  "Warns about missing 'onClick' prop on <Button />"
);

assert(
  propsProblems.some((p) => p.message.includes("<Card>") && p.message.includes("'title'")),
  "Warns about missing required props on <Card />"
);

// 6. Accessibility & Security checks (img, a)
console.log("\n--- 6. A11y & Security HTML Checks ---");
const a11yCode = `
const View = () => (
  <div>
    <img src="/avatar.png" />
    <a href="https://google.com" target="_blank">External</a>
  </div>
);
`;
const a11yProblems = checkComponentProps(a11yCode);
assert(a11yProblems.some((p) => p.rule === "jsx-a11y-img-has-alt"), "Warns on <img> missing alt attribute");
assert(a11yProblems.some((p) => p.rule === "react-no-target-blank"), "Warns on target='_blank' without rel='noreferrer'");

console.log(`\n========================================`);
console.log(`Tests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED SUCCESSFULLY! ✓\n");
}
