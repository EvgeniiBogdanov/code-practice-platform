import { runNodeJsCode, formatNodeValue } from "../src/utils/nodeRunner.js";

async function testRunner() {
  console.log("Starting nodeRunner tests...");

  // Test 1: User's palindrome example
  const palindromeCode = `
const isPalindrome = (str) => {
  let lowerStr = str.toLowerCase();
  let reverseString = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reverseString += lowerStr[i];
  }

  return reverseString === lowerStr;
};

const result = isPalindrome("Madam");
console.log(result);
`;

  const res1 = await runNodeJsCode(palindromeCode);
  console.log("Test 1 Result:", res1.logs.map(l => l.text));
  if (res1.logs[0]?.text === "true" && res1.exitCode === 0) {
    console.log("✓ Test 1 Passed: Palindrome outputs 'true'");
  } else {
    console.error("✗ Test 1 Failed", res1);
  }

  // Test 2: Console table, numbers, objects, booleans, circular reference
  const complexCode = `
console.log("Hello", 42, true, null, undefined);
const obj = { a: 1, b: "two" };
obj.self = obj;
console.log(obj);
console.table([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
console.time("timer");
console.timeEnd("timer");
`;

  const res2 = await runNodeJsCode(complexCode);
  console.log("Test 2 Logs count:", res2.logs.length);
  console.log("Test 2 Logs:", res2.logs.map(l => `[${l.type}] ${l.text}`));

  // Test 3: Timers
  const timerCode = `
setTimeout(() => {
  console.log("From setTimeout!");
}, 50);
`;

  const logs3 = [];
  await runNodeJsCode(timerCode, {
    onLog: (l) => logs3.push(l.text),
  });

  // Wait for timer
  await new Promise(r => setTimeout(r, 100));
  console.log("Test 3 Async logs:", logs3);
  if (logs3.includes("From setTimeout!")) {
    console.log("✓ Test 3 Passed: Async timer logs caught");
  }

  console.log("All tests completed!");
}

testRunner();
